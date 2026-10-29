import {Composition} from 'remotion';
import {CompareGFX, DURATION} from './CompareGFX';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="CompareGFX"
    component={CompareGFX}
    durationInFrames={DURATION}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{showSafe: false}}
  />
);
