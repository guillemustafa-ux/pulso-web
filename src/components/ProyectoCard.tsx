import type { Proyecto } from '../content/proyectos';
import Latido from './Latido';
import Alfiler from './Alfiler';
import Broche from './Broche';

const COLOR_BROCHE: Record<string, string> = {
  mostaza: '#FF5B35', // broche ember sobre tela mostaza
  verde: '#F2B705', // broche mostaza sobre tela verde
};

export default function ProyectoCard({ proyecto }: { proyecto: Proyecto }) {
  const esMuestra = Boolean(proyecto.retazo);
  const clases = [
    'proyecto-card',
    'reveal',
    esMuestra ? `retazo retazo-${proyecto.retazo}` : 'terminado',
    proyecto.tinte ? `tinte-${proyecto.tinte}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={clases}>
      {esMuestra ? <Broche color={COLOR_BROCHE[proyecto.retazo!]} /> : <Alfiler />}

      {proyecto.esPulsoDeX ? (
        <div className="lockup">
          <span className="marca">PULSO</span>
          <span className="dot">·</span>
          <span className="hija">{proyecto.esPulsoDeX}</span>
        </div>
      ) : (
        <h3>{proyecto.nombre}</h3>
      )}

      {proyecto.esPulsoDeX && (
        <span className="pill">
          <Latido strokeWidth={14} className="mini-pulse" />
          {proyecto.nombre}
        </span>
      )}

      {proyecto.nacioEnPulso && (
        <div>
          <span className="pill">nació en pulso</span>
          <div className="founder-strip" />
        </div>
      )}

      <p className="descripcion">{proyecto.descripcion}</p>

      {proyecto.detalles && (
        <div className="chips">
          {proyecto.detalles.map((d) => (
            <span key={d} className="chip">
              {d}
            </span>
          ))}
        </div>
      )}

      {proyecto.url ? (
        <a className="link-vivo" href={proyecto.url} target="_blank" rel="noopener noreferrer">
          probar en vivo →
        </a>
      ) : null}

      {proyecto.estado === 'live' ? (
        <span className="estado-live">
          <span className="dot" />
          live
        </span>
      ) : (
        <span className="tag-costura">{proyecto.estado}</span>
      )}
    </article>
  );
}
