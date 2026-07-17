import { useEffect, useRef, useState } from 'react';
import { usePincel, trazo, COLORES, GROSORES, TRAMAS } from '../lib/pincel';

// El lienzo del atril: acá el visitante deja su huella — dibujo, texto,
// lo que quiera. Se guarda en el muro y entra al compilado de la semana.
const ANCHO = 480;
const ALTO = 320;
const MAX_POR_DIA = 3;
const CLAVE_CUPO = 'pulso-huellas-hoy';

type Estado = 'dibujando' | 'enviando' | 'enviada' | 'error' | 'sin-cupo';

function cupoDeHoy(): number {
  try {
    const crudo = localStorage.getItem(CLAVE_CUPO);
    if (!crudo) return 0;
    const { fecha, n } = JSON.parse(crudo);
    return fecha === new Date().toDateString() ? n : 0;
  } catch {
    return 0;
  }
}

function sumarCupo() {
  localStorage.setItem(
    CLAVE_CUPO,
    JSON.stringify({ fecha: new Date().toDateString(), n: cupoDeHoy() + 1 }),
  );
}

export default function LienzoModal() {
  const { lienzoAbierto, setLienzoAbierto, ajustes, setAjustes } = usePincel();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [estado, setEstado] = useState<Estado>('dibujando');
  const [tocado, setTocado] = useState(false);
  const anteriorRef = useRef<{ x: number; y: number } | null>(null);
  const ajustesRef = useRef(ajustes);
  ajustesRef.current = ajustes;

  useEffect(() => {
    if (!lienzoAbierto) return;
    setEstado(cupoDeHoy() >= MAX_POR_DIA ? 'sin-cupo' : 'dibujando');
    setTocado(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.fillStyle = '#FDFBF3'; // lienzo blanco, apenas cálido
      ctx.fillRect(0, 0, ANCHO, ALTO);
    }
  }, [lienzoAbierto]);

  if (!lienzoAbierto) return null;

  const coords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * ANCHO,
      y: ((e.clientY - rect.top) / rect.height) * ALTO,
    };
  };

  const empezar = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    anteriorRef.current = coords(e);
  };

  const pintar = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!anteriorRef.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const punto = coords(e);
    trazo(ctx, anteriorRef.current.x, anteriorRef.current.y, punto.x, punto.y, ajustesRef.current);
    anteriorRef.current = punto;
    setTocado(true);
  };

  const soltar = () => {
    anteriorRef.current = null;
  };

  const limpiar = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FDFBF3';
    ctx.fillRect(0, 0, ANCHO, ALTO);
    setTocado(false);
  };

  const enviar = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !tocado || estado === 'enviando') return;
    setEstado('enviando');
    try {
      const res = await fetch('/api/huellas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagen: canvas.toDataURL('image/png') }),
      });
      if (!res.ok) throw new Error();
      sumarCupo();
      setEstado('enviada');
    } catch {
      setEstado('error');
    }
  };

  return (
    <div className="lienzo-overlay" onClick={(e) => e.target === e.currentTarget && setLienzoAbierto(false)}>
      <div className="lienzo-caja" role="dialog" aria-label="Dejá tu huella">
        {estado === 'enviada' ? (
          <div className="lienzo-gracias">
            <p className="annot">tu huella quedó en el muro ↓</p>
            <p>Entra también al compilado de la semana. Gracias por pasar.</p>
            <button className="lienzo-cerrar" onClick={() => setLienzoAbierto(false)}>
              cerrar
            </button>
          </div>
        ) : estado === 'sin-cupo' ? (
          <div className="lienzo-gracias">
            <p>
              Ya dejaste {MAX_POR_DIA} huellas hoy — la tela también descansa. Volvé mañana.
            </p>
            <button className="lienzo-cerrar" onClick={() => setLienzoAbierto(false)}>
              cerrar
            </button>
          </div>
        ) : (
          <>
            <p className="lienzo-titulo">
              Dejá tu huella: un dibujo, una firma, lo que quieras.
            </p>
            <canvas
              ref={canvasRef}
              width={ANCHO}
              height={ALTO}
              className="lienzo-canvas"
              onPointerDown={empezar}
              onPointerMove={pintar}
              onPointerUp={soltar}
              onPointerLeave={soltar}
            />
            <div className="lienzo-herramientas">
              <div className="atril-swatches">
                {COLORES.map((c) => (
                  <button
                    key={c}
                    className={`swatch ${ajustes.color === c ? 'elegido' : ''}`}
                    style={{ background: c }}
                    onClick={() => setAjustes({ ...ajustes, color: c })}
                    aria-label={`color ${c}`}
                  />
                ))}
              </div>
              <div className="atril-opciones">
                {GROSORES.map((g) => (
                  <button
                    key={g.px}
                    className={ajustes.grosor === g.px ? 'elegido' : ''}
                    onClick={() => setAjustes({ ...ajustes, grosor: g.px })}
                  >
                    {g.nombre}
                  </button>
                ))}
              </div>
              <div className="atril-opciones">
                {TRAMAS.map((t) => (
                  <button
                    key={t.id}
                    className={ajustes.trama === t.id ? 'elegido' : ''}
                    onClick={() => setAjustes({ ...ajustes, trama: t.id })}
                  >
                    {t.nombre}
                  </button>
                ))}
              </div>
            </div>
            <div className="lienzo-acciones">
              <button onClick={limpiar}>limpiar</button>
              <button onClick={() => setLienzoAbierto(false)}>cancelar</button>
              <button className="lienzo-enviar" onClick={enviar} disabled={!tocado || estado === 'enviando'}>
                {estado === 'enviando' ? 'colgando…' : 'colgar en el muro'}
              </button>
            </div>
            {estado === 'error' && (
              <span className="lienzo-error">Uy, algo se rompió — probá de nuevo en un rato.</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
