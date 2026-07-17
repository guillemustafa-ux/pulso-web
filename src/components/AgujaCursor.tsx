import { useEffect, useRef } from 'react';

// El mouse cose la gran tela: puntadas de hilo ember que siguen al cursor y se
// desvanecen. Solo con puntero fino (desktop) y sin prefers-reduced-motion.
type Punto = { x: number; y: number; t: number };

const VIDA_MS = 900; // cuánto vive cada puntada antes de desvanecerse
const LARGO_PUNTADA = 14; // px entre puntadas — costura, no trazo continuo

export default function AgujaCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const punteroFino = window.matchMedia('(pointer: fine)').matches;
    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canvas || !punteroFino || sinMovimiento) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const puntos: Punto[] = [];
    let raf = 0;

    const ajustar = () => {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    ajustar();

    const mover = (e: MouseEvent) => {
      const ultimo = puntos[puntos.length - 1];
      if (!ultimo || Math.hypot(e.clientX - ultimo.x, e.clientY - ultimo.y) > LARGO_PUNTADA) {
        puntos.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      }
    };

    const dibujar = () => {
      const ahora = performance.now();
      while (puntos.length && ahora - puntos[0].t > VIDA_MS) puntos.shift();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      // un segmento sí y uno no: la puntada pasa por arriba y por abajo de la tela
      for (let i = 1; i < puntos.length; i += 2) {
        const edad = (ahora - puntos[i].t) / VIDA_MS;
        ctx.strokeStyle = `rgba(255, 91, 53, ${0.55 * (1 - edad)})`;
        ctx.beginPath();
        ctx.moveTo(puntos[i - 1].x, puntos[i - 1].y);
        ctx.lineTo(puntos[i].x, puntos[i].y);
        ctx.stroke();
      }
      raf = requestAnimationFrame(dibujar);
    };
    raf = requestAnimationFrame(dibujar);

    window.addEventListener('mousemove', mover);
    window.addEventListener('resize', ajustar);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', mover);
      window.removeEventListener('resize', ajustar);
    };
  }, []);

  return <canvas ref={canvasRef} className="hilo-cursor" aria-hidden="true" />;
}
