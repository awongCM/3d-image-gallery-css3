const gallery = document.querySelector(".gallery-frame");
const scene = document.querySelector("#scene");
const modeToggle = document.querySelector("#mode-toggle");
const featuredImage = document.querySelector("#featured-image");
const featuredKicker = document.querySelector("#featured-kicker");
const featuredTitle = document.querySelector("#featured-title");
const featuredCaption = document.querySelector("#featured-caption");
const thumbnails = [...document.querySelectorAll(".thumbnail")];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function updateSelectedThumbnail(selectedButton) {
	thumbnails.forEach((button) => {
		const isSelected = button === selectedButton;
		button.classList.toggle("is-active", isSelected);
		if (isSelected) {
			button.setAttribute("aria-current", "true");
		} else {
			button.removeAttribute("aria-current");
		}
	});
}

function updateFeaturedImage(button) {
	featuredImage.src = button.dataset.large;
	featuredImage.alt = button.dataset.alt;
	featuredKicker.textContent = `Image ${button.dataset.index} of ${thumbnails.length}`;
	featuredTitle.textContent = button.dataset.title;
	featuredCaption.textContent = button.dataset.caption;
	updateSelectedThumbnail(button);
}

function selectImage(button) {
	if (button.classList.contains("is-active")) {
		return;
	}

	if (!reduceMotion.matches && "startViewTransition" in document) {
		document.startViewTransition(() => updateFeaturedImage(button));
		return;
	}

	updateFeaturedImage(button);
}

function setImmersiveMode(isImmersive) {
	gallery.classList.toggle("is-immersive", isImmersive);
	modeToggle.setAttribute("aria-pressed", String(isImmersive));
	modeToggle.textContent = isImmersive ? "Exit 3D view" : "Enter 3D view";
	document.body.classList.toggle("has-immersive-gallery", isImmersive);
}

function updateTilt(event) {
	if (reduceMotion.matches || !gallery.classList.contains("is-immersive")) {
		return;
	}

	const bounds = scene.getBoundingClientRect();
	const x = (event.clientX - bounds.left) / bounds.width - 0.5;
	const y = (event.clientY - bounds.top) / bounds.height - 0.5;

	scene.style.setProperty("--tilt-y", `${x * 7}deg`);
	scene.style.setProperty("--tilt-x", `${y * -5}deg`);
}

function resetTilt() {
	scene.style.setProperty("--tilt-x", "0deg");
	scene.style.setProperty("--tilt-y", "0deg");
}

thumbnails.forEach((button) => {
	button.addEventListener("click", () => selectImage(button));
});

modeToggle.addEventListener("click", () => {
	setImmersiveMode(!gallery.classList.contains("is-immersive"));
});

featuredImage.addEventListener("click", () => {
	setImmersiveMode(!gallery.classList.contains("is-immersive"));
});

scene.addEventListener("pointermove", updateTilt);
scene.addEventListener("pointerleave", resetTilt);

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape" && gallery.classList.contains("is-immersive")) {
		setImmersiveMode(false);
		resetTilt();
		modeToggle.focus();
	}
});
