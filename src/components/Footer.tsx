import Latido from './Latido';
import MailCTA from './MailCTA';

export default function Footer() {
  return (
    <footer className="cierre">
      <div className="wrap reveal">
        <Latido strokeWidth={8} className="mini-pulse" />
        <p>El día a día sale en Instagram. Comentá, preguntá, meté mano.</p>
        <a
          className="cta-ig"
          href="https://www.instagram.com/pulso.envozalta"
          target="_blank"
          rel="noopener noreferrer"
        >
          @pulso.envozalta
        </a>
        <MailCTA />
        <div className="meta-mono">pulso · se construye en voz alta · 2026</div>
      </div>
    </footer>
  );
}
