import React, { useState, useEffect, useCallback, useRef } from 'react';
import CanvasBoard from './components/CanvasBoard';
import Toolbar from './components/Toolbar';
import ProjectLibraryModal from './components/ProjectLibraryModal';
import { AppState, DEFAULT_PALETTE, DEFAULT_SIZE, Language, ToolType, StoredProject } from './types';
import { imageToPixelGrid, TRANSLATIONS } from './utils';
import { Undo, Redo, Grid3X3, X, Settings, Eye, EyeOff, Layers, Moon, Sun, Monitor, Globe, HelpCircle, Pencil, Palette, Move, Image as ImageIcon, Save, LayersIcon, BookOpen, Keyboard, MoreVertical, Hand, Menu } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';

// Resize Modal Component
interface ResizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResize: (w: number, h: number) => void;
  currentWidth: number;
  currentHeight: number;
  language: Language;
}

const ResizeModal: React.FC<ResizeModalProps> = ({ isOpen, onClose, onResize, currentWidth, currentHeight, language }) => {
  const [width, setWidth] = useState(currentWidth);
  const [height, setHeight] = useState(currentHeight);
  const t = TRANSLATIONS[language];

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setWidth(currentWidth);
      setHeight(currentHeight);
    }
  }, [isOpen, currentWidth, currentHeight]);

  const PRESETS = [
    { w: 16, h: 16, label: '16 x 16' },
    { w: 32, h: 32, label: '32 x 32' },
    { w: 48, h: 48, label: '48 x 48' },
    { w: 64, h: 64, label: '64 x 64' },
    { w: 96, h: 96, label: '96 x 96' },
    { w: 128, h: 128, label: '128 x 128' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
       <div className="bg-paper-50 dark:bg-slate-900 p-6 rounded-lg shadow-2xl border border-paper-200 dark:border-slate-700 w-full max-w-sm animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t.resize.title}</h3>
             <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"><X size={20}/></button>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-200 text-xs p-3 rounded-lg mb-4">
             {t.resize.warning}
          </div>

          {/* Presets */}
          <div className="mb-4">
             <label className="block text-xs uppercase text-slate-500 font-bold mb-2">{t.resize.presets}</label>
             <div className="grid grid-cols-3 gap-2">
               {PRESETS.map((preset) => (
                 <button
                    key={preset.label}
                    onClick={() => { setWidth(preset.w); setHeight(preset.h); }}
                    className="px-2 py-1.5 bg-paper-200 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-lg border border-paper-200 dark:border-slate-700 transition-colors"
                 >
                   {preset.label}
                 </button>
               ))}
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs uppercase text-slate-500 font-bold mb-2">{t.resize.width}</label>
              <input 
                type="number" 
                value={width} 
                onChange={e => setWidth(Math.min(128, Math.max(1, parseInt(e.target.value) || 0)))} 
                className="w-full bg-paper-100 dark:bg-slate-950 border border-paper-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
                min="1" 
                max="128" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-slate-500 font-bold mb-2">{t.resize.height}</label>
              <input 
                type="number" 
                value={height} 
                onChange={e => setHeight(Math.min(128, Math.max(1, parseInt(e.target.value) || 0)))} 
                className="w-full bg-paper-100 dark:bg-slate-950 border border-paper-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" 
                min="1" 
                max="128" 
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
             <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-paper-200 dark:hover:bg-slate-800 rounded-lg transition-colors">{t.resize.cancel}</button>
             <button 
                onClick={() => onResize(width, height)} 
                className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/20yb transition-all"
             >
                {t.resize.apply}
             </button>
          </div>
       </div>
    </div>
  );
};

