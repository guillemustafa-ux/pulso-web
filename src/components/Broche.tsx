// Brochecito de ropa de color — engancha las muestras en proceso al hilo
export default function Broche({ color = '#F2B705' }: { color?: string }) {
  return (
    <svg className="broche" viewBox="0 0 20 40" fill="none" aria-hidden="true">
      <rect x="6" y="2" width="8" height="34" rx="3.5" fill={color} />
      <line x1="10" y1="20" x2="10" y2="34" stroke="rgba(34,26,18,0.4)" strokeWidth="1.6" />
      <circle cx="10" cy="15" r="2.6" fill="none" stroke="rgba(34,26,18,0.45)" strokeWidth="1.6" />
    </svg>
  );
}
