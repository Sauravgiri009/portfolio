import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, Cloud, Defs, Face, Tower, Tree, Waves} from './art';

const FPS = 30;
const s = (x: number) => Math.round(x * FPS);

// scene lengths in seconds (sum = 79.25, matches vo.mp3)
const SCENES = [
  {id: 'hook', d: 9.5},
  {id: 'rules', d: 21},
  {id: 'risk', d: 11},
  {id: 'case', d: 17},
  {id: 'checks', d: 14.5},
  {id: 'outro', d: 6.25},
] as const;
export const TOTAL = s(79.25);
export const SCENE_START: Record<string, number> = {};
let acc = 0;
SCENES.forEach((x) => { SCENE_START[x.id] = acc; acc += s(x.d); });

const SECTIONS = [
  {key: 'rules', label: 'RULES', color: C.rules},
  {key: 'risk', label: 'RISK', color: C.risk},
  {key: 'case', label: 'CASE', color: C.case},
  {key: 'checks', label: 'CHECKS', color: C.checks},
];
const TITLES: Record<string, string> = {rules: 'NGT BUFFER RULES', risk: 'HIGH-RISK AREAS', case: 'REAL CASE', checks: '3 CHECKS'};
const FONT = '"Poppins","Arial Black",system-ui,sans-serif';

// ---------- shared ----------
const Pop: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - at, fps: FPS, config: {damping: 11, stiffness: 140}});
  return <div style={{opacity: interpolate(f - at, [0, 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), transform: `scale(${0.6 + 0.4 * p}) translateY(${(1 - p) * 30}px)`, ...style}}>{children}</div>;
};

const Pill: React.FC<{color: string; children: React.ReactNode; size?: number}> = ({color, children, size = 54}) => (
  <div style={{display: 'inline-block', background: color, color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: size, padding: '10px 30px', borderRadius: 26, boxShadow: '0 10px 0 rgba(0,0,0,.18)', letterSpacing: 1}}>{children}</div>
);

const Caption: React.FC<{text: string; color?: string}> = ({text, color = C.ink}) => (
  <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 50, lineHeight: 1.2, color, textAlign: 'center', background: 'rgba(255,255,255,.92)', borderRadius: 30, padding: '22px 30px', boxShadow: '0 10px 0 rgba(0,0,0,.12)'}}>{text}</div>
);

const Tracker: React.FC<{active: number}> = ({active}) => (
  <div style={{display: 'flex', gap: 12, justifyContent: 'center'}}>
    {SECTIONS.map((x, i) => (
      <div key={x.key} style={{flex: 1, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 24, padding: '10px 0', borderRadius: 18, color: i === active ? '#fff' : x.color, background: i === active ? x.color : 'rgba(255,255,255,.85)', border: `4px solid ${x.color}`, opacity: i <= active ? 1 : 0.55}}>{x.label}</div>
    ))}
  </div>
);

// full-bleed bg with continuous drift (never still)
const Bg: React.FC<{kind: 'day' | 'flood' | 'case' | 'check'}> = ({kind}) => {
  const f = useCurrentFrame();
  const top = {day: '#7FCBFF', flood: '#9AA9B8', case: '#F7B2A8', check: '#A8E6B0'}[kind];
  const bot = {day: '#E6F7FF', flood: '#D5DEE6', case: '#FFE3DD', check: '#E9FBEA'}[kind];
  return (
    <AbsoluteFill style={{background: `linear-gradient(${top},${bot})`}}>
      <svg width="1080" height="1920" style={{position: 'absolute'}}>
        {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={(i * 230 + f * (0.6 + i * 0.1)) % 1200 - 60} cy={160 + i * 290} r={60 + (i % 3) * 22} fill="#fff" opacity=".18" />)}
      </svg>
    </AbsoluteFill>
  );
};

