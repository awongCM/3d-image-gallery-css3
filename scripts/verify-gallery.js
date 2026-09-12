#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles/screen.css"), "utf8");
const js = fs.readFileSync(path.join(root, "scripts/gallery.js"), "utf8");

const failures = [];

function check(name, condition, detail) {
	if (!condition) {
		failures.push(`${name}: ${detail}`);
	}
}

function blockAfter(source, pattern) {
	const match = source.match(pattern);
	if (!match) {
		return "";
	}

	const open = source.indexOf("{", match.index);
	let depth = 0;

	for (let index = open; index < source.length; index += 1) {
		if (source[index] === "{") {
			depth += 1;
		} else if (source[index] === "}") {
			depth -= 1;
			if (depth === 0) {
				return source.slice(open + 1, index);
			}
		}
	}

	return "";
}

const galleryOpenTag = html.match(/<(section|dialog)\b[^>]*id="gallery"[^>]*>/i)?.[0] ?? "";
check(
	"gallery is a dialog",
	/^<dialog\b/i.test(galleryOpenTag),
	"Immersive mode needs a native <dialog id=\"gallery\"> so focus is trapped and the rest of the page is inert."
);

check(
	"page shell is a container",
	/\.page-shell\s*\{[^}]*container-type:\s*inline-size/.test(css),
	".page-shell must set container-type so notes (outside .gallery-frame) can respond to container queries."
);

const mediaBlock = blockAfter(css, /@media\s*\(max-width:\s*860px\)/);
check(
	"notes grid has a viewport fallback",
	/\.note-grid[\s\S]*grid-template-columns:\s*1fr/.test(mediaBlock),
	"@media (max-width: 860px) must collapse .note-grid to one column when container queries do not apply."
);

check(
	"immersive mode uses showModal",
	/\.showModal\s*\(/.test(js),
	"gallery.js must call showModal() so immersive view is a true modal dialog."
);

check(
	"dialog is restored after close",
	/\.show\s*\(/.test(js),
	"gallery.js must call show() after the modal closes so the gallery stays visible in the page."
);

const hoverRail = /:modal[\s\S]{0,240}\.thumbnail-panel:hover|:is-immersive[\s\S]{0,240}\.thumbnail-panel:hover/.test(css)
	&& /thumbnail-panel:hover[\s\S]{0,160}opacity:\s*1/.test(css);
const modalRail = blockAfter(css, /\.gallery-frame:modal\s+\.thumbnail-panel\b|\.gallery-frame\.is-immersive\s+\.thumbnail-panel\b/);
const railAlwaysVisible = /opacity:\s*1/.test(modalRail) && !/opacity:\s*0\./.test(modalRail);

check(
	"immersive thumbnail rail is usable without hover",
	railAlwaysVisible && !hoverRail,
	"Immersive/modal .thumbnail-panel must stay fully visible instead of revealing on :hover."
);

const modalCaption = blockAfter(css, /\.gallery-frame:modal\s+\.featured-card\s+figcaption\b|\.gallery-frame\.is-immersive\s+\.featured-card\s+figcaption\b/);
check(
	"immersive caption stays in document flow",
	/position:\s*static/.test(modalCaption) && !/translateZ\(72px\)/.test(modalCaption),
	"Immersive figcaption must be position: static (no overlapping translateZ) so it cannot sit under the rail or clip out of the overlay."
);

const modalImageWrap = blockAfter(css, /\.gallery-frame:modal\s+\.image-wrap\b|\.gallery-frame\.is-immersive\s+\.image-wrap\b/);
check(
	"immersive image is sized to the overlay",
	modalImageWrap.length > 0 && !/\d+vh/.test(modalImageWrap),
	"Immersive .image-wrap must not use magic vh heights; size it to the dialog overlay instead."
);

check(
	"inline dialog stays in document flow",
	/\.gallery-frame\s*\{[^}]*position:\s*relative/.test(css),
	"Non-modal .gallery-frame must be position: relative so UA dialog absolute positioning does not overlay the notes."
);

check(
	"modal dialog has a definite overlay height",
	/\.gallery-frame:modal\s*\{[^}]*max-height:\s*calc\(100dvh/.test(css),
	"Modal dialog needs a definite dvh max-height so the featured card row cannot collapse."
);

if (failures.length) {
	console.error(`verify-gallery: ${failures.length} failed\n`);
	failures.forEach((failure) => {
		console.error(`- ${failure}`);
	});
	process.exit(1);
}

console.log("verify-gallery: 10 checks passed");
