import { useEffect, useRef } from 'react';
import { usePincel, trazo, pincelada } from '../lib/pincel';

// Modo pincel: el trazo queda pintado sobre la página mientras navegás.
// La tela tiene memoria caprichosa: la mayoría de los gestos se desvanecen
// en ~40s, pero algunos (~3 de 10) quedan marcados para siempre — se guardan
// en el navegador del visitante y lo esperan la próxima vez que vuelve.
const CHANCE_DE_QUEDAR = 0.3;
const PAUSA_NUEVO_GESTO = 400; // ms sin mover el mouse = gesto nuevo
const CLAVE_MARCAS = 'pulso-tela-marcas';

export default function PincelCapa() {
  const fijaRef = useRef<HTMLCanvasElement>(null);
  const efimeraRef = useRef<HTMLCanvasElement>(null);
  const hayCambiosRef = useRef(false);
  const { modoPincel, ajustes } = usePincel();
  const ajustesRef = useRef(ajustes);
  ajustesRef.current = ajustes;

  // la capa fija vive siempre: restaura las marcas guardadas de visitas anteriores
  useEffect(() => {
    const fija = fijaRef.current;
    const ctx = fija?.getContext('2d');
    if (!fija || !ctx) return;

    const dimensionar = () => {
      const copia = document.createElement('canvas');
      copia.width = fija.width;
      copia.height = fija.height;
      copia.getContext('2d')?.drawImage(fija, 0, 0);
      fija.width = window.innerWidth * devicePixelRatio;
      fija.height = window.innerHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      if (copia.width > 0) {
        ctx.drawImage(copia, 0, 0, copia.width / devicePixelRatio, copia.height / devicePixelRatio);
      }
    };
    dimensionar();

    const guardadas = localStorage.getItem(CLAVE_MARCAS);
    if (guardadas) {
      const img = new Image();
      img.onload = () =>
        ctx.drawImage(img, 0, 0, window.innerWidth, window.innerHeight);
      img.src = guardadas;
    }

    // las marcas nuevas se guardan de a ratos, sin trabar el dibujo
    const guardar = window.setInterval(() => {
      if (!hayCambiosRef.current) return;
      hayCambiosRef.current = false;
      try {
        localStorage.setItem(CLAVE_MARCAS, fija.toDataURL('image/png'));
      } catch {
        // storage lleno: la tela sigue andando, solo deja de recordar
      }
    }, 3000);

    window.addEventListener('resize', dimensionar);
    return () => {
      window.clearInterval(guardar);
      window.removeEventListener('resize', dimensionar);
    };
  }, []);

  // el pincel activo: pinta sobre la fija (si el gesto queda) o la efímera
  useEffect(() => {
    document.body.classList.toggle('modo-pincel', modoPincel);
    const fija = fijaRef.current;
    const efimera = efimeraRef.current;
    if (!fija || !efimera || !modoPincel) return;

    const ctxFija = fija.getContext('2d');
    const ctxEfimera = efimera.getContext('2d');
    if (!ctxFija || !ctxEfimera) return;

    const ajustar = () => {
      efimera.width = window.innerWidth * devicePixelRatio;
      efimera.height = window.innerHeight * devicePixelRatio;
      ctxEfimera.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    ajustar();

    let anterior: { x: number; y: number } | null = null;
    let ultimoMovimiento = 0;
    let gestoQueda = false;

    const mover = (e: MouseEvent) => {
      const ahora = performance.now();
      if (ahora - ultimoMovimiento > PAUSA_NUEVO_GESTO) {
        // gesto nuevo: se sortea si esta pincelada queda marcada o se desvanece
        gestoQueda = Math.random() < CHANCE_DE_QUEDAR;
        anterior = null;
      }
      ultimoMovimiento = ahora;
      const punto = { x: e.clientX, y: e.clientY };
      const ctx = gestoQueda ? ctxFija : ctxEfimera;
      if (anterior) trazo(ctx, anterior.x, anterior.y, punto.x, punto.y, ajustesRef.current);
      if (gestoQueda) hayCambiosRef.current = true;
      anterior = punto;
    };

    const click = (e: MouseEvent) => {
      // el atril y el lienzo no se pintan encima
      if ((e.target as HTMLElement).closest('.atril, .lienzo-overlay')) return;
      const queda = Math.random() < CHANCE_DE_QUEDAR;
      pincelada(queda ? ctxFija : ctxEfimera, e.clientX, e.clientY, ajustesRef.current);
      if (queda) hayCambiosRef.current = true;
    };

    const salir = () => {
      anterior = null;
    };

    // la tela absorbe la capa efímera de a poco (~40s hasta desaparecer)
    const absorber = window.setInterval(() => {
      ctxEfimera.save();
      ctxEfimera.globalCompositeOperation = 'destination-out';
      ctxEfimera.globalAlpha = 0.03;
      ctxEfimera.fillStyle = '#000';
      ctxEfimera.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctxEfimera.restore();
    }, 400);

    window.addEventListener('mousemove', mover);
    window.addEventListener('click', click);
    window.addEventListener('mouseout', salir);
    window.addEventListener('resize', ajustar);
    return () => {
      window.clearInterval(absorber);
      window.removeEventListener('mousemove', mover);
      window.removeEventListener('click', click);
      window.removeEventListener('mouseout', salir);
      window.removeEventListener('resize', ajustar);
    };
  }, [modoPincel]);

  return (
    <>
      <canvas ref={fijaRef} className="pincel-capa" aria-hidden="true" />
      {modoPincel && <canvas ref={efimeraRef} className="pincel-capa" aria-hidden="true" />}
    </>
  );
}
