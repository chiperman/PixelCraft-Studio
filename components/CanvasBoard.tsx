import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GridConfig, ToolType } from '../types';
import { floodFill } from '../utils';

interface CanvasBoardProps {
  grid: string[];
  config: GridConfig;
  tool: ToolType;
  selectedColor: string;
  showGrid: boolean;
  showDrawingLayer: boolean;
  showReferenceLayer: boolean;
  backgroundImage: string | null;
  backgroundOpacity: number;
  isDarkMode: boolean;
  onGridChange: (newGrid: string[]) => void;
  onEyeDropper: (color: string) => void;
  isSpacePressed: boolean;
}

const CanvasBoard: React.FC<CanvasBoardProps> = ({
  grid,
  config,
  tool,
  selectedColor,
  showGrid,
  showDrawingLayer,
  showReferenceLayer,
  backgroundImage,
  backgroundOpacity,
  isDarkMode,
  onGridChange,
  onEyeDropper,
  isSpacePressed,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentGrid, setCurrentGrid] = useState<string[]>(grid);

  useEffect(() => {
    setCurrentGrid(grid);
  }, [grid]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height, size } = config;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Pixels
    if (showDrawingLayer) {
        currentGrid.forEach((color, i) => {
            if (color) {
                const x = (i % width) * size;
                const y = Math.floor(i / width) * size;
                ctx.fillStyle = color;
                ctx.fillRect(x, y, size, size);
            }
        });
    }

    // Draw Grid Lines
    if (showGrid) {
      // Adjust grid color based on theme for visibility
      ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= width; x++) {
        ctx.moveTo(x * size, 0);
        ctx.lineTo(x * size, height * size);
      }
      for (let y = 0; y <= height; y++) {
        ctx.moveTo(0, y * size);
        ctx.lineTo(width * size, y * size);
      }
      ctx.stroke();
    }
  }, [currentGrid, config, showGrid, showDrawingLayer, isDarkMode]);

  useEffect(() => {
    draw();
  }, [draw]);

  const getGridCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const x = Math.floor((clientX - rect.left) / config.size);
    const y = Math.floor((clientY - rect.top) / config.size);

    if (x < 0 || x >= config.width || y < 0 || y >= config.height) return null;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    // Disable drawing if space is pressed (panning mode)
    if (isSpacePressed) return;

    // Only left click or touch
    if ('button' in e && e.button !== 0) return;
    
    if (!showDrawingLayer) return; // Prevent drawing if hidden

    const coords = getGridCoordinates(e);
    if (!coords) return;

    if (tool === 'bucket') {
        const newGrid = floodFill(currentGrid, config, coords.x, coords.y, currentGrid[coords.y * config.width + coords.x], selectedColor);
        onGridChange(newGrid);
        return;
    }

    setIsDrawing(true);
    handleDrawAction(coords.x, coords.y);
  };

  const handleDrawAction = (x: number, y: number) => {
      const index = y * config.width + x;
      if (tool === 'picker') {
          const color = currentGrid[index];
          if (color) onEyeDropper(color);
          setIsDrawing(false);
          return;
      }

      const newGrid = [...currentGrid];
      if (tool === 'pencil') {
          newGrid[index] = selectedColor;
      } else if (tool === 'eraser') {
          newGrid[index] = '';
      }
      
      setCurrentGrid(newGrid);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;
      const coords = getGridCoordinates(e);
      if (!coords) return;
      
      handleDrawAction(coords.x, coords.y);
  };

  const handleMouseUp = () => {
      if (isDrawing) {
          setIsDrawing(false);
          onGridChange(currentGrid); // Commit change to history
      }
  };

  // Determine Cursor Style
  let cursorStyle = 'cursor-default';
  
  if (isSpacePressed) {
      cursorStyle = 'cursor-grab';
  } else if (showDrawingLayer) {
      cursorStyle = 'cursor-crosshair';
  } else {
      cursorStyle = 'cursor-not-allowed';
  }

  return (
    <div className={`relative shadow-2xl rounded bg-white dark:bg-slate-800 select-none border border-paper-300 dark:border-slate-700 transition-colors ${cursorStyle}`}>
      {backgroundImage && showReferenceLayer && (
        <div 
          className="absolute inset-0 pointer-events-none bg-no-repeat bg-cover z-0"
          style={{ 
            backgroundImage: `url(${backgroundImage})`, 
            opacity: backgroundOpacity,
            imageRendering: 'pixelated'
          }}
        />
      )}
      <canvas
        ref={canvasRef}
        width={config.width * config.size}
        height={config.height * config.size}
        className={`relative z-10 touch-none ${cursorStyle}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        style={{ width: config.width * config.size, height: config.height * config.size }}
      />
    </div>
  );
};

export default CanvasBoard;