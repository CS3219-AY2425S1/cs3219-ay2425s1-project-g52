import { useEffect, useMemo, useState } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { WebrtcProvider } from "y-webrtc";
import { oneDark } from "@codemirror/theme-one-dark";
import Output from "./Output";
import { Box, Button } from "@mui/material";
import LanguageDropdown from "./LanguageDropdown";
import { compileCode, checkStatus } from "../../api/judge-api";
import { languageMap } from "./languageMap"; // Import the language map

import * as random from 'lib0/random'

interface OutputDetails {
  status: { id: number };
  compile_output: string;
  stdout: string;
  stderr: string;
}

const usercolors = [
  { color: '#6200ea', light: '#6200ea33' },  // Deep Purple
  { color: '#03dac6', light: '#03dac633' },  // Teal
  { color: '#ff9800', light: '#ff980033' },  // Orange
  { color: '#f44336', light: '#f4433633' },  // Red
  { color: '#4caf50', light: '#4caf5033' },  // Green
  { color: '#2196f3', light: '#2196f333' },  // Blue
  { color: '#9c27b0', light: '#9c27b033' },  // Purple
  { color: '#ffeb3b', light: '#ffeb3b33' }   // Yellow
];

// select a random color for this user
const userColor = usercolors[random.uint32() % usercolors.length]

interface CodeEditorProps {
  roomId: string;
  setCodeContents: (code: string) => void;
  setCodingLanguage: (language: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ roomId, setCodeContents, setCodingLanguage }) => {
  const ydoc = useMemo(() => new Y.Doc(), []);
  const [provider, setProvider] = useState<WebrtcProvider | null>(null);
  const [view, setView] = useState<EditorView | null>(null);
  const [outputDetails, setOutputDetails] = useState<OutputDetails>({
    status: { id: 0 },
    compile_output: "",
    stdout: "",
    stderr: "",
  });
  const [processing, setProcessing] = useState<boolean>(false);

  // for language stuff
  const [languageId, setLanguage] = useState<number>(100);
  const [editorMode, setEditorMode] = useState<any>(null);

  useEffect(() => {
    const language = languageMap[languageId];
    if (language) {
      setCodingLanguage(language.name); // Update coding language name
      setEditorMode(language.mode); // Update the mode based on the selected language
    }
  }, [languageId]); // Re-run effect whenever languageId changes


  const handleLanguageChange = (language : number) => {
    setLanguage(language);
  };

  useEffect(() => {
    // Set up the WebSocket provider
    const providerInstance = new WebrtcProvider(roomId, ydoc, {
      signaling: ["ws://localhost:4000/yjs"]
    });
    setProvider(providerInstance);

    // Clean up on component unmount
    return () => {
      providerInstance?.destroy();
      ydoc.destroy();
    };
  }, [roomId, ydoc]);

  useEffect(() => {
    if (!provider) return;

    // Create the Yjs text type
    const yText = ydoc.getText("codemirror");
    const undoManager = new Y.UndoManager(yText)

    const username = sessionStorage.getItem("username") || "Guest";

    provider.awareness.setLocalStateField('user', {
      name: username,
      color: userColor.color,
      colorLight: userColor.light
    })

    // Set up the editor state with yCollab for collaborative editing
    const state = EditorState.create({
      doc: yText.toString(),
      extensions: [
        basicSetup,
        oneDark,
        editorMode, // langunge highlighter
        // python(), // Syntax highlighting for python
        yCollab(yText, provider.awareness, {undoManager}),
      ],
    });

    // Initialize the editor view
    const editorView = new EditorView({
      state,
      parent: document.getElementById("editor")!,
      dispatch: (tr) => {
        editorView.update([tr]);
        if (tr.docChanged) {
          setCodeContents(editorView.state.doc.toString());
        }
      }
    });
    setView(editorView);

    // Clean up on unmount
    return () => {
      editorView.destroy();
    };
  }, [provider, ydoc, setCodeContents, editorMode]);

  const handleCompile = async () => {
    setProcessing(true);
    if (!view) return;

    const code = view.state.doc.toString();
    
    try {
      const token = await compileCode({
        languageId: languageId || 100, // use correct lang
        sourceCode: code,
      });
      pollStatus(token);
    } catch (error) {
      setProcessing(false);
      console.error("Error during compilation:", error);
    }
  };


  const pollStatus = async (token: string) => {
    try {
      const response = await checkStatus(token);
      const statusId = response.status?.id;

      if (statusId === 1 || statusId === 2) {
        setTimeout(() => pollStatus(token), 2000);
      } else {
        setProcessing(false);
        setOutputDetails(response);
        console.log("Compilation result:", response);
      }
    } catch (error) {
      setProcessing(false);
      console.error("Error checking status:", error);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        width: "100%",
        height: "100%",
        padding: 2,
        boxSizing: "border-box",
      }}
    >
      {/* Container for Editor and Output */}
      <Box
        display="flex"
        flexDirection="column"
        sx={{
          flex: 1,
          gap: 2,
          overflow: "hidden", // Allow internal areas to scroll without causing parent scroll
        }}
      >
        <LanguageDropdown selectedLanguage={languageId} onSelectChange={handleLanguageChange} />
        {/* Editor Area */}
        <Box
          id="editor"
          sx={{
            flex: 2,
            backgroundColor: "#2e2e2e",
            borderRadius: 1,
            overflowY: "auto", // Scroll within editor if content exceeds space
            maxheight: "310px",
          }}
        />

        {/* Output Area */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#1e1e1e",
            borderRadius: 1,
            padding: 2, // Add padding for better spacing
            maxHeight: "200px",
            }}
        >
          <Output outputDetails={outputDetails} />
        </Box>
      </Box>

      {/* Compile Button */}
      <Box
        sx={{
          mt: 2,
          textAlign: "center",
        }}
      >
       <Button
        variant="contained"
        onClick={handleCompile}
        disabled={!view?.state.doc.toString() || processing}
        sx={{
          backgroundColor: processing ? "grey.500" : "#1976d2",
          color: "white",
          "&:disabled": {
            backgroundColor: "grey.500",
            color: "white",
          },
        }}
      >
        {processing ? "Processing..." : "Compile and Execute"}
      </Button>

      </Box>
    </Box>
  );
};

export default CodeEditor;