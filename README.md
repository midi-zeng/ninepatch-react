# ninepatch-vue

Vue 3 component that renders Android nine-patch images with CSS `border-image`.

Built on top of [`ninepatch-core`](https://github.com/midi-zeng/ninepatch-core),
which supports both AAPT-compiled nine-patch PNGs (with an `npTc` chunk) and raw
nine-patch sources (with black guide borders).

## Installation

```sh
npm install ninepatch-vue
```

## Usage

```vue
<script setup lang="ts">
import { NinePatch } from 'ninepatch-vue'
</script>

<template>
  <!-- The image is parsed automatically -->
  <NinePatch src="/images/btn.9.png">
    <button>Click me</button>
  </NinePatch>

  <!-- Or provide the values manually (the image is not parsed) -->
  <NinePatch
    :custom-options="{
      padding: { top: 10, right: 20, bottom: 10, left: 20 },
      borderImageSlice: { top: 14, right: 151, bottom: 91, left: 14 },
      clipPath: 0
    }"
  >
    <button>Click me</button>
  </NinePatch>
</template>
```

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `src` | `string` | Nine-patch image URL (raw or compiled). |
| `customOptions` | `object` | Manual `padding` / `borderImageSlice` / `clipPath`; skips parsing. |

Anything else (`class`, `style`, listeners) falls through to the wrapper div,
and content goes into the default slot. The wrapper fills its parent height
(`height: 100%`), so size the container.

## Development

```sh
npm install
npm test        # vitest + @vue/test-utils
npm run lint    # oxlint
npm run typecheck  # vue-tsc
npm run build   # vite build (es/cjs + d.ts)
```

## Migrating from 1.x

- Requires Vue 3; the component is now `<script setup lang="ts">` instead of
  `vue-property-decorator` class components.
- Same props (`src`, `customOptions`) and slot; class/style now fall through
  via attribute inheritance.

## License

MIT
