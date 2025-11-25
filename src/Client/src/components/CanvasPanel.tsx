import React, { useEffect, useRef, useState } from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';
import { ObjectId } from 'bson';

interface DrawItem {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

interface Draw {
  id: ObjectId;
  name: string;
  items: DrawItem[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface CanvasPanelProps {
  draw?: Draw | null; // Optional draw object
  onSave: (dataUrl: string) => void;
  onExport: (dataUrl: string) => void;
}

const CanvasPanel = ({ draw, onSave, onExport }: CanvasPanelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(100);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  console.log('draw:', draw)
  // Draw items on canvas whenever draw or zoom/pan changes
  useEffect(() => {
    if (!canvasRef.current || !draw) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Compute canvas size based on items
    const maxX = Math.max(...draw?.items?.map((item) => item.x + item.width));
    const maxY = Math.max(...draw?.items?.map((item) => item.y + item.height));

    canvas.width = maxX;
    canvas.height = maxY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    draw?.items?.forEach((item) => {
      ctx.fillStyle = item.fill;
      ctx.fillRect(item.x, item.y, item.width, item.height);
    });
  }, [draw]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <h2 className="text-lg font-semibold text-foreground">Canvas Workspace</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground min-w-[60px] text-center">{zoom}%</span>
          <div className="w-px h-6 bg-border mx-2" />
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-background">
        {draw ? (
          <div
            className="w-full h-full flex items-center justify-center p-8 overflow-auto"
            style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
          >
            <div
              style={{
                transform: `scale(${zoom / 100}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                transformOrigin: 'center',
                transition: isPanning ? 'none' : 'transform 0.2s',
              }}
            >
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full shadow-lg rounded-lg"
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Icon name="Image" size={48} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No Draw Loaded</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Select a draw from the list to visualize it on the canvas workspace
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasPanel;