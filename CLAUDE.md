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

## v2.2 — el atril, el muro y el latido vivo (17/07/2026)

- **Atril** (`Atril.tsx`, fijo arriba a la derecha): abre el lienzo y presta el pincel.
  Ajustes compartidos en `src/lib/pincel.tsx` (paleta sin turquesa, grosores, tramas
  sólido/seco/tela).
- **Lienzo** (`LienzoModal.tsx`): el visitante dibuja/escribe y "cuelga en el muro".
  Cupo 3 huellas/día por navegador (localStorage).
- **Muro** (`Muro.tsx` + `api/huellas.ts` + `api/borrar.ts`, Vercel Blob store
  `pulso-huellas`): huellas EN VIVO, muestra las últimas 12, todas quedan archivadas por
  fecha para el compilado semanal/mensual (flujo: cronista → guardián → Guille).
  Salvaguardas del guardián (17/07): disclaimer publicado junto al muro, espacio rotulado
  de visitantes, borrado inmediato de lo que no va (datos de clientes, hype financiero,
  cruces de facetas, odio/spam), revisión 2 veces por día — si no hay guardia, se pausa el
  muro; una huella suelta nunca se repostea fuera del compilado.
  **Admin**: entrar a la web con `?llave=<token>` muestra la ✕ de borrado en cada huella.
  El token vive en `.llave-muro.txt` (gitignoreado) y en la env `MURO_ADMIN_TOKEN` de Vercel.
- **Modo pincel** (`PincelCapa.tsx`): pinta la página; la tela tiene memoria caprichosa —
  la mayoría de los gestos se desvanecen en ~40s, ~3 de 10 quedan marcados para siempre
  (localStorage del visitante, clave `pulso-tela-marcas`).
- **Latido vivo** (`Latido.tsx` con `animado`): nunca se queda quieto; su TEMPO sigue la
  actividad del visitante (2.4s en reposo → 0.55s a full). La aguja descansa mientras el
  pincel está activo.

## v2.3 — el maestro del taller (17/07/2026)

- **Guía acompañante** (`Guia.tsx`, fijo abajo del Atril): latido tenue que aparece al
  scrollear, sugiere según la sección visible (IntersectionObserver) y abre el chat.
- **Agente IA** (`api/guia.ts`): persona de "viejo maestro pintor de época" que acompaña la
  aventura (visitante + creaciones programáticas de Guille). Motor: **Google Gemini nivel
  gratuito** (`gemini-2.0-flash`, env `GEMINI_API_KEY` — pendiente de que Guille la cree en
  aistudio.google.com y la cargue en Vercel; hasta entonces responde 503 amigable).
  Prompt dictaminado apto por el guardián con 5 ajustes aplicados: "tracker educativo, sin
  plata real", modo afirmativo, nunca pedir datos sensibles, nunca firmar la obra como
  propia (es de Guille + agentes), y transparencia total si le preguntan si es IA.
  Cupo 10 preguntas/día por navegador. OJO: las fichas de proyectos están INLINE en
  api/guia.ts (la función no puede importar de src/) — mantener en sync con proyectos.ts.

## Deploy (17/07/2026)

- Repo público: `https://github.com/guillemustafa-ux/pulso-web` (build in public).
- Producción en Vercel (proyecto `pulso-web`, deploy vía CLI — un push NO redeploya solo,
  correr `vercel --prod` tras cada cambio): **https://pulso-envozalta.vercel.app** (og:url ya
  apunta ahí).
- Footer con CTA "dejá tu mail" (`MailCTA.tsx`, FormSubmit) + copy propio en "vos" singular,
  ambos dictaminados aptos por el guardián el 17/07.

## Pendientes

1. Guille: pegar la URL en la bio de IG (@pulso.envozalta) — reemplaza el link a Exchange.
2. FormSubmit: al llegar el primer mail, activar la cuenta y reemplazar el mail plano del
   endpoint en `MailCTA.tsx` por el alias random que dan (no dejar el Gmail expuesto).
3. Manifiesto v2 en afirmativo/hospitalidad: versiones A y B de voz-de-marca entregadas,
   falta elección de Guille → dictamen del guardián → actualizar VOZ.md §1 + Manifiesto.tsx
   (+ opcional editar caption del post #1 en IG).
4. Si la dirección de arte v2/v2.1 queda firme: registrarla en pulso-marca/IDENTIDAD.md.
5. Decisión de Guille pendiente: ¿renombrar la tarjeta "aa smart wallet" a algo menos críptico?

Dictamen del guardian-de-marca (17/07): copy APTO para deploy con correcciones YA aplicadas
en `proyectos.ts` (Exchange: evidencia en vez de promesa de Play; ulises deco: sin deficit
framing). "PULSO · de Sol" apto tal cual; manifiesto, hero, footer y bitácora aptos.
