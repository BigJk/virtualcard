let styleDomElement: HTMLStyleElement | null = null;

export const loadFonts = (...paths: string[]) => {
	const importStatement = paths.map((path) => `@import url("${path}");`).join('\n');

	if (styleDomElement === null) {
		styleDomElement = document.createElement('style');
		styleDomElement.innerHTML = importStatement;
		document.head.appendChild(styleDomElement);
	} else {
		styleDomElement.innerHTML = importStatement;
	}
};

export const unloadFonts = () => {
	if (styleDomElement !== null) {
		document.head.removeChild(styleDomElement);
		styleDomElement = null;
	}
};
