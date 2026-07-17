import { useState } from 'react';
import { usePincel, COLORES, GROSORES, TRAMAS } from '../lib/pincel';

// El atril del taller, arriba a la derecha: abre el lienzo para dejar tu
// huella y presta el pincel para pintar la página (modo pincel).
export default function Atril() {
  const { modoPincel, setModoPincel, setLienzoAbierto, ajustes, setAjustes, limpiarTela } =
    usePincel();
  const [abierto, setAbierto] = useState(false);
  const punteroFino =
    typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

  return (
    <div className={`atril ${abierto ? 'abierto' : ''}`}>
      <button
        className="atril-boton"
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        aria-label="Abrir el atril"
      >
        <svg viewBox="0 0 32 32" aria-hidden="true">
          {/* atril: marco, lienzo y patas */}
          <rect x="7" y="5" width="18" height="14" rx="1" fill="#FDFBF3" stroke="currentColor" strokeWidth="2" />
          <line x1="16" y1="2" x2="16" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="9" y1="19" x2="5" y2="29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="23" y1="19" x2="27" y2="29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="19" x2="16" y2="27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M11 12 Q14 8 17 11 T23 10" fill="none" stroke="#FF5B35" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="atril-label">Atril</span>
      </button>

      {abierto && (
        <div className="atril-panel">
          <button className="atril-huella" onClick={() => { setLienzoAbierto(true); setAbierto(false); }}>
            dejá tu huella →
          </button>

          {punteroFino && (
            <>
              <label className="atril-toggle">
                <input
                  type="checkbox"
                  checked={modoPincel}
                  onChange={(e) => setModoPincel(e.target.checked)}
                />
                pintar la página — algunas huellas se borran, otras quedan
              </label>
              <button className="atril-limpiar" onClick={limpiarTela}>
                borrar toda la pintura
              </button>
            </>
          )}

          <div className="atril-grupo">
            <span className="atril-titulo">color</span>
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
          </div>

          <div className="atril-grupo">
            <span className="atril-titulo">grosor</span>
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
          </div>

          <div className="atril-grupo">
            <span className="atril-titulo">trama</span>
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
        </div>
      )}
    </div>
  );
}
