import {Composition} from 'remotion';
import {CompareGFX, DURATION, FPS} from './CompareGFX';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="CompareGFX"
    component={CompareGFX}
    durationInFrames={(DURATION * FPS) / 30}
    fps={FPS}
    width={1080}
    height={1920}
    defaultProps={{showSafe: false}}
  />
);
