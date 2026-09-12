# Modernization history

This project started as a CSS3-era 3D gallery: thumbnails sat in a fixed-size strip, jQuery reordered the selected image, and WebKit-prefixed transforms rotated the gallery upward to reveal a full-size image.

The 2026 refresh keeps the same idea, but uses the browser platform features that have become practical since then.

## What changed

| Area | Original approach | Modern approach |
| --- | --- | --- |
| Markup | Generic `div`, `ul`, `li`, and image `rel` attributes | Semantic sections, figure/caption content, real buttons, and `data-*` metadata |
| JavaScript | jQuery event handlers and DOM reordering | Small vanilla JS controller that updates state |
| 3D transforms | `-webkit-transform` and `-webkit-perspective` only | Standard `transform`, `perspective`, `transform-style`, and typed CSS variables |
| Image swaps | Direct `src` update | `document.startViewTransition()` enhancement with a normal fallback |
| Layout | Fixed 600px gallery assumptions | Responsive scene with container queries, a page-level container, and viewport fallbacks |
| Immersive view | WebKit cube flip that rotated the stage to `#bottom` | Modal `<dialog>` tilt lightbox; captions stay in document flow inside the overlay |
| Thumbnails | Dot links and hidden text | Scroll Snap-capable thumbnail rail with visible labels |
| Motion preferences | Always animates | `prefers-reduced-motion` disables heavy movement |
| Performance | All content renders at once | Native image loading hints and `content-visibility` for secondary content |

## Modern platform ideas used

- `@property` registers `--tilt-x`, `--tilt-y`, and `--stage-depth` so the 3D scene can animate custom values predictably.
- CSS Cascade Layers keep reset, base, layout, component, and motion rules organized without a build step.
- OKLCH and `color-mix()` provide richer color control with plain CSS fallbacks.
- Container queries make the gallery respond to its own width instead of the viewport alone.
- CSS Scroll Snap gives the thumbnail rail native carousel behavior on narrow layouts.
- View Transitions animate selected image changes when the browser supports them.
- `prefers-reduced-motion` keeps the same content available without the dramatic 3D movement.

## Good next experiments

1. Add a pure CSS scroll-driven cover-flow section using `animation-timeline: view()`.
2. Try cross-document View Transitions if the project grows beyond one page.
3. Add HTML Popover API controls for image details, EXIF data, or author notes.
4. Use responsive `srcset` image variants when larger production assets are available.
5. Explore CSS anchor positioning for thumbnail callouts or floating gallery controls.
