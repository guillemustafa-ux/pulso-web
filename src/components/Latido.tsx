type Props = {
  className?: string;
  animado?: boolean;
  strokeWidth?: number;
};

// Único lugar donde vive el path del latido (IDENTIDAD.md §4)
export default function Latido({ className, animado = false, strokeWidth = 6 }: Props) {
  const clases = [animado ? 'latido-animado' : '', className ?? ''].filter(Boolean).join(' ');
  return (
    <svg className={clases || undefined} viewBox="0 0 150 50" fill="none" aria-hidden="true">
      <path
        d="M0 28 L38 28 L48 10 L62 44 L76 18 L86 28 L150 28"
        stroke="#FF5B35"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={100}
      />
    </svg>
  );
}
