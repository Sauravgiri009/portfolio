import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {C, Defs, Grain, P, Palm, Person, Pine, Ripples, SERIF, Tower} from './art';
import {ASSETS} from './assets';

const FPS = 30;
const s = (x: number) => Math.round(x * FPS);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Scene windows in seconds (sum = 79.25, matches public/vo.mp3).
// Estimated from script word counts; replace with vo_words.txt timings when available.
const SCENES = [
  {id: 'hook', from: 0, to: 9.75},
  {id: 'rules', from: 9.75, to: 18.65},
  {id: 'risk', from: 18.65, to: 30.05},
  {id: 'case', from: 30.05, to: 50.35},
  {id: 'checks', from: 50.35, to: 68.55},
  {id: 'outro', from: 68.55, to: 79.25},
] as const;
export const TOTAL = s(79.25);

const SECTIONS = [
  {key: 'rules', from: 9.75, to: 30.05, color: C.rules},
  {key: 'case', from: 30.05, to: 50.35, color: C.case},
  {key: 'checks', from: 50.35, to: 79.25, color: C.checks},
];

// On-screen text = only the highlighted supers from the script, verbatim.
// y is the top of the super inside the safe zone (0-1134).
const SUPERS: {from: number; to: number; y: number; lines: string[]; color: string; size?: number}[] = [
  {from: 0.4, to: 9.75, y: 840, lines: ['Buying Near Lakes/Drains', 'in Bengaluru?'], color: P.orange},
  {from: 11.2, to: 15.0, y: 860, lines: ['Lakes: 75m', 'No-Construction Zone'], color: C.rules},
  {from: 15.0, to: 18.65, y: 740, lines: ['Primary Drain: 50m', 'Secondary Drain: 35m', 'Tertiary Drain: 25m'], color: C.rules},
  {from: 31.4, to: 42.5, y: 800, lines: ['NGT Imposed', '₹117 Cr Fine', '(Mantri Techzone)'], color: C.case},
  {from: 42.5, to: 50.35, y: 690, lines: ['Clearance Quashed'], color: C.case},
  {from: 45.5, to: 50.35, y: 820, lines: ['Construction Stayed'], color: C.case},
  {from: 48.0, to: 50.35, y: 950, lines: ['Flood Risk'], color: C.case},
  {from: 54.2, to: 68.55, y: 560, lines: ['Verify Setback in', 'Sanctioned Plan'], color: C.checks, size: 44},
  {from: 59.3, to: 68.55, y: 750, lines: ['Cross-check BBMP', 'Storm-Water-Drain Map'], color: C.checks, size: 44},
  {from: 64.0, to: 68.55, y: 940, lines: ['Valid Environmental', 'Clearance'], color: C.checks, size: 44},
];

// Full-screen chapter cards at each section change (text reuses the section's super).
const CARD = 40;
const CARDS: {at: number; color: string; lines?: string[]; checks?: boolean}[] = [
  {at: 9.75, color: C.rules, lines: ['The Buffer Rules', '& High-Risk Areas']},
  {at: 30.05, color: C.case, lines: ['NGT Imposed', '₹117 Cr Fine', '(Mantri Techzone)']},
  {at: 50.35, color: C.checks, checks: true},
];

// ---------- overlays ----------
const Tracker: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (t < SECTIONS[0].from) return null;
  return (
    <div style={{position: 'absolute', left: 116, top: 410, width: 847, display: 'flex', justifyContent: 'center', gap: 14}}>
      {SECTIONS.map((x) => {
        const p = interpolate(t, [x.from, x.to], [0, 1], clamp);
        return (
          <div key={x.key} style={{width: 200, height: 12, background: 'rgba(247,228,198,.25)'}}>
            <div style={{width: `${p * 100}%`, height: '100%', background: x.color}} />
          </div>
        );
      })}
    </div>
  );
};

const Super: React.FC<{lines: string[]; color: string; size?: number; f: number}> = ({lines, color, size = 54, f}) => {
  const p = spring({frame: f, fps: FPS, config: {damping: 14}});
  return (
    <div style={{display: 'flex', justifyContent: 'center', opacity: p, transform: `translateY(${(1 - p) * 24}px)`}}>
      <div style={{background: P.navy, borderTop: `10px solid ${color}`, padding: '20px 34px', textAlign: 'center', fontFamily: SERIF, fontWeight: 800, fontSize: size, lineHeight: 1.22, color: P.cream, maxWidth: 847, boxShadow: '0 14px 0 rgba(0,0,0,.25)'}}>
        {lines.map((l) => <div key={l} style={{whiteSpace: 'nowrap'}}>{l}</div>)}
      </div>
    </div>
  );
};

