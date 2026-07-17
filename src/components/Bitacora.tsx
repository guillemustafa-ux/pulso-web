import { entradas } from '../lib/bitacora';
import TarjetaEntrada from './TarjetaEntrada';

export default function Bitacora() {
  return (
    <section id="bitacora">
      <h2 className="section-title">Bitácora</h2>
      <div className="feed-grid">
        {entradas.map((e) => (
          <TarjetaEntrada key={`${e.fecha}-${e.titulo}`} entrada={e} />
        ))}
      </div>
    </section>
  );
}
