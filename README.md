# ninepatch-react

React component that renders Android nine-patch images with CSS `border-image`.

Built on top of [`ninepatch-core`](https://github.com/midi-zeng/ninepatch-core),
which supports both AAPT-compiled nine-patch PNGs (with an `npTc` chunk) and raw
nine-patch sources (with black guide borders).

## Installation

```sh
pnpm add ninepatch-react
```

## Usage

```tsx
import { NinePatch } from 'ninepatch-react'

// The image is parsed automatically
<NinePatch src="/images/btn.9.png">
  <button>Click me</button>
</NinePatch>

// Or provide the values manually (the image is not parsed)
<NinePatch
  customOptions={{
    padding: { top: 10, right: 20, bottom: 10, left: 20 },
    borderImageSlice: { top: 14, right: 151, bottom: 91, left: 14 },
    borderInset: 0
  }}
>
  <button>Click me</button>
</NinePatch>
```

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `src` | `string` | Nine-patch image URL (raw or compiled). |
| `customOptions` | `object` | Manual `padding` / `borderImageSlice` / `borderInset`; skips parsing. |
| `className` | `string` | Applied to the wrapper `div`. |
| `style` | `CSSProperties` | Merged into the wrapper `div` styles. |
| `children` | `ReactNode` | Content rendered inside the wrapper. |

The wrapper fills its parent height (`height: 100%`), so size the container.

## Development

```sh
pnpm install
pnpm dev            # demo playground (same as pnpm demo:dev)
pnpm test           # vitest + @testing-library/react
pnpm run lint       # oxlint
pnpm run typecheck  # tsc (library + demo)
pnpm run build      # vite build (es/cjs + d.ts)
pnpm run release    # build, bumpp (version + commit + tag + push), publish to npm
```

### Demo

A runnable playground lives in [`demo/`](./demo), built with the dedicated
[`vite.config.demo.ts`](./vite.config.demo.ts) at the repo root; it resolves
the library sources directly, so it always runs the latest local code.

```sh
pnpm demo:dev     # vite dev server
pnpm demo:build   # production build into demo/dist
pnpm demo:preview # serve the build
```

## Migrating from 1.x

- Rewritten in TypeScript and built with Vite (ESM + CJS + full types);
  the `prop-types` and `uuid` runtime dependencies are gone.
- The peer dependency is now `react >= 17`.
- The API is consolidated to `src` / `customOptions` / `className` / `style` /
  `children`; images are parsed automatically unless `customOptions` is set.

## License

MIT
