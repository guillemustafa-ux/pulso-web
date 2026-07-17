import { useEffect, useRef, useState } from 'react';
import Latido from './Latido';

// El acompañante: un latido chiquito y tenue que aparece al scrollear,
// sugiere según dónde estés, y al abrirlo es el guía del taller — un
// agente IA que responde sobre los proyectos, la marca y Guille.
const MAX_PREGUNTAS_DIA = 10;
const CLAVE_CUPO = 'pulso-guia-hoy';

const SUGERENCIAS: Record<string, string> = {
  manifiesto: 'esto es lo que creemos ¿preguntas? tocame',
  latiendo: 'el exchange se puede probar en vivo ↑',
  bitacora: 'esto pasó de verdad, día a día',
  muro: 'dejá tu huella en el Atril ↗',
};

type Mensaje = { rol: 'visitante' | 'guia'; texto: string };

function cupoDeHoy(): number {
  try {
    const crudo = localStorage.getItem(CLAVE_CUPO);
    if (!crudo) return 0;
    const { fecha, n } = JSON.parse(crudo);
    return fecha === new Date().toDateString() ? n : 0;
  } catch {
    return 0;
  }
}

export default function Guia() {
  const [visible, setVisible] = useState(false);
  const [sugerencia, setSugerencia] = useState('¿te acompaño? tocame');
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [texto, setTexto] = useState('');
  const [pensando, setPensando] = useState(false);
  const finRef = useRef<HTMLDivElement>(null);

  // aparece recién cuando el visitante baja de la zona del hero
  useEffect(() => {
    const alScrollear = () => setVisible(window.scrollY > window.innerHeight * 0.5);
    alScrollear();
    window.addEventListener('scroll', alScrollear, { passive: true });
    return () => window.removeEventListener('scroll', alScrollear);
  }, []);

  // la sugerencia sigue la sección que estás mirando
  useEffect(() => {
    const secciones = Object.keys(SUGERENCIAS)
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && SUGERENCIAS[e.target.id]) {
            setSugerencia(SUGERENCIAS[e.target.id]);
          }
        }
      },
      { threshold: 0.4 },
    );
    secciones.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, pensando]);

  const preguntar = async (e: React.FormEvent) => {
    e.preventDefault();
    const pregunta = texto.trim();
    if (!pregunta || pensando) return;
    if (cupoDeHoy() >= MAX_PREGUNTAS_DIA) {
      setMensajes((m) => [
        ...m,
        { rol: 'visitante', texto: pregunta },
        { rol: 'guia', texto: 'Por hoy charlamos bastante — el taller también descansa. Volvé mañana, o seguila por IG: @pulso.envozalta.' },
      ]);
      setTexto('');
      return;
    }

    const historia: Mensaje[] = [...mensajes, { rol: 'visitante', texto: pregunta }];
    setMensajes(historia);
    setTexto('');
    setPensando(true);
    try {
      const res = await fetch('/api/guia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensajes: historia.slice(-10) }),
      });
      const datos = await res.json();
      if (!res.ok) throw new Error(datos?.error);
      localStorage.setItem(
        CLAVE_CUPO,
        JSON.stringify({ fecha: new Date().toDateString(), n: cupoDeHoy() + 1 }),
      );
      setMensajes((m) => [...m, { rol: 'guia', texto: datos.texto }]);
    } catch (err) {
      setMensajes((m) => [
        ...m,
        {
          rol: 'guia',
          texto:
            err instanceof Error && err.message
              ? `Uy: ${err.message}.`
              : 'Uy, algo se rompió — probá de nuevo en un rato.',
        },
      ]);
    } finally {
      setPensando(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="guia">
      {abierto && (
        <div className="guia-chat">
          <div className="guia-chat-cabeza">
            <Latido strokeWidth={10} className="mini-pulse" />
            <span>el maestro del taller</span>
            <button onClick={() => setAbierto(false)} aria-label="Cerrar el guía">
              ✕
            </button>
          </div>
          <div className="guia-mensajes">
            {mensajes.length === 0 && (
              <p className="guia-hola">
                Adelante, pasá — soy el maestro de este taller. Preguntame por las obras, por la
                marca o por Guille.
              </p>
            )}
            {mensajes.map((m, i) => (
              <p key={i} className={`guia-msj ${m.rol}`}>
                {m.texto}
              </p>
            ))}
            {pensando && <p className="guia-msj guia pensando">···</p>}
            <div ref={finRef} />
          </div>
          <form className="guia-form" onSubmit={preguntar}>
            <input
              type="text"
              placeholder="preguntame algo"
              value={texto}
              maxLength={500}
              onChange={(e) => setTexto(e.target.value)}
            />
            <button type="submit" disabled={pensando || !texto.trim()}>
              →
            </button>
          </form>
        </div>
      )}
      <button className="guia-boton" onClick={() => setAbierto(!abierto)} aria-expanded={abierto}>
        <Latido animado strokeWidth={9} className="guia-latido" />
        {!abierto && <span className="guia-sugerencia">{sugerencia}</span>}
      </button>
    </div>
  );
}
