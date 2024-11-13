import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';

interface WhiteboardHistoryProps {
  state: any;
}

const WhiteboardHistory: React.FC<WhiteboardHistoryProps> = ({ state }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Update the dimensions of the whiteboard
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', backgroundColor: 'white', overflow: 'hidden' }} 
    >
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          <Rect x={0} y={0} width={dimensions.width} height={dimensions.height} fill="white" />
          {state.map((line: any, i: number) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color || "black"}
              strokeWidth={line.width || 2}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default WhiteboardHistory;
