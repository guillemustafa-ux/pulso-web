import Wordmark from './Wordmark';

export default function Hero() {
  return (
    <div className="hero-zona">
      <header className="hero">
        <div className="hero-brand">
          <Wordmark animado />
          <div className="tagline-manual">se construye en voz alta</div>
        </div>
        <div className="meta-mono hero-meta">
          la bitácora de guille
          <br />
          #buildinpublic · hecho en argentina
        </div>
      </header>
      <p className="hero-bio">
        Armo apps, bots y lo que se me cruce, con mi equipo de IA. Entrá y mirá el proceso, tal
        como va, sin pulir.
      </p>
      <nav className="ancla" aria-label="Secciones">
        <a href="#manifiesto">manifiesto</a>
        <a href="#latiendo">proyectos</a>
        <a href="#bitacora">bitácora</a>
      </nav>
    </div>
  );
}
