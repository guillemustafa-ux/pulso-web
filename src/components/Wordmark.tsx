import Latido from './Latido';

export default function Wordmark({ animado = false }: { animado?: boolean }) {
  return (
    <div className="wordmark">
      <span>pulso</span>
      <Latido className="pulse-overlay" animado={animado} />
    </div>
  );
}
