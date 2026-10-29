import {Composition} from 'remotion';
import {CompareGFX, DURATION, FPS} from './CompareGFX';
import {Hook, HOOK_FPS, HOOK_SECONDS} from './hook/Hook';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="CompareGFX"
      component={CompareGFX}
      durationInFrames={(DURATION * FPS) / 30}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{showSafe: false}}
    />
    <Composition
      id="Hook"
      component={Hook}
      durationInFrames={Math.ceil(HOOK_SECONDS * HOOK_FPS)}
      fps={HOOK_FPS}
      width={1080}
      height={1920}
      defaultProps={{showSafe: false}}
    />
  </>
);
