import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {fontFamily, serifFamily} from '../fonts';

// Hook: "Bada ghar, better views ya jaldi possession? ..." (VO 9.66 s).
// Style mixes the two references: cream canvas with a faint dashed grid and
// soft organic shapes, word-by-word type with an italic serif accent, photo
// cards with location chips, editor-style selection box + cursor clicks,
// wallet with coins, swinging hanging tags, and an illustrated location.
// All timings are in seconds and come from vo_words.txt.

export const HOOK_FPS = 60;
export const HOOK_SECONDS = 9.67;

const C = {
  bg1: '#FFFDF7',
  bg2: '#FFF3D9',
  gold: '#FFD47B',
  goldMid: '#F2B94A',
  goldDeep: '#9C6B00',
  peach: '#FFE6C7',
  ink: '#1E1A12',
  muted: '#6B6250',
  line: '#EBD9B0',
  white: '#FFFFFF',
};

// 99Shorts safe zone: x 116-963, y 410-1544.
const SAFE = {x: 116, y: 410, w: 847, h: 1134};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const useSec = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};

const useSpringAt = (at: number, damping = 14, stiffness = 140) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - Math.round(at * fps), fps, config: {damping, stiffness, mass: 0.7}});
};

const ramp = (t: number, a: number, b: number, easing = Easing.out(Easing.cubic)) =>
  interpolate(t, [a, b], [0, 1], {...clamp, easing});

// ---------- Icons ----------

const PinIcon: React.FC<{size: number; color?: string}> = ({size, color = C.goldDeep}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z" fill={color} />
    <circle cx="12" cy="9" r="2.8" fill={C.white} />
  </svg>
);

const CheckIcon: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill={C.goldDeep} />
    <path d="M7 12.5l3.2 3.2L17 9" stroke={C.white} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const KeyIcon: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 48 24">
    <circle cx="10" cy="12" r="8" fill="none" stroke={C.goldDeep} strokeWidth="4" />
    <path d="M18 12h26M36 12v7M42 12v5" stroke={C.goldDeep} strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const Sparkle: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <path d="M20 0C21.5 13 27 18.5 40 20 27 21.5 21.5 27 20 40 18.5 27 13 21.5 0 20 13 18.5 18.5 13 20 0z" fill={color} />
  </svg>
);

const Cursor: React.FC<{size?: number}> = ({size = 46}) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 22 31" style={{filter: 'drop-shadow(0 4px 6px rgba(80,60,10,0.35))'}}>
    <path d="M1 1 L1 25 L7 19.5 L11.5 29.5 L15.5 27.8 L11 18 L19 18 Z" fill={C.white} stroke={C.ink} strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

// ---------- Background ----------

const Flower: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="-100 -100 200 200">
    {[0, 60, 120, 180, 240, 300].map((a) => (
      <ellipse key={a} cx="0" cy="-52" rx="34" ry="52" fill={color} transform={`rotate(${a})`} />
    ))}
    <circle r="40" fill={color} />
  </svg>
);

