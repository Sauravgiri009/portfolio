# 2 BHK comparison GFX

1080x1920, 60 fps, 9 s. Light theme, accent `#FFD47B`. Each project gets its own card (about 2 s each), then all three load into one table. Content uses x 60-1020, y 330-1590 for phone legibility.

```bash
npm install
npm run dev     # preview in Remotion Studio
npm run build   # renders out/compare-gfx.mp4
```

Table data lives in `src/data.ts`; timings and colours are at the top of `src/CompareGFX.tsx`.

## Hook (`Hook` composition)

9.67 s, 60 fps, VO mixed in from `public/hook/vo.m4a`. Phrase timings are in `vo_words.txt`.

```bash
npx remotion render Hook out/hook.mp4
```

