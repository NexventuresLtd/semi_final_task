export function FlagUS({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 16" className={className} rx="2">
      <rect width="24" height="16" rx="2" fill="#B22234" />
      {[...Array(6)].map((_, i) => (
        <rect key={i} y={i * 16 / 13 * 2} width="24" height={16 / 13} fill="white" />
      ))}
      <rect width="10" height="8.6" fill="#3C3B6E" />
    </svg>
  );
}

export function FlagFR({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 16" className={className}>
      <rect width="24" height="16" rx="2" fill="#ED2939" />
      <rect width="16" height="16" fill="white" />
      <rect width="8" height="16" fill="#002395" />
      <clipPath id="fr-clip"><rect width="24" height="16" rx="2" /></clipPath>
    </svg>
  );
}

export function FlagRW({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 16" className={className}>
      <rect width="24" height="16" rx="2" fill="#20603D" />
      <rect width="24" height="10.7" fill="#00A1DE" />
      <rect width="24" height="5.3" y="5.3" fill="#FAD201" />
      <circle cx="18" cy="4.5" r="2.3" fill="#E5BE01" />
      {[...Array(24)].map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        const x1 = 18 + Math.cos(angle) * 2.3;
        const y1 = 4.5 + Math.sin(angle) * 2.3;
        const x2 = 18 + Math.cos(angle) * 3.4;
        const y2 = 4.5 + Math.sin(angle) * 3.4;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#E5BE01" strokeWidth="0.4" />;
      })}
    </svg>
  );
}