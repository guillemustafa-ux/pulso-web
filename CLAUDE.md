# pulso-web — página oficial de la marca PULSO

Landing single-page del canal build-in-public de Guille. Construida el 16/07/2026 a partir del
"prompt madre" de `C:\Users\Cript\pulso-marca\` (BRIEF-MARCA.md, IDENTIDAD.md, VOZ.md — leer
antes de tocar identidad o copy). Voz rioplatense, primera persona, cero hype.

## Stack

Vite + React 19 + TypeScript + CSS plano (sin Tailwind, decisión deliberada: el CSS de identidad
se portó literal). Deploy previsto: Vercel. Comandos: `npm run dev`, `npm run build`, `npm run preview`.

## Sistema visual (v2 — dirección de arte de Guille del 16/07)

Base identidad del canal: papel `#F3ECDD`, tinta `#221A12`, noche `#211911`, ember `#FF5B35`
(firma, nunca cambia), mostaza `#F2B705`, turquesa `#1ECBC0` SOLO en el filete del badge
"nació en pulso" de Exchange. Tipos: Bricolage Grotesque (títulos), IBM Plex Sans/Mono, Caveat
(anotaciones/tagline). Animación del latido del hero dibujándose (0.8s); desde v2.1 se suma
movimiento de interacción (ver abajo).

Extensiones v2 pedidas por Guille (concepto "la gran tela"):

- **Fondo = gran tela**: `.grain` ahora es trama tejida (repeating-linear-gradients) + grano.
- **Tipografía escrita**: descripciones (hero-bio, manifiesto salvo 1er párrafo, descripciones de
  proyectos, cuerpo de bitácora, footer) en **Shantell Sans** 400.
- **Nuevo token** `--verde: #8bc061` (verde claro alegre, junto a ember y mostaza = colores de
  "lo que se está haciendo").
- **Sección proyectos = muestras colgadas de un hilo de sisal** (`.hilo-sisal`, SVG ondulado
  `#A98E5F`): tarjetas con rotación alternada.
  - Trabajo **en proceso** = retazo de tela de color (`.proyecto-card.retazo` + `retazo-mostaza`
    / `retazo-verde`: fondo color, trama textil, borde dashed = costura, tag `.tag-costura`),
    colgado con **brochecito de color** (`Broche.tsx`).
  - Trabajo **terminado** = "prisma más detallado" (`.proyecto-card.terminado`: marco firme,
    chips de detalle, dot verde "live"), prendido con **alfiler** (`Alfiler.tsx`).

Extensiones v2.1 (feedback de Guille del 16/07, tras su revisión visual):

- **Paleta repartida en las tarjetas**: nuevo token `--ocre: #e09a4a`; aa smart wallet =
  terminado con `tinte: 'ocre'` (`.terminado.tinte-ocre`), exchange queda neutra (el "alguno
  neutro como el fondo"), ulises mostaza, Sol verde. Orden del array: exchange → sol → aa →
  ulises, para que el verde caiga cerca del medio.
- **Hero centrado**: `.hero-zona` (min-height ~66vh, flex centrado) — el wordmark vive cerca
  del medio de la pantalla, no pegado arriba.
- **Movimiento al scroll**: `.reveal`/`.visible` (IntersectionObserver en App.tsx, toggle en
  ambas direcciones = aparece y desaparece). Usa `translate`, NO `transform`, para no pisar la
  rotación de las colgadas.
- **Balanceo al hover**: las tarjetas colgadas se hamacan (`@keyframes balanceo`, rotación
  base en `--rot`, pivote arriba donde agarra el hilo).
- **Cursor aguja + puntadas**: el mouse es una aguja (SVG data-uri en base.css, links
  conservan la manito) y deja puntadas de hilo ember que se desvanecen (`AgujaCursor.tsx`,
  canvas fixed). Solo `pointer: fine`; todo el movimiento respeta `prefers-reduced-motion`.
- La regla "única animación: el latido" quedó superada por pedido de Guille — el movimiento
  es parte del concepto (coser/hamacar la tela), no decoración.

OJO: estas extensiones (Shantell, verde, ocre, retazos/hilo/broche/alfiler, trama de tela,
movimiento v2.1, cursor aguja) todavía NO están registradas en `pulso-marca/IDENTIDAD.md` —
si se consolidan, actualizar allá también.

## Estructura

- `src/content/proyectos.ts` — array tipado de proyectos (flags: `nacioEnPulso`, `esPulsoDeX`,
  `retazo`, `detalles`).
- `src/content/bitacora/*.md` — entradas con frontmatter (`fecha`, `tipo: hito|proceso|resultado`,
  `titulo`, `proyecto`, opc. `imagen`/`anotacion`/`terminal`). **Agregar entrada = tirar un .md acá.**
  Parser propio sin deps en `src/lib/bitacora.ts` (rompe el build si el frontmatter está mal).
- `src/components/` — Latido (único dueño del path SVG del latido), Wordmark, Alfiler, Broche,
  Hero, Manifiesto, Proyectos, ProyectoCard, Bitacora, TarjetaEntrada, Footer.
- `src/styles/` — tokens.css (paleta), base.css (tela, tipografía, layout), components.css.
- `capturas/` — screenshots de verificación (v1 y v2, desktop y mobile).

## Reglas duras (heredadas de pulso-marca/CLAUDE.md)

- Manifiesto literal de VOZ.md §1 — no se reescribe.
- Faceta artística de Guille AFUERA; portfolio formal inglés sin cruces (no linkear).
- Nunca inventar hitos: la bitácora publica solo evidencia real.
- "Pulso de Sol" (Grisbill): jamás datos de la clienta ni link.

## Verificación

`npm run build` limpio → `npm run preview` → revisar consola sin errores y screenshots
desktop (1280) + mobile (390). Chequear siempre: latido clavado sobre "ul", turquesa solo bajo
"nació en pulso", anclas #manifiesto/#latiendo/#bitacora.

## Pendientes

1. OK visual final de Guille → crear repo GitHub + importar en Vercel.
2. Al tener URL definitiva: agregar `og:url` en index.html y redeploy.
3. Si la dirección de arte v2/v2.1 queda firme: registrarla en pulso-marca/IDENTIDAD.md.
4. Decisión de Guille pendiente: ¿renombrar la tarjeta "aa smart wallet" a algo menos críptico?

Dictamen del guardian-de-marca (17/07): copy APTO para deploy con correcciones YA aplicadas
en `proyectos.ts` (Exchange: evidencia en vez de promesa de Play; ulises deco: sin deficit
framing). "PULSO · de Sol" apto tal cual; manifiesto, hero, footer y bitácora aptos.
