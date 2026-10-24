import React from 'react';

export const C = {
  rules: '#1E88E5',
  risk: '#FB8C00',
  case: '#E53935',
  checks: '#43A047',
  ink: '#1B2A41',
  cream: '#FFF8E7',
  water: '#4FC3F7',
};

export const Face: React.FC<{x: number; y: number; s?: number; mood?: 'happy' | 'worried' | 'shock'; hair?: string}> = ({x, y, s = 1, mood = 'happy', hair = '#3E2723'}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx="0" cy="150" rx="70" ry="90" fill="#5C9E5C" />
    <circle cx="0" cy="0" r="100" fill="url(#skin)" />
    <path d="M-104,-20 C-110,-120 -20,-150 20,-130 C80,-150 120,-80 104,-20 C80,-70 40,-80 0,-70 C-40,-80 -80,-60 -104,-20Z" fill={hair} />
    <ellipse cx="-38" cy="8" rx="19" ry="26" fill="#fff" />
    <ellipse cx="38" cy="8" rx="19" ry="26" fill="#fff" />
    <circle cx="-36" cy={mood === 'worried' ? 16 : 10} r="13" fill="#5D3A1A" />
    <circle cx="40" cy={mood === 'worried' ? 16 : 10} r="13" fill="#5D3A1A" />
    <circle cx="-31" cy="4" r="4.5" fill="#fff" />
    <circle cx="45" cy="4" r="4.5" fill="#fff" />
    <path d={mood === 'happy' ? 'M-58,-30 Q-38,-44 -18,-32' : 'M-58,-24 Q-38,-26 -18,-42'} stroke={hair} strokeWidth="9" fill="none" strokeLinecap="round" />
    <path d={mood === 'happy' ? 'M18,-32 Q38,-44 58,-30' : 'M18,-42 Q38,-26 58,-24'} stroke={hair} strokeWidth="9" fill="none" strokeLinecap="round" />
    {mood === 'happy' && <path d="M-34,50 Q0,84 34,50" stroke="#8A3B2A" strokeWidth="8" fill="#fff" strokeLinecap="round" />}
    {mood === 'worried' && <path d="M-26,66 Q0,46 26,66" stroke="#8A3B2A" strokeWidth="8" fill="none" strokeLinecap="round" />}
    {mood === 'shock' && <ellipse cx="0" cy="62" rx="16" ry="22" fill="#7A2E22" />}
    <circle cx="-62" cy="40" r="16" fill="#FF8A80" opacity=".45" />
    <circle cx="62" cy="40" r="16" fill="#FF8A80" opacity=".45" />
  </g>
);

export const Defs: React.FC = () => (
  <defs>
    <radialGradient id="skin" cx="40%" cy="35%"><stop offset="0" stopColor="#FFD7B0" /><stop offset="1" stopColor="#E8A877" /></radialGradient>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7FCBFF" /><stop offset="1" stopColor="#E3F6FF" /></linearGradient>
    <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5BC8F5" /><stop offset="1" stopColor="#1E88C8" /></linearGradient>
    <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8BD450" /><stop offset="1" stopColor="#4C9A2A" /></linearGradient>
  </defs>
);

export const Tree: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x="-12" y="0" width="24" height="90" rx="8" fill="#7B4A25" />
    <circle cx="0" cy="-20" r="62" fill="#3F9B33" />
    <circle cx="-38" cy="14" r="42" fill="#4CAF3C" />
    <circle cx="40" cy="12" r="44" fill="#56BD45" />
    <circle cx="-14" cy="-46" r="26" fill="#7BD861" opacity=".7" />
  </g>
);

export const Tower: React.FC<{x: number; y: number; w?: number; h?: number; color?: string}> = ({x, y, w = 150, h = 300, color = '#F2A65A'}) => (
  <g transform={`translate(${x},${y})`}>
    <rect x="0" y={-h} width={w} height={h} rx="12" fill={color} />
    <rect x={w * 0.08} y={-h} width={w * 0.12} height={h} fill="#fff" opacity=".18" />
    {Array.from({length: Math.floor(h / 60)}).map((_, r) =>
      [0, 1, 2].map((c) => <rect key={`${r}-${c}`} x={w * 0.14 + c * (w * 0.28)} y={-h + 24 + r * 60} width={w * 0.18} height={34} rx="6" fill="#FFF3C4" />)
    )}
  </g>
);

export const Cloud: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`} fill="#fff" opacity=".95">
    <ellipse cx="0" cy="0" rx="80" ry="34" /><ellipse cx="-40" cy="-18" rx="44" ry="34" /><ellipse cx="30" cy="-26" rx="52" ry="40" />
  </g>
);

export const Waves: React.FC<{y: number; w: number; t: number; color?: string; amp?: number}> = ({y, w, t, color = '#fff', amp = 8}) => (
  <g opacity=".5">
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M0,${y + i * 36} ` + Array.from({length: 9}).map((_, k) => `q${w / 18},${(k % 2 ? 1 : -1) * amp} ${w / 9},0`).join(' ')} stroke={color} strokeWidth="5" fill="none" transform={`translate(${Math.sin(t / 25 + i) * 18},0)`} />
    ))}
  </g>
);
