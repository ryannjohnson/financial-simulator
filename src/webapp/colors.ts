export const DARK_GRAY = '#121212';
export const WHITE = '#ffffff';

// https://www.material.io/design/color/dark-theme.html#properties
const whiteOverlays = [0.05, 0.07, 0.08, 0.09, 0.11, 0.12, 0.14, 0.15, 0.16];

export function whiteOverlay(level: number) {
  if (!Number.isInteger(level) || level < 1 || level > 9) {
    throw new Error(`Level "${level}" must be an integer between 1 and 9`);
  }

  const percent = whiteOverlays[level];

  return `rgba(255, 255, 255, ${percent})`;
}
