export type TipoEntrada = 'hito' | 'proceso' | 'resultado';

export type Entrada = {
  fecha: string; // aaaa-mm-dd
  tipo: TipoEntrada;
  titulo: string;
  proyecto: string;
  imagen?: string; // solo tipo resultado
  anotacion?: string; // solo tipo proceso (Caveat)
  terminal?: string; // solo tipo proceso
  cuerpo: string[]; // párrafos
};

const modulos = import.meta.glob('../content/bitacora/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const TIPOS: TipoEntrada[] = ['hito', 'proceso', 'resultado'];

function parsear(ruta: string, crudo: string): Entrada {
  const m = crudo.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error(`Entrada de bitácora sin frontmatter: ${ruta}`);
  const [, fm, resto] = m;

  const datos: Record<string, string> = {};
  let claveMultilinea: string | null = null;
  for (const linea of fm.split(/\r?\n/)) {
    if (claveMultilinea !== null) {
      if (/^\s/.test(linea)) {
        datos[claveMultilinea] +=
          (datos[claveMultilinea] ? '\n' : '') + linea.replace(/^ {2}/, '');
        continue;
      }
      claveMultilinea = null;
    }
    const par = linea.match(/^([\w-]+):\s?(.*)$/);
    if (!par) continue;
    const [, clave, valor] = par;
    if (valor.trim() === '|') {
      claveMultilinea = clave;
      datos[clave] = '';
    } else {
      datos[clave] = valor.trim();
    }
  }

  const { fecha, tipo, titulo, proyecto } = datos;
  if (!fecha || !titulo || !proyecto || !TIPOS.includes(tipo as TipoEntrada)) {
    throw new Error(`Frontmatter incompleto o tipo inválido en ${ruta}`);
  }

  const cuerpo = resto
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return {
    fecha,
    tipo: tipo as TipoEntrada,
    titulo,
    proyecto,
    imagen: datos.imagen,
    anotacion: datos.anotacion,
    terminal: datos.terminal,
    cuerpo,
  };
}

export const entradas: Entrada[] = Object.entries(modulos)
  .map(([ruta, crudo]) => parsear(ruta, crudo))
  .sort((a, b) => b.fecha.localeCompare(a.fecha));
