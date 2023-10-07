export function isLightColor(hexColor: string) {
	// Remove the '#' if present
	hexColor = hexColor.replace(/^#/, '');

	// Convert hex to RGB
	const r = parseInt(hexColor.slice(0, 2), 16);
	const g = parseInt(hexColor.slice(2, 4), 16);
	const b = parseInt(hexColor.slice(4, 6), 16);

	// Calculate relative luminance
	const l = 0.2126 * (r / 255) ** 2.2 + 0.7152 * (g / 255) ** 2.2 + 0.0722 * (b / 255) ** 2.2;

	// Calculate contrast ratio
	const cr = (l + 0.05) / 0.05;

	// Use WCAG guidelines to determine light or dark text
	return cr >= 4.5;
}