const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 border-b-2 rounded-md text-[10px] sm:text-xs font-mono text-slate-600 dark:text-slate-400 min-w-[20px] inline-flex justify-center items-center mx-0.5">
    {children}
  </kbd>
);

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose, language }) => {
  const t = TRANSLATIONS[language];
  
  if (!isOpen) return null;

  const FEATURES = [
    { key: 'tools', icon: <Pencil size={24} className="text-indigo-500" /> },
    { key: 'colors', icon: <Palette size={24} className="text-pink-500" /> },
    { key: 'nav', icon: <Move size={24} className="text-blue-500" /> },
    { key: 'layers', icon: <LayersIcon size={24} className="text-purple-500" /> },
    { key: 'images', icon: <ImageIcon size={24} className="text-green-500" /> },
    { key: 'project', icon: <Save size={24} className="text-orange-500" /> },
  ];

  const TOOL_SHORTCUTS = [
    { label: t.tools.pencil, keys: ['1'] },
    { label: t.tools.eraser, keys: ['2'] },
    { label: t.tools.fill, keys: ['3'] },
    { label: t.tools.picker, keys: ['4'] },
  ];

  const EDITOR_SHORTCUTS = [
    { label: t.ui.undo, combinations: [['Ctrl', 'Z']] },
    { label: t.ui.redo, combinations: [['Ctrl', 'Y'], ['Ctrl', 'Shift', 'Z']] },
    { label: t.ui.pan, combinations: [['Space', 'Drag']] },
    { label: t.ui.zoom, combinations: [['Ctrl', 'Scroll']] },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
       {/* Main Container - Unified layout */}
       <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-paper-200 dark:border-slate-700 w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-300 overflow-hidden">
          
          {/* Header */}
          <div className="px-8 pt-8 pb-4 flex justify-between items-start flex-shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">{t.tutorial.title}</h2>
                <div className="h-1 w-12 bg-indigo-500 rounded-lg"></div>
              </div>
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-white transition-colors bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <X size={20}/>
              </button>
          </div>

          <div className="overflow-y-auto px-8 pb-8 flex-1 custom-scrollbar">
              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                 {FEATURES.map((feature) => {
                     // @ts-ignore
                     const section = t.tutorial.sections[feature.key];
                     return (
                        <div key={feature.key} className="flex items-start gap-4 p-4 rounded-lg bg-paper-100/50 dark:bg-slate-800/50 border border-transparent hover:border-indigo-200 dark:hover:border-slate-600 hover:bg-paper-100 dark:hover:bg-slate-800 transition-all group">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-950 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{section.title}</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {section.desc}
                                </p>
                            </div>
                        </div>
                     )
                 })}
              </div>

              {/* Shortcuts Section (Excalidraw Style) */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Keyboard size={20} className="text-teal-500" />
                    {t.tutorial.sections.shortcuts.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Tools Shortcuts */}
                    <div className="bg-paper-50 dark:bg-slate-800/50 rounded-xl border border-paper-200 dark:border-slate-700 p-4">
                        <h4 className="text-xs uppercase font-bold text-slate-500 mb-3 tracking-wider">{t.headers.tools}</h4>
                        <div className="space-y-2">
                            {TOOL_SHORTCUTS.map((shortcut) => (
                                <div key={shortcut.label} className="flex items-center justify-between text-sm">
                                    <span className="text-slate-700 dark:text-slate-300">{shortcut.label}</span>
                                    <div className="flex items-center">
                                        {shortcut.keys.map((k, i) => <Kbd key={i}>{k}</Kbd>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Editor Shortcuts */}
                    <div className="bg-paper-50 dark:bg-slate-800/50 rounded-xl border border-paper-200 dark:border-slate-700 p-4">
                         <h4 className="text-xs uppercase font-bold text-slate-500 mb-3 tracking-wider">Editor</h4>
                         <div className="space-y-2">
                            {EDITOR_SHORTCUTS.map((shortcut) => (
                                <div key={shortcut.label} className="flex items-center justify-between text-sm">
                                    <span className="text-slate-700 dark:text-slate-300">{shortcut.label}</span>
                                    <div className="flex items-center gap-2">
                                        {shortcut.combinations.map((combo, i) => (
                                            <React.Fragment key={i}>
                                                {i > 0 && <span className="text-xs text-slate-400">or</span>}
                                                <div className="flex items-center gap-0.5">
                                                    {combo.map((k, j) => (
                                                        <React.Fragment key={j}>
                                                            {j > 0 && <span className="text-slate-400 mx-0.5 text-[10px]">+</span>}
                                                            <Kbd>{k}</Kbd>
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
              </div>
          </div>

          {/* Unified Action Area */}
          <div className="p-6 flex flex-col items-center justify-center gap-6 bg-paper-50 dark:bg-slate-900 border-t border-paper-200 dark:border-slate-800 shrink-0">
               <button 
                onClick={onClose}
                className="w-full md:w-auto min-w-[200px] px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-lg shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                  <BookOpen size={18} />
                  {t.tutorial.close}
              </button>
              
              <div className="flex items-center gap-6">
                <a 
                    href="https://github.com/chiperman/PixelCraft-Studio"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-white transition-colors flex items-center gap-2 text-xs font-medium"
                    title={t.tutorial.github}
                >
                    <SiGithub color="currentColor" size={20} />
                    <span className="hidden sm:inline">{t.tutorial.github}</span>
                </a>
              </div>
          </div>
       </div>
    </div>
  )
}

const getSystemLanguage = (): Language => {
    const lang = navigator.language;
    if (lang.startsWith('zh-TW') || lang.startsWith('zh-HK')) return 'zh-HK';
    if (lang.startsWith('zh')) return 'zh-CN';
    if (lang.startsWith('ja')) return 'ja';
    if (lang.startsWith('ko')) return 'ko';
    if (lang.startsWith('fr')) return 'fr';
    if (lang.startsWith('de')) return 'de';
    if (lang.startsWith('es')) return 'es';
    if (lang.startsWith('pt')) return 'pt-BR';
    if (lang.startsWith('ru')) return 'ru';
    if (lang.startsWith('ar')) return 'ar';
    return 'en';
}

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
  
  const [isNotificationVisible, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [isResizeModalOpen, setIsResizeModalOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [computedIsDarkMode, setComputedIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileHeaderMenuOpen, setIsMobileHeaderMenuOpen] = useState(false);
  
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
  const lastMousePos = useRef<{x: number, y: number} | null>(null);
  const lastTouchPos = useRef<{x: number, y: number} | null>(null);
  const lastPinchDist = useRef<number | null>(null); // For pinch zoom

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
          // Header Color: Dark = Slate-900 (#0f172a), Light = Paper-50 (#FFFFFF)
          metaThemeColor.setAttribute('content', isDark ? '#0f172a' : '#ffffff');
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

  //ZQ Helper function for blank grid
  const AQ = (w: number, h: number) => Array(w * h).fill('');

  // Handle Space Key for Panning Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.key === ' ') {
            // Allow typing in inputs
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
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
              setState(s => {
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
                setState(prev => ({ 
                    ...prev, 
                    ...parsed, 
                    customPalette: loadedCustomPalette,
                    history: [parsed.grid], 
                    historyIndex: 0,
                    showDrawingLayer: parsed.showDrawingLayer ?? true,
                    showReferenceLayer: parsed.showReferenceLayer ?? true,
                    theme: parsed.theme ?? 'system', // Load saved theme
                    language: parsed.language ?? getSystemLanguage()
                }));
            }
        } catch (e) {
            console.error("Failed to load local state");
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
                    id: p.id ? String(p.id) : `gen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
                }));
                setSavedProjects(cleaned);
            }
        } catch(e) { console.error("Failed to load library"); }
    }
  }, []);

  const handleCloseTutorial = () => {
      localStorage.setItem('pixelCraftTutorialSeen', 'true');
      setIsTutorialOpen(false);
  }

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
             language: state.language
         };
         localStorage.setItem('pixelCraftState', JSON.stringify(toSave));
     }
  }, [state.grid, state.config, state.backgroundImage, state.selectedColor, state.customPalette, state.showDrawingLayer, state.showReferenceLayer, state.theme, state.language]);

  const updateGrid = useCallback((newGrid: string[], addToHistory = true) => {
    setState(prev => {
      const newHistory = addToHistory 
        ? [...prev.history.slice(0, prev.historyIndex + 1), newGrid]
        : prev.history;
        
      // Limit history size
      if (newHistory.length > 50) newHistory.shift();

      return {
        ...prev,
        grid: newGrid,
        history: newHistory,
        historyIndex: addToHistory ? newHistory.length - 1 : prev.historyIndex
      };
    });
  }, []);

  const handleUndo = useCallback(() => {
    setState(prev => {
        if (prev.historyIndex > 0) {
            const newIndex = prev.historyIndex - 1;
            return {
                ...prev,
                grid: prev.history[newIndex],
                historyIndex: newIndex
            };
        }
        return prev;
    });
  }, []);

  const handleRedo = useCallback(() => {
    setState(prev => {
        if (prev.historyIndex < prev.history.length - 1) {
            const newIndex = prev.historyIndex + 1;
            return {
                ...prev,
                grid: prev.history[newIndex],
                historyIndex: newIndex
            };
        }
        return prev;
    });
  }, []);

  const handleSetTool = useCallback((tool: ToolType) => {
     setState(s => ({ ...s, tool }));
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        // Ignore shortcuts if typing in input
        if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
            return;
        }

        const isCmdOrCtrl = e.ctrlKey || e.metaKey;

        // Tool Shortcuts (1-4)
        if (!isCmdOrCtrl && !e.altKey && !e.shiftKey) {
            switch(e.key) {
                case '1': handleSetTool('pencil'); break;
                case '2': handleSetTool('eraser'); break;
                case '3': handleSetTool('bucket'); break;
                case '4': handleSetTool('picker'); break;
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
      setState(prev => ({
          ...prev,
          backgroundImage: null 
      }));
      updateGrid(emptyGrid);
      setNotification({ msg: t.notifications.cleared, type: 'success' });
      setTimeout(() => setNotification(null), 3000);
  };

  // Import Image Logic
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'convert' | 'background') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const src = event.target?.result as string;
      if (type === 'convert') {
          try {
            const newGrid = await imageToPixelGrid(src, state.config.width, state.config.height);
            updateGrid(newGrid);
            setNotification({ msg: t.notifications.converted, type: 'success' });
          } catch (error) {
            setNotification({ msg: t.notifications.convertError, type: 'error' });
          }
      } else {
          // Reference Layer
          setState(prev => ({ ...prev, backgroundImage: src }));
          setNotification({ msg: t.notifications.refSet, type: 'success' });
      }
      setTimeout(() => setNotification(null), 3000);
    };
    reader.readAsDataURL(file);
    
    // Clear input to allow same file selection
    e.target.value = '';
  };

  const handleExport = () => {
    const canvas = document.createElement('canvas');
    canvas.width = state.config.width * state.config.size;
    canvas.height = state.config.height * state.config.size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw pixels
    state.grid.forEach((color, i) => {
      if (color) {
        const x = (i % state.config.width) * state.config.size;
        const y = Math.floor(i / state.config.width) * state.config.size;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, state.config.size, state.config.size);
      }
    });

    const link = document.createElement('a');
    link.download = `pixel-art-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setNotification({ msg: t.notifications.exported, type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleResize = (w: number, h: number) => {
      setState(prev => ({
          ...prev,
          config: { ...prev.config, width: w, height: h },
          grid: AQ(w, h), // Clear grid on resize
          history: [AQ(w, h)],
          historyIndex: 0
      }));
      setIsResizeModalOpen(false);
      setNotification({ msg: t.notifications.resized(w, h), type: 'success' });
      setTimeout(() => setNotification(null), 3000);
  }
  
  const handleEyeDropper = (color: string) => {
      setState(s => ({ ...s, selectedColor: color, tool: 'pencil' })); // Auto switch back to pencil
  };

  const handleCustomColorUpdate = (index: number, color: string) => {
      const newPalette = [...state.customPalette];
      newPalette[index] = color;
      setState(s => ({ ...s, customPalette: newPalette, selectedColor: color }));
  }

  const handleSaveProject = () => {
      // Open Library Modal in Save Mode? Or simple save?
      // Let's trigger Library Modal
      openLibrary();
  }
  
  const openLibrary = () => {
      // Load library again to be sure
      const saved = localStorage.getItem('pixelCraftLibrary');
      if (saved) {
         try {
             const parsed = JSON.parse(saved);
              // MIGRATION: Ensure all projects have an ID
            if (Array.isArray(parsed)) {
                const cleaned = parsed.map((p: any) => ({
                    ...p,
                    id: p.id ? String(p.id) : `gen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
                }));
                setSavedProjects(cleaned);
            }
         } catch(e) {}
      }
      setIsLibraryOpen(true);
  }

  const saveCurrentToLibrary = (name: string) => {
      const newProject: StoredProject = {
          id: `proj_${Date.now()}_${Math.random().toString(36).substring(2,9)}`,
          name: name,
          timestamp: Date.now(),
          thumbnail: '', // Generate thumbnail
          grid: state.grid,
          config: state.config,
          customPalette: state.customPalette,
          selectedColor: state.selectedColor,
          showDrawingLayer: state.showDrawingLayer,
          showReferenceLayer: state.showReferenceLayer,
          backgroundImage: state.backgroundImage,
          backgroundOpacity: state.backgroundOpacity
      };

      // Generate Thumbnail
      const canvas = document.createElement('canvas');
      canvas.width = state.config.width; // Save small
      canvas.height = state.config.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
          state.grid.forEach((color, i) => {
            if (color) {
                const x = i % state.config.width;
                const y = Math.floor(i / state.config.width);
                ctx.fillStyle = color;
                ctx.fillRect(x, y, 1, 1);
            }
          });
          newProject.thumbnail = canvas.toDataURL();
      }

      const updatedLibrary = [newProject, ...savedProjects];
      setSavedProjects(updatedLibrary);
      localStorage.setItem('pixelCraftLibrary', JSON.stringify(updatedLibrary));
      setNotification({ msg: t.notifications.librarySaved, type: 'success' });
      setTimeout(() => setNotification(null), 3000);
  }

  const loadProjectFromLibrary = (project: StoredProject) => {
      setState(prev => ({
          ...prev,
          grid: project.grid,
          config: project.config,
          customPalette: project.customPalette || prev.customPalette,
          selectedColor: project.selectedColor || prev.selectedColor,
          showDrawingLayer: project.showDrawingLayer ?? true,
          showReferenceLayer: project.showReferenceLayer ?? true,
          backgroundImage: project.backgroundImage || null,
          backgroundOpacity: project.backgroundOpacity || 0.5,
          history: [project.grid],
          historyIndex: 0
      }));
      setNotification({ msg: t.notifications.libraryLoaded, type: 'success' });
      setTimeout(() => setNotification(null), 3000);
  }

  const deleteProject = (id: string) => {
      const updated = savedProjects.filter(p => p.id !== id);
      setSavedProjects(updated);
      localStorage.setItem('pixelCraftLibrary', JSON.stringify(updated));
      setNotification({ msg: t.notifications.libraryDeleted, type: 'success' });
      setTimeout(() => setNotification(null), 3000);
  }

  const renameProject = (id: string, newName: string) => {
      const updated = savedProjects.map(p => p.id === id ? { ...p, name: newName } : p);
      setSavedProjects(updated);
      localStorage.setItem('pixelCraftLibrary', JSON.stringify(updated));
  }

  const handleFileLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const parsed = JSON.parse(ev.target?.result as string);
            if (parsed.grid && parsed.config) {
                setState(prev => ({
                    ...prev,
                    ...parsed,
                    history: [parsed.grid],
                    historyIndex: 0
                }));
                setNotification({ msg: t.notifications.projectLoaded, type: 'success' });
            }
        } catch (err) {
            setNotification({ msg: t.notifications.loadError, type: 'error' });
        }
        setTimeout(() => setNotification(null), 3000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleFileSave = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "pixel-craft-project.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      setNotification({ msg: t.notifications.projectSaved, type: 'success' });
      setTimeout(() => setNotification(null), 3000);
  };

  // --- PAN & ZOOM HANDLERS ---
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
      // Middle mouse or Space+Left
      const isMiddle = 'button' in e && e.button === 1;
      if (isSpacePressed || isMiddle || isMobilePanning) {
          setIsPanning(true);
          const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
          const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
          lastMousePos.current = { x: clientX, y: clientY };
      }
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
      if (isPanning && lastMousePos.current) {
          const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
          const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
          
          const dx = clientX - lastMousePos.current.x;
          const dy = clientY - lastMousePos.current.y;
          
          setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
          lastMousePos.current = { x: clientX, y: clientY };
      }
  };

  const handleMouseUp = () => {
      setIsPanning(false);
      lastMousePos.current = null;
  };

  // Touch Zoom (Pinch)
  const handleTouchStart = (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
          const dist = Math.hypot(
              e.touches[0].clientX - e.touches[1].clientX,
              e.touches[0].clientY - e.touches[1].clientY
          );
          lastPinchDist.current = dist;
      } else if (e.touches.length === 1) {
          handleMouseDown(e);
      }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
      if (e.touches.length === 2 && lastPinchDist.current !== null) {
          const dist = Math.hypot(
              e.touches[0].clientX - e.touches[1].clientX,
              e.touches[0].clientY - e.touches[1].clientY
          );
          const delta = dist - lastPinchDist.current;
          
          // Sensitivity factor
          if (Math.abs(delta) > 10) {
              const direction = delta > 0 ? 1 : -1;
               setState(s => {
                  const newSize = Math.min(60, Math.max(4, s.config.size + direction));
                  return { ...s, config: { ...s.config, size: newSize } };
              });
              lastPinchDist.current = dist;
          }
      } else if (e.touches.length === 1) {
          handleMouseMove(e);
      }
  };

  const handleTouchEnd = () => {
      lastPinchDist.current = null;
      handleMouseUp();
  };


  return (
    <div 
        className="flex h-[100dvh] w-full bg-paper-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans overflow-hidden transition-colors" 
        dir={state.language === 'ar' ? 'rtl' : 'ltr'}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleTouchEnd}
    >
      
      {/* Modals */}
      <ResizeModal 
        isOpen={isResizeModalOpen} 
        onClose={() => setIsResizeModalOpen(false)} 
        onResize={handleResize} 
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
        onSaveCurrent={saveCurrentToLibrary}
        onLoad={loadProjectFromLibrary}
        onDelete={deleteProject}
        onRename={renameProject}
        language={state.language}
      />

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <Toolbar 
        activeTool={state.tool} 
        setTool={handleSetTool}
        selectedColor={state.selectedColor}
        setColor={(c) => setState(s => ({ ...s, selectedColor: c, tool: 'pencil' }))}
        customPalette={state.customPalette}
        onUpdateCustomColor={handleCustomColorUpdate}
        onDownload={handleExport}
        onSave={handleFileSave}
        onLoad={handleFileLoad}
        onClear={handleClear}
        onImageUpload={handleImageUpload}
        onOpenLibrary={openLibrary}
        language={state.language}
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative min-w-0">
        
        {/* Header */}
        <header className="h-16 bg-paper-50 dark:bg-slate-900 border-b border-paper-200 dark:border-slate-800 flex items-center justify-between px-4 flex-shrink-0 z-40 relative">
            <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                  className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-paper-100 dark:hover:bg-slate-800 rounded-lg"
                >
                    <Menu size={20} />
                </button>

                <div className="hidden md:flex items-center gap-2">
                    <button onClick={handleUndo} className="p-2 text-slate-600 dark:text-slate-400 hover:bg-paper-100 dark:hover:bg-slate-800 rounded-lg" title={t.ui.undo}>
                        <Undo size={20} />
                    </button>
                    <button onClick={handleRedo} className="p-2 text-slate-600 dark:text-slate-400 hover:bg-paper-100 dark:hover:bg-slate-800 rounded-lg" title={t.ui.redo}>
                        <Redo size={20} />
                    </button>
                </div>

                 {/* Mobile Hand Tool Toggle */}
                 <button 
                    onClick={() => setIsMobilePanning(!isMobilePanning)}
                    className={`md:hidden p-2 rounded-lg transition-colors ${
                        isMobilePanning 
                        ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-paper-100 dark:hover:bg-slate-800'
                    }`}
                 >
                    <Hand size={20} />
                 </button>
            </div>

            {/* Mobile Title */}
            <h1 
              className="md:hidden text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent" 
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
                PixelCraft
            </h1>

            <div className="flex items-center gap-2">
                 {/* Mobile Menu Toggle */}
                 <button 
                   onClick={() => setIsMobileHeaderMenuOpen(!isMobileHeaderMenuOpen)}
                   className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-paper-100 dark:hover:bg-slate-800 rounded-lg"
                 >
                    <MoreVertical size={20} />
                 </button>

                 {/* Desktop Header Actions */}
                 <div className="hidden md:flex items-center gap-2">
                    {/* Settings Group */}
                    <div className="flex items-center bg-paper-100 dark:bg-slate-800 rounded-lg p-1 border border-paper-200 dark:border-slate-700">
                        <button 
                            onClick={() => setState(s => ({ ...s, showGrid: !s.showGrid }))}
                            className={`p-1.5 rounded-md transition-all ${state.showGrid ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'}`}
                            title={state.showGrid ? t.ui.gridOn : t.ui.gridOff}
                        >
                            <Grid3X3 size={16} />
                        </button>
                        <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                        <button 
                            onClick={() => setState(s => ({ ...s, showDrawingLayer: !s.showDrawingLayer }))}
                            className={`p-1.5 rounded-md transition-all ${!state.showDrawingLayer ? 'text-slate-400' : 'text-indigo-600 dark:text-indigo-400'}`}
                            title={t.ui.layers}
                        >
                            {state.showDrawingLayer ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button 
                            onClick={() => setState(s => ({ ...s, showReferenceLayer: !s.showReferenceLayer }))}
                             className={`p-1.5 rounded-md transition-all ${!state.showReferenceLayer ? 'text-slate-400' : 'text-green-600 dark:text-green-400'}`}
                            title={t.ui.refLayer}
                        >
                            {state.showReferenceLayer ? <ImageIcon size={16} /> : <EyeOff size={16} />}
                        </button>
                    </div>
                    
                    {/* Size Button */}
                     <button 
                        onClick={() => setIsResizeModalOpen(true)}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-paper-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2 text-xs font-medium border border-transparent hover:border-paper-200 dark:hover:border-slate-700"
                    >
                        <Settings size={16} />
                        <span>{state.config.width}x{state.config.height}</span>
                    </button>

                    {/* Theme Toggle */}
                     <button 
                        onClick={() => setState(s => ({ ...s, theme: s.theme === 'light' ? 'dark' : s.theme === 'dark' ? 'system' : 'light' }))}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-paper-100 dark:hover:bg-slate-800 rounded-lg"
                        title={`Theme: ${state.theme}`}
                    >
                        {state.theme === 'light' ? <Sun size={20} /> : state.theme === 'dark' ? <Moon size={20} /> : <Monitor size={20} />}
                    </button>
                     
                     {/* Language */}
                     <button 
                        onClick={() => {
                             const langs: Language[] = ['en', 'zh-CN', 'zh-HK', 'ja', 'ko', 'fr', 'de', 'es', 'pt-BR', 'ru', 'ar'];
                             const idx = langs.indexOf(state.language);
                             const next = langs[(idx + 1) % langs.length];
                             setState(s => ({ ...s, language: next }));
                        }}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-paper-100 dark:hover:bg-slate-800 rounded-lg font-bold text-xs"
                    >
                        {state.language.split('-')[0].toUpperCase()}
                    </button>

                     <button 
                        onClick={() => setIsTutorialOpen(true)}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-paper-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                        <HelpCircle size={20} />
                    </button>
                 </div>
            </div>
        </header>

        {/* Mobile Header Menu Dropdown */}
        {isMobileHeaderMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-paper-50 dark:bg-slate-900 border-b border-paper-200 dark:border-slate-800 shadow-2xl z-30 p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
                 {/* Mobile Actions Grid */}
                 <div className="grid grid-cols-4 gap-4">
                    <button onClick={handleUndo} className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-300">
                        <div className="p-2 bg-paper-100 dark:bg-slate-800 rounded-lg"><Undo size={20} /></div>
                        <span className="text-[10px]">{t.ui.undo}</span>
                    </button>
                     <button onClick={handleRedo} className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-300">
                        <div className="p-2 bg-paper-100 dark:bg-slate-800 rounded-lg"><Redo size={20} /></div>
                        <span className="text-[10px]">{t.ui.redo}</span>
                    </button>
                    <button onClick={() => { setIsResizeModalOpen(true); setIsMobileHeaderMenuOpen(false); }} className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-300">
                        <div className="p-2 bg-paper-100 dark:bg-slate-800 rounded-lg"><Settings size={20} /></div>
                        <span className="text-[10px]">{t.resize.title}</span>
                    </button>
                    <button onClick={() => { setIsTutorialOpen(true); setIsMobileHeaderMenuOpen(false); }} className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-300">
                         <div className="p-2 bg-paper-100 dark:bg-slate-800 rounded-lg"><HelpCircle size={20} /></div>
                        <span className="text-[10px]">Help</span>
                    </button>
                 </div>

                 <div className="h-px bg-paper-200 dark:bg-slate-800 w-full"></div>

                 {/* Toggles */}
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{t.ui.gridOn}</span>
                    <button 
                        onClick={() => setState(s => ({ ...s, showGrid: !s.showGrid }))}
                        className={`w-12 h-6 rounded-full transition-colors relative ${state.showGrid ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${state.showGrid ? 'left-7' : 'left-1'}`}></div>
                    </button>
                 </div>

                 <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Dark Mode</span>
                     <button 
                        onClick={() => setState(s => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }))}
                        className="p-2 bg-paper-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300"
                    >
                        {state.theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
                 </div>
            </div>
        )}

        {/* Canvas Area */}
        <main 
            className="flex-1 overflow-hidden relative bg-paper-100 dark:bg-slate-950 cursor-default touch-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
        >
           {/* Pixel Grid Background Pattern */}
           <div 
             className="absolute inset-0 opacity-20 pointer-events-none"
             style={{
                backgroundImage: `radial-gradient(${computedIsDarkMode ? '#1e293b' : '#D1CEC7'} 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
                transform: `translate(${panOffset.x}px, ${panOffset.y}px)`
             }}
           />

           <div 
             ref={canvasContainerRef}
             className="w-full h-full flex items-center justify-center p-8"
             style={{
                 transform: `translate(${panOffset.x}px, ${panOffset.y}px)`
             }}
           >
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
                onGridChange={(newGrid) => updateGrid(newGrid)}
                onEyeDropper={handleEyeDropper}
                isSpacePressed={isSpacePressed || isMobilePanning}
              />
           </div>
        </main>

        {/* Floating Action Button (Help) - Only on Mobile */}
        <button 
           onClick={() => setIsTutorialOpen(true)}
           className="md:hidden fixed bottom-6 right-6 w-12 h-12 bg-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center z-40 hover:bg-indigo-500 transition-transform active:scale-90"
        >
           <HelpCircle size={24} />
        </button>

      </div>

      {/* Toast Notification */}
      {isNotificationVisible && (
        <div className={`fixed bottom-8 left-1/2 md:left-[calc(50%+9rem)] transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl border flex items-center gap-3 z-[100] ${
            isNotificationVisible.type === 'success' 
             ? 'bg-paper-50 dark:bg-slate-900 border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400' 
             : 'bg-paper-50 dark:bg-slate-900 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400'
        } transition-all animate-in slide-in-from-bottom-5 fade-in duration-300`}>
           {isNotificationVisible.type === 'success' ? (
               <div className="w-2 h-2 rounded-full bg-green-500"></div>
           ) : (
               <div className="w-2 h-2 rounded-full bg-red-500"></div>
           )}
           <span className="font-medium text-sm">{isNotificationVisible.msg}</span>
        </div>
      )}

    </div>
  );
};

export default App;