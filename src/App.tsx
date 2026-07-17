import { useEffect } from 'react';
import Hero from './components/Hero';
import Manifiesto from './components/Manifiesto';
import Proyectos from './components/Proyectos';
import Bitacora from './components/Bitacora';
import Muro from './components/Muro';
import Footer from './components/Footer';
import AgujaCursor from './components/AgujaCursor';
import Atril from './components/Atril';
import PincelCapa from './components/PincelCapa';
import LienzoModal from './components/LienzoModal';
import Guia from './components/Guia';
import { PincelProvider } from './lib/pincel';

export default function App() {
  // apariciones/desapariciones al scrollear: .reveal gana .visible al entrar
  // al viewport y la pierde al salir
  useEffect(() => {
    const elementos = document.querySelectorAll('.reveal');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elementos.forEach((el) => el.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.12 },
    );
    elementos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <PincelProvider>
      <AgujaCursor />
      <PincelCapa />
      <Atril />
      <LienzoModal />
      <Guia />
      <div className="wrap">
        <Hero />
        <main>
          <Manifiesto />
          <Proyectos />
          <Bitacora />
          <Muro />
        </main>
      </div>
      <Footer />
    </PincelProvider>
  );
}
