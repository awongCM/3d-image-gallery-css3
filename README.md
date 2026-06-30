# Modern 3D CSS Gallery

A plain HTML, CSS, and vanilla JavaScript image gallery that updates the original CSS3 3D slideshow idea for modern browsers.

The gallery now includes:

- semantic thumbnail buttons and accessible state
- responsive layout with container queries
- Scroll Snap thumbnail navigation on smaller screens
- animatable CSS custom properties with `@property`
- View Transition-enhanced image swaps where supported
- reduced-motion fallbacks

## Running locally

Serve the repository root over HTTP:

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080/`.

## Background

See `docs/modernization-history.md` for notes comparing the original CSS3-era implementation with the 2026 refresh.