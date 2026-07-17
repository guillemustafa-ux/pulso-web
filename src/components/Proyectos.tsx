import { proyectos } from '../content/proyectos';
import ProyectoCard from './ProyectoCard';

export default function Proyectos() {
  return (
    <section id="latiendo">
      <h2 className="section-title">Lo que está latiendo</h2>
      {/* el hilo de sisal del que cuelgan las muestras */}
      <svg className="hilo-sisal" viewBox="0 0 1200 26" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <path
          d="M0 14 C 100 6, 200 22, 300 13 S 500 5, 600 15 S 800 24, 900 13 S 1100 7, 1200 15"
          stroke="#A98E5F"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="7 3"
        />
        <path
          d="M0 16 C 100 8, 200 24, 300 15 S 500 7, 600 17 S 800 26, 900 15 S 1100 9, 1200 17"
          stroke="rgba(169,142,95,0.45)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="4 5"
        />
      </svg>
      <div className="proyectos-grid">
        {proyectos.map((p) => (
          <ProyectoCard key={p.id} proyecto={p} />
        ))}
      </div>
    </section>
  );
}