const Supers: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <>
      {SUPERS.filter((x) => t >= x.from && t < x.to).map((x) => (
        <div key={x.lines[0]} style={{position: 'absolute', left: 116, width: 847, top: 410 + x.y}}>
          <Super lines={x.lines} color={x.color} size={x.size} f={f - s(x.from)} />
        </div>
      ))}
    </>
  );
};

const TitleCard: React.FC<{color: string; lines?: string[]; checks?: boolean}> = ({color, lines, checks}) => {
  const f = useCurrentFrame();
  const wipe = interpolate(f, [0, 8], [100, 0], clamp);
  const out = interpolate(f, [CARD - 6, CARD], [1, 0], clamp);
  const p = spring({frame: f - 4, fps: FPS, config: {damping: 14}});
  return (
    <AbsoluteFill style={{background: color, clipPath: `inset(0 0 ${wipe}% 0)`, opacity: out}}>
      <svg width="1080" height="1920" style={{position: 'absolute'}}>
        <circle cx={540} cy={980 - f * 2} r={420} fill="#fff" opacity=".08" />
      </svg>
      <div style={{position: 'absolute', left: 116, top: 410, width: 847, height: 1134, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `translateY(${(1 - p) * 60}px)`}}>
        <div style={{width: 140, height: 8, background: P.cream, marginBottom: 40}} />
        {lines && <div style={{fontFamily: SERIF, fontWeight: 800, fontSize: 84, lineHeight: 1.1, color: P.cream, textAlign: 'center'}}>{lines.map((l) => <div key={l} style={{whiteSpace: 'nowrap'}}>{l}</div>)}</div>}
        {checks && (
          <svg width="640" height="220" viewBox="0 0 640 220">
            {[0, 1, 2].map((i) => {
              const q = spring({frame: f - 6 - i * 6, fps: FPS, config: {damping: 10}});
              return <g key={i} transform={`translate(${110 + i * 210},110) scale(${q})`}><circle r="90" fill={P.cream} /><path d="M-40,0 L-10,32 L44,-30" stroke={color} strokeWidth="20" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>;
            })}
          </svg>
        )}
        <div style={{width: 140, height: 8, background: P.cream, marginTop: 40}} />
      </div>
      <Grain f={f} />
    </AbsoluteFill>
  );
};

// ---------- scene shell ----------
// background full-bleed (with drift / Ken Burns), art centred in the safe zone above the supers
const Photo: React.FC<{src: string; f: number; focusY?: number}> = ({src, f, focusY = 50}) => (
  <Img src={staticFile(src)} style={{width: 1160, height: 2000, objectFit: 'cover', objectPosition: `50% ${focusY}%`, transform: `scale(${1.02 + f * 0.0004})`}} />
);

const Stage: React.FC<{id: string; bg: React.ReactNode; children: React.ReactNode}> = ({id, bg, children}) => {
  const f = useCurrentFrame();
  const asset = ASSETS[id];
  return (
    <AbsoluteFill style={{background: P.navy, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: -40, transform: `translate(${Math.sin(f / 90) * 14}px,${Math.cos(f / 110) * 10}px) scale(${1.04 + f * 0.00008})`}}>
        {asset ? <Photo src={asset.src} focusY={asset.focusY} f={f} /> : bg}
      </div>
      {!asset && (
        <div style={{position: 'absolute', left: 116, top: 470, width: 847, height: 700, transform: `translateY(${Math.sin(f / 60) * 6}px) scale(${1 + f * 0.0001})`}}>{children}</div>
      )}
      <Grain f={f} />
    </AbsoluteFill>
  );
};

// ---------- backgrounds (1160x2000 to cover drift) ----------
const BgSunset: React.FC<{f: number}> = ({f}) => (
  <svg width="1160" height="2000"><Defs />
    <rect width="1160" height="2000" fill="url(#dusk)" />
    <circle cx={580} cy={820 - f * 0.08} r={170} fill={P.sun} />
    <rect y="1200" width="1160" height="800" fill="url(#water)" />
  </svg>
);
const BgNight: React.FC<{f: number}> = ({f}) => (
  <svg width="1160" height="2000"><Defs />
    <rect width="1160" height="2000" fill="url(#night)" />
    {Array.from({length: 46}).map((_, i) => <rect key={i} x={(i * 97) % 1160} y={(i * 211 + f * 26) % 2000} width="3" height="60" fill={P.mist} opacity=".35" transform="rotate(8)" />)}
  </svg>
);
const BgFlat: React.FC<{c: string; f: number}> = ({c, f}) => (
  <svg width="1160" height="2000">
    <rect width="1160" height="2000" fill={c} />
    <circle cx={580 + Math.sin(f / 80) * 120} cy={700} r={360} fill="#fff" opacity=".05" />
    <circle cx={580 - Math.sin(f / 90) * 140} cy={1600} r={440} fill="#000" opacity=".08" />
  </svg>
);

