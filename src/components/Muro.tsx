import { useEffect, useState } from 'react';
import { usePincel } from '../lib/pincel';

// El muro: las huellas que deja la gente que pasa. Espacio de visitantes,
// separado de la voz del canal (salvaguarda del guardián). Muestra las
// últimas; todas quedan archivadas para el compilado semanal/mensual.
type Huella = { url: string; subida: string };

export default function Muro() {
  const { setLienzoAbierto } = usePincel();
  const [huellas, setHuellas] = useState<Huella[]>([]);
  const [total, setTotal] = useState(0);
  const [cargado, setCargado] = useState(false);
  const llave = new URLSearchParams(window.location.search).get('llave');

  const cargar = () => {
    fetch('/api/huellas')
      .then((r) => r.json())
      .then((d) => {
        setHuellas(d.huellas ?? []);
        setTotal(d.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setCargado(true));
  };

  useEffect(cargar, []);

  const borrar = async (url: string) => {
    await fetch('/api/borrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, llave }),
    });
    cargar();
  };

  return (
    <section id="muro" className="reveal">
      <h2 className="section-title">El muro de los que pasan</h2>
      <p className="muro-intro">
        El lienzo está en el atril, arriba a la derecha: dejá tu dibujo, tu firma, lo que
        quieras. Las últimas huellas quedan acá; todas entran al compilado de la semana.
      </p>
      <p className="muro-disclaimer">
        Esto lo dibuja la gente que pasa, en vivo y sin filtro previo. Lo que no va, lo saco.
        Si ves algo que no va, avisame por IG.
      </p>

      {cargado && huellas.length === 0 && (
        <button className="muro-vacio" onClick={() => setLienzoAbierto(true)}>
          <span className="annot">todavía no hay huellas — dejá la primera ↗</span>
        </button>
      )}

      {huellas.length > 0 && (
        <>
          <div className="muro-grid">
            {huellas.map((h) => (
              <figure key={h.url} className="muro-huella">
                <img src={h.url} alt="Huella de un visitante" loading="lazy" />
                <figcaption className="meta-mono">
                  {new Date(h.subida).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}
                </figcaption>
                {llave && (
                  <button className="muro-borrar" onClick={() => borrar(h.url)} aria-label="Borrar huella">
                    ✕
                  </button>
                )}
              </figure>
            ))}
          </div>
          <p className="meta-mono muro-total">
            {total} huella{total === 1 ? '' : 's'} hasta hoy · las demás esperan el compilado
          </p>
        </>
      )}
    </section>
  );
}