const Background: React.FC = () => {
  const t = useSec();
  const twinkle = (o: number) => 0.75 + 0.25 * Math.sin(t * 3 + o);
  return (
    <AbsoluteFill style={{background: `linear-gradient(170deg, ${C.bg1} 0%, ${C.bg1} 50%, ${C.bg2} 100%)`, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, ${C.line}88 0 2px, transparent 2px 90px), repeating-linear-gradient(90deg, ${C.line}88 0 2px, transparent 2px 90px)`,
          backgroundPosition: `${t * 6}px ${t * 10}px`,
          opacity: 0.5,
          maskImage: 'linear-gradient(180deg, black 0%, transparent 35%, transparent 70%, black 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, black 0%, transparent 35%, transparent 70%, black 100%)',
        }}
      />
      <div style={{position: 'absolute', right: -170, top: -120, transform: `rotate(${t * 8}deg)`, opacity: 0.55}}>
        <Flower size={520} color={C.gold} />
      </div>
      <div style={{position: 'absolute', left: -200, bottom: -160, transform: `rotate(${-t * 6}deg)`, opacity: 0.8}}>
        <Flower size={560} color={C.peach} />
      </div>
      <div style={{position: 'absolute', left: -120, top: 1500, transform: `rotate(${t * 5}deg)`, opacity: 0.35}}>
        <Flower size={260} color={C.gold} />
      </div>
      {/* thin diagonal lines, top-left */}
      <svg width={1080} height={400} style={{position: 'absolute', left: 0, top: 120}}>
        <line x1={-40} y1={260 + t * 4} x2={520} y2={20 + t * 4} stroke={C.goldMid} strokeWidth={2} opacity={0.5} />
        <line x1={-40} y1={320 + t * 4} x2={420} y2={120 + t * 4} stroke={C.goldMid} strokeWidth={2} opacity={0.35} />
      </svg>
      <div style={{position: 'absolute', left: 70, top: 300, transform: `scale(${twinkle(0)})`}}>
        <Sparkle size={44} color={C.goldMid} />
      </div>
      <div style={{position: 'absolute', right: 70, top: 1600, transform: `scale(${twinkle(2)})`}}>
        <Sparkle size={56} color={C.goldMid} />
      </div>
      <div style={{position: 'absolute', right: 150, top: 330, transform: `scale(${twinkle(4)})`}}>
        <Sparkle size={26} color={C.goldDeep} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- Type ----------

type Kind = 'sans' | 'serif' | 'hl';
type W = {w: string; at: number; kind?: Kind; select?: number; render?: (t: number) => string};

const SelectBox: React.FC<{at: number}> = ({at}) => {
  const t = useSec();
  const o = ramp(t, at, at + 0.12);
  const handle: React.CSSProperties = {position: 'absolute', width: 14, height: 14, background: C.white, border: `2px solid ${C.ink}`};
  const move = ramp(t, at - 0.05, at + 0.32, Easing.inOut(Easing.cubic));
  const click = interpolate(t, [at + 0.32, at + 0.4, at + 0.5], [1, 0.82, 1], clamp);
  return (
    <>
      <div style={{position: 'absolute', inset: -12, border: `2px dashed ${C.ink}`, opacity: o}}>
        <div style={{...handle, left: -8, top: -8}} />
        <div style={{...handle, right: -8, top: -8}} />
        <div style={{...handle, left: -8, bottom: -8}} />
        <div style={{...handle, right: -8, bottom: -8}} />
      </div>
      <div
        style={{
          position: 'absolute',
          right: -38,
          bottom: -58,
          opacity: ramp(t, at - 0.05, at + 0.08),
          transform: `translate(${(1 - move) * 150}px, ${(1 - move) * 120}px) scale(${click})`,
          transformOrigin: 'top left',
        }}
      >
        <Cursor />
      </div>
    </>
  );
};

const Word: React.FC<{word: W}> = ({word}) => {
  const t = useSec();
  const p = ramp(t, word.at, word.at + 0.22);
  const kind = word.kind ?? 'sans';
  const box = kind === 'hl' ? ramp(t, word.at + 0.05, word.at + 0.3, Easing.inOut(Easing.cubic)) : 0;
  const text = word.render ? word.render(t) : word.w;
  const base: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    opacity: p,
    transform: `translateY(${(1 - p) * 26}px)`,
    filter: `blur(${(1 - p) * 8}px)`,
    whiteSpace: 'nowrap',
  };
  if (kind === 'serif') {
    return (
      <span style={{...base, fontFamily: serifFamily, fontStyle: 'italic', fontWeight: 700, fontSize: 80, color: C.goldDeep, letterSpacing: -0.5}}>
        {text}
      </span>
    );
  }
  return (
    <span style={{...base, fontWeight: 800, fontSize: 74, color: C.ink, letterSpacing: -1.6, padding: kind === 'hl' ? '0 16px' : 0}}>
      {kind === 'hl' && (
        <span
          style={{
            position: 'absolute',
            inset: '6px 0 2px 0',
            background: C.gold,
            borderRadius: 14,
            transform: `scaleX(${box})`,
            transformOrigin: 'left center',
            boxShadow: '0 10px 22px -14px rgba(156,107,0,0.8)',
          }}
        />
      )}
      <span style={{position: 'relative'}}>{text}</span>
      {word.select !== undefined && <SelectBox at={word.select} />}
    </span>
  );
};

// One headline (1-2 lines) visible between `from` and `to`.
const Headline: React.FC<{lines: W[][]; from: number; to: number}> = ({lines, from, to}) => {
  const t = useSec();
  if (t < from - 0.05 || t > to + 0.2) return null;
  const out = ramp(t, to - 0.02, to + 0.14, Easing.in(Easing.cubic));
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.x,
        top: SAFE.y + 18,
        width: SAFE.w,
        textAlign: 'center',
        opacity: 1 - out,
        transform: `translateY(${-out * 30}px)`,
      }}
    >
      {lines.map((ln, i) => (
        <div key={i} style={{display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 18, lineHeight: 1.18, marginTop: i ? 6 : 0}}>
          {ln.map((w, j) => (
            <Word key={j} word={w} />
          ))}
        </div>
      ))}
    </div>
  );
};

// ---------- Cards, chips, tags ----------

const Chip: React.FC<{text: string; icon?: 'pin' | 'check'; size?: number; style?: React.CSSProperties}> = ({text, icon = 'pin', size = 24, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: C.white,
      borderRadius: 40,
      padding: `${size * 0.35}px ${size * 0.7}px ${size * 0.35}px ${size * 0.5}px`,
      fontSize: size,
      fontWeight: 700,
      color: C.ink,
      whiteSpace: 'nowrap',
      boxShadow: '0 8px 20px -12px rgba(80,60,10,0.5)',
      ...style,
    }}
  >
    {icon === 'pin' ? <PinIcon size={size * 1.15} /> : <CheckIcon size={size * 1.1} />}
    {text}
  </div>
);

type CardProps = {
  src: string;
  x: number; // centre, canvas px
  y: number;
  w: number;
  h: number;
  rot: number;
  inAt: number;
  outAt?: number;
  from: [number, number];
  to?: [number, number];
  chip?: string;
  chipAt?: number;
  chipBottom?: boolean;
  chipSize?: number;
  focusY?: number; // keep <= 50 so the AI watermark in the bottom-right corner stays cropped out
  lift?: {at: number; dy: number};
};

const PhotoCard: React.FC<CardProps> = (p) => {
  const t = useSec();
  const enter = useSpringAt(p.inAt, 15, 120);
  const out = p.outAt !== undefined ? ramp(t, p.outAt, p.outAt + 0.3, Easing.in(Easing.cubic)) : 0;
  const chipIn = useSpringAt(p.chipAt ?? p.inAt + 0.2, 12, 160);
  const lift = p.lift ? ramp(t, p.lift.at, p.lift.at + 0.35, Easing.inOut(Easing.cubic)) * p.lift.dy : 0;
  if (t < p.inAt - 0.02 || (p.outAt !== undefined && t > p.outAt + 0.32)) return null;
  const life = p.outAt ?? HOOK_SECONDS;
  const kb = interpolate(t, [p.inAt, life], [1.14, 1.02], clamp);
  const to = p.to ?? [0, 0];
  const dx = p.from[0] * (1 - enter) + to[0] * out;
  const dy = p.from[1] * (1 - enter) + to[1] * out + lift;
  return (
    <div
      style={{
        position: 'absolute',
        left: p.x - p.w / 2,
        top: p.y - p.h / 2,
        width: p.w,
        height: p.h,
        transform: `translate(${dx}px, ${dy}px) rotate(${p.rot * (0.4 + 0.6 * enter) + out * p.rot}deg)`,
        opacity: Math.min(1, enter * 1.6) * (1 - out),
        borderRadius: 30,
        border: `10px solid ${C.white}`,
        boxShadow: '0 30px 60px -28px rgba(110,80,10,0.55)',
        background: C.white,
      }}
    >
      <div style={{position: 'absolute', inset: 0, borderRadius: 21, overflow: 'hidden'}}>
        <Img
          src={staticFile(p.src)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: `50% ${p.focusY ?? 40}%`,
            transform: `scale(${kb})`,
            transformOrigin: `50% ${p.focusY ?? 40}%`,
          }}
        />
      </div>
      {p.chip && (
        <div
          style={{
            position: 'absolute',
            left: 16,
            ...(p.chipBottom ? {bottom: 16} : {top: 16}),
            transform: `scale(${chipIn})`,
            transformOrigin: 'left center',
          }}
        >
          <Chip text={p.chip} size={p.chipSize ?? 24} />
        </div>
      )}
    </div>
  );
};

// A tag hanging from a nail on a string, dropping in and swinging to rest.
const HangingTag: React.FC<{x: number; y: number; len: number; at: number; outAt?: number; children: React.ReactNode}> = ({
  x,
  y,
  len,
  at,
  outAt,
  children,
}) => {
  const t = useSec();
  const drop = useSpringAt(at, 11, 130);
  const out = outAt !== undefined ? ramp(t, outAt, outAt + 0.2) : 0;
  if (t < at - 0.02) return null;
  const dt = Math.max(0, t - at);
  const swing = 16 * Math.exp(-dt * 2.2) * Math.cos(dt * 8);
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: Math.min(1, drop * 2) * (1 - out), transform: `translateY(${(1 - drop) * -160}px)`}}>
      <div style={{position: 'absolute', left: -9, top: -9, width: 18, height: 18, borderRadius: 9, background: C.goldDeep}} />
      <div style={{position: 'absolute', left: 0, top: 0, transform: `rotate(${swing}deg)`, transformOrigin: '0 0'}}>
        <div style={{position: 'absolute', left: -1.5, top: 0, width: 3, height: len, background: C.goldDeep}} />
        <div style={{position: 'absolute', left: 0, top: len, transform: 'translateX(-50%)'}}>{children}</div>
      </div>
    </div>
  );
};

const Tag: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 36}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: C.gold,
      border: `4px solid ${C.white}`,
      borderRadius: 18,
      padding: '12px 22px',
      fontSize: size,
      fontWeight: 800,
      color: C.ink,
      whiteSpace: 'nowrap',
      boxShadow: '0 16px 30px -16px rgba(110,80,10,0.7)',
    }}
  >
    {children}
  </div>
);

// ---------- Scene pieces ----------

const BudgetChip: React.FC<{at: number; outAt: number}> = ({at, outAt}) => {
  const t = useSec();
  const p = useSpringAt(at, 12, 160);
  const out = ramp(t, outAt, outAt + 0.2);
  const click = interpolate(t, [at + 0.45, at + 0.52, at + 0.62], [1, 0.9, 1], clamp);
  const move = ramp(t, at + 0.05, at + 0.45, Easing.inOut(Easing.cubic));
  if (t < at - 0.02 || t > outAt + 0.22) return null;
  return (
    <div style={{position: 'absolute', left: 540, top: 1440, transform: `translate(-50%, -50%) scale(${p * click})`, opacity: 1 - out}}>
      <Chip text="Budget Friendly" icon="check" size={34} style={{border: `3px solid ${C.gold}`}} />
      <div style={{position: 'absolute', right: -30, bottom: -54, transform: `translate(${(1 - move) * 160}px, ${(1 - move) * 90}px)`}}>
        <Cursor />
      </div>
    </div>
  );
};

const Coin: React.FC<{x: number; at: number; landY: number}> = ({x, at, landY}) => {
  const t = useSec();
  if (t < at) return null;
  const fall = ramp(t, at, at + 0.38, Easing.in(Easing.quad));
  const gone = ramp(t, at + 0.36, at + 0.46);
  const y = interpolate(fall, [0, 1], [landY - 360, landY]);
  return (
    <div style={{position: 'absolute', left: x - 36, top: y - 36, width: 72, height: 72, opacity: 1 - gone, transform: `rotate(${fall * 200}deg)`}}>
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          background: `radial-gradient(circle at 35% 30%, #FFE7A8, ${C.goldMid})`,
          border: `4px solid #C98F12`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          fontWeight: 800,
          color: C.goldDeep,
        }}
      >
        ₹
      </div>
    </div>
  );
};

