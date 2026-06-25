# AM Lottie Web

A TypeScript fork of Airbnb's [lottie-web](https://github.com/airbnb/lottie-web), maintained for the [Aarstein Media dotLottie player ecosystem](https://www.aarstein.media/en/dotlottie-player).

## Why this fork exists

- **Safer expressions** — After Effects expressions are evaluated without `eval`, which improves security and performance.
- **SSR-friendly** — Browser and Web API usage is guarded for Node and server rendering.
- **Better errors** — Failures surface through typed events instead of failing silently.

This package is primarily built for [`@aarsteinmedia/dotlottie-player`](https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player) and [`@aarsteinmedia/dotlottie-react`](https://www.npmjs.com/package/@aarsteinmedia/dotlottie-react). Other use cases are supported, but inherited from upstream lottie-web behavior.

## Installation

```bash
pnpm add @aarsteinmedia/lottie-web
```

If you use the dotLottie entry point, install the peer dependency as well:

```bash
pnpm add fflate
```

## Entry points

| Import | Description |
| --- | --- |
| `@aarsteinmedia/lottie-web` | Full build: SVG + canvas renderers, effects, and expressions |
| `@aarsteinmedia/lottie-web/light` | SVG renderer only, no expressions |
| `@aarsteinmedia/lottie-web/svg` | SVG renderer with expressions |
| `@aarsteinmedia/lottie-web/canvas` | Canvas renderer with expressions |
| `@aarsteinmedia/lottie-web/utils` | Shared helpers and enums |
| `@aarsteinmedia/lottie-web/dotlottie` | dotLottie archive utilities |

## Basic usage

```ts
import lottie, { loadAnimation } from '@aarsteinmedia/lottie-web'
import type { AnimationItem } from '@aarsteinmedia/lottie-web'
import { PlayerEvent } from '@aarsteinmedia/lottie-web/utils'

const container = document.getElementById('animation')

const animation: AnimationItem = loadAnimation({
  container,
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: '/animations/hero.json',
})

animation.addEventListener(PlayerEvent.Complete, () => {
  console.log('Animation finished')
})

// Later
animation.destroy()
```

### Inline animation data

```ts
import animationData from './animation.json'

const animation = loadAnimation({
  container: document.getElementById('animation'),
  renderer: 'svg',
  animationData,
  autoplay: false,
})
```

### SVG-only bundle (smaller)

```ts
import lottie from '@aarsteinmedia/lottie-web/svg'
```

## Events

`AnimationItem` extends a small event emitter. Common events include:

| Event | When it fires |
| --- | --- |
| `DOMLoaded` | Animation is ready to play |
| `enterFrame` | Each rendered frame |
| `complete` | Playback reached the end |
| `loopComplete` | A loop iteration finished |
| `configError` | Invalid configuration or data |
| `renderFrameError` | A frame failed to render |
| `destroy` | Animation is being torn down |

Import event names from `@aarsteinmedia/lottie-web/utils`:

```ts
import { PlayerEvent } from '@aarsteinmedia/lottie-web/utils'

animation.addEventListener(PlayerEvent.RenderFrameError, (event) => {
  console.error(event?.nativeError)
})
```

## Development

```bash
pnpm install
pnpm dev        # preview player with live reload
pnpm lint       # eslint
pnpm test       # vitest
pnpm prod       # typecheck + production build
pnpm check      # lint, test, build, and verify version injection
```

Sample Lottie JSON files live in [`assets/`](./assets) and are used by the preview app and test suite.

## License

GPL-2.0-or-later. See upstream lottie-web licensing implications if you distribute combined or derivative works.
