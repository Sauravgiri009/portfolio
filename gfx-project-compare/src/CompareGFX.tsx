import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {fontFamily} from './fonts';
import {PROJECTS, ROWS, Row} from './data';

// Palette: light, warm, single gold accent.
const C = {
  bg1: '#FFFDF8',
  bg2: '#FFF4DC',
  gold: '#FFD47B',
  goldDeep: '#9C6B00',
  ink: '#1E1A12',
  muted: '#6B6250',
  line: '#F0E3C4',
  card: '#FFFFFF',
};

// Content box: wider than the strict 99Shorts safe zone (user asked for
// phone legibility over margins). The 99Shorts zone is drawn by showSafe.
const SAFE = {x: 116, y: 410, w: 847, h: 1134};
const BOX = {x: 60, w: 960};
const Y = {head: 330, tracker: 486, solo: 580, table: 486, bottom: 1590};

// Timeline (frames @ 30 fps): one scene per project, then the full table.
const SCENE = 66;
const STARTS = [0, 62, 124];
const FINAL = 186;
export const DURATION = 270; // 9 s

const ROW = {area: 0, price: 1, feature: 2, construction: 3, builder: 4, possession: 5};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const useEnter = (start: number, damping = 18) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - start, fps, config: {damping, mass: 0.7, stiffness: 120}});
};

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / DURATION;
  return (
    <AbsoluteFill style={{background: `linear-gradient(165deg, ${C.bg1} 0%, ${C.bg1} 45%, ${C.bg2} 100%)`}}>
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 1100,
          borderRadius: '50%',
          left: 420 - t * 120,
          top: -380 + t * 90,
          background: `radial-gradient(circle, ${C.gold}55 0%, ${C.gold}00 65%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 1000,
          height: 1000,
          borderRadius: '50%',
          left: -520 + t * 140,
          top: 1180 - t * 110,
          background: `radial-gradient(circle, ${C.gold}45 0%, ${C.gold}00 65%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${C.goldDeep}1F 1.6px, transparent 1.6px)`,
          backgroundSize: '36px 36px',
          backgroundPosition: `${t * 36}px ${t * 72}px`,
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, black 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, black 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useEnter(0, 20);
  const bar = interpolate(frame, [8, 30], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', left: BOX.x, top: Y.head, width: BOX.w, opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
      <div style={{fontSize: 28, fontWeight: 700, letterSpacing: 0.5, color: C.goldDeep}}>2 BHK Comparison</div>
      <div style={{fontSize: 66, fontWeight: 800, color: C.ink, letterSpacing: -1.5, lineHeight: 1.1, marginTop: 2}}>
        Which 2 BHK Wins?
      </div>
      <div style={{marginTop: 12, height: 6, width: 130 * bar, borderRadius: 3, background: C.gold}} />
    </div>
  );
};

// Progress tracker for the per-project scenes; fades out when the table takes over.
const Tracker: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useEnter(6, 18);
  const out = interpolate(frame, [FINAL - 6, FINAL + 4], [0, 1], clamp);
  const active = frame < STARTS[1] ? 0 : frame < STARTS[2] ? 1 : 2;
  return (
    <div
      style={{
        position: 'absolute',
        left: BOX.x,
        top: Y.tracker,
        width: BOX.w,
        display: 'flex',
        gap: 14,
        opacity: p * (1 - out),
        transform: `translateY(${(1 - p) * 20 - out * 20}px)`,
      }}
    >
      {PROJECTS.map((pr, i) => {
        const on = i === active;
        const done = i < active;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: 62,
              borderRadius: 31,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              fontSize: 25,
              fontWeight: 700,
              background: on ? C.gold : done ? '#FFF1D2' : C.card,
              border: `2px solid ${on ? C.gold : C.line}`,
              color: on ? C.ink : C.muted,
              boxShadow: on ? '0 12px 24px -16px rgba(156,107,0,0.7)' : 'none',
            }}
          >
            <span style={{opacity: 0.6}}>0{i + 1}</span>
            {pr.short}
          </div>
        );
      })}
    </div>
  );
};

const Badge: React.FC<{text: string; scale: number; style?: React.CSSProperties}> = ({text, scale, style}) => (
  <div
    style={{
      background: C.ink,
      color: C.gold,
      fontSize: 22,
      fontWeight: 800,
      padding: '6px 14px',
      borderRadius: 20,
      whiteSpace: 'nowrap',
      transform: `scale(${scale})`,
      transformOrigin: 'right center',
      ...style,
    }}
  >
    ★ {text}
  </div>
);

const Shimmer: React.FC<{start: number; radius: number}> = ({start, radius}) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [start, start + 24], [-60, 160], clamp);
  return (
    <div style={{position: 'absolute', inset: 0, borderRadius: radius, overflow: 'hidden', pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '45%',
          left: `${x}%`,
          background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0) 100%)',
        }}
      />
    </div>
  );
};

// ---------- Per-project scene ----------

const Tile: React.FC<{row: Row; col: number; start: number; label?: string}> = ({row, col, start, label}) => {
  const frame = useCurrentFrame();
  const p = useEnter(start, 17);
  const isWin = row.win === col;
  const winStart = start + 12;
  const w = isWin ? interpolate(frame, [winStart, winStart + 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)}) : 0;
  const badgeIn = useEnter(winStart + 4, 12);
  const big = row.kind === 'big';
  return (
    <div
      style={{
        flex: 1,
        position: 'relative',
        borderRadius: 26,
        padding: '30px 30px',
        background: isWin ? `rgba(255,212,123,${0.22 + w * 0.78})` : C.card,
        border: `2px solid ${isWin && w > 0 ? C.gold : C.line}`,
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - p) * 30}px)`,
        boxShadow: isWin ? `0 18px 34px -20px rgba(156,107,0,${0.7 * w})` : '0 12px 28px -22px rgba(80,60,10,0.4)',
      }}
    >
      {isWin && <Shimmer start={winStart + 6} radius={24} />}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', minHeight: 40}}>
        <div style={{fontSize: 29, fontWeight: 700, color: isWin ? 'rgba(30,26,18,0.75)' : C.goldDeep}}>{label ?? row.label}</div>
        {isWin && row.badge && <Badge text={row.badge} scale={badgeIn} />}
      </div>
      {big ? (
        <div style={{position: 'relative', marginTop: 8}}>
          <div style={{fontSize: 72, fontWeight: 800, color: C.ink, letterSpacing: -1.8, lineHeight: 1.08, whiteSpace: 'nowrap'}}>
            {row.values[col]}
          </div>
          {row.unit && <div style={{fontSize: 30, fontWeight: 600, color: isWin ? 'rgba(30,26,18,0.75)' : C.muted, marginTop: 2}}>{row.unit}</div>}
        </div>
      ) : (
        <div style={{position: 'relative', marginTop: 10, fontSize: 39, fontWeight: 700, color: C.ink, lineHeight: 1.22, letterSpacing: -0.4}}>
          {row.values[col]}
        </div>
      )}
    </div>
  );
};

