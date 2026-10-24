import {getStaticFiles} from '@remotion/studio';

// Scene images are picked up automatically from public/assets/photos/.
// Name them after the scene: hook, rules, risk (or risk-bellandur), case, checks, outro
// (.jpg / .jpeg / .png / .webp). A found image replaces that scene's vector art.
const NAMES: Record<string, string[]> = {
  hook: ['hook'],
  rules: ['rules'],
  risk: ['risk', 'risk-bellandur'],
  case: ['case'],
  checks: ['checks'],
  outro: ['outro'],
};
const EXT = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG'];

// optional per-scene crop point (0 = top, 100 = bottom)
const FOCUS_Y: Record<string, number> = {};

const files = new Set(getStaticFiles().map((f) => f.name));

export const ASSETS: Record<string, {src: string; focusY?: number} | null> = Object.fromEntries(
  Object.entries(NAMES).map(([id, names]) => {
    for (const n of names) for (const e of EXT) {
      const src = `assets/photos/${n}.${e}`;
      if (files.has(src)) return [id, {src, focusY: FOCUS_Y[id]}];
    }
    return [id, null];
  })
);
