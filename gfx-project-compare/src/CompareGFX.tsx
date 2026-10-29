import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {fontFamily} from './fonts';
import {PROJECTS, ROWS, Row} from './data';

export const DURATION = 255; // 8.5 s @ 30 fps

// Palette: light, warm, single gold accent.
const C = {
  bg1: '#FFFDF8',
  bg2: '#FFF4DC',
  gold: '#FFD47B',
  goldDeep: '#9C6B00',
  ink: '#1E1A12',
  muted: '#7D7360',
  line: '#F0E3C4',
  card: '#FFFFFF',
};

// Safe zone x 116-963, y 410-1544. Content sits 12 px inside it so the
// slow camera drift (±6 px) never pushes anything out.
const SAFE = {x: 116, y: 410, w: 847, h: 1134};
const PAD = 12;
const BOX = {x: SAFE.x + PAD, y: SAFE.y + PAD, w: SAFE.w - PAD * 2, h: SAFE.h - PAD * 2};

// Timeline (frames)
const T = {
  title: 0,
  headers: 14,
  rows: 40,
  rowGap: 17,
  cellGap: 4,
  legend: 160,
};

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
      {/* faint dot grid, drifting */}
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
  const p = useEnter(T.title, 20);
  const bar = interpolate(frame, [T.title + 8, T.title + 30], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div style={{opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
      <div style={{fontSize: 22, fontWeight: 700, letterSpacing: 6, color: C.goldDeep, textTransform: 'uppercase'}}>
        Project Comparison
      </div>
      <div style={{fontSize: 62, fontWeight: 800, color: C.ink, letterSpacing: -1.5, lineHeight: 1.1, marginTop: 8}}>
        Which 2 BHK wins?
      </div>
      <div
        style={{
          marginTop: 16,
          height: 6,
          width: 120 * bar,
          borderRadius: 3,
          background: C.gold,
        }}
      />
    </div>
  );
};

const COL_GAP = 14;

const Headers: React.FC = () => (
  <div style={{display: 'flex', gap: COL_GAP}}>
    {PROJECTS.map((p, i) => (
      <HeaderCard key={i} i={i} line1={p.line1} line2={p.line2} />
    ))}
  </div>
);

const HeaderCard: React.FC<{i: number; line1: string; line2: string}> = ({i, line1, line2}) => {
  const p = useEnter(T.headers + i * 5, 15);
  return (
    <div
      style={{
        flex: 1,
        background: C.gold,
        borderRadius: 22,
        padding: '18px 20px',
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${(1 - p) * 40}px) scale(${0.92 + p * 0.08})`,
        boxShadow: '0 14px 30px -18px rgba(156,107,0,0.55)',
      }}
    >
      <div style={{fontSize: 17, fontWeight: 700, letterSpacing: 2, color: 'rgba(30,26,18,0.55)'}}>
        0{i + 1}
      </div>
      <div style={{fontSize: 29, fontWeight: 800, color: C.ink, lineHeight: 1.12, marginTop: 4, letterSpacing: -0.4}}>
        {line1}
        <br />
        {line2}
      </div>
    </div>
  );
};

const RowView: React.FC<{row: Row; index: number}> = ({row, index}) => {
  const frame = useCurrentFrame();
  const start = T.rows + index * T.rowGap;
  const labelIn = interpolate(frame, [start, start + 12], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 9, opacity: labelIn}}>
        <div style={{fontSize: 19, fontWeight: 700, letterSpacing: 3.5, color: C.goldDeep, textTransform: 'uppercase', whiteSpace: 'nowrap'}}>
          {row.label}
        </div>
        <div style={{flex: 1, height: 2, background: C.line, transformOrigin: 'left', transform: `scaleX(${labelIn})`}} />
      </div>
      <div style={{display: 'flex', gap: COL_GAP}}>
        {row.values.map((v, i) => (
          <Cell key={i} row={row} value={v} col={i} start={start + 3 + i * T.cellGap} />
        ))}
      </div>
    </div>
  );
};

const Cell: React.FC<{row: Row; value: string; col: number; start: number}> = ({row, value, col, start}) => {
  const frame = useCurrentFrame();
  const p = useEnter(start, 17);
  const isWin = row.win === col;
  const winStart = start + 14;
  const w = isWin ? interpolate(frame, [winStart, winStart + 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)}) : 0;
  const badgeIn = useEnter(winStart + 4, 12);
  const badge = isWin ? badgeIn : 0;
  const sweep = interpolate(frame, [winStart + 6, winStart + 30], [-60, 160], clamp);

  return (
    <div
      style={{
        flex: 1,
        position: 'relative',
        borderRadius: 18,
        padding: row.kind === 'big' ? '14px 18px 13px' : '15px 18px',
        background: isWin ? `rgba(255,212,123,${0.22 + w * 0.78})` : C.card,
        border: `2px solid ${isWin && w > 0 ? C.gold : C.line}`,
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - p) * 26}px)`,
        boxShadow: isWin
          ? `0 16px 30px -18px rgba(156,107,0,${0.65 * w})`
          : '0 10px 24px -20px rgba(80,60,10,0.35)',
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {isWin && (
        <div style={{position: 'absolute', inset: 0, borderRadius: 16, overflow: 'hidden', pointerEvents: 'none'}}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '45%',
              left: `${sweep}%`,
              background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0) 100%)',
            }}
          />
        </div>
      )}
      {row.kind === 'big' ? (
        <>
          <div style={{fontSize: 33, fontWeight: 800, color: C.ink, letterSpacing: -0.8, lineHeight: 1.12, whiteSpace: 'nowrap', position: 'relative'}}>
            {value}
          </div>
          {row.unit && (
            <div style={{fontSize: 19, fontWeight: 600, color: isWin ? 'rgba(30,26,18,0.7)' : C.muted, marginTop: 2, position: 'relative'}}>
              {row.unit}
            </div>
          )}
        </>
      ) : (
        <div style={{fontSize: 22, fontWeight: 600, color: C.ink, lineHeight: 1.3, position: 'relative'}}>{value}</div>
      )}
      {isWin && row.badge && (
        <div
          style={{
            position: 'absolute',
            top: -13,
            right: 12,
            background: C.ink,
            color: C.gold,
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 1.8,
            textTransform: 'uppercase',
            padding: '5px 11px',
            borderRadius: 20,
            transform: `scale(${badge})`,
            transformOrigin: 'right center',
          }}
        >
          ★ {row.badge}
        </div>
      )}
    </div>
  );
};

