import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {C, Defs, Grain, P, Palm, Person, Pine, Ripples, SANS, SERIF, Tower, Vignette} from './art';

const FPS = 30;
const s = (x: number) => Math.round(x * FPS);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// scene lengths in seconds (sum = 79.25, matches public/vo.mp3)
const SCENES = [
  {id: 'hook', d: 9.5},
  {id: 'rules', d: 21},
  {id: 'risk', d: 11},
  {id: 'case', d: 17},
  {id: 'checks', d: 14.5},
  {id: 'outro', d: 6.25},
] as const;
export const TOTAL = s(79.25);
const START: Record<string, number> = {};
let acc = 0;
SCENES.forEach((x) => { START[x.id] = acc; acc += s(x.d); });

const SECTIONS = [
  {key: 'rules', label: 'RULES', color: C.rules},
  {key: 'risk', label: 'RISK', color: C.risk},
  {key: 'case', label: 'CASE', color: C.case},
  {key: 'checks', label: 'CHECKS', color: C.checks},
];
const TITLES: Record<string, [string, string]> = {
  rules: ['The Buffer', 'Rules'],
  risk: ['High-Risk', 'Areas'],
  case: ['A Real', 'Case'],
  checks: ['Three', 'Checks'],
};
const CARD = 36; // title card length in frames

// ---------- shared ----------
const Tracker: React.FC<{active: number}> = ({active}) => (
  <div style={{display: 'flex', gap: 10}}>
    {SECTIONS.map((x, i) => (
      <div key={x.key} style={{flex: 1}}>
        <div style={{height: 10, background: i <= active ? x.color : 'rgba(247,228,198,.35)'}} />
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 4, marginTop: 8, color: i === active ? x.color : 'rgba(247,228,198,.7)'}}>{x.label}</div>
      </div>
    ))}
  </div>
);

const Caption: React.FC<{text: string; accent: string}> = ({text, accent}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [CARD, CARD + 10], [0, 1], clamp);
  return (
    <div style={{opacity: o, transform: `translateY(${(1 - o) * 20}px)`, background: P.navy, borderLeft: `14px solid ${accent}`, padding: '24px 30px', fontFamily: SERIF, fontWeight: 700, fontSize: 50, lineHeight: 1.18, color: P.cream}}>{text}</div>
  );
};

// content lives in the safe zone; background stays full-bleed outside it
const Stage: React.FC<{active: number; bg: React.ReactNode; caption?: string; accent?: string; children: React.ReactNode}> = ({active, bg, caption, accent = P.orange, children}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: P.navy, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: -40, transform: `translate(${Math.sin(f / 90) * 14}px,${Math.cos(f / 110) * 10}px) scale(${1.04 + f * 0.00008})`}}>{bg}</div>
      <div style={{position: 'absolute', left: 116, top: 410, width: 847, height: 1134}}>
        {active >= 0 && <Tracker active={active} />}
        <div style={{position: 'absolute', top: 70, left: 0, width: 847, height: 840, transform: `translateY(${Math.sin(f / 60) * 6}px) scale(${1 + f * 0.0001})`}}>{children}</div>
        {caption && <div style={{position: 'absolute', top: 930, left: 0, right: 0}}><Caption text={caption} accent={accent} /></div>}
      </div>
      <Vignette />
      <Grain f={f} />
    </AbsoluteFill>
  );
};

const TitleCard: React.FC<{k: string; color: string; n: number}> = ({k, color, n}) => {
  const f = useCurrentFrame();
  const wipe = interpolate(f, [0, 8], [100, 0], clamp);
  const out = interpolate(f, [CARD - 6, CARD], [1, 0], clamp);
  const p = spring({frame: f - 4, fps: FPS, config: {damping: 14}});
  return (
    <AbsoluteFill style={{background: color, clipPath: `inset(0 0 ${wipe}% 0)`, opacity: out}}>
      <svg width="1080" height="1920" style={{position: 'absolute'}}>
        <circle cx={540} cy={980 - f * 2} r={420} fill="#fff" opacity=".08" />
        <rect x="0" y="1460" width="1080" height="460" fill="#000" opacity=".15" />
      </svg>
      <div style={{position: 'absolute', left: 116, top: 410, width: 847, height: 1134, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `translateY(${(1 - p) * 60}px)`}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: 14, color: P.cream, opacity: 0.85}}>CHAPTER 0{n}</div>
        <div style={{width: 120, height: 6, background: P.cream, margin: '30px 0'}} />
        <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 132, lineHeight: 1, color: P.cream, textAlign: 'center'}}>{TITLES[k][0]}<br />{TITLES[k][1]}</div>
      </div>
      <Grain f={f} />
    </AbsoluteFill>
  );
};

