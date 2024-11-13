import { useState, useEffect, useRef } from "react";
import { Stage, Layer, Line, Rect } from "react-konva";
import { IconButton, Menu, MenuItem } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import FormatColorResetIcon from "@mui/icons-material/FormatColorReset";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import CloseIcon from "@mui/icons-material/Close";

type WhiteboardProps = {
  setWhiteBoardOpen: (open: boolean) => void;
  socket: any;
  roomId: string;
  username: string;
  width: number;
  height: number;
  savedLines: LineData[];
  setSavedLines: (lines: LineData[]) => void;
};

type LineData = {
  points: number[];
  color: string;
  erasing: boolean;
  width: number;
};

const Whiteboard: React.FC<WhiteboardProps> = ({
  setWhiteBoardOpen,
  socket,
  roomId,
  username,
  width,
  height,
  savedLines,
  setSavedLines,
}) => {
  const [lines, setLines] = useState<LineData[]>(savedLines || []);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isErasing, setIsErasing] = useState<boolean>(false);
  const [currentColor, setCurrentColor] = useState<string>("black");
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const eraserWidth = 20;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const throttleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const emitDrawingData = (updatedLines: LineData[]): void => {
    if (socket && updatedLines.length > 0) {
      socket.emit("drawing", { roomId, lines: updatedLines });
    }
  };

  const emitThrottledData = (updatedLines: LineData[]): void => {
    if (!throttleTimeout.current) {
      throttleTimeout.current = setTimeout(() => {
        emitDrawingData(updatedLines);
        throttleTimeout.current = null;
      }, 100);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("drawing", (newLines: { lines: LineData[] }) => {
        setLines(newLines.lines);
      });

      return () => {
        socket.off("drawing");
      };
    }
  }, [socket]);

  useEffect(() => {
    setSavedLines(lines);
  }, [lines, setSavedLines]);

  const handleMouseDown = (e: any): void => {
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    if (pos) {
      setLines([
        ...lines,
        { points: [pos.x, pos.y], color: currentColor, erasing: isErasing, width: strokeWidth },
      ]);
    }
  };

  const handleMouseMove = (e: any): void => {
    if (!isDrawing) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    if (point) {
      const lastLine = lines[lines.length - 1];
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      const updatedLines = lines.concat();
      setLines(updatedLines);
      emitThrottledData(updatedLines);
    }
  };

  const handleMouseUp = (): void => {
    setIsDrawing(false);
  };

  const handleClear = (): void => {
    setLines([]);
    if (socket) {
      socket.emit("drawing", { roomId, lines: [] });
    }
  };

  const toggleEraseMode = (): void => {
    if (isErasing) {
      setIsErasing(false);
      setCurrentColor("black");
      setStrokeWidth(2);
    } else {
      setIsErasing(true);
      setCurrentColor("white");
      setStrokeWidth(eraserWidth);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const changeColor = (color: string): void => {
    setCurrentColor(color);
    setIsErasing(false);
    setStrokeWidth(2);
  };

  const closeWhiteboard = (): void => {
    setSavedLines(lines);
    if (socket) {
      socket.emit("toggleWhiteboardOff", roomId);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("closeWhiteboard", () => {
        setWhiteBoardOpen(false);
      });
      return () => {
        socket.off("closeWhiteboard");
      };
    }
  }, [socket, setWhiteBoardOpen]);

  return (
    <div style={{ width, height }}>
      <Stage
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          <Rect x={0} y={0} width={width} height={height} fill="white" />
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.erasing ? "white" : line.color}
              strokeWidth={line.erasing ? eraserWidth : line.width}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation="source-over"
            />
          ))}
        </Layer>
      </Stage>

      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        <IconButton
          onClick={handleClick}
          color={!isErasing ? "primary" : "default"}
        >
          <CreateIcon />
        </IconButton>
        <Menu
          id="color-picker-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => changeColor("black")}
            style={{ color: "black" }}
          >
            Black
          </MenuItem>
          <MenuItem onClick={() => changeColor("red")} style={{ color: "red" }}>
            Red
          </MenuItem>
          <MenuItem
            onClick={() => changeColor("green")}
            style={{ color: "green" }}
          >
            Green
          </MenuItem>
          <MenuItem
            onClick={() => changeColor("blue")}
            style={{ color: "blue" }}
          >
            Blue
          </MenuItem>
        </Menu>

        <IconButton
          onClick={toggleEraseMode}
          color={isErasing ? "primary" : "default"}
        >
          <FormatColorResetIcon />
        </IconButton>

        <IconButton onClick={handleClear} color="default">
          <ClearAllIcon />
        </IconButton>

        <IconButton onClick={closeWhiteboard} color="default">
          <CloseIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Whiteboard;