const Wallet: React.FC<{at: number; outAt: number}> = ({at, outAt}) => {
  const t = useSec();
  const p = useSpringAt(at, 13, 120);
  const out = ramp(t, outAt, outAt + 0.3, Easing.in(Easing.cubic));
  const fill = ramp(t, 5.6, 6.3);
  const bump = (k: number) => interpolate(t, [k, k + 0.06, k + 0.16], [0, 1, 0], clamp);
  const squash = 1 - 0.05 * (bump(5.98) + bump(6.13) + bump(6.28));
  if (t < at - 0.02 || t > outAt + 0.32) return null;
  const cx = 540;
  const cy = 1090;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(1, p * 1.5) * (1 - out), transform: `translateY(${out * 60}px)`}}>
      {/* dashed orbit */}
      <div
        style={{
          position: 'absolute',
          left: cx - 280,
          top: cy - 280,
          width: 560,
          height: 560,
          borderRadius: 280,
          border: `3px dashed ${C.goldMid}`,
          transform: `scale(${p}) rotate(${t * 20}deg)`,
          background: 'rgba(255,212,123,0.12)',
        }}
      />
      {[0, 1, 2, 3].map((i) => {
        const a = i * 1.57 + t * 0.6;
        return (
          <div key={i} style={{position: 'absolute', left: cx + Math.cos(a) * 300 - 14, top: cy + Math.sin(a) * 300 - 14, opacity: p}}>
            <Sparkle size={28} color={C.goldMid} />
          </div>
        );
      })}
      <Coin x={cx - 40} at={5.6} landY={cy - 60} />
      <Coin x={cx + 50} at={5.75} landY={cy - 60} />
      <Coin x={cx} at={5.9} landY={cy - 60} />
      {/* wallet body */}
      <div style={{position: 'absolute', left: cx - 210, top: cy - 120, width: 420, height: 270, transform: `scale(${p}) scaleY(${squash})`, transformOrigin: '50% 100%'}}>
        {/* bill peeking out */}
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: -60 - fill * 20,
            width: 300,
            height: 150,
            background: '#FFF6DE',
            border: `4px solid ${C.goldMid}`,
            borderRadius: 14,
            transform: 'rotate(-4deg)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: 14,
            fontSize: 48,
            fontWeight: 800,
            color: C.goldDeep,
          }}
        >
          ₹
        </div>
        <div style={{position: 'absolute', inset: 0, borderRadius: 40, background: `linear-gradient(160deg, ${C.gold} 0%, ${C.goldMid} 100%)`, boxShadow: '0 30px 50px -26px rgba(110,80,10,0.7)'}} />
        <div style={{position: 'absolute', left: 22, right: 22, top: 22, bottom: 22, borderRadius: 26, border: `3px dashed rgba(255,255,255,0.75)`}} />
        {/* clasp */}
        <div style={{position: 'absolute', right: -14, top: 92, width: 120, height: 86, borderRadius: 24, background: C.goldDeep, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 30, height: 30, borderRadius: 15, background: C.gold, border: `4px solid ${C.white}`}} />
        </div>
      </div>
    </div>
  );
};