// ---------- backgrounds (1160x2000 to cover drift) ----------
const BgSunset: React.FC<{f: number}> = ({f}) => (
  <svg width="1160" height="2000"><Defs />
    <rect width="1160" height="2000" fill="url(#dusk)" />
    <circle cx={720} cy={760 - f * 0.08} r={150} fill={P.sun} />
    <rect y="1240" width="1160" height="760" fill="url(#water)" />
  </svg>
);
const BgNight: React.FC<{f: number}> = ({f}) => (
  <svg width="1160" height="2000"><Defs />
    <rect width="1160" height="2000" fill="url(#night)" />
    {Array.from({length: 46}).map((_, i) => <rect key={i} x={(i * 97) % 1160} y={((i * 211 + f * 26) % 2000)} width="3" height="60" fill={P.mist} opacity=".35" transform="rotate(8)" />)}
  </svg>
);
const BgFlat: React.FC<{c: string; f: number}> = ({c, f}) => (
  <svg width="1160" height="2000">
    <rect width="1160" height="2000" fill={c} />
    <circle cx={200 + f * 0.3} cy={500} r={340} fill="#fff" opacity=".05" />
    <circle cx={960 - f * 0.2} cy={1600} r={420} fill="#000" opacity=".08" />
  </svg>
);

// ---------- scenes (art in an 847x840 box) ----------
const Skyline: React.FC<{lit?: number}> = ({lit = 0}) => (
  <g>
    <Tower x={20} y={560} w={110} h={260} c={P.teal} lit={lit} />
    <Tower x={140} y={560} w={90} h={190} c={P.deep} lit={lit} />
    <Tower x={520} y={560} w={130} h={340} c={P.rust} lit={lit} />
    <Tower x={660} y={560} w={110} h={250} c={P.teal} lit={lit} />
    <Tower x={770} y={560} w={80} h={180} c={P.deep} lit={lit} />
  </g>
);

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const q = spring({frame: f - 120, fps: FPS, config: {damping: 10}});
  return (
    <Stage active={-1} bg={<BgSunset f={f} />} caption="Lake-facing flat pasand aaya? Brochure nahi, NGT rules dekho." accent={P.orange}>
      <svg viewBox="0 0 847 840" width="847" height="840"><Defs />
        <Skyline lit={0.2} />
        <rect x="0" y="560" width="847" height="280" fill="url(#water)" />
        <Ripples x={560} y={590} w={420} f={f} />
        <polygon points="0,700 300,690 360,840 0,840" fill={P.navy} />
        <Palm x={60} y={705} s={1.1} c={P.navy} />
        <Person x={230} y={705} s={1.05} shirt={P.orange} pose="point" />
        <g transform="translate(560,120)">
          <rect x="-170" y="-20" width="340" height="230" fill={P.cream} transform="rotate(4)" />
          <text x="0" y="60" textAnchor="middle" fontFamily={SANS} fontWeight="700" fontSize="26" letterSpacing="6" fill={P.teal} transform="rotate(4)">BROCHURE</text>
          <text x="0" y="130" textAnchor="middle" fontFamily={SERIF} fontWeight="700" fontSize="58" fill={P.navy} transform="rotate(4)">Lake View</text>
          <g transform={`translate(130,10) scale(${q})`}><circle r="52" fill={P.orange} /><text y="24" textAnchor="middle" fontFamily={SERIF} fontWeight="700" fontSize="72" fill={P.cream}>?</text></g>
        </g>
      </svg>
    </Stage>
  );
};