// ---------- scenes (art in an 847x700 box, symmetric around x=423) ----------
const Skyline: React.FC<{lit?: number; y?: number}> = ({lit = 0, y = 470}) => (
  <g>
    <Tower x={0} y={y} w={110} h={230} c={P.teal} lit={lit} />
    <Tower x={115} y={y} w={90} h={300} c={P.rust} lit={lit} />
    <Tower x={210} y={y} w={80} h={170} c={P.deep} lit={lit} />
    <Tower x={557} y={y} w={80} h={170} c={P.deep} lit={lit} />
    <Tower x={642} y={y} w={90} h={300} c={P.rust} lit={lit} />
    <Tower x={737} y={y} w={110} h={230} c={P.teal} lit={lit} />
  </g>
);

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage id="hook" bg={<BgSunset f={f} />}>
      <svg viewBox="0 0 847 700" width="847" height="700"><Defs />
        <Skyline lit={0.2} />
        <rect x="0" y="470" width="847" height="230" fill="url(#water)" />
        <Ripples x={423} y={490} w={460} f={f} />
        <polygon points="273,700 300,640 546,640 573,700" fill={P.navy} />
        <Palm x={300} y={645} s={0.8} c={P.navy} /><Palm x={546} y={645} s={0.8} c={P.navy} />
        <Person x={423} y={650} s={0.9} shirt={P.orange} />
      </svg>
    </Stage>
  );
};

const Rules: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS + 9.75;
  const ring = interpolate(f, [CARD + 20, CARD + 80], [0, 1], clamp);
  const drains = t >= 15.0;
  return (
    <Stage id="rules" bg={<BgFlat c={P.deep} f={f} />}>
      {!drains ? (
        <svg viewBox="0 0 847 700" width="847" height="700"><Defs />
          {[[90, 150], [757, 150], [120, 640], [727, 640]].map(([x, y], i) => <Pine key={i} x={x} y={y} s={0.55} c={P.teal} />)}
          <ellipse cx="423" cy="350" rx={220 + 140 * ring} ry={150 + 100 * ring} fill={C.case} opacity={0.2 * ring} />
          <ellipse cx="423" cy="350" rx={220 + 140 * ring} ry={150 + 100 * ring} fill="none" stroke={P.orange} strokeWidth="7" strokeDasharray="24 14" opacity={ring} />
          <ellipse cx="423" cy="350" rx="220" ry="150" fill={P.navy} />
          <Ripples x={423} y={300} w={280} f={f} c={P.mist} n={5} />
          <g opacity={ring} stroke={P.cream} strokeWidth="5"><line x1="643" y1="350" x2="783" y2="350" /><line x1="643" y1="336" x2="643" y2="364" /><line x1="783" y1="336" x2="783" y2="364" /></g>
        </svg>
      ) : (
        <svg viewBox="0 0 847 700" width="847" height="700"><Defs />
          {[{w: 90, b: 150, c: P.rust}, {w: 64, b: 105, c: P.orange}, {w: 40, b: 75, c: P.mustard}].map((d, i) => {
            const p = spring({frame: f - s(15.0 - 9.75) - i * 12, fps: FPS, config: {damping: 13}});
            const y = 110 + i * 190;
            return (
              <g key={i} opacity={p} transform={`translate(423,${y}) scale(${0.8 + 0.2 * p},1)`}>
                <rect x={-(d.w / 2 + d.b)} y="-60" width={d.w + d.b * 2} height="120" fill={d.c} opacity=".35" />
                <rect x={-d.w / 2} y="-60" width={d.w} height="120" fill={P.sea} />
                <rect x={-d.w / 2} y={-60 + ((f * 2) % 120)} width={d.w} height="6" fill={P.mist} />
                <rect x={-(d.w / 2 + d.b) - 70} y="-60" width="70" height="120" fill={P.teal} />
                <rect x={d.w / 2 + d.b} y="-60" width="70" height="120" fill={P.teal} />
              </g>
            );
          })}
        </svg>
      )}
    </Stage>
  );
};