const Stage: React.FC<{active: number; children: React.ReactNode; caption?: string; capColor?: string}> = ({active, children, caption, capColor}) => {
  const f = useCurrentFrame();
  const drift = Math.sin(f / 70) * 8;
  return (
    <div style={{position: 'absolute', left: 116, top: 410, width: 847, height: 1134}}>
      <Tracker active={active} />
      <div style={{position: 'absolute', top: 84, left: 0, width: 847, height: 820, transform: `translateY(${drift}px) scale(${1 + f * 0.00012})`, transformOrigin: '50% 50%'}}>{children}</div>
      {caption && <div style={{position: 'absolute', top: 930, left: 0, right: 0}}><Caption text={caption} color={capColor} /></div>}
    </div>
  );
};

const TitleCard: React.FC<{k: string; color: string; n: number}> = ({k, color, n}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f, fps: FPS, config: {damping: 12}});
  const wipe = interpolate(f, [0, 8], [100, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: color, clipPath: `inset(0 ${wipe}% 0 0)`, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', left: 116, top: 410, width: 847, height: 1134, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30, transform: `scale(${0.8 + 0.2 * p})`}}>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 200, color: 'rgba(255,255,255,.35)'}}>0{n}</div>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 96, color: '#fff', textAlign: 'center', lineHeight: 1.05, textShadow: '0 8px 0 rgba(0,0,0,.18)'}}>{TITLES[k]}</div>
        <div style={{width: 520, height: 14, background: '#fff', borderRadius: 8}} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- scenes ----------
const Landscape: React.FC<{f: number; flood?: number}> = ({f, flood = 0}) => (
  <svg viewBox="0 0 847 820" width="847" height="820">
    <Defs />
    <Cloud x={160 + (f % 600) * 0.15} y={70} />
    <Cloud x={640 - (f % 600) * 0.1} y={120} s={0.8} />
    <rect x="0" y="470" width="847" height="350" rx="40" fill="url(#grass)" />
    <ellipse cx="423" cy="610" rx="400" ry="150" fill="url(#lake)" />
    <Waves y={575} w={600} t={f} />
    <Tree x={60} y={380} s={1.1} />
    <Tree x={790} y={390} s={1} />
    <Tower x={560} y={500} h={330} color="#F2A65A" />
    <Tower x={690} y={500} h={250} color="#EF7B7B" w={130} />
    <Tower x={40} y={520} h={200} color="#7FB6F5" w={120} />
    {flood > 0 && <rect x="0" y={700 - flood * 160} width="847" height={160 + flood * 160} fill="#4FC3F7" opacity=".6" />}
  </svg>
);

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Bg kind="day" />
      <Stage active={-1} caption="Lake-facing flat pasand aaya? Brochure nahi, NGT rules dekho!" >
        <Landscape f={f} />
        <svg viewBox="0 0 847 820" width="847" height="820" style={{position: 'absolute', left: 0, top: 0}}>
          <Defs /><Face x={200} y={470} s={1.15} mood={f % 120 < 60 ? 'happy' : 'worried'} />
          <g transform={`translate(${620 + Math.sin(f / 20) * 8},180)`}>
            <rect x="-150" y="-70" width="300" height="130" rx="30" fill="#fff" /><path d="M-20,60 L0,100 L20,60Z" fill="#fff" />
            <text x="0" y="-6" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="46" fill={C.ink}>Lake view!</text>
            <text x="0" y="38" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="46" fill={C.rules}>Sure? 🤔</text>
          </g>
        </svg>
      </Stage>
    </>
  );
};