const Rules: React.FC = () => {
  const f = useCurrentFrame();
  const t = f - CARD;
  const ring = interpolate(t, [30, 90], [0, 1], clamp);
  const tiersOn = t > s(9.5);
  const tiers = [{n: 'Primary', m: 50, c: P.rust}, {n: 'Secondary', m: 35, c: P.orange}, {n: 'Tertiary', m: 25, c: P.mustard}];
  return (
    <>
      <Stage active={0} bg={<BgFlat c={P.deep} f={f} />} accent={C.rules}
        caption={tiersOn ? 'Drain jitna bada, buffer utna bada.' : 'Lake ke 75m aur drain ke 25m: No-Construction Zone.'}>
        {!tiersOn ? (
          <svg viewBox="0 0 847 840" width="847" height="840"><Defs />
            <rect x="0" y="0" width="847" height="840" fill={P.sea} />
            {[[80, 140], [760, 120], [90, 700], [770, 720], [420, 790]].map(([x, y], i) => <Pine key={i} x={x} y={y} s={0.55} c={P.deep} />)}
            <ellipse cx="423" cy="420" rx={240 + 130 * ring} ry={170 + 100 * ring} fill={C.case} opacity={0.18 * ring} />
            <ellipse cx="423" cy="420" rx={240 + 130 * ring} ry={170 + 100 * ring} fill="none" stroke={P.orange} strokeWidth="7" strokeDasharray="24 14" opacity={ring} />
            <ellipse cx="423" cy="420" rx="240" ry="170" fill={P.navy} />
            <Ripples x={423} y={360} w={300} f={f} c={P.mist} n={5} />
            <g opacity={ring}>
              <line x1="663" y1="420" x2="793" y2="420" stroke={P.cream} strokeWidth="5" />
              <rect x="640" y="440" width="180" height="72" fill={P.orange} />
              <text x="730" y="490" textAnchor="middle" fontFamily={SERIF} fontWeight="700" fontSize="48" fill={P.cream}>75 m</text>
              <text x="423" y="440" textAnchor="middle" fontFamily={SANS} fontWeight="700" fontSize="34" letterSpacing="8" fill={P.cream}>NO BUILD</text>
            </g>
          </svg>
        ) : (
          <svg viewBox="0 0 847 840" width="847" height="840"><Defs />
            <rect x="0" y="0" width="847" height="300" fill={P.sea} />
            <polygon points="0,300 847,300 760,380 87,380" fill={P.navy} />
            <Ripples x={423} y={318} w={600} f={f} c={P.mist} n={3} />
            {tiers.map((x, i) => {
              const p = spring({frame: t - s(10) - i * 15, fps: FPS, config: {damping: 13}});
              return (
                <g key={x.n} opacity={p} transform={`translate(${20 + i * 275},${430 + (1 - p) * 50})`}>
                  <rect width="255" height="380" fill={x.c} />
                  <rect width="255" height="12" fill="#000" opacity=".2" />
                  <text x="127" y="80" textAnchor="middle" fontFamily={SANS} fontWeight="700" fontSize="28" letterSpacing="4" fill={P.cream}>{x.n.toUpperCase()}</text>
                  <text x="127" y="240" textAnchor="middle" fontFamily={SERIF} fontWeight="700" fontSize="128" fill={P.cream}>{x.m}</text>
                  <text x="127" y="320" textAnchor="middle" fontFamily={SANS} fontWeight="700" fontSize="34" letterSpacing="6" fill={P.navy}>METRES</text>
                </g>
              );
            })}
            <Pine x={90} y={290} s={0.6} c={P.deep} /><Pine x={760} y={290} s={0.7} c={P.deep} />
          </svg>
        )}
      </Stage>
      {f < CARD && <TitleCard k="rules" color={C.rules} n={1} />}
    </>
  );
};

