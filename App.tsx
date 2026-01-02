import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import CanvasBoard from './components/CanvasBoard';
import { Toolbar } from './components/Toolbar';
import ProjectLibraryModal from './components/ProjectLibraryModal';
import {
  AppState,
  DEFAULT_PALETTE,
  DEFAULT_SIZE,
  Language,
  ToolType,
  StoredProject,
} from './types';
import { imageToPixelGrid, TRANSLATIONS } from './utils';
import { getSystemLanguage, SUPPORTED_LANGUAGES } from './i18n/translations';
import { CustomSelect } from './components/CustomSelect';
import { ResizeModal } from './components/ResizeModal';
import { TutorialModal } from './components/TutorialModal';
import {
  Undo,
  Redo,
  Grid3X3,
  X,
  Settings,
  Eye,
  EyeOff,
  Layers,
  Moon,
  Sun,
  Monitor,
  Globe,
  HelpCircle,
  Pencil,
  Palette,
  Move,
  Image as ImageIcon,
  Save,
  LayersIcon,
  BookOpen,
  Keyboard,
  MoreVertical,
  Hand,
  Menu,
  Check,
  ChevronDown,
  Grid,
} from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';

const App: React.FC = () => {
  const initialCustomPalette = ['#ffffff', '#cccccc', '#999999', '#666666', '#333333'];

  const [state, setState] = useState<AppState>({
    grid: Array(DEFAULT_SIZE * DEFAULT_SIZE).fill(''),
    history: [Array(DEFAULT_SIZE * DEFAULT_SIZE).fill('')],
    historyIndex: 0,
    config: { width: DEFAULT_SIZE, height: DEFAULT_SIZE, size: 16 },
    selectedColor: DEFAULT_PALETTE[0],
    tool: 'pencil',
    showGrid: true,
    showDrawingLayer: true,
    showReferenceLayer: true,
    backgroundImage: null,
    backgroundOpacity: 0.5,
    customPalette: initialCustomPalette,
    theme: 'system', // Default theme
    language: getSystemLanguage(),
  });

  const [isNotificationVisible, setNotification] = useState<{
    msg: string;
    type: 'success' | 'error';
  } | null>(null);
  const [isResizeModalOpen, setIsResizeModalOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [computedIsDarkMode, setComputedIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileHeaderMenuOpen, setIsMobileHeaderMenuOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  // Library State
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [savedProjects, setSavedProjects] = useState<StoredProject[]>([]);

  // Mobile Pan Mode
  const [isMobilePanning, setIsMobilePanning] = useState(false);

  // Panning & Zooming State
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 }); // New pan state

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);
  const lastTouchPos = useRef<{ x: number; y: number } | null>(null);
  const lastPinchDist = useRef<number | null>(null); // For pinch zoom
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  // Helper for translations in component body
  const t = TRANSLATIONS[state.language];

  // Handle Theme Logic
  useEffect(() => {
    const applyTheme = () => {
      const root = window.document.documentElement;
      let isDark = false;

      if (state.theme === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        isDark = state.theme === 'dark';
      }

      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      setComputedIsDarkMode(isDark);

      // Update Meta Theme Color for Mobile Browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', isDark ? '#000000' : '#fcf7f1');
      }
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (state.theme === 'system') applyTheme();
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [state.theme]);

  // Handle outside click for theme dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setIsThemeDropdownOpen(false);
      }
    };

    if (isThemeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isThemeDropdownOpen]);

  // Helper function for blank grid
  const AQ = (w: number, h: number) => Array(w * h).fill('');

  // Handle Space Key for Panning Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        // Allow typing in inputs
        if (
          document.activeElement?.tagName === 'INPUT' ||
          document.activeElement?.tagName === 'TEXTAREA'
        ) {
          return;
        }

        e.preventDefault(); // Stop default browser scrolling

        if (!e.repeat) {
          setIsSpacePressed(true);
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle Wheel Zoom (Ctrl + Wheel)
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const direction = e.deltaY < 0 ? 1 : -1; // Up (neg) = Zoom In
        setState((s) => {
          const newSize = Math.min(60, Math.max(4, s.config.size + direction * 2));
          return { ...s, config: { ...s.config, size: newSize } };
        });
      }
    };

    // Using non-passive listener to allow preventDefault()
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // Load LocalStorage on Mount
  useEffect(() => {
    // 1. Load Saved State
    const savedState = localStorage.getItem('pixelCraftState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        const loadedCustomPalette = parsed.customPalette || initialCustomPalette;
        if (parsed.grid && parsed.config) {
          setState((prev) => ({
            ...prev,
            ...parsed,
            customPalette: loadedCustomPalette,
            history: [parsed.grid],
            historyIndex: 0,
            showDrawingLayer: parsed.showDrawingLayer ?? true,
            showReferenceLayer: parsed.showReferenceLayer ?? true,
            theme: parsed.theme ?? 'system', // Load saved theme
            language: parsed.language ?? getSystemLanguage(),
          }));
        }
      } catch (e) {
        console.error('Failed to load local state');
      }
    }

    // 2. Check if user has seen the tutorial before
    const hasSeenTutorial = localStorage.getItem('pixelCraftTutorialSeen');
    if (!hasSeenTutorial) {
      setIsTutorialOpen(true);
      // Do NOT set item here. Set it when they close it.
    }

    // 3. Load Project Library
    const savedLibrary = localStorage.getItem('pixelCraftLibrary');
    if (savedLibrary) {
      try {
        const parsed = JSON.parse(savedLibrary);
        // MIGRATION: Ensure all projects have an ID
        if (Array.isArray(parsed)) {
          const cleaned = parsed.map((p: any) => ({
            ...p,
            id: p.id
              ? String(p.id)
              : `gen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          }));
          setSavedProjects(cleaned);
        }
      } catch (e) {
        console.error('Failed to load library');
      }
    }
  }, []);

  const handleCloseTutorial = () => {
    localStorage.setItem('pixelCraftTutorialSeen', 'true');
    setIsTutorialOpen(false);
  };

  // Save to LocalStorage
  useEffect(() => {
    if (state.grid.length > 0) {
      const toSave = {
        grid: state.grid,
        config: state.config,
        selectedColor: state.selectedColor,
        backgroundImage: state.backgroundImage,
        customPalette: state.customPalette,
        showDrawingLayer: state.showDrawingLayer,
        showReferenceLayer: state.showReferenceLayer,
        theme: state.theme,
        language: state.language,
      };
      localStorage.setItem('pixelCraftState', JSON.stringify(toSave));
    }
  }, [
    state.grid,
    state.config,
    state.backgroundImage,
    state.selectedColor,
    state.customPalette,
    state.showDrawingLayer,
    state.showReferenceLayer,
    state.theme,
    state.language,
  ]);

  const updateGrid = useCallback((newGrid: string[], addToHistory = true) => {
    setState((prev) => {
      const newHistory = addToHistory
        ? [...prev.history.slice(0, prev.historyIndex + 1), newGrid]
        : prev.history;

      // Limit history size
      if (newHistory.length > 50) newHistory.shift();

      return {
        ...prev,
        grid: newGrid,
        history: newHistory,
        historyIndex: addToHistory ? newHistory.length - 1 : prev.historyIndex,
      };
    });
  }, []);

  const handleUndo = useCallback(() => {
    setState((prev) => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        return {
          ...prev,
          grid: prev.history[newIndex],
          historyIndex: newIndex,
        };
      }
      return prev;
    });
  }, []);

  const handleRedo = useCallback(() => {
    setState((prev) => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        return {
          ...prev,
          grid: prev.history[newIndex],
          historyIndex: newIndex,
        };
      }
      return prev;
    });
  }, []);

  const handleSetTool = useCallback((tool: ToolType) => {
    setState((s) => ({ ...s, tool }));
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts if typing in input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const isCmdOrCtrl = e.ctrlKey || e.metaKey;

      // Tool Shortcuts (1-4)
      if (!isCmdOrCtrl && !e.altKey && !e.shiftKey) {
        switch (e.key) {
          case '1':
            handleSetTool('pencil');
            break;
          case '2':
            handleSetTool('eraser');
            break;
          case '3':
            handleSetTool('bucket');
            break;
          case '4':
            handleSetTool('picker');
            break;
        }
      }

      if (isCmdOrCtrl) {
        const key = e.key.toLowerCase();

        // Redo: Ctrl+Y or Ctrl+Shift+Z
        if (key === 'y' || (e.shiftKey && key === 'z')) {
          e.preventDefault();
          handleRedo();
          return;
        }

        // Undo: Ctrl+Z (check last to avoid conflict with Shift+Z)
        if (key === 'z') {
          e.preventDefault();
          handleUndo();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, handleSetTool]);

  const handleClear = () => {
    const emptyGrid = AQ(state.config.width, state.config.height);
    setState((prev) => ({
      ...prev,
      backgroundImage: null,
    }));
    updateGrid(emptyGrid);
    showNotification(t.notifications.cleared, 'success');
  };

  const handleGridChangeFromCanvas = (newGrid: string[]) => {
    updateGrid(newGrid);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'convert' | 'background'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const src = event.target?.result as string;
      if (type === 'convert') {
        try {
          const img = new Image();
          img.src = src;
          img.onload = async () => {
            const newGrid = await imageToPixelGrid(src, state.config.width, state.config.height);
            updateGrid(newGrid);
            showNotification(t.notifications.converted, 'success');
          };
        } catch (err) {
          showNotification(t.notifications.convertError, 'error');
        }
      } else {
        setState((prev) => ({ ...prev, backgroundImage: src, showReferenceLayer: true }));
        showNotification(t.notifications.refSet, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleExport = () => {
    const { width, height } = state.config;

    // Calculate scale to ensure high resolution (approx 2048px on longest side)
    // We use integer scaling to preserve sharp edges (nearest neighbor effect)
    const maxDim = Math.max(width, height);
    const targetDim = 2048;
    let scale = Math.floor(targetDim / maxDim);
    if (scale < 1) scale = 1;

    // Create off-screen canvas for clean export
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = width * scale;
    exportCanvas.height = height * scale;
    const ctx = exportCanvas.getContext('2d');

    if (!ctx) return;

    // Draw only pixels (no grid lines)
    state.grid.forEach((color, i) => {
      if (color) {
        const x = (i % width) * scale;
        const y = Math.floor(i / width) * scale;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, scale, scale);
      }
    });

    // Generate download
    try {
      const link = document.createElement('a');
      link.download = `pixel-art-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = exportCanvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showNotification(t.notifications.exported, 'success');
    } catch (e) {
      console.error('Export error:', e);
      showNotification('Export failed', 'error');
    }
  };

  const handleSaveProject = () => {
    const projectData = {
      grid: state.grid,
      config: state.config,
      customPalette: state.customPalette,
      selectedColor: state.selectedColor,
      backgroundImage: state.backgroundImage,
      backgroundOpacity: state.backgroundOpacity,
      showDrawingLayer: state.showDrawingLayer,
      showReferenceLayer: state.showReferenceLayer,
      showGrid: state.showGrid,
      theme: state.theme,
      language: state.language,
      version: '1.0',
    };

    const blob = new Blob([JSON.stringify(projectData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pixelcraft-project-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(t.notifications.projectSaved, 'success');
  };

  const handleLoadProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.grid && json.config) {
          setState((prev) => ({
            ...prev,
            ...json,
            history: [json.grid],
            historyIndex: 0,
            theme: json.theme || prev.theme,
            language: json.language || prev.language,
          }));
          showNotification(t.notifications.projectLoaded, 'success');
        } else {
          showNotification(t.notifications.loadError, 'error');
        }
      } catch (err) {
        showNotification(t.notifications.loadError, 'error');
      }
      e.target.value = ''; // Reset input
    };
    reader.readAsText(file);
  };

  const handleManualResize = (w: number, h: number) => {
    const newGrid = AQ(w, h);
    setState((prev) => ({
      ...prev,
      grid: newGrid,
      history: [newGrid],
      historyIndex: 0,
      config: { ...prev.config, width: w, height: h },
    }));
    setIsResizeModalOpen(false);
    showNotification(t.notifications.resized(w, h), 'success');
  };

  const handleUpdateCustomColor = (index: number, color: string) => {
    setState((prev) => {
      const newCustom = [...prev.customPalette];
      newCustom[index] = color;
      return { ...prev, customPalette: newCustom, selectedColor: color };
    });
  };

  // --- LIBRARY FUNCTIONS ---

  const generateThumbnail = async (): Promise<string> => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return '';

    // Create a small offscreen canvas for thumbnail
    const thumbCanvas = document.createElement('canvas');
    const size = 300; // Thumbnail size
    thumbCanvas.width = size;
    thumbCanvas.height = size;
    const ctx = thumbCanvas.getContext('2d');
    if (!ctx) return '';

    // Draw checkered background first (simulating transparent) or just white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Calculate aspect ratio to fit
    const scale = Math.min(size / canvas.width, size / canvas.height);
    const x = (size - canvas.width * scale) / 2;
    const y = (size - canvas.height * scale) / 2;

    ctx.imageSmoothingEnabled = false; // Keep pixelated look
    ctx.drawImage(canvas, x, y, canvas.width * scale, canvas.height * scale);

    return thumbCanvas.toDataURL('image/png', 0.8);
  };

  const handleSaveToLibrary = async (name: string) => {
    const thumb = await generateThumbnail();
    const pk = `gen_${Date.now()}`;
    const newProject: StoredProject = {
      id: pk,
      name,
      thumbnail: thumb,
      timestamp: Date.now(),
      grid: state.grid,
      config: state.config,
      customPalette: state.customPalette,
      selectedColor: state.selectedColor,
      showDrawingLayer: state.showDrawingLayer,
      showReferenceLayer: state.showReferenceLayer,
      backgroundImage: state.backgroundImage,
      backgroundOpacity: state.backgroundOpacity,
    };

    const updatedProjects = [newProject, ...savedProjects];
    setSavedProjects(updatedProjects);
    localStorage.setItem('pixelCraftLibrary', JSON.stringify(updatedProjects));
    showNotification(t.notifications.librarySaved, 'success');
  };

  const handleLoadFromLibrary = (project: StoredProject) => {
    setState((prev) => ({
      ...prev,
      grid: project.grid,
      config: project.config,
      customPalette: project.customPalette,
      selectedColor: project.selectedColor,
      showDrawingLayer: project.showDrawingLayer,
      showReferenceLayer: project.showReferenceLayer,
      backgroundImage: project.backgroundImage,
      backgroundOpacity: project.backgroundOpacity,
      history: [project.grid],
      historyIndex: 0,
    }));
    showNotification(t.notifications.libraryLoaded, 'success');
  };

  const handleDeleteFromLibrary = (id: string) => {
    // Create new array excluding the target
    const updated = savedProjects.filter((p) => String(p.id) !== String(id));
    setSavedProjects(updated);
    localStorage.setItem('pixelCraftLibrary', JSON.stringify(updated));
    showNotification(t.notifications.libraryDeleted, 'success');
  };

  const handleRenameInLibrary = (id: string, newName: string) => {
    setSavedProjects((currentProjects) => {
      const updated = currentProjects.map((p) => (p.id === id ? { ...p, name: newName } : p));
      localStorage.setItem('pixelCraftLibrary', JSON.stringify(updated));
      return updated;
    });
  };

  const handleExportFromLibrary = (project: StoredProject) => {
    const data = JSON.stringify(project, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/[^a-z0-9\u4e00-\u9fa5-_]/gi, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(t.notifications.projectSaved, 'success');
  };

  const showNotification = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Panning Event Handlers (for Container)
  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (isSpacePressed && e.button === 0) || isMobilePanning) {
      e.preventDefault();
      setIsPanning(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleContainerMouseMove = (e: React.MouseEvent) => {
    if (isPanning && lastMousePos.current) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleContainerMouseUp = () => {
    setIsPanning(false);
    lastMousePos.current = null;
  };

  // Touch Panning & Pinch Zoom Handlers (Mobile)
  const handleContainerTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastPinchDist.current = dist;
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      lastTouchPos.current = { x: midX, y: midY };
      setIsPanning(true);
    } else if (e.touches.length === 1 && (isMobilePanning || isSpacePressed)) {
      const touch = e.touches[0];
      setIsPanning(true);
      lastTouchPos.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleContainerTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      if (lastPinchDist.current) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const ZS = dist - lastPinchDist.current;
        if (Math.abs(ZS) > 5) {
          const zoomDirection = ZS > 0 ? 1 : -1;
          setState((s) => {
            const newSize = Math.min(60, Math.max(4, s.config.size + zoomDirection));
            return { ...s, config: { ...s.config, size: newSize } };
          });
          lastPinchDist.current = dist;
        }
      }
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      if (lastTouchPos.current) {
        const dx = midX - lastTouchPos.current.x;
        const dy = midY - lastTouchPos.current.y;
        setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        lastTouchPos.current = { x: midX, y: midY };
      } else {
        lastTouchPos.current = { x: midX, y: midY };
      }
      return;
    }
    if (isMobilePanning && e.touches.length === 1 && lastTouchPos.current) {
      if (e.cancelable) e.preventDefault();
      const touch = e.touches[0];
      const dx = touch.clientX - lastTouchPos.current.x;
      const dy = touch.clientY - lastTouchPos.current.y;
      setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      lastTouchPos.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleContainerTouchEnd = () => {
    setIsPanning(false);
    lastTouchPos.current = null;
    lastPinchDist.current = null;
  };

  const handleZoomWheel = (e: React.WheelEvent) => {
    const direction = e.deltaY < 0 ? 1 : -1;
    setState((s) => {
      const newSize = Math.min(60, Math.max(4, s.config.size + direction * 2));
      return { ...s, config: { ...s.config, size: newSize } };
    });
  };

  const handleOpacityWheel = (e: React.WheelEvent) => {
    const direction = e.deltaY < 0 ? 1 : -1;
    setState((s) => {
      let newVal = s.backgroundOpacity + direction * 0.1;
      newVal = Math.min(1, Math.max(0, newVal));
      newVal = Math.round(newVal * 10) / 10;
      return { ...s, backgroundOpacity: newVal };
    });
  };

  return (
    <div
      className="flex h-[100dvh] w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors selection:bg-indigo-500/30"
      dir={state.language === 'ar' ? 'rtl' : 'ltr'}
    >
      <ResizeModal
        isOpen={isResizeModalOpen}
        onClose={() => setIsResizeModalOpen(false)}
        onResize={handleManualResize}
        currentWidth={state.config.width}
        currentHeight={state.config.height}
        language={state.language}
      />

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={handleCloseTutorial}
        language={state.language}
      />

      <ProjectLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        projects={savedProjects}
        onSaveCurrent={handleSaveToLibrary}
        onLoad={handleLoadFromLibrary}
        onDelete={handleDeleteFromLibrary}
        onRename={handleRenameInLibrary}
        onExport={handleExportFromLibrary}
        language={state.language}
      />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Header Menu Overlay */}
      {isMobileHeaderMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileHeaderMenuOpen(false)}
        />
      )}

      {/* MOBILE DROPDOWN MENU PANEL */}
      {isMobileHeaderMenuOpen && (
        <div className="fixed top-24 left-4 right-4 glass-panel rounded-cupertino shadow-2xl z-50 p-5 flex flex-col gap-4 animate-in slide-in-from-top-2 md:hidden max-h-[70vh] overflow-y-auto">
          {/* Size & Grid Row */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsResizeModalOpen(true);
                setIsMobileHeaderMenuOpen(false);
              }}
              className="flex-1 h-12 flex items-center justify-center gap-2 bg-[#fcf7f1] hover:bg-[#fcf7f1] dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 rounded-xl border border-white/20 dark:border-white/5 font-medium text-sm transition-colors active:scale-95"
            >
              <Grid3X3 size={18} className="text-indigo-500" />
              {state.config.width} × {state.config.height}
            </button>
            <button
              onClick={() => setState((s) => ({ ...s, showGrid: !s.showGrid }))}
              className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-xl border border-white/20 dark:border-white/5 text-sm font-medium transition-colors active:scale-95 ${state.showGrid
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 border-transparent'
                : 'bg-[#fcf7f1] dark:bg-white/5 text-slate-500 dark:text-slate-400'
                }`}
            >
              {state.showGrid ? t.ui.gridOn : t.ui.gridOff}
            </button>
          </div>

          {/* Zoom Row */}
          <div className="bg-[#fcf7f1] dark:bg-white/5 p-4 rounded-2xl border border-white/20 dark:border-white/5 shadow-sm">
            <div className="flex justify-between mb-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {t.ui.zoom}
              </label>
              <span className="text-xs font-mono text-slate-500">{state.config.size}px</span>
            </div>
            <input
              type="range"
              min="4"
              max="60"
              value={state.config.size}
              onChange={(e) =>
                setState((s) => ({ ...s, config: { ...s.config, size: parseInt(e.target.value) } }))
              }
              className="w-full accent-indigo-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Layers Row */}
          <div className="bg-[#fcf7f1] dark:bg-white/5 p-4 rounded-2xl border border-white/20 dark:border-white/5 shadow-sm">
            <label className="text-xs font-bold text-slate-500 uppercase mb-3 block tracking-widest">
              {t.ui.drawingLayer}
            </label>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setState((s) => ({ ...s, showDrawingLayer: !s.showDrawingLayer }))}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors active:scale-95 ${state.showDrawingLayer
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-[#fcf7f1] dark:bg-white/5 text-slate-500'
                  }`}
              >
                {state.showDrawingLayer ? <Eye size={16} /> : <EyeOff size={16} />}
                {t.ui.layers}
              </button>
              <button
                onClick={() =>
                  setState((s) => ({ ...s, showReferenceLayer: !s.showReferenceLayer }))
                }
                disabled={!state.backgroundImage}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors active:scale-95 ${!state.backgroundImage
                  ? 'opacity-50 cursor-not-allowed bg-[#fcf7f1] dark:bg-white/5 text-slate-400'
                  : state.showReferenceLayer
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-[#fcf7f1] dark:bg-white/5 text-slate-500'
                  }`}
              >
                {state.showReferenceLayer ? <Eye size={16} /> : <EyeOff size={16} />}
                {t.ui.refLayer}
              </button>
            </div>
            {state.backgroundImage && state.showReferenceLayer && (
              <div className="pt-3 border-t border-slate-200/50 dark:border-white/10">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {t.ui.refOpacity}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {Math.round(state.backgroundOpacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={state.backgroundOpacity}
                  onChange={(e) =>
                    setState((s) => ({ ...s, backgroundOpacity: parseFloat(e.target.value) }))
                  }
                  className="w-full accent-indigo-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Theme & Language Row */}
          <div className="flex gap-3">
            <CustomSelect
              value={state.language}
              onChange={(val) => setState((s) => ({ ...s, language: val as Language }))}
              options={SUPPORTED_LANGUAGES}
              isDarkMode={computedIsDarkMode}
            />

            <button
              onClick={() =>
                setState((s) => ({ ...s, theme: state.theme === 'dark' ? 'light' : 'dark' }))
              }
              className="h-12 w-12 flex-shrink-0 flex items-center justify-center bg-[#fcf7f1] dark:bg-white/5 rounded-xl border border-white/20 dark:border-white/5 text-slate-700 dark:text-slate-200 active:scale-95 transition-all shadow-sm"
            >
              {state.theme === 'dark' || (state.theme === 'system' && computedIsDarkMode) ? (
                <Moon size={20} />
              ) : (
                <Sun size={20} />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <Toolbar
        activeTool={state.tool}
        setTool={(t) => setState((s) => ({ ...s, tool: t }))}
        selectedColor={state.selectedColor}
        setColor={(c) => setState((s) => ({ ...s, selectedColor: c }))}
        customPalette={state.customPalette}
        onUpdateCustomColor={handleUpdateCustomColor}
        onDownload={handleExport}
        onSave={handleSaveProject}
        onLoad={handleLoadProject}
        onClear={handleClear}
        onImageUpload={handleImageUpload}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        language={state.language}
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
      />

      {/* Main Area */}
      <main className="flex-1 flex flex-col relative min-w-0">
        {/* Top Bar (Floating Glass) */}
        <div className="absolute top-0 left-0 right-0 md:left-80 z-40 p-4 pt-[calc(1rem+env(safe-area-inset-top))] pointer-events-none transition-[left] duration-300">
          <header className="h-16 glass-panel rounded-cupertino flex items-center px-4 md:px-6 pointer-events-auto justify-between shadow-sm transition-all animate-in slide-in-from-top-4 duration-500">
            {/* MOBILE LAYOUT */}
            <div className="flex md:hidden items-center justify-between w-full h-full">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsSidebarOpen(true);
                    setIsMobileHeaderMenuOpen(false);
                  }}
                  className="p-2.5 bg-[#fcf7f1] hover:bg-[#fcf7f1] text-slate-500 hover:text-slate-900 dark:bg-white/5 dark:text-slate-400 dark:hover:text-white rounded-xl dark:hover:bg-white/10 transition-colors border border-[var(--color-muted)]/30 dark:border-transparent"
                >
                  <Menu size={20} />
                </button>

                <div className="h-5 w-px bg-slate-200/50 dark:bg-white/10 mx-1"></div>

                <button
                  onClick={() => setIsMobilePanning(!isMobilePanning)}
                  className={`p-2.5 rounded-xl transition-all ${isMobilePanning
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'bg-[#fcf7f1] text-slate-500 dark:bg-white/5 dark:text-slate-400 hover:bg-[#fcf7f1] dark:hover:bg-white/10 border border-[var(--color-muted)]/30 dark:border-transparent'
                    }`}
                  title={t.ui.pan}
                >
                  <Hand size={20} />
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleUndo}
                    disabled={state.historyIndex === 0}
                    className="p-2.5 bg-[#fcf7f1] hover:bg-[#fcf7f1] dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 rounded-xl disabled:opacity-30 transition-colors border border-[var(--color-muted)]/30 dark:border-transparent"
                  >
                    {' '}
                    <Undo size={20} />
                  </button>
                  <button
                    onClick={handleRedo}
                    disabled={state.historyIndex === state.history.length - 1}
                    className="p-2.5 bg-[#fcf7f1] hover:bg-[#fcf7f1] dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 rounded-xl disabled:opacity-30 transition-colors border border-[var(--color-muted)]/30 dark:border-transparent"
                  >
                    {' '}
                    <Redo size={20} />
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!isMobileHeaderMenuOpen) setIsSidebarOpen(false);
                  setIsMobileHeaderMenuOpen(!isMobileHeaderMenuOpen);
                }}
                className={`p-2.5 rounded-xl transition-colors ${isMobileHeaderMenuOpen
                  ? 'bg-indigo-500 text-white'
                  : 'bg-[#fcf7f1] text-slate-500 dark:bg-white/5 dark:text-slate-400 hover:bg-[#fcf7f1] dark:hover:bg-white/10 border border-[var(--color-muted)]/30 dark:border-transparent'
                  }`}
              >
                <MoreVertical size={20} />
              </button>
            </div>

            {/* DESKTOP LAYOUT */}
            <div className="hidden md:flex flex-1 items-center justify-between min-w-0 gap-2">
              {/* LEFT SIDE: Undo/Redo & Size */}
              <div className="flex items-center gap-2">
                <div className="h-10 flex items-center bg-[#fcf7f1] dark:bg-white/5 rounded-xl p-1 border border-[var(--color-muted)]/30 dark:border-white/5 shadow-sm">
                  <button
                    onClick={handleUndo}
                    disabled={state.historyIndex === 0}
                    className="p-2 hover:bg-[#fcf7f1] dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-slate-400 rounded-lg disabled:opacity-30 transition-all shadow-sm hover:shadow"
                    title={`${t.ui.undo} (Ctrl + Z)`}
                  >
                    <Undo size={18} />
                  </button>
                  <div className="w-px h-4 bg-slate-300/50 dark:bg-white/10 mx-1"></div>
                  <button
                    onClick={handleRedo}
                    disabled={state.historyIndex === state.history.length - 1}
                    className="p-2 hover:bg-[#fcf7f1] dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-slate-400 rounded-lg disabled:opacity-30 transition-all shadow-sm hover:shadow"
                    title={`${t.ui.redo} (Ctrl + Y)`}
                  >
                    <Redo size={18} />
                  </button>
                </div>

                <button
                  onClick={() => setIsResizeModalOpen(true)}
                  className="h-10 flex items-center gap-2 bg-[#fcf7f1] dark:bg-white/5 hover:bg-[#fcf7f1] dark:hover:bg-white/10 text-slate-500 px-2 lg:px-4 rounded-xl border border-[var(--color-muted)]/30 dark:border-white/5 transition-all group hover:shadow-sm"
                >
                  <Grid3X3
                    size={18}
                    className="text-indigo-500 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-sm font-semibold hidden xl:inline">
                    {state.config.width} × {state.config.height}
                  </span>
                  <Settings size={14} className="ml-1 opacity-50 group-hover:opacity-100" />
                </button>

                <div className="h-10 hidden lg:flex items-center gap-3 bg-[#fcf7f1] dark:bg-white/5 px-4 rounded-xl border border-[var(--color-muted)]/30 dark:border-white/5 shadow-sm">
                  <label className="text-sm text-slate-500 font-bold uppercase tracking-widest hidden xl:block">
                    {t.ui.zoom}
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="60"
                    value={state.config.size}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        config: { ...s.config, size: parseInt(e.target.value) },
                      }))
                    }
                    onWheel={handleZoomWheel}
                    className="w-24 accent-indigo-500 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/*ZG RIGHT SIDE: Layers, Grid, Theme */}
              <div className="flex items-center gap-2">
                {/* Layers Control */}
                <div className="h-10 flex items-center gap-1 bg-[#fcf7f1] dark:bg-white/5 px-2 rounded-xl border border-[var(--color-muted)]/30 dark:border-white/5 shadow-sm">
                  <Layers size={16} className="text-slate-400 mx-2 hidden lg:block" />
                  <button
                    onClick={() =>
                      setState((s) => ({ ...s, showDrawingLayer: !s.showDrawingLayer }))
                    }
                    className={`p-1.5 rounded-lg transition-all ${state.showDrawingLayer
                      ? 'bg-[#fcf7f1] dark:bg-white/20 text-indigo-500 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-500'
                      }`}
                    title={t.ui.layers}
                  >
                    {state.showDrawingLayer ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button
                    onClick={() =>
                      setState((s) => ({ ...s, showReferenceLayer: !s.showReferenceLayer }))
                    }
                    disabled={!state.backgroundImage}
                    className={`p-1.5 rounded-lg transition-all ${!state.backgroundImage
                      ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                      : state.showReferenceLayer
                        ? 'bg-[#fcf7f1] dark:bg-white/20 text-green-500 shadow-sm'
                        : 'text-slate-400 hover:text-slate-500'
                      }`}
                    title={t.ui.refLayer}
                  >
                    {state.showReferenceLayer ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>

                {state.backgroundImage && state.showReferenceLayer && (
                  <div className="h-10 hidden lg:flex items-center gap-3 bg-white/50 dark:bg-white/5 px-3 rounded-xl border border-[var(--color-muted)]/30 dark:border-white/5 animate-in fade-in slide-in-from-right-2 shadow-sm">
                    <span className="text-sm text-slate-500 font-bold uppercase hidden xl:block tracking-widest">
                      {t.ui.refOpacity}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={state.backgroundOpacity}
                      onChange={(e) =>
                        setState((s) => ({ ...s, backgroundOpacity: parseFloat(e.target.value) }))
                      }
                      onWheel={handleOpacityWheel}
                      className="w-16 sm:w-20 accent-indigo-500 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer"
                    />
                  </div>
                )}
                <button
                  onClick={() => setState((s) => ({ ...s, showGrid: !s.showGrid }))}
                  className={`h-10 px-2 lg:px-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all border flex items-center justify-center gap-2 ${state.showGrid
                    ? 'bg-indigo-500 text-white border-transparent shadow-md shadow-indigo-500/20'
                    : 'bg-[#fcf7f1] dark:bg-white/5 border-[var(--color-muted)]/30 dark:border-white/5 text-slate-500 hover:bg-[#fcf7f1] dark:hover:bg-white/10 shadow-sm'
                    }`}
                  title={state.showGrid ? t.ui.gridOn : t.ui.gridOff}
                >
                  <Grid size={18} />
                  <span className="hidden xl:inline">{state.showGrid ? t.ui.gridOn : t.ui.gridOff}</span>
                </button>

                {/* Language Switcher */}
                <div className="relative group z-50">
                  <CustomSelect
                    value={state.language}
                    onChange={(val) => setState((s) => ({ ...s, language: val as Language }))}
                    options={SUPPORTED_LANGUAGES}
                    isDarkMode={computedIsDarkMode}
                    containerClass=""
                    className="h-10 w-10 xl:w-40 transition-all duration-300 justify-center xl:justify-between px-0 xl:px-3"
                    labelClass="hidden xl:block"
                    chevronClass="hidden xl:block"
                  />
                </div>

                {/* Theme Toggle */}
                <div className="relative z-50" ref={themeDropdownRef}>
                  <button
                    onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                    className={`h-10 w-10 flex items-center justify-center bg-[#fcf7f1] dark:bg-white/5 rounded-xl border border-[var(--color-muted)]/30 dark:border-white/5 text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-white transition-colors hover:bg-[#fcf7f1] dark:hover:bg-white/10 shadow-sm ${isThemeDropdownOpen
                      ? 'bg-[#fcf7f1] dark:bg-white/10 text-indigo-500 dark:text-white'
                      : ''
                      }`}
                  >
                    {state.theme === 'light' && <Sun size={20} />}
                    {state.theme === 'dark' && <Moon size={20} />}
                    {state.theme === 'system' && <Monitor size={20} />}
                  </button>

                  {isThemeDropdownOpen && (
                    <div className="absolute right-0 top-full pt-2 w-40 animate-in fade-in zoom-in-95 duration-200">
                      <div className="glass-panel rounded-xl shadow-2xl overflow-hidden p-1">
                        <button
                          onClick={() => {
                            setState((s) => ({ ...s, theme: 'light' }));
                            setIsThemeDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 transition-colors ${state.theme === 'light'
                            ? 'bg-indigo-500 text-white'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                            }`}
                        >
                          <Sun size={16} /> {t.ui.lightMode}
                        </button>
                        <button
                          onClick={() => {
                            setState((s) => ({ ...s, theme: 'dark' }));
                            setIsThemeDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 transition-colors ${state.theme === 'dark'
                            ? 'bg-indigo-500 text-white'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                            }`}
                        >
                          <Moon size={16} /> {t.ui.darkMode}
                        </button>
                        <button
                          onClick={() => {
                            setState((s) => ({ ...s, theme: 'system' }));
                            setIsThemeDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 transition-colors ${state.theme === 'system'
                            ? 'bg-indigo-500 text-white'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                            }`}
                        >
                          <Monitor size={16} /> {t.ui.systemMode}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
        </div>

        {/* Canvas Container */}
        <div
          ref={canvasContainerRef}
          onMouseDown={handleContainerMouseDown}
          onMouseMove={handleContainerMouseMove}
          onMouseUp={handleContainerMouseUp}
          onMouseLeave={handleContainerMouseUp}
          onTouchStart={handleContainerTouchStart}
          onTouchMove={handleContainerTouchMove}
          onTouchEnd={handleContainerTouchEnd}
          className={`flex-1 overflow-hidden relative transition-colors ${isPanning || isMobilePanning
            ? 'cursor-grabbing'
            : isSpacePressed
              ? 'cursor-grab'
              : 'cursor-default'
            }`}
          style={{
            // Clean dot pattern - Cupertino Style / Warmth
            backgroundImage: `radial-gradient(${computedIsDarkMode ? '#3a3a3c' : 'rgba(56, 56, 56, 0.1)'
              } 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            backgroundColor: computedIsDarkMode ? '#000000' : '#fcf7f1',
            touchAction: 'none',
          }}
        >
          {/* Movable/Scalable Wrapper */}
          <div
            className="absolute top-1/2 left-1/2"
            style={{
              transform: `translate(-50%, -50%) translate(${panOffset.x}px, ${panOffset.y}px)`,
            }}
          >
            <div className="shadow-2xl shadow-black/20 dark:shadow-black/50 pointer-events-auto rounded-none">
              <CanvasBoard
                grid={state.grid}
                config={state.config}
                tool={state.tool}
                selectedColor={state.selectedColor}
                showGrid={state.showGrid}
                showDrawingLayer={state.showDrawingLayer}
                showReferenceLayer={state.showReferenceLayer}
                backgroundImage={state.backgroundImage}
                backgroundOpacity={state.backgroundOpacity}
                isDarkMode={computedIsDarkMode}
                onGridChange={handleGridChangeFromCanvas}
                onEyeDropper={(c) => setState((s) => ({ ...s, selectedColor: c, tool: 'pencil' }))}
                isSpacePressed={isSpacePressed || isMobilePanning}
              />
            </div>
          </div>
        </div>

        {/* Floating Help Button */}
        <button
          onClick={() => setIsTutorialOpen(true)}
          className="absolute bottom-6 right-6 z-40 h-12 w-12 flex items-center justify-center bg-[#fcf7f1] dark:bg-[#1c1c1e]/75 hover:bg-white dark:hover:bg-[#2c2c2e] text-slate-600 dark:text-slate-300 rounded-full shadow-lg backdrop-blur-md transition-all hover:scale-110 active:scale-95 border border-white/20 dark:border-white/10"
          title={t.tutorial.title}
        >
          <HelpCircle size={24} />
        </button>

        {/* Notification Toast */}
        {isNotificationVisible && (
          <div
            className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 z-[100] w-max max-w-[90vw] whitespace-nowrap glass-panel animate-in slide-in-from-bottom-5 fade-in duration-300 backdrop-blur-xl ${isNotificationVisible.type === 'success'
              ? 'border-green-500/20 text-green-600 dark:text-green-400'
              : 'border-red-500/20 text-red-600 dark:text-red-400'
              }`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm ${isNotificationVisible.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}
            ></div>
            <span className="font-semibold text-sm">{isNotificationVisible.msg}</span>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;