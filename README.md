<div align="center">
  <a href="./doc/README_zh-CN.md">中文文档 (Chinese)</a>
  <br/>
  <br/>
  <img src="./favicon.svg" width="120" alt="PixelCraft Studio Logo" />
  <h1>PixelCraft Studio</h1>
</div>

PixelCraft Studio is a professional-grade, web-based pixel art editor built with React. It is designed to be lightweight yet powerful, offering advanced features like image-to-pixel conversion, reference layers, and multi-language support.

### ✨ Key Features

*   **Essential Tools**: Pencil, Eraser, Flood Fill (Bucket), and Color Picker.
*   **Layer System**:
    *   **Drawing Layer**: Your main canvas.
    *   **Reference Layer**: Upload an image to place under your canvas for tracing. Adjust opacity as needed.
*   **Image Processing**:
    *   **Image-to-Pixel**: Import any image and automatically convert it into pixel art based on the current grid size.
*   **Canvas Management**:
    *   Customizable grid sizes (Presets or Manual up to 128x128).
    *   Zoom and Pan controls.
    *   Grid line toggles.
*   **Project Management**:
    *   Save projects as `.json` files to edit later.
    *   Export artwork as high-quality PNGs.
    *   Auto-saves to browser local storage.
*   **Customization**:
    *   **Themes**: Light, Dark, and System Sync.
    *   **Internationalization**: Supports 11 languages (English, Chinese, Japanese, Korean, French, German, Spanish, Portuguese, Russian, Arabic).
    *   **Palette**: Default 25-color palette + 5 editable custom color slots.

### ⌨️ Keyboard Shortcuts & Navigation

| Action | Control |
| :--- | :--- |
| **Pan / Move Canvas** | Hold `Space` + Click & Drag (or Middle Mouse Button) |
| **Zoom In/Out** | `Ctrl` + Mouse Wheel |
| **Undo** | Button in UI (History support) |
| **Redo** | Button in UI |

### 🛠️ Tech Stack

*   **Framework**: React 19
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Language**: TypeScript