const Risk: React.FC = () => {
  const f = useCurrentFrame();
  const t = f - CARD;
  const rise = interpolate(t, [20, 220], [0, 1], clamp);
  return (
    <>
      <Stage active={1} bg={<BgNight f={f} />} caption="Drain ke paas bane projects: illegal bhi, flood zone bhi." accent={C.risk}>
        <svg viewBox="0 0 847 840" width="847" height="840"><Defs />
          {['Varthur', 'Bellandur', 'ORR'].map((n, i) => {
            const p = spring({frame: t - 15 - i * 22, fps: FPS, config: {damping: 12}});
            return (
              <g key={n} opacity={p} transform={`translate(${i * 285},${(1 - p) * -30})`}>
                <rect width="265" height="86" fill={P.orange} />
                <text x="132" y="58" textAnchor="middle" fontFamily={SERIF} fontWeight="700" fontSize="44" fill={P.cream}>{n}</text>
              </g>
            );
          })}
          <Skyline lit={0.6} />
          <rect x="0" y={760 - rise * 260} width="847" height={80 + rise * 260} fill={P.sea} opacity=".92" />
          <rect x="0" y={760 - rise * 260} width="847" height="8" fill={P.mist} />
          <Ripples x={600} y={790 - rise * 240} w={360} f={f} c={P.sun} n={4} />
          <rect x="300" y={560} width="160" height="40" fill="url(#glow)" opacity=".6" />
        </svg>
      </Stage>
      {f < CARD && <TitleCard k="risk" color={C.risk} n={2} />}
    </>
  );
};

const Case: React.FC = () => {
  const f = useCurrentFrame();
  const t = f - CARD;
  const fine = spring({frame: t - 10, fps: FPS, config: {damping: 10}});
  const gavel = interpolate(t, [70, 80, 90], [-70, -18, -30], clamp);
  const stamps = [{l: 'CLEARANCE QUASHED', at: 160}, {l: 'CONSTRUCTION STAYED', at: 220}, {l: 'FLOOD RISK', at: 280}];
  return (
    <>
      <Stage active={2} bg={<BgFlat c={P.navy} f={f} />} caption="Mantri Techzone: buffer violation par ₹117 crore fine." accent={C.case}>
        <svg viewBox="0 0 847 840" width="847" height="840"><Defs />
          {/* courthouse */}
          <polygon points="40,120 300,30 560,120" fill={P.teal} />
          {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={70 + i * 100} y="135" width="40" height="230" fill={P.teal} />)}
          <rect x="40" y="365" width="520" height="30" fill={P.deep} />
          {/* gavel */}
          <g transform={`translate(660,170) rotate(${gavel})`}>
            <rect x="-14" y="0" width="28" height="200" fill={P.peach} />
            <rect x="-90" y="-50" width="180" height="70" fill={P.orange} />
            <rect x="-90" y="-50" width="180" height="16" fill="#000" opacity=".2" />
          </g>
          <rect x="560" y="370" width="200" height="28" fill={P.peach} />
          {/* fine */}
          <g transform={`translate(300,${300 - (1 - fine) * 40})`} opacity={fine}>
            <rect x="-210" y="-60" width="420" height="120" fill={P.cream} transform="rotate(-4)" />
            <text y="28" textAnchor="middle" fontFamily={SERIF} fontWeight="700" fontSize="84" fill={C.case} transform="rotate(-4)">₹117 Cr</text>
          </g>
          {stamps.map((x, i) => {
            const p = spring({frame: t - x.at, fps: FPS, config: {damping: 9, stiffness: 220}});
            return (
              <g key={x.l} opacity={Math.min(1, p)} transform={`translate(423,${520 + i * 104}) rotate(${i % 2 ? 2 : -2}) scale(${1.6 - 0.6 * p})`}>
                <rect x="-360" y="-44" width="720" height="84" fill="none" stroke={P.orange} strokeWidth="7" />
                <text y="16" textAnchor="middle" fontFamily={SANS} fontWeight="700" fontSize="44" letterSpacing="5" fill={P.orange}>{x.l}</text>
              </g>
            );
          })}
        </svg>
      </Stage>
      {f < CARD && <TitleCard k="case" color={C.case} n={3} />}
    </>
  );
};

