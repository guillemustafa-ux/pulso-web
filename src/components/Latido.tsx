import { useEffect, useRef } from 'react';

type Props = {
  className?: string;
  animado?: boolean;
  strokeWidth?: number;
};

// intervalo de muestreo del tempo y rango de duración del latido
const MUESTREO_MS = 400;
const DUR_REPOSO = 2.4; // segundos por latido con la página quieta
const DUR_AGITADO = 0.55; // techo de tempo con el visitante a full

// Único lugar donde vive el path del latido (IDENTIDAD.md §4)
// Con `animado`, el trazo late sin parar y su TEMPO sigue la actividad del
// visitante: quieto late lento, y se acelera cuando manipula la interfaz.
export default function Latido({ className, animado = false, strokeWidth = 6 }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !animado) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let eventos = 0;
    let nivel = 0;
    const registrar = () => {
      eventos++;
    };

    const latir = window.setInterval(() => {
      const nuevo = Math.min(1, eventos / 10);
      eventos = 0;
      // sube rápido con la actividad, baja suave al soltar (como un pulso real)
      nivel = nuevo > nivel ? nuevo : nivel * 0.85;
      const dur = DUR_REPOSO - (DUR_REPOSO - DUR_AGITADO) * nivel;
      svg.style.setProperty('--latido-dur', `${dur.toFixed(2)}s`);
    }, MUESTREO_MS);

    window.addEventListener('mousemove', registrar, { passive: true });
    window.addEventListener('scroll', registrar, { passive: true });
    window.addEventListener('click', registrar, { passive: true });
    window.addEventListener('keydown', registrar, { passive: true });
    window.addEventListener('touchmove', registrar, { passive: true });
    return () => {
      window.clearInterval(latir);
      window.removeEventListener('mousemove', registrar);
      window.removeEventListener('scroll', registrar);
      window.removeEventListener('click', registrar);
      window.removeEventListener('keydown', registrar);
      window.removeEventListener('touchmove', registrar);
    };
  }, [animado]);

  const clases = [animado ? 'latido-animado' : '', className ?? ''].filter(Boolean).join(' ');
  return (
    <svg
      ref={svgRef}
      className={clases || undefined}
      viewBox="0 0 150 50"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0 28 L38 28 L48 10 L62 44 L76 18 L86 28 L150 28"
        stroke="#FF5B35"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={100}
      />
    </svg>
  );
}
