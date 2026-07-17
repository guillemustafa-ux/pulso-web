import { useEffect, useRef, useState } from 'react';
import Latido from './Latido';
import MaestroAvatar from './MaestroAvatar';
import { usePincel } from '../lib/pincel';

// El acompañante: Apeles, el maestro del taller, parado en la puerta desde
// que entrás. Sugiere según dónde estés, y al tocarlo abre el chat — un
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

// Si el maestro nombra un espacio del taller, ofrece llevarte caminando.
const ESPACIOS: [RegExp, string][] = [
  [/exchange|staking|trading/i, 'latiendo'],
  [/muro|huella|atril|lienzo/i, 'muro'],
  [/bit[aá]cora|d[ií]a a d[ií]a/i, 'bitacora'],
  [/manifiesto|convicci[oó]n/i, 'manifiesto'],
];

function espacioDe(texto: string): string | null {
  for (const [re, id] of ESPACIOS) if (re.test(texto)) return id;
  return null;
}

// El recorrido del taller: etapas que el visitante va cumpliendo, como en un
// videojuego. Quedan guardadas en su navegador; al completarlas todas, el
// maestro le pinta su estrella en el caballete.
const CLAVE_RECORRIDO = 'pulso-recorrido';
const ETAPAS: { id: string; label: string; espacio?: string }[] = [
  { id: 'manifiesto', label: 'pasá por el manifiesto', espacio: 'manifiesto' },
  { id: 'obras', label: 'mirá las obras', espacio: 'latiendo' },
  { id: 'bitacora', label: 'hojeá la bitácora', espacio: 'bitacora' },
  { id: 'pintar', label: 'pintá en el lienzo del Atril' },
  { id: 'huella', label: 'colgá tu huella en el muro', espacio: 'muro' },
];
// qué etapa se cumple al pasar por cada sección
const ETAPA_POR_SECCION: Record<string, string> = {
  manifiesto: 'manifiesto',
  latiendo: 'obras',
  bitacora: 'bitacora',
};

function recorridoGuardado(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(CLAVE_RECORRIDO) ?? '[]'));
  } catch {
    return new Set();
  }
}

// La intuición del maestro: por cómo se mueve el visitante (y la hora) elige
// qué dibujo dedicarle primero, con qué dedicatoria, y qué trato pide el
// caso. La señal viaja al agente como ID (el servidor tiene los textos).
type Intuicion = { inicial: number; dedicatoria: string; senal: string };