const Doc: React.FC<{kind: number}> = ({kind}) => (
  <svg width="150" height="190" viewBox="0 0 150 190">
    <rect x="10" y="10" width="130" height="170" fill={P.cream} />
    <rect x="10" y="10" width="130" height="30" fill={kind === 0 ? C.rules : kind === 1 ? P.orange : C.case} />
    {kind === 0 && <g stroke={C.rules} strokeWidth="4" fill="none"><rect x="30" y="60" width="90" height="90" /><line x1="30" y1="105" x2="120" y2="105" /><line x1="75" y1="60" x2="75" y2="150" /></g>}
    {kind === 1 && <g><path d="M20,140 C50,90 80,150 130,70" stroke={P.sea} strokeWidth="10" fill="none" /><rect x="50" y="60" width="40" height="40" fill="none" stroke={P.orange} strokeWidth="5" strokeDasharray="8 5" /></g>}
    {kind === 2 && <g><circle cx="75" cy="130" r="30" fill={C.case} /><rect x="30" y="58" width="90" height="8" fill={P.teal} /><rect x="30" y="76" width="70" height="8" fill={P.teal} /></g>}
  </svg>
);

const Checks: React.FC = () => {
  const f = useCurrentFrame();
  const t = f - CARD;
  const items = [
    {h: 'Sanctioned Plan', b: '75 / 50 / 35 / 25m setback verify karo'},
    {h: 'BBMP Drain Map', b: 'Site boundary cross-check karo'},
    {h: 'Env. Clearance', b: 'Developer ke against NGT orders search karo'},
  ];
  return (
    <>
      <Stage active={3} bg={<BgFlat c={P.teal} f={f} />} caption="Booking se pehle yeh 3 checks zaroor karo." accent={C.checks}>
        <div style={{height: 840, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingTop: 10}}>
          {items.map((x, i) => {
            const p = spring({frame: t - 20 - i * 120, fps: FPS, config: {damping: 13}});
            return (
              <div key={x.h} style={{opacity: p, transform: `translateX(${(1 - p) * 80}px)`, height: 250, display: 'flex', alignItems: 'center', gap: 26, background: P.navy, borderLeft: `14px solid ${C.checks}`, padding: '0 26px'}}>
                <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 120, color: C.checks, width: 80}}>{i + 1}</div>
                <div style={{flex: 1}}>
                  <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 50, color: P.cream}}>{x.h}</div>
                  <div style={{fontFamily: SANS, fontSize: 31, lineHeight: 1.3, color: P.peach, marginTop: 8}}>{x.b}</div>
                </div>
                <Doc kind={i} />
              </div>
            );
          })}
        </div>
      </Stage>
      {f < CARD && <TitleCard k="checks" color={C.checks} n={4} />}
    </>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const cta = spring({frame: f - 60, fps: FPS, config: {damping: 12}});
  return (
    <Stage active={3} bg={<BgSunset f={f} />} caption="Lake view se zyada zaroori: aapke ghar ki legal security." accent={P.orange}>
      <svg viewBox="0 0 847 840" width="847" height="840"><Defs />
        <Skyline lit={0.4} />
        <rect x="0" y="560" width="847" height="120" fill="url(#water)" />
        <Ripples x={600} y={580} w={360} f={f} n={4} />
        <rect x="0" y="680" width="847" height="160" fill={P.navy} />
        <Person x={250} y={690} s={0.95} shirt={P.orange} />
        <Person x={330} y={690} s={0.85} shirt={P.mustard} flip />
        <g opacity={cta} transform={`translate(0,${(1 - cta) * 30})`}>
          <rect x="420" y="715" width="410" height="100" fill={P.orange} />
          <text x="625" y="760" textAnchor="middle" fontFamily={SANS} fontWeight="700" fontSize="26" letterSpacing="3" fill={P.cream}>MORE 99SHORTS ON</text>
          <text x="625" y="800" textAnchor="middle" fontFamily={SERIF} fontWeight="700" fontSize="40" fill={P.cream}>99acres</text>
        </g>
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
      return <Sequence key={x.id} from={START[x.id]} durationInFrames={s(x.d)}><Comp /></Sequence>;
    })}
  </AbsoluteFill>
);