const Risk: React.FC = () => {
  const f = useCurrentFrame();
  const rise = interpolate(f, [20, 260], [0, 1], clamp);
  return (
    <Stage id="risk" bg={<BgNight f={f} />}>
      <svg viewBox="0 0 847 700" width="847" height="700"><Defs />
        <Skyline lit={0.6} y={560} />
        <rect x="0" y={660 - rise * 260} width="847" height={40 + rise * 260} fill={P.sea} opacity=".9" />
        <rect x="0" y={660 - rise * 260} width="847" height="8" fill={P.mist} />
        <Ripples x={423} y={690 - rise * 240} w={420} f={f} c={P.sun} n={4} />
      </svg>
    </Stage>
  );
};

const Case: React.FC = () => {
  const f = useCurrentFrame();
  const gavel = interpolate(f, [CARD + 20, CARD + 30, CARD + 40], [-70, -18, -30], clamp);
  return (
    <Stage id="case" bg={<BgFlat c={P.navy} f={f} />}>
      <svg viewBox="0 0 847 700" width="847" height="700"><Defs />
        <polygon points="163,170 423,80 683,170" fill={P.mustard} />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={193 + i * 100} y="185" width="40" height="200" fill={P.mustard} />)}
        <rect x="163" y="385" width="520" height="30" fill={P.peach} />
        <g transform={`translate(423,40) rotate(${gavel})`}>
          <rect x="-12" y="0" width="24" height="170" fill={P.peach} />
          <rect x="-80" y="-44" width="160" height="62" fill={P.rust} />
          <rect x="-80" y="-44" width="160" height="14" fill="#000" opacity=".2" />
        </g>
      </svg>
    </Stage>
  );
};

const Doc: React.FC<{kind: number}> = ({kind}) => (
  <g>
    <rect x="-80" y="-105" width="160" height="210" fill={P.cream} />
    <rect x="-80" y="-105" width="160" height="34" fill={kind === 0 ? C.rules : kind === 1 ? P.orange : C.case} />
    {kind === 0 && <g stroke={C.rules} strokeWidth="5" fill="none"><rect x="-50" y="-50" width="100" height="120" /><line x1="-50" y1="10" x2="50" y2="10" /><line x1="0" y1="-50" x2="0" y2="70" /></g>}
    {kind === 1 && <g><path d="M-65,70 C-30,0 10,80 65,-40" stroke={P.sea} strokeWidth="12" fill="none" /><rect x="-30" y="-50" width="50" height="50" fill="none" stroke={P.orange} strokeWidth="5" strokeDasharray="8 5" /></g>}
    {kind === 2 && <g><circle cx="0" cy="45" r="34" fill={C.case} /><rect x="-50" y="-50" width="100" height="9" fill={P.teal} /><rect x="-40" y="-30" width="80" height="9" fill={P.teal} /></g>}
  </g>
);

const Checks: React.FC = () => {
  const f = useCurrentFrame();
  const starts = [54.2, 59.3, 64.0].map((x) => s(x - 50.35));
  return (
    <Stage id="checks" bg={<BgFlat c={P.teal} f={f} />}>
      <svg viewBox="0 0 847 700" width="847" height="700">
        {[0, 1, 2].map((i) => {
          const p = spring({frame: f - starts[i] + 10, fps: FPS, config: {damping: 12}});
          return <g key={i} opacity={0.25 + 0.75 * p} transform={`translate(${153 + i * 270},${150 - p * 20}) rotate(${(i - 1) * 4}) scale(${0.85 + 0.15 * p})`}><Doc kind={i} /></g>;
        })}
      </svg>
    </Stage>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage id="outro" bg={<BgSunset f={f} />}>
      <svg viewBox="0 0 847 700" width="847" height="700"><Defs />
        <Skyline lit={0.4} />
        <rect x="0" y="470" width="847" height="120" fill="url(#water)" />
        <Ripples x={423} y={490} w={380} f={f} n={4} />
        <rect x="0" y="590" width="847" height="110" fill={P.navy} />
        <Person x={385} y={600} s={0.95} shirt={P.orange} />
        <Person x={461} y={600} s={0.85} shirt={P.mustard} flip />
      </svg>
    </Stage>
  );
};

const MAP = {hook: Hook, rules: Rules, risk: Risk, case: Case, checks: Checks, outro: Outro};

export const Main: React.FC = () => (
  <AbsoluteFill style={{background: P.navy}}>
    <Audio src={staticFile('vo.mp3')} />
    {SCENES.map((x) => {
      const Comp = MAP[x.id];
      return <Sequence key={x.id} from={s(x.from)} durationInFrames={s(x.to) - s(x.from)}><Comp /></Sequence>;
    })}
    <Tracker />
    <Supers />
    {CARDS.map((c) => (
      <Sequence key={c.at} from={s(c.at)} durationInFrames={CARD}><TitleCard color={c.color} lines={c.lines} checks={c.checks} /></Sequence>
    ))}
  </AbsoluteFill>
);