const Rules: React.FC = () => {
  const f = useCurrentFrame();
  const t = f - 36; // after title card
  const ring = interpolate(t, [30, 90], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const tiers = [{n: 'Primary', m: 50, c: '#1E88E5'}, {n: 'Secondary', m: 35, c: '#8E24AA'}, {n: 'Tertiary', m: 25, c: '#FB8C00'}];
  const showTiers = t > s(9.5);
  return (
    <>
      <Bg kind="day" />
      <Stage active={0} caption={showTiers ? 'Drain ke hisaab se buffer badalta hai' : 'Lake ke 75m & drain ke 25m: No-Construction Zone'} capColor={C.rules}>
        {!showTiers ? (
          <svg viewBox="0 0 847 820" width="847" height="820">
            <Defs />
            <rect x="0" y="120" width="847" height="700" rx="40" fill="url(#grass)" />
            <ellipse cx="423" cy="430" rx="300" ry="200" fill="url(#lake)" />
            <Waves y={400} w={500} t={f} />
            {/* 75m buffer ring */}
            <ellipse cx="423" cy="430" rx={300 + 130 * ring} ry={200 + 90 * ring} fill="rgba(229,57,53,.22)" stroke="#E53935" strokeWidth="8" strokeDasharray="22 14" />
            <g opacity={ring}><rect x="583" y="170" width="220" height="76" rx="22" fill="#E53935" /><text x="693" y="224" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="50" fill="#fff">75 m</text></g>
            <Tree x={70} y={250} /><Tree x={780} y={640} s={0.9} />
            <Face x={150} y={700} s={0.8} mood="worried" />
            <g opacity={ring}><circle cx="423" cy="430" r="72" fill="#fff" /><text x="423" y="455" textAnchor="middle" fontSize="76">🚫</text></g>
          </svg>
        ) : (
          <svg viewBox="0 0 847 820" width="847" height="820">
            <Defs />
            <rect x="0" y="40" width="847" height="780" rx="40" fill="url(#grass)" />
            <rect x="0" y="380" width="847" height="90" fill="#6D8CA8" /><Waves y={400} w={847} t={f} amp={5} />
            {tiers.map((x, i) => {
              const p = spring({frame: t - s(10) - i * 18, fps: FPS, config: {damping: 12}});
              return (
                <g key={x.n} transform={`translate(0,${(1 - p) * 40})`} opacity={p}>
                  <rect x={40 + i * 270} y={500} width="250" height="220" rx="30" fill={x.c} />
                  <text x={165 + i * 270} y={575} textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="34" fill="#fff">{x.n}</text>
                  <text x={165 + i * 270} y={670} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="84" fill="#fff">{x.m}m</text>
                </g>
              );
            })}
            <Tree x={120} y={190} /><Tree x={720} y={200} s={0.9} />
          </svg>
        )}
      </Stage>
      {f < 36 && <TitleCard k="rules" color={C.rules} n={1} />}
    </>
  );
};

const Risk: React.FC = () => {
  const f = useCurrentFrame();
  const t = f - 36;
  const rise = interpolate(t, [20, 200], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const names = ['Varthur', 'Bellandur', 'ORR'];
  return (
    <>
      <Bg kind="flood" />
      <Stage active={1} caption="Drains ke paas bane projects = flood risk zone" capColor={C.risk}>
        <Landscape f={f} flood={rise} />
        <svg viewBox="0 0 847 820" width="847" height="820" style={{position: 'absolute', left: 0, top: 0}}>
          <Defs />
          {names.map((n, i) => {
            const p = spring({frame: t - 20 - i * 25, fps: FPS, config: {damping: 11}});
            return <g key={n} opacity={p} transform={`translate(${60 + i * 260},${60 + (1 - p) * -30})`}><rect width="240" height="84" rx="26" fill={C.risk} /><text x="120" y="58" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="40" fill="#fff">{n}</text></g>;
          })}
          <Face x={150} y={520} s={0.9} mood="shock" />
        </svg>
      </Stage>
      {f < 36 && <TitleCard k="risk" color={C.risk} n={2} />}
    </>
  );
};

const Case: React.FC = () => {
  const f = useCurrentFrame();
  const t = f - 36;
  const stamps = [{l: 'CLEARANCE QUASHED', at: 150}, {l: 'CONSTRUCTION STAYED', at: 210}, {l: 'FLOOD RISK', at: 270}];
  const coin = spring({frame: t - 10, fps: FPS, config: {damping: 9}});
  return (
    <>
      <Bg kind="case" />
      <Stage active={2} caption="Mantri Techzone: NGT ka ₹117 Cr fine" capColor={C.case}>
        <svg viewBox="0 0 847 820" width="847" height="820">
          <Defs />
          <Tower x={90} y={470} h={360} color="#C9CED6" w={170} /><Tower x={270} y={470} h={280} color="#B5BBC6" w={150} />
          <rect x="0" y="470" width="847" height="350" rx="40" fill="url(#grass)" />
          <g transform={`translate(560,250) scale(${coin})`}>
            <circle r="150" fill="#FFC928" stroke="#E5A100" strokeWidth="14" />
            <text y="-14" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="90" fill="#7A4B00">₹117</text>
            <text y="70" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="70" fill="#7A4B00">CRORE</text>
          </g>
          <g transform="translate(180,150) rotate(-18)"><rect x="-40" y="-20" width="130" height="50" rx="14" fill="#6D4C41" /><rect x="30" y="20" width="26" height="140" rx="10" fill="#8D6E63" /></g>
          {stamps.map((x, i) => {
            const p = spring({frame: t - x.at, fps: FPS, config: {damping: 8, stiffness: 200}});
            return <g key={x.l} opacity={Math.min(1, p)} transform={`translate(423,${540 + i * 92}) rotate(${i % 2 ? 3 : -3}) scale(${2 - p})`}><rect x="-300" y="-40" width="600" height="76" rx="14" fill="none" stroke="#C62828" strokeWidth="9" /><text y="18" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="46" fill="#C62828">{x.l}</text></g>;
          })}
          <Face x={730} y={640} s={0.6} mood="shock" />
        </svg>
      </Stage>
      {f < 36 && <TitleCard k="case" color={C.case} n={3} />}
    </>
  );
};

const Checks: React.FC = () => {
  const f = useCurrentFrame();
  const t = f - 36;
  const items = [
    {n: 1, h: 'Sanctioned Plan', b: 'Verify 75/50/35/25m setback', e: '📐'},
    {n: 2, h: 'BBMP SWD Map', b: 'Cross-check site boundary', e: '🗺️'},
    {n: 3, h: 'Env. Clearance', b: 'Search NGT orders vs developer', e: '📜'},
  ];
  return (
    <>
      <Bg kind="check" />
      <Stage active={3} caption="Booking se pehle yeh 3 checks karo" capColor={C.checks}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 26, paddingTop: 10}}>
          {items.map((x, i) => (
            <Pop key={x.n} at={30 + i * 130} style={{display: 'flex', alignItems: 'center', gap: 24, background: '#fff', borderRadius: 34, padding: '22px 28px', boxShadow: '0 12px 0 rgba(0,0,0,.12)', border: `6px solid ${C.checks}`}}>
              <div style={{width: 96, height: 96, borderRadius: 48, background: C.checks, color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 56, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{x.n}</div>
              <div style={{flex: 1}}>
                <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 46, color: C.ink}}>{x.h}</div>
                <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 32, color: '#44546A'}}>{x.b}</div>
              </div>
              <div style={{fontSize: 70}}>{x.e}</div>
            </Pop>
          ))}
        </div>
      </Stage>
      {f < 36 && <TitleCard k="checks" color={C.checks} n={4} />}
    </>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Bg kind="day" />
      <Stage active={3} caption="Lake view se zyada zaroori: legal security">
        <Landscape f={f} />
        <svg viewBox="0 0 847 820" width="847" height="820" style={{position: 'absolute', left: 0, top: 0}}>
          <Defs /><Face x={423} y={470} s={1.2} mood="happy" />
          <g transform="translate(423,740)"><rect x="-300" y="-60" width="600" height="110" rx="30" fill={C.checks} /><text y="14" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="44" fill="#fff">99shorts only on 99acres</text></g>
        </svg>
      </Stage>
    </>
  );
};

const MAP = {hook: Hook, rules: Rules, risk: Risk, case: Case, checks: Checks, outro: Outro};

export const Main: React.FC = () => (
  <AbsoluteFill style={{background: '#fff'}}>
    <Audio src={staticFile('vo.mp3')} />
    {SCENES.map((x) => {
      const Comp = MAP[x.id];
      return <Sequence key={x.id} from={SCENE_START[x.id]} durationInFrames={s(x.d)}><Comp /></Sequence>;
    })}
  </AbsoluteFill>
);
