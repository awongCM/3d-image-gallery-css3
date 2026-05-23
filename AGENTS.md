## Cursor Cloud specific instructions

This is a static HTML/CSS/JS project (3D CSS3 Gallery Slideshow) with **no build step, no package manager, and no dependencies to install**.

### Running the application

Serve the project root over HTTP:

```
python3 -m http.server 8080
```

Then open `http://localhost:8080/` in a browser.

### Notes

- There are no linters, test frameworks, or build tools configured in this project.
- The CSS3 3D transforms use `-webkit-` prefixed properties; they work in Chrome/Chromium.
- jQuery is vendored locally at `scripts/jquery.js` — no CDN or npm dependency.
