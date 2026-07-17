import { createContext, useContext, useState, type ReactNode } from 'react';

// El pincel del taller: ajustes compartidos entre el modo pincel (pintar la
// página) y el lienzo del atril. Paleta del canal, sin turquesa (reservado).
export type Trama = 'solido' | 'seco' | 'tela';
export type Ajustes = { color: string; grosor: number; trama: Trama };

export const COLORES = ['#221A12', '#FF5B35', '#F2B705', '#8bc061', '#e09a4a'];
export const GROSORES: { nombre: string; px: number }[] = [
  { nombre: 'fino', px: 3 },
  { nombre: 'medio', px: 6 },
  { nombre: 'grueso', px: 12 },
];
export const TRAMAS: { id: Trama; nombre: string }[] = [
  { id: 'solido', nombre: 'sólido' },
  { id: 'seco', nombre: 'seco' },
  { id: 'tela', nombre: 'tela' },
];

type PincelCtx = {
  modoPincel: boolean;
  setModoPincel: (v: boolean) => void;
  lienzoAbierto: boolean;
  setLienzoAbierto: (v: boolean) => void;
  ajustes: Ajustes;
  setAjustes: (a: Ajustes) => void;
  nonceLimpiar: number;
  limpiarTela: () => void; // borra TODO lo pintado en la página, capas y marcas guardadas
};

const Ctx = createContext<PincelCtx | null>(null);

export function PincelProvider({ children }: { children: ReactNode }) {
  const [modoPincel, setModoPincel] = useState(false);
  const [lienzoAbierto, setLienzoAbierto] = useState(false);
  const [ajustes, setAjustes] = useState<Ajustes>({
    color: '#FF5B35',
    grosor: 6,
    trama: 'solido',
  });
  const [nonceLimpiar, setNonceLimpiar] = useState(0);
  const limpiarTela = () => setNonceLimpiar((n) => n + 1);
  return (
    <Ctx.Provider
      value={{
        modoPincel,
        setModoPincel,
        lienzoAbierto,
        setLienzoAbierto,
        ajustes,
        setAjustes,
        nonceLimpiar,
        limpiarTela,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function usePincel() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('usePincel fuera de PincelProvider');
  return ctx;
}

/* ===== dibujo ===== */

function linea(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

// Un tramo de pincelada entre dos puntos, según la trama elegida.
export function trazo(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  a: Ajustes,
) {
  ctx.strokeStyle = a.color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (a.trama === 'seco') {
    // tiza seca: tres pasadas finas corridas apenas, translúcidas
    ctx.setLineDash([]);
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = Math.max(1, a.grosor / 3);
    for (let i = -1; i <= 1; i++) {
      const off = i * (a.grosor / 2.5);
      linea(ctx, x0 + off, y0 + off, x1 + off, y1 + off);
    }
  } else if (a.trama === 'tela') {
    // entramado: puntadas, como la costura de la página
    ctx.globalAlpha = 0.9;
    ctx.setLineDash([a.grosor, a.grosor * 0.7]);
    ctx.lineWidth = a.grosor;
    linea(ctx, x0, y0, x1, y1);
  } else {
    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
    ctx.lineWidth = a.grosor;
    linea(ctx, x0, y0, x1, y1);
  }

  ctx.globalAlpha = 1;
  ctx.setLineDash([]);
}

// La pincelada suelta que deja un click.
export function pincelada(ctx: CanvasRenderingContext2D, x: number, y: number, a: Ajustes) {
  ctx.fillStyle = a.color;
  if (a.trama === 'seco') {
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 3; i++) {
      const dx = (Math.sin(x * 13 + i * 7) * a.grosor) / 2;
      const dy = (Math.cos(y * 17 + i * 5) * a.grosor) / 2;
      ctx.beginPath();
      ctx.arc(x + dx, y + dy, a.grosor * 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (a.trama === 'tela') {
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(x, y, a.grosor, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(x + a.grosor * 1.4, y - a.grosor * 0.8, a.grosor * 0.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(x, y, a.grosor * 1.1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
