import { useEffect, useRef } from 'react';
import { usePincel, trazo, pincelada } from '../lib/pincel';

// Modo pincel: el trazo queda pintado sobre la página mientras navegás,
// pero nunca de forma permanente — la tela lo absorbe de a poco (~75s)
// y la página original siempre vuelve. Lo que queda de verdad se dibuja
// en el lienzo del Atril y cuelga en el muro. (Decisión de Guille 17/07:
// antes había marcas "para siempre" en localStorage; se quitaron porque
// tapaban la página original.)
const PAUSA_NUEVO_GESTO = 400; // ms sin mover el mouse = gesto nuevo

export default function PincelCapa() {
  const telaRef = useRef<HTMLCanvasElement>(null);
  const { modoPincel, ajustes, nonceLimpiar } = usePincel();
  const ajustesRef = useRef(ajustes);
  ajustesRef.current = ajustes;

  // "borrar toda la pintura de una"
  useEffect(() => {
    if (nonceLimpiar === 0) return;
    const tela = telaRef.current;
    const ctx = tela?.getContext('2d');
    if (tela && ctx) ctx.clearRect(0, 0, tela.width, tela.height);
  }, [nonceLimpiar]);

  // la tela vive siempre montada: lo pintado sigue desvaneciéndose aunque
  // el visitante ya haya devuelto el pincel
  useEffect(() => {
    const tela = telaRef.current;
    const ctx = tela?.getContext('2d');
    if (!tela || !ctx) return;

    const ajustar = () => {
      tela.width = window.innerWidth * devicePixelRatio;
      tela.height = window.innerHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    ajustar();

    // la tela absorbe la pintura de a poco (~75s hasta desaparecer)
    const absorber = window.setInterval(() => {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 0.016;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.restore();
    }, 400);

    window.addEventListener('resize', ajustar);
    return () => {
      window.clearInterval(absorber);
      window.removeEventListener('resize', ajustar);
    };
  }, []);

  // el pincel activo
  useEffect(() => {
    document.body.classList.toggle('modo-pincel', modoPincel);
    const tela = telaRef.current;
    const ctx = tela?.getContext('2d');
    if (!tela || !ctx || !modoPincel) return;

    let anterior: { x: number; y: number } | null = null;
    let ultimoMovimiento = 0;

    const mover = (e: MouseEvent) => {
      const ahora = performance.now();
      if (ahora - ultimoMovimiento > PAUSA_NUEVO_GESTO) anterior = null;
      ultimoMovimiento = ahora;
      const punto = { x: e.clientX, y: e.clientY };
      if (anterior) trazo(ctx, anterior.x, anterior.y, punto.x, punto.y, ajustesRef.current);
      anterior = punto;
    };

    const click = (e: MouseEvent) => {
      // el atril, el lienzo y el guía no se pintan encima
      if ((e.target as HTMLElement).closest('.atril, .lienzo-overlay, .guia')) return;
      pincelada(ctx, e.clientX, e.clientY, ajustesRef.current);
    };

    const salir = () => {
      anterior = null;
    };

    window.addEventListener('mousemove', mover);
    window.addEventListener('click', click);
    window.addEventListener('mouseout', salir);
    return () => {
      window.removeEventListener('mousemove', mover);
      window.removeEventListener('click', click);
      window.removeEventListener('mouseout', salir);
    };
  }, [modoPincel]);

  return <canvas ref={telaRef} className="pincel-capa" aria-hidden="true" />;
}
