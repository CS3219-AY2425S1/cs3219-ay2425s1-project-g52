import { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeEditorHistoryProps {
  code: string;
}

const CodeEditorHistory: React.FC<CodeEditorHistoryProps> = ({ code }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialise the Code editor
    if (editorRef.current) {
      const view = new EditorView({
        doc: code,
        extensions: [
          basicSetup, 
          javascript(), 
          oneDark, 
          EditorView.editable.of(false), // Disable code editing
        ],
        parent: editorRef.current,
      });

      return () => {
        view.destroy();
      };
    }
  }, [code]);

  return <div ref={editorRef} style={{ height: '100%', width: '100%' }} />;
};

export default CodeEditorHistory;