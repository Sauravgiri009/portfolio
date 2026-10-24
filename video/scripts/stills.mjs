import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
const url = await bundle({entryPoint: new URL('../src/index.ts', import.meta.url).pathname});
const comp = await selectComposition({serveUrl: url, id: 'Main', browserExecutable: '/opt/pw-browsers/chromium'});
const fr = [120, 310, 400, 500, 930, 1000, 1480, 2000];
for (const f of fr) await renderStill({composition: comp, serveUrl: url, frame: f, output: `stills/f${String(f).padStart(4,'0')}.png`, scale: 0.4, browserExecutable: '/opt/pw-browsers/chromium', chromiumOptions: {gl: 'swangle'}});
console.log('done');