const Legend: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [T.legend, T.legend + 15], [0, 1], clamp);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 10, opacity: o, fontSize: 18, fontWeight: 600, color: C.muted}}>
      <div style={{width: 18, height: 18, borderRadius: 6, background: C.gold}} />
      Highlighted = best in that category
    </div>
  );
};

export const CompareGFX: React.FC<{showSafe?: boolean}> = ({showSafe}) => {
  const frame = useCurrentFrame();
  // slow camera drift so no frame is ever static
  const driftY = interpolate(frame, [0, DURATION], [5, -5]);
  const driftX = Math.sin(frame / 60) * 2;
  const zoom = interpolate(frame, [0, DURATION], [1, 1.008]);

  return (
    <AbsoluteFill style={{fontFamily}}>
      <Background />
      <div
        style={{
          position: 'absolute',
          left: BOX.x,
          top: BOX.y,
          width: BOX.w,
          height: BOX.h,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transform: `translate(${driftX}px, ${driftY}px) scale(${zoom})`,
          transformOrigin: '50% 50%',
        }}
      >
        <Title />
        <Headers />
        {ROWS.map((r, i) => (
          <RowView key={i} row={r} index={i} />
        ))}
        <Legend />
      </div>
      {showSafe && (
        <div
          style={{
            position: 'absolute',
            left: SAFE.x,
            top: SAFE.y,
            width: SAFE.w,
            height: SAFE.h,
            outline: '3px dashed red',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