// índices en MOTIVOS: 0 corazón (el de la marca), 1 mate, 2 gato, 3 barquito, 4 bici
function intuir(hechas: Set<string>, eventosRecientes: number): Intuicion {
  const hora = new Date().getHours();
  if (hechas.has('pintar') || hechas.has('huella'))
    return { inicial: 0, dedicatoria: 'para vos, colega', senal: 'colega' };
  if (eventosRecientes > 60)
    return { inicial: 1, dedicatoria: 'un mate, hay tiempo', senal: 'apurado' };
  if (hora >= 5 && hora < 12)
    return { inicial: 1, dedicatoria: 'un mate, para arrancar', senal: 'maniana' };
  if (hora >= 20 || hora < 5)
    return { inicial: 3, dedicatoria: 'para vos, trasnochado', senal: 'noche' };
  return { inicial: 4, dedicatoria: 'para vos, paseandero', senal: 'paseo' };
}

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
  const [sugerencia, setSugerencia] = useState('¿te acompaño? tocame');
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [texto, setTexto] = useState('');
  const [pensando, setPensando] = useState(false);
  const [caminando, setCaminando] = useState(false);
  const [hechas, setHechas] = useState<Set<string>>(recorridoGuardado);
  const caminandoRef = useRef(false);
  const finRef = useRef<HTMLDivElement>(null);
  const { lienzoAbierto, setLienzoAbierto } = usePincel();
  const completo = hechas.size >= ETAPAS.length;
  const actividadRef = useRef<number[]>([]);
  const [intuicion, setIntuicion] = useState<Intuicion>(() => intuir(recorridoGuardado(), 0));

  // el maestro mira de reojo cómo se mueve el visitante (últimos 8 segundos)
  useEffect(() => {
    const anotar = () => {
      const ahora = performance.now();
      const v = actividadRef.current;
      v.push(ahora);
      while (v.length && ahora - v[0] > 8000) v.shift();
    };
    window.addEventListener('mousemove', anotar, { passive: true });
    window.addEventListener('scroll', anotar, { passive: true });
    window.addEventListener('touchmove', anotar, { passive: true });
    return () => {
      window.removeEventListener('mousemove', anotar);
      window.removeEventListener('scroll', anotar);
      window.removeEventListener('touchmove', anotar);
    };
  }, []);

  // al abrir el chat, intuye el caso y dedica el dibujo
  useEffect(() => {
    if (abierto) setIntuicion(intuir(recorridoGuardado(), actividadRef.current.length));
  }, [abierto]);

  const marcarEtapa = (id: string) => {
    setHechas((previas) => {
      if (previas.has(id)) return previas;
      const nuevas = new Set(previas).add(id);
      try {
        localStorage.setItem(CLAVE_RECORRIDO, JSON.stringify([...nuevas]));
      } catch {
        /* sin storage no hay recorrido persistente, nada que hacer */
      }
      return nuevas;
    });
  };

  // abrir el lienzo del Atril cumple la etapa de pintar; la huella avisa
  // desde el lienzo al colgarse
  useEffect(() => {
    if (lienzoAbierto) marcarEtapa('pintar');
  }, [lienzoAbierto]);
  useEffect(() => {
    const alColgar = () => marcarEtapa('huella');
    window.addEventListener('pulso:huella', alColgar);
    return () => window.removeEventListener('pulso:huella', alColgar);
  }, []);

  // El maestro camina hasta el espacio y la página lo sigue: el scroll lo
  // lleva él, a paso de caminata, hasta llegar.
  const llevarA = (id: string) => {
    const destino = document.getElementById(id);
    if (!destino || caminandoRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      destino.scrollIntoView();
      return;
    }
    setAbierto(false);
    setCaminando(true);
    caminandoRef.current = true;
    const desde = window.scrollY;
    const hasta =
      destino.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.22;
    const dur = Math.min(3800, Math.max(1400, Math.abs(hasta - desde) / 1.1));
    const t0 = performance.now();
    // condición del guardián: si el visitante scrollea o toca durante la
    // caminata, el maestro suelta el control al instante
    let interrumpida = false;
    const soltar = () => {
      interrumpida = true;
    };
    window.addEventListener('wheel', soltar, { passive: true });
    window.addEventListener('touchstart', soltar, { passive: true });
    window.addEventListener('keydown', soltar);
    const terminar = () => {
      window.removeEventListener('wheel', soltar);
      window.removeEventListener('touchstart', soltar);
      window.removeEventListener('keydown', soltar);
      setCaminando(false);
      caminandoRef.current = false;
    };
    const paso = (t: number) => {
      if (interrumpida) {
        terminar();
        return;
      }
      const p = Math.min(1, (t - t0) / dur);
      const suave = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      // 'instant': el paso lo pone el tween; el scroll-behavior:smooth global
      // convertiría cada cuadro en una animación nativa que pisa la caminata
      window.scrollTo({ top: desde + (hasta - desde) * suave, behavior: 'instant' });
      if (p < 1) {
        requestAnimationFrame(paso);
      } else {
        terminar();
      }
    };
    requestAnimationFrame(paso);
  };

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
            const etapa = ETAPA_POR_SECCION[e.target.id];
            if (etapa) marcarEtapa(etapa);
          }
        }
      },
      { threshold: 0.4 },
    );
    secciones.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // autoscroll SOLO dentro de la caja de mensajes (scrollIntoView arrastraba
  // la página entera hasta el fondo al abrir el chat)
  useEffect(() => {
    const caja = finRef.current?.parentElement;
    if (caja) caja.scrollTop = caja.scrollHeight;
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
        body: JSON.stringify({ mensajes: historia.slice(-10), senal: intuicion.senal }),
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

  return (
    <div className={`guia ${caminando ? 'caminando' : ''}`}>
      <div
        className={`guia-persona ${abierto ? 'abierto' : ''}`}
        role="button"
        tabIndex={0}
        aria-expanded={abierto}
        aria-label="Hablar con Apeles, el maestro del taller"
        onClick={() => setAbierto(!abierto)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setAbierto(!abierto);
          }
        }}
      >
        <MaestroAvatar
          pensando={pensando}
          caminando={caminando}
          completo={completo}
          inicial={intuicion.inicial}
          dedicatoria={intuicion.dedicatoria}
        />
        {!abierto && !caminando && <span className="guia-sugerencia">{sugerencia}</span>}
      </div>
      {abierto && (
        <div className="guia-chat">
          <div className="guia-chat-cabeza">
            <Latido strokeWidth={10} className="mini-pulse" />
            <span>Apeles · maestro del taller</span>
            <button onClick={() => setAbierto(false)} aria-label="Cerrar el guía">
              ✕
            </button>
          </div>
          <div className="guia-mensajes">
            {mensajes.length === 0 && (
              <p className="guia-hola">
                Adelante, pasá — soy Apeles, el maestro de este taller. Eso del caballete lo
                pinté para vos, de bienvenida. Tocá mi paleta y pintá en el lienzo: acá el
                código es ese — se mira, se pinta, se deja huella. Y preguntame por las obras,
                por la marca o por Guille.
              </p>
            )}
            <div className="guia-recorrido">
              <span className="guia-recorrido-titulo">el recorrido del taller</span>
              {ETAPAS.map((etapa) => {
                const hecha = hechas.has(etapa.id);
                return (
                  <button
                    key={etapa.id}
                    className={`guia-etapa ${hecha ? 'hecha' : ''}`}
                    disabled={hecha}
                    onClick={() => {
                      if (etapa.id === 'pintar') setLienzoAbierto(true);
                      else if (etapa.espacio) llevarA(etapa.espacio);
                    }}
                  >
                    <span className="guia-etapa-tilde">{hecha ? '✓' : '○'}</span>
                    {etapa.label}
                  </button>
                );
              })}
              {completo && (
                <p className="guia-recorrido-fin">
                  Recorriste todo el taller — la estrella del caballete es tuya.
                </p>
              )}
            </div>
            {mensajes.map((m, i) => {
              const espacio = m.rol === 'guia' ? espacioDe(m.texto) : null;
              return (
                <div key={i} className={`guia-burbuja ${m.rol}`}>
                  <p className={`guia-msj ${m.rol}`}>{m.texto}</p>
                  {espacio && (
                    <button className="guia-llevame" onClick={() => llevarA(espacio)}>
                      vení, te lo muestro →
                    </button>
                  )}
                </div>
              );
            })}
            {pensando && (
              <p className="guia-msj guia pensando" aria-label="el maestro está pensando">
                <span className="corazon-pensando">♥</span>
              </p>
            )}
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
    </div>
  );
}
