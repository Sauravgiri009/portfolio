import React from 'react';
import {loadFont} from '@remotion/google-fonts/Poppins';

// mid-century flat palette (teal/navy + burnt orange + peach, grain)
export const P = {
  navy: '#102A33',
  deep: '#173B45',
  teal: '#22545C',
  sea: '#2F6F73',
  mist: '#6FA3A0',
  orange: '#E5603A',
  rust: '#B8402A',
  peach: '#F4C49A',
  cream: '#F7E4C6',
  sun: '#FCEBC0',
  mustard: '#D9A441',
};

export const C = {
  rules: '#2F8C8C',
  risk: P.orange,
  case: '#B8322A',
  checks: P.mustard,
};

const {fontFamily} = loadFont('normal', {weights: ['500', '700', '800'], subsets: ['latin', 'devanagari']});
export const SERIF = fontFamily;
export const SANS = fontFamily;

export const Defs: React.FC = () => (
  <defs>
    <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#F2A77A" /><stop offset=".55" stopColor={P.peach} /><stop offset="1" stopColor={P.cream} />
    </linearGradient>
    <linearGradient id="night" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={P.navy} /><stop offset="1" stopColor={P.teal} />
    </linearGradient>
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={P.sea} /><stop offset="1" stopColor={P.deep} />
    </linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={P.orange} stopOpacity=".9" /><stop offset="1" stopColor={P.orange} stopOpacity="0" />
    </linearGradient>
  </defs>
);

// film grain, shifted each frame so it never sits still
export const Grain: React.FC<{f: number}> = ({f}) => (
  <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.22, pointerEvents: 'none'}}>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed={f % 7} /><feColorMatrix values="0 0 0 0 .1  0 0 0 0 .1  0 0 0 0 .1  0 0 0 .9 0" /></filter>
    <rect width="1080" height="1920" filter="url(#grain)" />
  </svg>
);

export const Vignette: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(16,42,51,.55) 100%)', pointerEvents: 'none'}} />
);

// angular flat figure, standing; shirt colour carries the accent
export const Person: React.FC<{x: number; y: number; s?: number; shirt?: string; flip?: boolean; pose?: 'stand' | 'point' | 'hands'}> = ({x, y, s = 1, shirt = P.orange, flip, pose = 'stand'}) => (
  <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
    <polygon points="-14,0 160,-6 150,10 -10,10" fill={P.navy} opacity=".35" />
    <polygon points="-16,-150 -2,-150 2,0 -14,0" fill={P.navy} />
    <polygon points="4,-150 18,-150 16,0 4,0" fill={P.deep} />
    <polygon points="-24,-270 26,-270 22,-145 -20,-145" fill={shirt} />
    <polygon points="-24,-270 0,-270 -6,-145 -20,-145" fill="#000" opacity=".15" />
    {pose === 'point' ? <polygon points="22,-262 96,-300 100,-288 26,-244" fill={shirt} /> : <polygon points="22,-262 34,-262 30,-175 20,-175" fill={shirt} />}
    {pose === 'hands' ? <polygon points="-22,-262 -60,-320 -48,-326 -12,-262" fill={shirt} /> : <polygon points="-22,-262 -34,-262 -30,-175 -20,-175" fill={shirt} />}
    <rect x="-6" y="-292" width="12" height="24" fill="#E8A877" />
    <ellipse cx="0" cy="-318" rx="24" ry="28" fill="#F0B88A" />
    <path d="M-26,-320 C-28,-352 24,-360 28,-326 L20,-330 C10,-338 -10,-340 -18,-326Z" fill={P.navy} />
    <circle cx="10" cy="-318" r="3" fill={P.navy} />
  </g>
);

export const Tower: React.FC<{x: number; y: number; w: number; h: number; c: string; lit?: number}> = ({x, y, w, h, c, lit = 0}) => {
  const rows = Math.floor((h - 30) / 46);
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="0" y={-h} width={w} height={h} fill={c} />
      <rect x={w * 0.62} y={-h} width={w * 0.38} height={h} fill="#000" opacity=".18" />
      {Array.from({length: rows}).map((_, r) =>
        [0, 1, 2].map((k) => {
          const on = lit > 0 && (r * 3 + k * 7) % 5 < lit * 5;
          return <rect key={`${r}${k}`} x={w * 0.12 + k * w * 0.27} y={-h + 22 + r * 46} width={w * 0.16} height={24} fill={on ? P.sun : '#000'} opacity={on ? 0.95 : 0.12} />;
        })
      )}
    </g>
  );
};

export const Palm: React.FC<{x: number; y: number; s?: number; c?: string}> = ({x, y, s = 1, c = P.deep}) => (
  <g transform={`translate(${x},${y}) scale(${s})`} fill={c}>
    <polygon points="-6,0 6,0 2,-160 -2,-160" />
    <polygon points="0,-160 -90,-140 -10,-150" /><polygon points="0,-160 90,-140 10,-150" />
    <polygon points="0,-160 -60,-200 -6,-164" /><polygon points="0,-160 60,-200 6,-164" />
  </g>
);

export const Pine: React.FC<{x: number; y: number; s?: number; c?: string}> = ({x, y, s = 1, c = P.teal}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <polygon points="0,-180 60,0 -60,0" fill={c} />
    <polygon points="0,-180 60,0 0,0" fill="#000" opacity=".18" />
  </g>
);

// horizontal reflection stripes on water
export const Ripples: React.FC<{x: number; y: number; w: number; f: number; c?: string; n?: number}> = ({x, y, w, f, c = P.sun, n = 6}) => (
  <g>
    {Array.from({length: n}).map((_, i) => {
      const len = w * (0.7 - i * 0.09);
      return <rect key={i} x={x - len / 2 + Math.sin(f / 18 + i) * 10} y={y + i * 22} width={len} height={6} rx={3} fill={c} opacity={0.8 - i * 0.1} />;
    })}
  </g>
);