const Tower: React.FC<{x: number; w: number; h: number; at: number; base: number; tint: string}> = ({x, w, h, at, base, tint}) => {
  const p = useSpringAt(at, 14, 110);
  const cols = Math.max(2, Math.floor((w - 30) / 34));
  const rows = Math.floor((h - 50) / 46);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: base - h,
        width: w,
        height: h,
        transform: `scaleY(${p})`,
        transformOrigin: '50% 100%',
        background: tint,
        border: `4px solid ${C.white}`,
        borderBottom: 'none',
        borderRadius: '14px 14px 0 0',
        boxShadow: '0 20px 40px -24px rgba(110,80,10,0.6)',
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridAutoRows: 30,
        gap: 16,
        padding: '26px 16px',
        overflow: 'hidden',
      }}
    >
      {Array.from({length: cols * rows}).map((_, i) => (
        <div key={i} style={{borderRadius: 4, background: i % 5 === 2 ? C.gold : 'rgba(255,255,255,0.85)'}} />
      ))}
    </div>
  );
};

const LocationScene: React.FC<{at: number}> = ({at}) => {
  const t = useSec();
  const ground = useSpringAt(at, 16, 90);
  const board = useSpringAt(8.32, 10, 150);
  const pin = useSpringAt(8.5, 9, 170);
  const ripple = (t - 8.62) % 0.9;
  if (t < at - 0.02) return null;
  const base = 1430;
  return (
    <>
      {/* hills behind */}
      <svg width={1080} height={420} style={{position: 'absolute', left: 0, top: base - 400, opacity: ground, transform: `translateY(${(1 - ground) * 80}px)`}}>
        <path d="M0 420 L0 250 C120 170 220 120 330 170 C430 215 500 110 620 90 C740 70 820 180 930 150 C1000 130 1050 150 1080 170 L1080 420 Z" fill={C.peach} />
        <path d="M0 420 L0 320 C160 260 300 250 420 300 C540 350 640 240 780 250 C900 258 980 300 1080 290 L1080 420 Z" fill="#FFE0A6" />
      </svg>
      <Tower x={230} w={180} h={420} at={at + 0.1} base={base} tint="#F7E3B8" />
      <Tower x={430} w={220} h={540} at={at + 0.2} base={base} tint="#FBEACB" />
      <Tower x={670} w={170} h={360} at={at + 0.3} base={base} tint="#F3DBA6" />
      {/* ground wave: full bleed decoration */}
      <svg width={1080} height={600} style={{position: 'absolute', left: 0, top: base - 30, transform: `translateY(${(1 - ground) * 300}px)`}}>
        <path d={`M0 40 C200 ${10 + Math.sin(t * 2) * 8} 380 70 560 40 C740 ${10 + Math.cos(t * 2) * 8} 900 60 1080 30 L1080 600 L0 600 Z`} fill={C.gold} />
        <path d="M0 80 C220 60 420 110 640 80 C820 60 960 90 1080 75" stroke={C.goldMid} strokeWidth={4} fill="none" opacity={0.6} />
      </svg>
      {/* location pin dropping on the tallest tower */}
      <div style={{position: 'absolute', left: 540 - 50, top: base - 540 - 120, transform: `translateY(${(1 - pin) * -260}px)`, opacity: Math.min(1, pin * 3)}}>
        {t > 8.62 && (
          <div
            style={{
              position: 'absolute',
              left: 50 - 60 * (ripple + 0.2),
              top: 118 - 18 * (ripple + 0.2),
              width: 120 * (ripple + 0.2),
              height: 36 * (ripple + 0.2),
              borderRadius: '50%',
              border: `3px solid ${C.goldDeep}`,
              opacity: 1 - ripple / 0.9,
            }}
          />
        )}
        <PinIcon size={100} />
      </div>
      {/* signboard */}
      <div style={{position: 'absolute', left: 600, top: 1090, transform: `scale(${board}) rotate(${(1 - board) * -12}deg)`, transformOrigin: '50% 100%'}}>
        <div style={{position: 'absolute', left: 166, top: 170, width: 18, height: 200, background: C.goldDeep, borderRadius: 4}} />
        <div
          style={{
            position: 'relative',
            width: 350,
            background: C.white,
            border: `5px solid ${C.goldDeep}`,
            borderRadius: 20,
            padding: '16px 18px',
            textAlign: 'center',
            boxShadow: '0 18px 30px -18px rgba(110,80,10,0.7)',
          }}
        >
          <div style={{fontSize: 44, fontWeight: 800, color: C.ink, lineHeight: 1.1}}>Kharghar</div>
          <div style={{fontSize: 38, fontWeight: 700, color: C.goldDeep, marginTop: 4}}>Sector 27</div>
        </div>
      </div>
    </>
  );
};

