import type { CSSProperties } from 'react';
import { usePincel } from '../lib/pincel';

// El maestro del taller en persona: viejito pintor de época con boina, delantal
// manchado, cinturón de pinceles y paleta en mano. A su lado, un caballete donde
// pinta dibujos de bienvenida dedicados al visitante, pincelada por pincelada.
// La paleta es clickeable: te presta el pincel.
// Si el visitante completó el recorrido del taller, en el caballete queda
// pintada su estrella. Cuando camina, se hamaca al paso.

// Cada motivo son 4 pinceladas que se pintan de a una (nunca dos a la vez).
const MOTIVOS: { id: string; color: string; trazos: string[] }[] = [
  {
    // el de la marca: un corazón con el latido adentro
    id: 'corazon',
    color: 'var(--ember)',
    trazos: [
      'M33 104 C18 92 14 80 24 74 C29 71 33 76 33 81 C33 76 37 71 42 74 C52 80 48 92 33 104',
      'M20 86 L27 86 L30 80 L34 94 L38 83 L40 86 L46 86',
      'M14 69 L17 72 M52 69 L49 72 M33 64 L33 68',
      'M12 80 L16 80 M54 80 L50 80',
    ],
  },
  {
    id: 'mate',
    color: 'var(--ocre)',
    trazos: [
      'M24 82 Q20 82 20 88 Q20 102 33 102 Q46 102 46 88 Q46 82 42 82 Q33 79 24 82',
      'M24 82 Q33 86 42 82',
      'M36 81 L46 69 Q48 66 50 68 Q51 70 48 71',
      'M28 75 Q25 71 28 67',
    ],
  },
  {
    id: 'gato',
    color: 'var(--tinta)',
    trazos: [
      'M20 102 Q14 88 24 80 L22 71 L28 75 Q31 73 34 75 L40 71 L38 80 Q44 87 42 95 Q41 102 36 102',
      'M20 102 Q11 100 13 92 Q14 88 18 89',
      'M28 81 L28 84 M35 81 L35 84 M31 87 L32 88 L33 87',
      'M26 87 L19 85 M26 89 L19 90 M37 87 L44 85 M37 89 L44 90',
    ],
  },
  {
    id: 'barquito',
    color: 'var(--ember)',
    trazos: [
      'M14 92 L52 92 L44 100 L22 100 Z',
      'M14 92 L33 72 L52 92 M33 72 L33 92',
      'M10 104 Q16 100 22 104 Q28 108 34 104 Q40 100 46 104 Q52 108 56 104',
      'M15 68 Q18 65 21 68 M21 68 Q24 65 27 68',
    ],
  },
  {
    id: 'bici',
    color: 'var(--verde)',
    trazos: [
      'M26 98 A8 8 0 1 1 25.9 97.9',
      'M54 98 A8 8 0 1 1 53.9 97.9',
      'M18 98 L26 84 L40 84 L46 98 L31 98 L26 84 M46 98 L43 81',
      'M26 84 L24 79 L21 80 M43 81 L47 78 L50 80',
    ],
  },
];

