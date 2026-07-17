// Alfiler que prende cada muestra a la gran tela
export default function Alfiler({ color = '#FF5B35' }: { color?: string }) {
  return (
    <svg className="alfiler" viewBox="0 0 24 34" fill="none" aria-hidden="true">
      <line x1="12" y1="10" x2="12" y2="32" stroke="#8a8378" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="8" r="6.5" fill={color} />
      <circle cx="10" cy="6" r="2" fill="rgba(255,255,255,0.45)" />
    </svg>
  );
}
