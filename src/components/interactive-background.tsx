"use client";

import React, { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: undefined as number | undefined, y: undefined as number | undefined });
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    const points: Point[] = [];
    const gridSize = 40;

    class Point {
      x: number;
      y: number;
      originX: number;
      originY: number;
      z: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.originX = x;
        this.originY = y;
        this.z = 0;
      }

      update() {
        if (mousePos.current.x === undefined) {
          this.x += (this.originX - this.x) * 0.1;
          this.y += (this.originY - this.y) * 0.1;
          this.z += (0 - this.z) * 0.1;
          return;
        }
        const dx = this.x - mousePos.current.x!;
        const dy = this.y - mousePos.current.y!;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200;

        if (dist < maxDist) {
          const angle = Math.atan2(dy, dx);
          const force = (maxDist - dist) / maxDist;
          this.x += Math.cos(angle) * force * 8;
          this.y += Math.sin(angle) * force * 8;
          this.z = force * 30;
        }

        this.x += (this.originX - this.x) * 0.1;
        this.y += (this.originY - this.y) * 0.1;
        this.z += (0 - this.z) * 0.1;
      }
    }

    const init = () => {
      points.length = 0;
      const cols = Math.ceil(canvas.width / gridSize);
      const rows = Math.ceil(canvas.height / gridSize);
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          points.push(new Point(i * gridSize, j * gridSize));
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameRef.current++;

      const cols = Math.ceil(canvas.width / gridSize);
      const rows = Math.ceil(canvas.height / gridSize);

      points.forEach((p) => p.update());

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
      gradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.3)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.3)');
      ctx.strokeStyle = gradient;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const p1 = points[i * (rows + 1) + j];
          const p2 = points[i * (rows + 1) + (j + 1)];
          const p3 = points[(i + 1) * (rows + 1) + j];

          if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineWidth = 1 + p1.z / 15;
            ctx.stroke();
          }
          if (p1 && p3) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.lineWidth = 1 + p1.z / 15;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOut = () => {
      mousePos.current = { x: undefined, y: undefined };
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-zinc-950/80 to-blue-900/40 z-[1]" />
    </div>
  );
}