export default function MaestroAvatar({
  pensando = false,
  caminando = false,
  completo = false,
  inicial = 0,
  dedicatoria = 'para vos',
}: {
  pensando?: boolean;
  caminando?: boolean;
  completo?: boolean;
  inicial?: number;
  dedicatoria?: string;
}) {
  const { modoPincel, setModoPincel } = usePincel();

  const alternarPincel = () => setModoPincel(!modoPincel);

  return (
    <svg
      className={`maestro ${pensando ? 'pensando' : ''} ${caminando ? 'caminando' : ''}`}
      viewBox="0 0 160 170"
      width="160"
      height="170"
      role="img"
      aria-label="El maestro del taller, pintando un regalo de bienvenida"
    >
      {/* ===== caballete con el regalo de bienvenida ===== */}
      <g className="maestro-caballete">
        <line x1="8" y1="112" x2="2" y2="155" stroke="var(--tinta)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="56" y1="112" x2="62" y2="155" stroke="var(--tinta)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="118" x2="32" y2="157" stroke="var(--tinta)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="0" y1="112" x2="66" y2="112" stroke="var(--tinta)" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="6" y="62" width="54" height="48" rx="2" fill="#FBF6EA" stroke="var(--tinta)" strokeWidth="2" />
        {/* recorrido completo: la estrella del visitante queda pintada */}
        {completo && (
          <path
            d="M33 72 L36.5 81.1 L46.3 81.7 L38.7 87.9 L41.2 97.3 L33 92 L24.8 97.3 L27.3 87.9 L19.7 81.7 L29.5 81.1 Z"
            fill="var(--mostaza)"
            stroke="var(--tinta)"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        )}
        {/* los dibujos dedicados: el maestro los pinta pincelada por pincelada
            (nunca dos trazos a la vez). El orden arranca por el motivo que la
            intuición eligió para este visitante. */}
        <g
          style={{ display: completo ? 'none' : undefined }}
          fill="none"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {MOTIVOS.map((motivo, i) => (
            <g
              key={motivo.id}
              className="motivo"
              stroke={motivo.color}
              style={{ '--retraso': `${((i - inicial + MOTIVOS.length) % MOTIVOS.length) * 12}s` } as CSSProperties}
            >
              {motivo.trazos.map((d, k) => (
                <path key={k} className={`maestro-trazo t${k + 1}`} d={d} pathLength="100" />
              ))}
            </g>
          ))}
        </g>
        <text className="maestro-caveat" x="33" y="167" textAnchor="middle">
          {completo ? 'tu estrella' : dedicatoria}
        </text>
      </g>

      {/* ===== el maestro ===== */}
      <g className="maestro-figura">
        {/* delantal manchado de pintura */}
        <path
          d="M85 67 C95 61 107 61 117 67 L124 149 L78 149 Z"
          fill="#EDE3CC"
          stroke="var(--tinta)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <g opacity="0.85">
          <ellipse cx="92" cy="84" rx="4" ry="3" fill="var(--ember)" transform="rotate(-18 92 84)" />
          <path d="M106 92 Q111 90 112 95 Q113 100 107 99 Q103 98 106 92" fill="var(--mostaza)" />
          <ellipse cx="97" cy="124" rx="4.5" ry="3" fill="var(--verde)" transform="rotate(12 97 124)" />
          <ellipse cx="114" cy="134" rx="3.5" ry="2.5" fill="var(--ocre)" transform="rotate(-25 114 134)" />
          <circle cx="86" cy="103" r="1.8" fill="var(--mostaza)" />
          <circle cx="119" cy="118" r="1.5" fill="var(--ember)" />
          {/* el corazón: una mancha que no es casualidad */}
          <path
            d="M88 131 C85 128 84 125.5 86 124.3 C87.2 123.6 88 124.6 88 125.6 C88 124.6 88.8 123.6 90 124.3 C92 125.5 91 128 88 131"
            fill="var(--ember)"
          />
        </g>

        {/* cinturón con distintos pinceles */}
        <g>
          <line x1="88" y1="106" x2="88" y2="93" stroke="var(--tinta)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M86 93 L90 93 L88 87 Z" fill="var(--ember)" />
          <line x1="100" y1="106" x2="100" y2="89" stroke="var(--tinta)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M98 89 L102 89 L100 83 Z" fill="var(--verde)" />
          <line x1="112" y1="106" x2="112" y2="95" stroke="var(--tinta)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M110 95 L114 95 L112 89 Z" fill="var(--mostaza)" />
          <rect x="80" y="106" width="42" height="9" rx="2" fill="#D9C7A0" stroke="var(--tinta)" strokeWidth="2" />
        </g>

        {/* brazo con el pincel, pintando el caballete */}
        <g className="maestro-brazo-pincel">
          <path d="M86 74 Q68 80 58 91" fill="none" stroke="var(--tinta)" strokeWidth="4" strokeLinecap="round" />
          <circle cx="58" cy="92" r="3.5" fill="#F6EFDE" stroke="var(--tinta)" strokeWidth="1.8" />
          <line x1="57" y1="93" x2="48" y2="99" stroke="var(--tinta)" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="47.5" cy="99.5" r="2" fill="var(--ember)" />
        </g>

        {/* cabeza: boina, cejas, ojos que parpadean, bigote y barba canosos */}
        <circle cx="100" cy="40" r="17" fill="#F6EFDE" stroke="var(--tinta)" strokeWidth="2.5" />
        <path
          d="M83 33 C81 19 117 15 119 29 C120 34 112 32 100 32 C90 32 84 37 83 33 Z"
          fill="var(--ember)"
          stroke="var(--tinta)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="102" cy="16" r="2.5" fill="var(--ember)" stroke="var(--tinta)" strokeWidth="1.5" />
        <path d="M89 37 Q93 33.5 97 36.5" fill="none" stroke="var(--tinta)" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M104 36.5 Q108 33.5 112 37" fill="none" stroke="var(--tinta)" strokeWidth="2.8" strokeLinecap="round" />
        <g className="maestro-ojos">
          <circle cx="94" cy="42" r="2.2" fill="var(--tinta)" />
          <circle cx="107" cy="42" r="2.2" fill="var(--tinta)" />
        </g>
        <path d="M101 42 Q104 48 100 50" fill="none" stroke="var(--tinta)" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M100 53 Q92 49.5 87.5 54 Q92 59.5 100 56 Q108 59.5 112.5 54 Q108 49.5 100 53"
          fill="#F2ECDC"
          stroke="var(--tinta)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M90 57 Q91 68 100 69 Q109 68 110 57 Q106 62 100 61 Q94 62 90 57"
          fill="#F2ECDC"
          stroke="var(--tinta)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* brazo con la paleta que te invita a pintar (clickeable) */}
        <path d="M117 74 Q130 81 133 91" fill="none" stroke="var(--tinta)" strokeWidth="4" strokeLinecap="round" />
        <g
          className="maestro-paleta"
          role="button"
          tabIndex={0}
          aria-label={modoPincel ? 'Devolver el pincel' : 'Tomar el pincel y pintar la página'}
          onClick={alternarPincel}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              alternarPincel();
            }
          }}
        >
          <title>{modoPincel ? 'devolver el pincel' : 'tocá la paleta y pintá vos'}</title>
          <ellipse cx="133" cy="104" rx="13" ry="10" fill="#F2ECDC" stroke="var(--tinta)" strokeWidth="2.5" />
          <ellipse cx="127" cy="108" rx="2.5" ry="2" fill="var(--papel)" stroke="var(--tinta)" strokeWidth="1.5" />
          <circle cx="128" cy="99" r="2" fill="var(--ember)" />
          <circle cx="134" cy="97" r="2" fill="var(--mostaza)" />
          <circle cx="139" cy="101" r="2" fill="var(--verde)" />
          <circle cx="139.5" cy="107" r="2" fill="var(--ocre)" />
          <circle cx="135" cy="111" r="1.8" fill="var(--tinta)" />
        </g>
        <text className="maestro-caveat maestro-invita" x="132" y="128" textAnchor="middle">
          {modoPincel ? '¡a pintar!' : '¿pintamos?'}
        </text>
      </g>
    </svg>
  );
}