const ProjectScene: React.FC<{i: number; last: boolean}> = ({i, last}) => {
  const frame = useCurrentFrame();
  const enter = useEnter(i === 0 ? 8 : 0, 20);
  const exitLen = last ? 8 : 10;
  const exit = interpolate(frame, [SCENE - exitLen, SCENE], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const pr = PROJECTS[i];
  const d = i === 0 ? 10 : 3; // first scene waits for the title
  return (
    <div
      style={{
        position: 'absolute',
        left: BOX.x,
        top: Y.solo,
        width: BOX.w,
        height: Y.bottom - Y.solo,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 26,
        opacity: Math.min(1, enter * 1.3) * (1 - exit),
        transform: `translateX(${(1 - enter) * 110 - exit * (last ? 0 : 110)}px) scale(${1 - exit * (last ? 0.06 : 0)})`,
      }}
    >
      <div style={{marginBottom: 8}}>
        <div style={{fontSize: 29, fontWeight: 700, color: C.goldDeep}}>Project 0{i + 1}</div>
        <div style={{fontSize: 80, fontWeight: 800, color: C.ink, letterSpacing: -2.2, lineHeight: 1.08, marginTop: 4}}>
          {pr.line1} {pr.line2}
        </div>
        <div style={{fontSize: 33, fontWeight: 600, color: C.muted, marginTop: 8}}>By {ROWS[ROW.builder].values[i]}</div>
      </div>
      <div style={{display: 'flex', gap: 24}}>
        <Tile row={ROWS[ROW.area]} col={i} start={d} label="Carpet Area" />
        <Tile row={ROWS[ROW.price]} col={i} start={d + 4} />
      </div>
      <div style={{display: 'flex', gap: 24}}>
        <Tile row={ROWS[ROW.possession]} col={i} start={d + 8} />
        <Tile row={ROWS[ROW.construction]} col={i} start={d + 12} label="Construction" />
      </div>
      <div style={{display: 'flex'}}>
        <Tile row={ROWS[ROW.feature]} col={i} start={d + 16} />
      </div>
    </div>
  );
};

// ---------- Final comparison table ----------

const COL_GAP = 16;
const T = {headers: 0, rows: 10, rowGap: 7, cellGap: 3, legend: 60};

const HeaderCard: React.FC<{i: number}> = ({i}) => {
  const p = useEnter(T.headers + i * 3, 15);
  const pr = PROJECTS[i];
  return (
    <div
      style={{
        flex: 1,
        background: C.gold,
        borderRadius: 22,
        padding: '14px 18px',
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${(1 - p) * 30}px) scale(${0.94 + p * 0.06})`,
        boxShadow: '0 14px 30px -18px rgba(156,107,0,0.55)',
      }}
    >
      <div style={{fontSize: 21, fontWeight: 700, color: 'rgba(30,26,18,0.6)'}}>0{i + 1}</div>
      <div style={{fontSize: 33, fontWeight: 800, color: C.ink, lineHeight: 1.1, marginTop: 2, letterSpacing: -0.5}}>
        {pr.line1}
        <br />
        {pr.line2}
      </div>
    </div>
  );
};

const Cell: React.FC<{row: Row; col: number; start: number}> = ({row, col, start}) => {
  const frame = useCurrentFrame();
  const p = useEnter(start, 17);
  const isWin = row.win === col;
  const winStart = start + 10;
  const w = isWin ? interpolate(frame, [winStart, winStart + 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)}) : 0;
  const badgeIn = useEnter(winStart + 4, 12);
  return (
    <div
      style={{
        flex: 1,
        position: 'relative',
        borderRadius: 18,
        padding: '12px 16px',
        background: isWin ? `rgba(255,212,123,${0.22 + w * 0.78})` : C.card,
        border: `2px solid ${isWin && w > 0 ? C.gold : C.line}`,
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - p) * 22}px)`,
        boxShadow: isWin ? `0 16px 30px -18px rgba(156,107,0,${0.65 * w})` : '0 10px 24px -20px rgba(80,60,10,0.35)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {isWin && <Shimmer start={winStart + 6} radius={16} />}
      {row.kind === 'big' ? (
        <>
          <div style={{fontSize: 40, fontWeight: 800, color: C.ink, letterSpacing: -1, lineHeight: 1.1, whiteSpace: 'nowrap', position: 'relative'}}>
            {row.values[col]}
          </div>
          {row.unit && (
            <div style={{fontSize: 24, fontWeight: 600, color: isWin ? 'rgba(30,26,18,0.75)' : C.muted, marginTop: 2, position: 'relative'}}>
              {row.unit}
            </div>
          )}
        </>
      ) : (
        <div style={{fontSize: 27, fontWeight: 600, color: C.ink, lineHeight: 1.24, position: 'relative'}}>{row.values[col]}</div>
      )}
      {isWin && row.badge && <Badge text={row.badge} scale={badgeIn} style={{position: 'absolute', top: -31, right: 10, fontSize: 20}} />}
    </div>
  );
};

const TableRow: React.FC<{row: Row; index: number}> = ({row, index}) => {
  const frame = useCurrentFrame();
  const start = T.rows + index * T.rowGap;
  const labelIn = interpolate(frame, [start, start + 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8, opacity: labelIn}}>
        <div style={{fontSize: 26, fontWeight: 700, color: C.goldDeep, whiteSpace: 'nowrap'}}>{row.label}</div>
        <div style={{flex: 1, height: 2, background: C.line, transformOrigin: 'left', transform: `scaleX(${labelIn})`}} />
      </div>
      <div style={{display: 'flex', gap: COL_GAP}}>
        {row.values.map((_, i) => (
          <Cell key={i} row={row} col={i} start={start + 2 + i * T.cellGap} />
        ))}
      </div>
    </div>
  );
};

const FinalTable: React.FC = () => {
  const frame = useCurrentFrame();
  const legend = interpolate(frame, [T.legend, T.legend + 12], [0, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: BOX.x,
        top: Y.table,
        width: BOX.w,
        height: Y.bottom - Y.table,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{display: 'flex', gap: COL_GAP}}>
        {PROJECTS.map((_, i) => (
          <HeaderCard key={i} i={i} />
        ))}
      </div>
      {ROWS.map((r, i) => (
        <TableRow key={i} row={r} index={i} />
      ))}
      <div style={{display: 'flex', alignItems: 'center', gap: 10, opacity: legend, fontSize: 24, fontWeight: 600, color: C.muted}}>
        <div style={{width: 20, height: 20, borderRadius: 6, background: C.gold}} />
        Highlighted = Best In That Category
      </div>
    </div>
  );
};

export const CompareGFX: React.FC<{showSafe?: boolean}> = ({showSafe}) => {
  const frame = useCurrentFrame();
  // slow camera drift so no frame is ever static
  const driftY = interpolate(frame, [0, DURATION], [4, -4]);
  const driftX = Math.sin(frame / 60) * 2;

  return (
    <AbsoluteFill style={{fontFamily}}>
      <Background />
      <AbsoluteFill style={{transform: `translate(${driftX}px, ${driftY}px)`}}>
        <Title />
        <Tracker />
        {STARTS.map((s, i) => (
          <Sequence key={i} from={s} durationInFrames={SCENE} layout="none">
            <ProjectScene i={i} last={i === STARTS.length - 1} />
          </Sequence>
        ))}
        <Sequence from={FINAL} layout="none">
          <FinalTable />
        </Sequence>
      </AbsoluteFill>
      {showSafe && (
        <>
          <div style={{position: 'absolute', left: SAFE.x, top: SAFE.y, width: SAFE.w, height: SAFE.h, outline: '3px dashed red'}} />
          <div
            style={{position: 'absolute', left: BOX.x, top: Y.head, width: BOX.w, height: Y.bottom - Y.head, outline: '3px dashed blue'}}
          />
        </>
      )}
    </AbsoluteFill>
  );
};
