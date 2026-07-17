import type { Entrada } from '../lib/bitacora';
import Latido from './Latido';

function fechaCorta(fecha: string): string {
  const [, mes, dia] = fecha.split('-');
  return `${dia}/${mes}`;
}

function Cuerpo({ parrafos }: { parrafos: string[] }) {
  return (
    <div className="cuerpo">
      {parrafos.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export default function TarjetaEntrada({ entrada }: { entrada: Entrada }) {
  const meta = `${fechaCorta(entrada.fecha)} · ${entrada.proyecto}`;

  if (entrada.tipo === 'proceso') {
    return (
      <article className="card proceso reveal">
        {entrada.anotacion && <span className="annot">{entrada.anotacion}</span>}
        {entrada.terminal && <pre className="term">{entrada.terminal}</pre>}
        <Cuerpo parrafos={entrada.cuerpo} />
        <div className="h-meta">{meta}</div>
      </article>
    );
  }

  if (entrada.tipo === 'resultado') {
    return (
      <article className="card resultado reveal">
        {entrada.imagen && <img className="photo" src={entrada.imagen} alt={entrada.titulo} />}
        <div className="band">
          <span className="name">{entrada.proyecto}</span>
          <Latido strokeWidth={14} className="mini-pulse" />
        </div>
        <Cuerpo parrafos={entrada.cuerpo} />
        <div className="h-meta">{meta}</div>
      </article>
    );
  }

  return (
    <article className="card hito reveal">
      <span className="h-tag">hito</span>
      <div className="h-title">{entrada.titulo}</div>
      <Cuerpo parrafos={entrada.cuerpo} />
      <div className="h-meta">{meta}</div>
    </article>
  );
}