// Diagonal gold wipe between the "budget" and "2 Crore" beats.
export const Wipe: React.FC<{at: number}> = ({at}) => {
  const t = useSec();
  const p = interpolate(t, [at - 0.16, at + 0.2], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  if (p <= 0 || p >= 1) return null;
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          top: -600,
          height: 3200,
          width: 1500,
          left: interpolate(p, [0, 1], [-1700, 1300]),
          transform: 'rotate(16deg)',
          background: `linear-gradient(90deg, ${C.peach} 0%, ${C.gold} 18%, ${C.gold} 82%, ${C.peach} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ---------- Composition ----------

export const Hook: React.FC<{showSafe?: boolean}> = ({showSafe}) => {
  const t = useSec();
  const crore = (tt: number) => {
    const v = interpolate(tt, [5.6, 6.0], [0, 2], clamp);
    return `₹${v >= 2 ? '2' : v.toFixed(1)} Crore`;
  };
  // slow camera drift so no frame is ever static
  const drift = `translate(${Math.sin(t * 0.9) * 3}px, ${Math.cos(t * 0.7) * 3}px)`;

  return (
    <AbsoluteFill style={{fontFamily}}>
      <Audio src={staticFile('hook/vo.m4a')} />
      <Background />
      <AbsoluteFill style={{transform: drift}}>
        {/* Beat 1: Bada Ghar Better Views */}
        <PhotoCard src="hook/interior.jpg" x={400} y={1060} w={500} h={640} rot={-5} inAt={0.05} outAt={1.6} from={[-60, 500]} to={[-500, -80]} chip="Spacious 2 BHK" chipAt={0.3} />
        <PhotoCard src="hook/hills.jpg" x={690} y={1150} w={460} h={590} rot={5} inAt={0.8} outAt={1.62} from={[500, 60]} to={[-520, -60]} chip="Hill Views" chipAt={1.0} focusY={35} />
        <Headline
          from={0}
          to={1.6}
          lines={[
            [
              {w: 'Bada', at: 0.05},
              {w: 'Ghar', at: 0.32},
            ],
            [
              {w: 'Better', at: 0.8, kind: 'serif'},
              {w: 'Views', at: 1.02, kind: 'serif'},
            ],
          ]}
        />

        {/* Beat 2: Ya Jaldi Possession? */}
        <PhotoCard src="hook/nms.jpg" x={500} y={1110} w={560} h={700} rot={-3} inAt={1.66} outAt={2.76} from={[520, 40]} to={[-560, 0]} chip="NMS One 27" chipAt={1.85} focusY={30} />
        <HangingTag x={740} y={725} len={70} at={2.2} outAt={2.72}>
          <Tag>
            <KeyIcon size={52} />
            Dec 2027
          </Tag>
        </HangingTag>
        <Headline
          from={1.63}
          to={2.78}
          lines={[
            [
              {w: 'Ya', at: 1.65},
              {w: 'Jaldi', at: 1.84},
            ],
            [{w: 'Possession?', at: 2.17, kind: 'hl', select: 2.3}],
          ]}
        />

        {/* Beat 3: Let's Simplify This Decision / Within Your Budget */}
        {(
          [
            {src: 'hook/today-royal.jpg', x: 300, rot: -7, at: 2.84, chip: 'Today Royal'},
            {src: 'hook/nms.jpg', x: 540, rot: 0, at: 2.94, chip: 'NMS One 27'},
            {src: 'hook/satyam.jpg', x: 780, rot: 7, at: 3.04, chip: 'Satyam Skydeck'},
          ] as const
        ).map((c, i) => (
          <PhotoCard
            key={c.src}
            src={c.src}
            x={c.x}
            y={1070 + (i === 1 ? -24 : 0)}
            w={290}
            h={530}
            rot={c.rot}
            inAt={c.at}
            outAt={4.9}
            from={[0, 420]}
            to={[0, -260]}
            chip={c.chip}
            chipAt={c.at + 0.25}
            chipBottom
            chipSize={22}
            focusY={30}
            lift={{at: 3.95, dy: -40}}
          />
        ))}
        <BudgetChip at={4.3} outAt={4.88} />
        <Headline
          from={2.8}
          to={3.93}
          lines={[
            [
              {w: "Let's", at: 2.82},
              {w: 'Simplify', at: 3.0},
            ],
            [
              {w: 'This', at: 3.3, kind: 'serif'},
              {w: 'Decision', at: 3.5, kind: 'serif'},
            ],
          ]}
        />
        <Headline
          from={3.95}
          to={4.98}
          lines={[
            [
              {w: 'Within', at: 3.97},
              {w: 'Your', at: 4.2},
            ],
            [{w: 'Budget', at: 4.4, kind: 'hl'}],
          ]}
        />

        {/* Beat 4: Agar 2 Crore Ke Andar / Aap 2 BHK Dhund Rahe */}
        <Wallet at={5.12} outAt={7.5} />
        <HangingTag x={820} y={715} len={80} at={6.5} outAt={7.5}>
          <Tag size={46}>2 BHK</Tag>
        </HangingTag>
        <Headline
          from={5.07}
          to={6.4}
          lines={[
            [
              {w: 'Agar', at: 5.1},
              {w: '₹2 Crore', at: 5.55, kind: 'hl', render: crore},
            ],
            [
              {w: 'Ke', at: 5.95, kind: 'serif'},
              {w: 'Andar', at: 6.08, kind: 'serif'},
            ],
          ]}
        />
        <Headline
          from={6.42}
          to={7.58}
          lines={[
            [
              {w: 'Aap', at: 6.44},
              {w: '2 BHK', at: 6.6, kind: 'hl'},
            ],
            [
              {w: 'Dhund', at: 7.0, kind: 'serif'},
              {w: 'Rahe', at: 7.22, kind: 'serif'},
            ],
          ]}
        />

        {/* Beat 5: Wo Bhi Kharghar Ke Sector 27 Mein */}
        <LocationScene at={7.62} />
        <Headline
          from={7.61}
          to={HOOK_SECONDS + 1}
          lines={[
            [
              {w: 'Wo', at: 7.63},
              {w: 'Bhi', at: 7.76},
              {w: 'Kharghar', at: 7.92, kind: 'serif'},
            ],
            [
              {w: 'Ke', at: 8.32},
              {w: 'Sector 27', at: 8.45, kind: 'hl', select: 8.7},
              {w: 'Mein', at: 9.05},
            ],
          ]}
        />
      </AbsoluteFill>
      <Wipe at={5.07} />
      {showSafe && <div style={{position: 'absolute', left: SAFE.x, top: SAFE.y, width: SAFE.w, height: SAFE.h, outline: '3px dashed red'}} />}
    </AbsoluteFill>
  );
};
