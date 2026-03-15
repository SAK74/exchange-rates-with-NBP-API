import { useEffect, useRef } from 'react';

interface CanvasProps {
  width: number;
  height: number;
  draw: (ctx: CanvasRenderingContext2D) => void;
  children?: React.ReactNode;
}

export default function Canvas({ width, height, draw, children }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext('2d')!;
    context.clearRect(0, 0, canvas.width, canvas.height);
    draw(context);
  });

  return (
    <div className="canvas_content">
      <canvas ref={canvasRef} width={width} height={height} />
      {children}
    </div>
  );
}
