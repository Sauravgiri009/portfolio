import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
const url = await bundle({entryPoint: new URL('../src/index.ts', import.meta.url).pathname});
const comp = await selectComposition({serveUrl: url, id: 'Main', browserExecutable: '/opt/pw-browsers/chromium'});
const fr = [60, 200, 360, 700, 900, 1200, 1300, 1500, 1620, 1900, 2050, 2300];
for (const f of fr) await renderStill({composition: comp, serveUrl: url, frame: f, output: `stills/f${String(f).padStart(4,'0')}.png`, scale: 0.4, browserExecutable: '/opt/pw-browsers/chromium', chromiumOptions: {gl: 'swangle'}});
console.log('done');
