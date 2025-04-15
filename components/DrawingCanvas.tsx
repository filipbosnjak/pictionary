"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

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
  const [paths, setPaths] = useState<Path[]>([]);
  const updateDrawing = useMutation(api.drawings.updateDrawing);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentPath({
      points: [{ x, y }],
      color: "#000000",
      width: 5,
    });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isDrawer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentPath((prev) => ({
      ...prev,
      points: [...prev.points, { x, y }],
    }));
  };

  const stopDrawing = async () => {
    if (!isDrawing || !isDrawer) return;

    setIsDrawing(false);
    setPaths((prev) => [...prev, currentPath]);
    await updateDrawing({
      roomId,
      paths: [...paths, currentPath],
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
    [...paths, currentPath].forEach((path) => {
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
  }, [paths, currentPath]);

  return (
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
  );
}
