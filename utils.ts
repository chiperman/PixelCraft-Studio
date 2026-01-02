import { GridConfig } from './types';
export { TRANSLATIONS } from './i18n/translations';

// Convert RGB(A) to Hex
export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// Flood Fill Algorithm
export const floodFill = (
  grid: string[],
  config: GridConfig,
  x: number,
  y: number,
  targetColor: string,
  replacementColor: string
): string[] => {
  const index = y * config.width + x;
  if (index < 0 || index >= grid.length) return grid;

  const currentColor = grid[index];
  if (currentColor === replacementColor) return grid;

  const newGrid = [...grid];
  const queue: [number, number][] = [[x, y]];

  while (queue.length > 0) {
    const [cx, cy] = queue.pop()!;
    const cIndex = cy * config.width + cx;

    if (newGrid[cIndex] === currentColor) {
      newGrid[cIndex] = replacementColor;

      if (cx + 1 < config.width) queue.push([cx + 1, cy]);
      if (cx - 1 >= 0) queue.push([cx - 1, cy]);
      if (cy + 1 < config.height) queue.push([cx, cy + 1]);
      if (cy - 1 >= 0) queue.push([cx, cy - 1]);
    }
  }
  return newGrid;
};

// Convert Image to Pixel Grid
export const imageToPixelGrid = (
  imageSrc: string,
  width: number,
  height: number
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      const grid: string[] = [];

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        if (a < 128) {
          grid.push('');
        } else {
          grid.push(rgbToHex(r, g, b));
        }
      }
      resolve(grid);
    };
    img.onerror = (e) => reject(e);
    img.src = imageSrc;
  });
};
