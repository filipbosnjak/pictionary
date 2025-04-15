"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import Slider from "@/components/ui/slider";

interface Point {
  x: number;
  y: number;
}

interface Path {
  points: Point[];
  color: string;
  width: number;
}

interface DrawingCanvasProps {
  roomId: Id<"rooms">;
  isDrawer: boolean;
}

const COLORS = [
  "#000000", // Black
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FF9900", // Orange
  "#9900FF", // Purple
  "#FF00FF", // Pink
  "#00FFFF", // Cyan
];

export default function DrawingCanvas({
  roomId,
  isDrawer,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Path>({
    points: [],
    color: "#000000",
    width: 5,
  });
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [paths, setPaths] = useState<Path[]>([]);

  const updateDrawing = useMutation(api.drawings.updateDrawing);
  const drawing = useQuery(api.drawings.getDrawing, { roomId });

  // Update local paths when drawing updates from server
  useEffect(() => {
    if (drawing && !isDrawing) {
      setPaths(drawing.paths || []);
    }
  }, [drawing, isDrawing]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setIsDrawing(true);
    setCurrentPath({
      points: [{ x, y }],
      color: selectedColor,
      width: brushSize,
    });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isDrawer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setCurrentPath((prev) => ({
      ...prev,
      points: [...prev.points, { x, y }],
    }));
  };

  const stopDrawing = async () => {
    if (!isDrawing || !isDrawer) return;

    setIsDrawing(false);
    const newPaths = [...paths, currentPath];
    setPaths(newPaths);
    await updateDrawing({
      roomId,
      paths: newPaths,
    });
  };

  const clearCanvas = async () => {
    if (!isDrawer) return;
    setPaths([]);
    await updateDrawing({
      roomId,
      paths: [],
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all paths
    [...paths, ...(isDrawing ? [currentPath] : [])].forEach((path) => {
      if (path.points.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);

      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }

      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    });
  }, [paths, currentPath, isDrawing]);

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-video bg-white rounded-lg shadow-md overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-full"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        {!isDrawer && (
          <div className="absolute inset-0 bg-transparent cursor-not-allowed" />
        )}
      </div>

      {isDrawer && (
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">
          <div className="flex gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full border-2 ${
                  selectedColor === color ? "border-black" : "border-gray-200"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
          <div className="flex-1 px-4">
            <Slider
              value={[brushSize]}
              onValueChange={(values: number[]) => setBrushSize(values[0])}
              min={1}
              max={20}
              step={1}
            />
          </div>
          <Button variant="outline" onClick={clearCanvas}>
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
