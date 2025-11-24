

export type ToolType = 'pencil' | 'eraser' | 'bucket' | 'picker';

export type ThemeMode = 'light' | 'dark' | 'system';

export type Language = 'en' | 'zh-CN' | 'zh-HK' | 'ja' | 'ko' | 'fr' | 'de' | 'es' | 'pt-BR' | 'ru' | 'ar';

export interface GridConfig {
  width: number;
  height: number;
  size: number; // Pixel size per cell
}

export interface AppState {
  grid: string[]; // Flat array of hex colors
  history: string[][];
  historyIndex: number;
  config: GridConfig;
  selectedColor: string;
  tool: ToolType;
  showGrid: boolean;
  showDrawingLayer: boolean;
  showReferenceLayer: boolean;
  backgroundImage: string | null;
  backgroundOpacity: number;
  customPalette: string[];
  theme: ThemeMode;
  language: Language;
}

export interface StoredProject {
  id: string;
  name: string;
  thumbnail: string; // Base64 data URL
  timestamp: number;
  // State to restore
  grid: string[];
  config: GridConfig;
  customPalette: string[];
  selectedColor: string;
  showDrawingLayer: boolean;
  showReferenceLayer: boolean;
  backgroundImage: string | null;
  backgroundOpacity: number;
}

// 25 Colors (5 rows x 5 columns)
export const DEFAULT_PALETTE = [
  // Row 1: Grayscale
  '#000000', '#404040', '#808080', '#c0c0c0', '#ffffff',
  // Row 2: Reds & Oranges
  '#590909', '#b81a1a', '#ff4d4d', '#ff9933', '#ffcc00',
  // Row 3: Greens & Yellows
  '#2b3d12', '#4b692f', '#76a138', '#a4d94e', '#e8f7a8',
  // Row 4: Blues & Teals
  '#0b1828', '#1a3a59', '#29668c', '#4da6ff', '#99e5ff',
  // Row 5: Purples & Pinks
  '#281229', '#5d2c5d', '#9e459e', '#ef7dce', '#ffccff'
];

export const DEFAULT_SIZE = 32;