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
          // Dark: Slate-900 (#0f172a) matches Header, Light: Paper-50 (#FFFFFF) matches Header
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
      showNotification(t.notifications.cleared, "success");
  };

  const handleGridChangeFromCanvas = (newGrid: string[]) => {
     updateGrid(newGrid);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'convert' | 'background') => {
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
                     showNotification(t.notifications.converted, "success");
                }
            } catch (err) {
                showNotification(t.notifications.convertError, "error");
            }
          } else {
             setState(prev => ({ ...prev, backgroundImage: src, showReferenceLayer: true }));
             showNotification(t.notifications.refSet, "success");
          }
      };
      reader.readAsDataURL(file);
  };

  const handleExport = () => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
          const link = document.createElement('a');
          link.download = 'pixel-art.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
          showNotification(t.notifications.exported, "success");
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
        version: '1.0'
      };
      
      const blob = new Blob([JSON.stringify(projectData)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pixelcraft-project-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification(t.notifications.projectSaved, "success");
  };

  const handleLoadProject = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (json.grid && json.config) {
             setState(prev => ({
                 ...prev,
                 ...json,
                 history: [json.grid],
                 historyIndex: 0,
                 theme: json.theme || prev.theme,
                 language: json.language || prev.language
             }));
             showNotification(t.notifications.projectLoaded, "success");
          } else {
             showNotification(t.notifications.loadError, "error");
          }
        } catch (err) {
          showNotification(t.notifications.loadError, "error");
        }
        e.target.value = ''; // Reset input
      };
      reader.readAsText(file);
  };

  const handleManualResize = (w: number, h: number) => {
      const newGrid = AQ(w, h);
      setState(prev => ({
          ...prev,
          grid: newGrid,
          history: [newGrid],
          historyIndex: 0,
          config: { ...prev.config, width: w, height: h }
      }));
      setIsResizeModalOpen(false);
      showNotification(t.notifications.resized(w, h), "success");
  };

  const handleUpdateCustomColor = (index: number, color: string) => {
      setState(prev => {
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
      backgroundOpacity: state.backgroundOpacity
    };

    const updatedProjects = [newProject, ...savedProjects];
    setSavedProjects(updatedProjects);
    localStorage.setItem('pixelCraftLibrary', JSON.stringify(updatedProjects));
    showNotification(t.notifications.librarySaved, "success");
  };

  const handleLoadFromLibrary = (project: StoredProject) => {
     setState(prev => ({
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
        historyIndex: 0
     }));
     showNotification(t.notifications.libraryLoaded, "success");
  };

  const handleDeleteFromLibrary = (id: string) => {
      // Create new array excluding the target
      const updated = savedProjects.filter(p => String(p.id) !== String(id));
      setSavedProjects(updated);
      localStorage.setItem('pixelCraftLibrary', JSON.stringify(updated));
      showNotification(t.notifications.libraryDeleted, "success");
  };

  const handleRenameInLibrary = (id: string, newName: string) => {
      setSavedProjects(currentProjects => {
          const updated = currentProjects.map(p => p.id === id ? { ...p, name: newName } : p);
          localStorage.setItem('pixelCraftLibrary', JSON.stringify(updated));
          return updated;
      });
  };


  const showNotification = (msg: string, type: 'success' | 'error') => {
      setNotification({ msg, type });
      setTimeout(() => setNotification(null), 3000);
  };

  // Panning Event Handlers (for Container) - Refactored to use panOffset state
  const handleContainerMouseDown = (e: React.MouseEvent) => {
      // Middle mouse (button 1) or Space + Left Click (button 0) or Mobile Pan Mode
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
          
          setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
          
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
          // Pinch Zoom Start
          const dist = Math.hypot(
             e.touches[0].clientX - e.touches[1].clientX,
             e.touches[0].clientY - e.touches[1].clientY
          );
          lastPinchDist.current = dist;

          // Also initialize pan position for 2 fingers
          const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
          const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
          lastTouchPos.current = { x: midX, y: midY };
          setIsPanning(true); // Make sure we flag panning state

      } else if (e.touches.length === 1 && (isMobilePanning || isSpacePressed)) {
           // Single finger pan if mode is active
          const touch = e.touches[0];
          setIsPanning(true);
          lastTouchPos.current = { x: touch.clientX, y: touch.clientY };
      }
  };

  const handleContainerTouchMove = (e: React.TouchEvent) => {
      // Handle Pinch Zoom + Pan (2 fingers)
      if (e.touches.length === 2) {
          e.preventDefault(); // Prevent native browser zoom

          // 1. Zoom Logic
          if (lastPinchDist.current) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const ZS = dist - lastPinchDist.current;
            if (Math.abs(ZS) > 5) {
                const zoomDirection = ZS > 0 ? 1 : -1;
                setState(s => {
                    const newSize = Math.min(60, Math.max(4, s.config.size + zoomDirection));
                    return { ...s, config: { ...s.config, size: newSize } };
                });
                lastPinchDist.current = dist;
            }
          }

          // 2. Pan Logic (Two fingers center point)
          const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
          const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

          if (lastTouchPos.current) {
               const dx = midX - lastTouchPos.current.x;
               const dy = midY - lastTouchPos.current.y;
               setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
               lastTouchPos.current = { x: midX, y: midY };
          } else {
               // Fallback if touch start didn't catch it (shouldn't happen with updated start logic)
               lastTouchPos.current = { x: midX, y: midY };
          }
          return;
      }

      // Handle Single Finger Panning (Only if isMobilePanning mode is ON)
      if (isMobilePanning && e.touches.length === 1 && lastTouchPos.current) {
           // Prevent default to stop page scroll while panning
           if(e.cancelable) e.preventDefault();
           
           const touch = e.touches[0];
           const dx = touch.clientX - lastTouchPos.current.x;
           const dy = touch.clientY - lastTouchPos.current.y;
           
           setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
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
      setState(s => {
          const newSize = Math.min(60, Math.max(4, s.config.size + direction * 2));
          return { ...s, config: { ...s.config, size: newSize } };
              });
  };

  const handleOpacityWheel = (e: React.WheelEvent) => {
      const direction = e.deltaY < 0 ? 1 : -1;
      setState(s => {
          let newVal = s.backgroundOpacity + (direction * 0.1);
          newVal = Math.min(1, Math.max(0, newVal));
          newVal = Math.round(newVal * 10) / 10;
          return { ...s, backgroundOpacity: newVal };
      });
  };

  return (
    <div className="flex h-[100dvh] w-full bg-paper-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans overflow-hidden transition-colors" dir={state.language === 'ar' ? 'rtl' : 'ltr'}>
      
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
        language={state.language}
      />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity" 
            onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Mobile Header Menu Overlay */}
      {isMobileHeaderMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileHeaderMenuOpen(false)} 
        />
      )}

       {/* MOBILE DROPDOWN MENU PANEL (Moved to Root Level for Correct Z-Index Stacking) */}
       {isMobileHeaderMenuOpen && (
           <div className="fixed top-16 left-0 right-0 bg-paper-50 dark:bg-slate-900 border-b border-paper-200 dark:border-slate-800 shadow-2xl z-40 p-4 flex flex-col gap-4 animate-in slide-in-from-top-2 md:hidden max-h-[80vh] overflow-y-auto">
                
                {/* Size & Grid Row */}
                <div className="flex gap-3">
                     <button 
                        onClick={() => { setIsResizeModalOpen(true); setIsMobileHeaderMenuOpen(false); }}
                        className="flex-1 h-12 flex items-center justify-center gap-2 bg-paper-100 dark:bg-slate-800 hover:bg-paper-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg border border-paper-200 dark:border-slate-700 font-medium text-sm"
                    >
                        <Grid3X3 size={18} className="text-indigo-500"/>
                        {state.config.width} × {state.config.height}
                    </button>
                    <button 
                        onClick={() => setState(s => ({ ...s, showGrid: !s.showGrid }))}
                        className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-lg border text-sm font-medium ${
                            state.showGrid 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/50 dark:text-indigo-400' 
                            : 'bg-paper-100 dark:bg-slate-800 border-paper-200 dark:border-slate-700 text-slate-500'
                        }`}
                    >
                        {state.showGrid ? t.ui.gridOn : t.ui.gridOff}
                    </button>
                </div>

                {/* Zoom Row */}
                <div className="bg-paper-100 dark:bg-slate-800 p-3 rounded-lg border border-paper-200 dark:border-slate-700">
                     <div className="flex justify-between mb-2">
                         <label className="text-xs font-bold text-slate-500 uppercase">{t.ui.zoom}</label>
                         <span className="text-xs font-mono text-slate-500">{state.config.size}px</span>
                     </div>
                     <input 
                        type="range" 
                        min="4" max="60" 
                        value={state.config.size} 
                        onChange={(e) => setState(s => ({ ...s, config: { ...s.config, size: parseInt(e.target.value) } }))}
                        className="w-full accent-indigo-500 h-2 bg-paper-300 dark:bg-slate-700 rounded-lg appearance-none"
                     />
                </div>

                {/* Layers Row */}
                <div className="bg-paper-100 dark:bg-slate-800 p-3 rounded-lg border border-paper-200 dark:border-slate-700">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">{t.ui.layers}</label>
                    <div className="flex gap-2 mb-3">
                         <button 
                            onClick={() => setState(s => ({...s, showDrawingLayer: !s.showDrawingLayer}))}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors ${state.showDrawingLayer ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'bg-paper-200 dark:bg-slate-700 text-slate-500'}`}
                         >
                             {state.showDrawingLayer ? <Eye size={16} /> : <EyeOff size={16} />}
                             {t.ui.layers}
                         </button>
                         <button 
                            onClick={() => setState(s => ({...s, showReferenceLayer: !s.showReferenceLayer}))}
                            disabled={!state.backgroundImage}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors ${
                                !state.backgroundImage 
                                    ? 'opacity-50 cursor-not-allowed bg-paper-200 dark:bg-slate-700 text-slate-400' 
                                    : state.showReferenceLayer 
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                                        : 'bg-paper-200 dark:bg-slate-700 text-slate-500'
                            }`}
                         >
                             {state.showReferenceLayer ? <Eye size={16} /> : <EyeOff size={16} />}
                             {t.ui.refLayer}
                         </button>
                    </div>
                    {state.backgroundImage && state.showReferenceLayer && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                             <div className="flex justify-between mb-2">
                                 <span className="text-xs text-slate-500">{t.ui.refOpacity}</span>
                                 <span className="text-xs font-mono text-slate-500">{Math.round(state.backgroundOpacity * 100)}%</span>
                             </div>
                             <input 
                                 type="range" min="0" max="1" step="0.1"
                                 value={state.backgroundOpacity}
                                 onChange={(e) => setState(s => ({ ...s, backgroundOpacity: parseFloat(e.target.value) }))}
                                 className="w-full accent-green-500 h-2 bg-paper-300 dark:bg-slate-700 rounded-lg appearance-none"
                             />
                        </div>
                    )}
                </div>

                {/* Theme & Language Row */}
                <div className="flex gap-3">
                     <div className="flex-1 bg-paper-100 dark:bg-slate-800 rounded-lg border border-paper-200 dark:border-slate-700 overflow-hidden relative">
                         <select 
                            value={state.language}
                            onChange={(e) => setState(s => ({...s, language: e.target.value as Language}))}
                            className="w-full h-12 pl-3 pr-8 bg-paper-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 outline-none appearance-none z-10 relative"
                            style={{ colorScheme: computedIsDarkMode ? 'dark' : 'light' }}
                         >
                             <option value="en" className="bg-paper-100 dark:bg-slate-800 text-slate-900 dark:text-white">English</option>
                             <option value="zh-CN" className="bg-paper-100 dark:bg-slate-800 text-slate-900 dark:text-white">简体中文</option>
                             <option value="zh-HK" className="bg-paper-100 dark:bg-slate-800 text-slate-900 dark:text-white">繁體中文</option>
                             <option value="ja" className="bg-paper-100 dark:bg-slate-800 text-slate-900 dark:text-white">日本語</option>
                             <option value="ko" className="bg-paper-100 dark:bg-slate-800 text-slate-900 dark:text-white">한국어</option>
                             <option value="fr" className="bg-paper-100 dark:bg-slate-800 text-slate-900 dark:text-white">Français</option>
                             <option value="de" className="bg-paper-100 dark:bg-slate-800 text-slate-900 dark:text-white">Deutsch</option>
                             <option value="es" className="bg-paper-100 dark:bg-slate-800 text-slate-900 dark:text-white">Español</option>
                             <option value="pt-BR" className="bg-paper-100 dark:bg-slate-800 text-slate-900 dark:text-white">Português</option>
                             <option value="ru" className="bg-paper-100 dark:bg-slate-800 text-slate-900 dark:text-white">Русский</option>
                             <option value="ar" className="bg-paper-100 dark:bg-slate-800 text-slate-900 dark:text-white">العربية</option>
                         </select>
                         <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-0">
                             <Globe size={16} />
                         </div>
                     </div>

                     <button 
                         onClick={() => setState(s => ({...s, theme: state.theme === 'dark' ? 'light' : 'dark'}))} 
                         className="h-12 w-12 flex-shrink-0 flex items-center justify-center bg-paper-100 dark:bg-slate-800 rounded-lg border border-paper-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                     >
                         {state.theme === 'dark' || (state.theme === 'system' && computedIsDarkMode) ? <Moon size={20} /> : <Sun size={20} />}
                     </button>
                </div>

           </div>
      )}

      {/* Sidebar */}
      <Toolbar 
        activeTool={state.tool}
        setTool={(t) => setState(s => ({ ...s, tool: t }))}
        selectedColor={state.selectedColor}
        setColor={(c) => setState(s => ({ ...s, selectedColor: c }))}
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
        
        {/* Top Bar - Increased z-index to stay above overlay (z-40) */}
        <header className="h-16 bg-paper-50 dark:bg-slate-900 border-b border-paper-200 dark:border-slate-800 flex items-center px-4 md:px-6 flex-shrink-0 z-40 transition-colors gap-4 relative">
           
           {/* MOBILE LAYOUT: Simple bar with Menu, Panning, Undo/Redo, and More */}
           <div className="flex md:hidden items-center justify-between w-full h-full">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg"
                    >
                        <Menu size={24} />
                    </button>
                    
                    <div className="h-6 w-px bg-paper-300 dark:bg-slate-700 mx-1"></div>
                    
                    {/* Mobile Pan Toggle */}
                    <button 
                        onClick={() => setIsMobilePanning(!isMobilePanning)}
                        className={`p-2 rounded-lg transition-colors ${isMobilePanning ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' : 'text-slate-500 dark:text-slate-400'}`}
                        title={t.ui.pan}
                    >
                        <Hand size={22} />
                    </button>

                    <div className="flex items-center gap-1">
                        <button onClick={handleUndo} disabled={state.historyIndex === 0} className="p-2 hover:bg-paper-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg disabled:opacity-30"><Undo size={22} /></button>
                        <button onClick={handleRedo} disabled={state.historyIndex === state.history.length - 1} className="p-2 hover:bg-paper-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg disabled:opacity-30"><Redo size={22} /></button>
                    </div>
                </div>

                <button 
                    onClick={() => setIsMobileHeaderMenuOpen(!isMobileHeaderMenuOpen)}
                    className={`p-2 rounded-lg transition-colors ${isMobileHeaderMenuOpen ? 'bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}
                >
                    <MoreVertical size={24} />
                </button>
           </div>


           {/* DESKTOP LAYOUT: Full detailed controls */}
           <div className="hidden md:flex flex-1 items-center justify-between min-w-0 gap-4">
               
               {/* LEFT SIDE: Scrollable (Undo, Redo, Size, Zoom) */}
               <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 pt-2 -mb-2 -mt-2">
                  <div className="h-10 flex items-center gap-1 bg-paper-50 dark:bg-slate-800 rounded-lg p-1 border border-paper-200 dark:border-slate-700 flex-shrink-0">
                      <button onClick={handleUndo} disabled={state.historyIndex === 0} className="p-2 hover:bg-paper-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-slate-400 rounded-md disabled:opacity-30 transition-colors" title={`${t.ui.undo} (Ctrl + Z)`}><Undo size={18} /></button>
                      <div className="w-px h-4 bg-paper-300 dark:bg-slate-700"></div>
                      <button onClick={handleRedo} disabled={state.historyIndex === state.history.length - 1} className="p-2 hover:bg-paper-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-slate-400 rounded-md disabled:opacity-30 transition-colors" title={`${t.ui.redo} (Ctrl + Y)`}><Redo size={18} /></button>
                  </div>

                  <div className="h-6 w-px bg-paper-300 dark:bg-slate-800 hidden md:block flex-shrink-0"></div>

                  <button 
                    onClick={() => setIsResizeModalOpen(true)}
                    className="h-10 flex-shrink-0 flex items-center gap-2 bg-paper-50 dark:bg-slate-800 hover:bg-paper-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 rounded-lg border border-paper-200 dark:border-slate-700 transition-all group"
                  >
                      <Grid3X3 size={18} className="text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300"/>
                      <span className="text-sm font-medium hidden sm:inline">
                          {state.config.width} × {state.config.height}
                      </span>
                      <span className="text-sm font-medium sm:hidden">
                          {state.config.width}
                      </span>
                      <Settings size={14} className="ml-1 opacity-50 group-hover:opacity-100"/>
                  </button>

                   <div className="h-10 flex-shrink-0 flex items-center gap-3 bg-paper-50 dark:bg-slate-800 px-3 rounded-lg border border-paper-200 dark:border-slate-700">
                      <label className="text-xs text-slate-500 font-bold uppercase tracking-wider hidden sm:block">{t.ui.zoom}</label>
                      <input 
                        type="range" 
                        min="4" max="60" 
                        value={state.config.size} 
                        onChange={(e) => setState(s => ({ ...s, config: { ...s.config, size: parseInt(e.target.value) } }))}
                        onWheel={handleZoomWheel}
                        className="w-20 sm:w-24 accent-indigo-500 h-1.5 bg-paper-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer hover:bg-paper-400 dark:hover:bg-slate-600 transition-colors"
                      />
                  </div>
               </div>

               {/* RIGHT SIDE: Fixed (No Overflow for Dropdowns) */}
               <div className="flex items-center gap-3 flex-shrink-0 pl-2">
                   
                   {/* Layers Control */}
                   <div className="h-10 flex items-center gap-2 bg-paper-50 dark:bg-slate-800 px-3 rounded-lg border border-paper-200 dark:border-slate-700">
                      <Layers size={14} className="text-slate-500 mr-1 hidden sm:block" />
                      <button 
                         onClick={() => setState(s => ({...s, showDrawingLayer: !s.showDrawingLayer}))}
                         className={`p-1.5 rounded-md transition-colors ${state.showDrawingLayer ? 'text-indigo-500 dark:text-indigo-400 hover:bg-paper-200 dark:hover:bg-slate-700' : 'text-slate-400 hover:text-slate-500'}`}
                         title={t.ui.layers}
                      >
                         {state.showDrawingLayer ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                      <button 
                         onClick={() => setState(s => ({...s, showReferenceLayer: !s.showReferenceLayer}))}
                         disabled={!state.backgroundImage}
                         className={`p-1.5 rounded-md transition-colors ${
                            !state.backgroundImage 
                                ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' 
                                : state.showReferenceLayer 
                                    ? 'text-green-500 dark:text-green-400 hover:bg-paper-200 dark:hover:bg-slate-700' 
                                    : 'text-slate-400 hover:text-slate-500'
                         }`}
                         title={t.ui.refLayer}
                      >
                         {state.showReferenceLayer ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                   </div>

                   {state.backgroundImage && state.showReferenceLayer && (
                       <div className="h-10 flex items-center gap-3 bg-paper-50 dark:bg-slate-800 px-3 rounded-lg border border-paper-200 dark:border-slate-800">
                           <span className="text-xs text-slate-500 font-bold uppercase hidden sm:block">{t.ui.refOpacity}</span>
                           <input 
                             type="range" min="0" max="1" step="0.1"
                             value={state.backgroundOpacity}
                             onChange={(e) => setState(s => ({ ...s, backgroundOpacity: parseFloat(e.target.value) }))}
                             onWheel={handleOpacityWheel}
                             className="w-16 sm:w-20 accent-green-500 h-1.5 bg-paper-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                           />
                       </div>
                   )}
                   <button 
                     onClick={() => setState(s => ({ ...s, showGrid: !s.showGrid }))}
                     className={`h-10 px-3 rounded-lg text-xs font-bold uppercase tracking-wide transition-all border flex items-center justify-center ${
                         state.showGrid 
                         ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/50 dark:text-indigo-400' 
                         : 'bg-paper-50 dark:bg-slate-800 border-paper-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                     }`}
                   >
                       {state.showGrid ? t.ui.gridOn : t.ui.gridOff}
                   </button>

                   {/* Language Switcher */}
                   <div className="relative group z-50">
                      <button className="h-10 w-10 flex items-center justify-center bg-paper-50 dark:bg-slate-800 rounded-lg border border-paper-200 dark:border-slate-700 text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                          <Globe size={18} />
                      </button>
                      <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block">
                          <div className="bg-paper-50 dark:bg-slate-800 rounded-lg shadow-xl border border-paper-200 dark:border-slate-700 overflow-hidden max-h-80 overflow-y-auto">
                            <button onClick={() => setState(s => ({...s, language: 'en'}))} className={`w-full text-left px-4 py-2 text-sm hover:bg-paper-100 dark:hover:bg-slate-700 ${state.language === 'en' ? 'text-indigo-500 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>🇺🇸 English (US)</button>
                            <button onClick={() => setState(s => ({...s, language: 'zh-CN'}))} className={`w-full text-left px-4 py-2 text-sm hover:bg-paper-100 dark:hover:bg-slate-700 ${state.language === 'zh-CN' ? 'text-indigo-500 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>🇨🇳 中文 (简体)</button>
                            <button onClick={() => setState(s => ({...s, language: 'zh-HK'}))} className={`w-full text-left px-4 py-2 text-sm hover:bg-paper-100 dark:hover:bg-slate-700 ${state.language === 'zh-HK' ? 'text-indigo-500 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>🇭🇰 中文 (繁體)</button>
                            <button onClick={() => setState(s => ({...s, language: 'ja'}))} className={`w-full text-left px-4 py-2 text-sm hover:bg-paper-100 dark:hover:bg-slate-700 ${state.language === 'ja' ? 'text-indigo-500 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>🇯🇵 日本語</button>
                            <button onClick={() => setState(s => ({...s, language: 'ko'}))} className={`w-full text-left px-4 py-2 text-sm hover:bg-paper-100 dark:hover:bg-slate-700 ${state.language === 'ko' ? 'text-indigo-500 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>🇰🇷 한국어</button>
                            <button onClick={() => setState(s => ({...s, language: 'fr'}))} className={`w-full text-left px-4 py-2 text-sm hover:bg-paper-100 dark:hover:bg-slate-700 ${state.language === 'fr' ? 'text-indigo-500 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>🇫🇷 Français</button>
                            <button onClick={() => setState(s => ({...s, language: 'de'}))} className={`w-full text-left px-4 py-2 text-sm hover:bg-paper-100 dark:hover:bg-slate-700 ${state.language === 'de' ? 'text-indigo-500 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>🇩🇪 Deutsch</button>
                            <button onClick={() => setState(s => ({...s, language: 'es'}))} className={`w-full text-left px-4 py-2 text-sm hover:bg-paper-100 dark:hover:bg-slate-700 ${state.language === 'es' ? 'text-indigo-500 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>🇪🇸 Español (ES)</button>
                            <button onClick={() => setState(s => ({...s, language: 'pt-BR'}))} className={`w-full text-left px-4 py-2 text-sm hover:bg-paper-100 dark:hover:bg-slate-700 ${state.language === 'pt-BR' ? 'text-indigo-500 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>🇧🇷 Português (BR)</button>
                            <button onClick={() => setState(s => ({...s, language: 'ru'}))} className={`w-full text-left px-4 py-2 text-sm hover:bg-paper-100 dark:hover:bg-slate-700 ${state.language === 'ru' ? 'text-indigo-500 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>🇷🇺 Русский</button>
                            <button onClick={() => setState(s => ({...s, language: 'ar'}))} className={`w-full text-left px-4 py-2 text-sm hover:bg-paper-100 dark:hover:bg-slate-700 ${state.language === 'ar' ? 'text-indigo-500 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>🇸🇦 العربية</button>
                          </div>
                      </div>
                   </div>

                   {/* Theme Toggle - Dropdown */}
                   <div className="relative group z-50">
                      <button className="h-10 w-10 flex items-center justify-center bg-paper-50 dark:bg-slate-800 rounded-lg border border-paper-200 dark:border-slate-700 text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                          {state.theme === 'light' && <Sun size={18} />}
                          {state.theme === 'dark' && <Moon size={18} />}
                          {state.theme === 'system' && <Monitor size={18} />}
                      </button>
                      <div className="absolute right-0 top-full pt-2 w-40 hidden group-hover:block">
                          <div className="bg-paper-50 dark:bg-slate-800 rounded-lg shadow-xl border border-paper-200 dark:border-slate-700 overflow-hidden">
                            <button onClick={() => setState(s => ({...s, theme: 'light'}))} className={`w-full text-left px-4 py-2 text-sm hover:bg-paper-100 dark:hover:bg-slate-700 flex items-center gap-2 ${state.theme === 'light' ? 'text-indigo-500 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                                <Sun size={16} /> {t.ui.lightMode}
                            </button>
                            <button onClick={() => setState(s => ({...s, theme: 'dark'}))} className={`w-full text-left px-4 py-2 text-sm hover:bg-paper-100 dark:hover:bg-slate-700 flex items-center gap-2 ${state.theme === 'dark' ? 'text-indigo-500 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                                <Moon size={16} /> {t.ui.darkMode}
                            </button>
                            <button onClick={() => setState(s => ({...s, theme: 'system'}))} className={`w-full text-left px-4 py-2 text-sm hover:bg-paper-100 dark:hover:bg-slate-700 flex items-center gap-2 ${state.theme === 'system' ? 'text-indigo-500 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                                <Monitor size={16} /> {t.ui.systemMode}
                            </button>
                          </div>
                      </div>
                   </div>
               </div>
           </div>
        </header>

        {/* Canvas Container - Refactored for Pan/Zoom with Transforms */}
        <div 
             ref={canvasContainerRef}
             onMouseDown={handleContainerMouseDown}
             onMouseMove={handleContainerMouseMove}
             onMouseUp={handleContainerMouseUp}
             onMouseLeave={handleContainerMouseUp}
             onTouchStart={handleContainerTouchStart}
             onTouchMove={handleContainerTouchMove}
             onTouchEnd={handleContainerTouchEnd}
             className={`flex-1 bg-paper-100 dark:bg-slate-950 overflow-hidden relative transition-colors ${
                isPanning || isMobilePanning ? 'cursor-grabbing' : isSpacePressed ? 'cursor-grab' : 'cursor-default'
             }`}
             style={{
                 // Background dots remain static to give reference
                 backgroundImage: `radial-gradient(${computedIsDarkMode ? '#1e293b' : '#D1CEC7'} 1px, transparent 1px)`,
                 backgroundSize: '20px 20px',
                 touchAction: 'none' // Important: Disable browser default touch actions like scroll/zoom
             }}
        >
            {/* Movable/Scalable Wrapper */}
            <div 
                className="absolute top-1/2 left-1/2"
                style={{ 
                    transform: `translate(-50%, -50%) translate(${panOffset.x}px, ${panOffset.y}px)` 
                }}
            >
                <div className="shadow-2xl shadow-black/10 dark:shadow-black/50 pointer-events-auto">
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
                        onEyeDropper={(c) => setState(s => ({ ...s, selectedColor: c, tool: 'pencil' }))}
                        isSpacePressed={isSpacePressed || isMobilePanning}
                    />
                </div>
            </div>
        </div>

        {/* Floating Help Button - Bottom Right */}
        <button 
            onClick={() => setIsTutorialOpen(true)}
            className="absolute bottom-4 right-4 z-40 h-10 w-10 flex items-center justify-center bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg shadow-lg transition-all hover:scale-105 active:scale-95"
            title={t.tutorial.title}
        >
            <HelpCircle size={20} />
        </button>

        {/* Notification Toast */}
        {isNotificationVisible && (
            <div className={`fixed bottom-8 left-1/2 md:left-[calc(50%+9rem)] transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl border flex items-center gap-3 z-[100] w-max max-w-[90vw] ${
                isNotificationVisible.type === 'success' 
                ? 'bg-paper-50 dark:bg-slate-900 border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400' 
                : 'bg-paper-50 dark:bg-slate-900 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400'
            } transition-all`}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isNotificationVisible.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium text-sm whitespace-nowrap">{isNotificationVisible.msg}</span>
            </div>
        )}

      </main>
    </div>
  );
};

export default App;