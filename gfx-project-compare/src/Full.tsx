import {AbsoluteFill, Series} from 'remotion';
import {CompareGFX, DURATION, FPS} from './CompareGFX';
import {Hook, HOOK_FPS, HOOK_SECONDS, Wipe} from './hook/Hook';

// Full short: hook (with VO) followed by the comparison GFX, joined by the gold wipe.
export const HOOK_FRAMES = Math.ceil(HOOK_SECONDS * HOOK_FPS);
export const GFX_FRAMES = (DURATION * FPS) / 30;

export const Full: React.FC = () => (
  <AbsoluteFill>
    <Series>
      <Series.Sequence durationInFrames={HOOK_FRAMES}>
        <Hook />
      </Series.Sequence>
      <Series.Sequence durationInFrames={GFX_FRAMES}>
        <CompareGFX />
      </Series.Sequence>
    </Series>
    <Wipe at={HOOK_FRAMES / HOOK_FPS} />
  </AbsoluteFill>
);
