

import React, { useState, useEffect, useCallback, useRef } from 'react';
import CanvasBoard from './components/CanvasBoard';
import Toolbar from './components/Toolbar';
import { AppState, DEFAULT_PALETTE, DEFAULT_SIZE, Language } from './types';
import { imageToPixelGrid, TRANSLATIONS } from './utils';
import { Undo, Redo, Grid3X3, X, Settings, Eye, EyeOff, Layers, Moon, Sun, Monitor, Globe, HelpCircle, Pencil, Palette, Move, Image as ImageIcon, Save, Layers as LayersIcon, BookOpen, MousePointer, Menu } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
       <div className="bg-paper-50 dark:bg-slate-900 p-6 rounded-xl shadow-2xl border border-paper-200 dark:border-slate-700 w-full max-w-sm animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t.resize.title}</h3>
             <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"><X size={20}/></button>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-200 text-xs p-3 rounded mb-4">
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
                    className="px-2 py-1.5 bg-paper-200 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 text-slate-600 dark:text-slate-400 text-xs font-medium rounded border border-paper-200 dark:border-slate-700 transition-colors"
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
                className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/20 transition-all"
             >
                {t.resize.apply}
             </button>
          </div>
       </div>
    </div>
  );
};

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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
       {/* Main Container - Unified layout */}
       <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-paper-200 dark:border-slate-700 w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-300 overflow-hidden">
          
          {/* Header */}
          <div className="px-8 pt-8 pb-4 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">{t.tutorial.title}</h2>
                <div className="h-1 w-12 bg-indigo-500 rounded-full"></div>
              </div>
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-white transition-colors bg-slate-100 dark:bg-slate-800 rounded-full">
                  <X size={20}/>
              </button>
          </div>

          {/* Content Grid */}
          <div className="overflow-y-auto px-8 py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
             {FEATURES.map((feature) => {
                 // @ts-ignore
                 const section = t.tutorial.sections[feature.key];
                 return (
                    <div key={feature.key} className="flex items-start gap-4 p-4 rounded-xl bg-paper-100/50 dark:bg-slate-800/50 border border-transparent hover:border-indigo-200 dark:hover:border-slate-600 hover:bg-paper-100 dark:hover:bg-slate-800 transition-all group">
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-950 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
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

          {/* Unified Action Area */}
          <div className="p-8 flex flex-col items-center justify-center gap-6 mt-auto">
               <button 
                onClick={onClose}
                className="w-full md:w-auto min-w-[200px] px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-full shadow-lg shadow-indigo-500/30 transition-all active:scale-95 hover:-translate-y-0.5 flex items-center justify-center gap-2"
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
  // Initial State Logic
  const getInitialGrid = (w: number, h: number) => Array(w * h).fill('');
  const initialCustomPalette = ['#ffffff', '#cccccc', '#999999', '#666666', '#333333'];

  const [state, setState] = useState<AppState>({
    grid: getInitialGrid(DEFAULT_SIZE, DEFAULT_SIZE),
    history: [getInitialGrid(DEFAULT_SIZE, DEFAULT_SIZE)],
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

  // Panning & Zooming State
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef<{x: number, y: number} | null>(null);

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
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
        if (state.theme === 'system') applyTheme();
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [state.theme]);

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

  const handleUndo = () => {
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
  };

  const handleRedo = () => {
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
  };

  const handleClear = () => {
      const emptyGrid = getInitialGrid(state.config.width, state.config.height);
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
      const newGrid = getInitialGrid(w, h);
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

  const showNotification = (msg: string, type: 'success' | 'error') => {
      setNotification({ msg, type });
      setTimeout(() => setNotification(null), 3000);
  };

  // Panning Event Handlers (for Container)
  const handleContainerMouseDown = (e: React.MouseEvent) => {
      // Middle mouse (button 1) or Space + Left Click (button 0)
      if (e.button === 1 || (isSpacePressed && e.button === 0)) {
          e.preventDefault();
          setIsPanning(true);
          lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
  };

  const handleContainerMouseMove = (e: React.MouseEvent) => {
      if (isPanning && canvasContainerRef.current && lastMousePos.current) {
          const dx = e.clientX - lastMousePos.current.x;
          const dy = e.clientY - lastMousePos.current.y;
          
          canvasContainerRef.current.scrollLeft -= dx;
          canvasContainerRef.current.scrollTop -= dy;
          
          lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
  };

  const handleContainerMouseUp = () => {
      setIsPanning(false);
      lastMousePos.current = null;
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
    <div className="flex h-screen w-full bg-paper-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans overflow-hidden transition-colors" dir={state.language === 'ar' ? 'rtl' : 'ltr'}>
      
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

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity" 
            onClick={() => setIsSidebarOpen(false)} 
        />
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
        language={state.language}
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
      />

      {/* Main Area */}
      <main className="flex-1 flex flex-col relative min-w-0">
        
        {/* Top Bar */}
        <header className="h-16 bg-paper-50 dark:bg-slate-900 border-b border-paper-200 dark:border-slate-800 flex items-center px-4 md:px-6 flex-shrink-0 z-30 transition-colors gap-4">
           
           {/* Mobile Menu Button */}
           <button 
             onClick={() => setIsSidebarOpen(true)}
             className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg flex-shrink-0"
           >
               <Menu size={24} />
           </button>

           <div className="flex-1 flex items-center justify-between min-w-0 gap-4">
               
               {/* LEFT SIDE: Scrollable (Undo, Redo, Size, Zoom) */}
               <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 pt-2 -mb-2 -mt-2">
                  <div className="h-10 flex items-center gap-1 bg-paper-50 dark:bg-slate-800 rounded-lg p-1 border border-paper-200 dark:border-slate-700 flex-shrink-0">
                      <button onClick={handleUndo} disabled={state.historyIndex === 0} className="p-2 hover:bg-paper-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-slate-400 rounded disabled:opacity-30 transition-colors" title={t.ui.undo}><Undo size={18} /></button>
                      <div className="w-px h-4 bg-paper-300 dark:bg-slate-700"></div>
                      <button onClick={handleRedo} disabled={state.historyIndex === state.history.length - 1} className="p-2 hover:bg-paper-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-slate-400 rounded disabled:opacity-30 transition-colors" title={t.ui.redo}><Redo size={18} /></button>
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
                         className={`p-1.5 rounded transition-colors ${state.showDrawingLayer ? 'text-indigo-500 dark:text-indigo-400 hover:bg-paper-200 dark:hover:bg-slate-700' : 'text-slate-400 hover:text-slate-500'}`}
                         title={t.ui.layers}
                      >
                         {state.showDrawingLayer ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                      <button 
                         onClick={() => setState(s => ({...s, showReferenceLayer: !s.showReferenceLayer}))}
                         disabled={!state.backgroundImage}
                         className={`p-1.5 rounded transition-colors ${
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

        {/* Canvas Container */}
        <div 
             ref={canvasContainerRef}
             onMouseDown={handleContainerMouseDown}
             onMouseMove={handleContainerMouseMove}
             onMouseUp={handleContainerMouseUp}
             onMouseLeave={handleContainerMouseUp}
             className={`flex-1 bg-paper-100 dark:bg-slate-950 overflow-auto relative transition-colors ${
                isPanning ? 'cursor-grabbing' : isSpacePressed ? 'cursor-grab' : 'cursor-default'
             }`}
             style={{
                 // Adjusted dot pattern color to be Paper 300 (a bit darker beige) for better visibility on the new warmer background
                 backgroundImage: `radial-gradient(${computedIsDarkMode ? '#1e293b' : '#D1CEC7'} 1px, transparent 1px)`,
                 backgroundSize: '20px 20px'
             }}
        >
            <div className="min-w-full min-h-full flex items-center justify-center p-12 pointer-events-none">
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
                        isSpacePressed={isSpacePressed}
                    />
                </div>
            </div>
        </div>

        {/* Floating Help Button - Bottom Right */}
        <button 
            onClick={() => setIsTutorialOpen(true)}
            className="absolute bottom-4 right-4 z-40 h-10 w-10 flex items-center justify-center bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
            title={t.tutorial.title}
        >
            <HelpCircle size={20} />
        </button>

        {/* Notification Toast */}
        {isNotificationVisible && (
            <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl border flex items-center gap-3 z-50 ${
                isNotificationVisible.type === 'success' 
                ? 'bg-paper-50 dark:bg-slate-900 border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400' 
                : 'bg-paper-50 dark:bg-slate-900 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400'
            } transition-all animate-bounce`}>
                <div className={`w-2 h-2 rounded-full ${isNotificationVisible.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium text-sm">{isNotificationVisible.msg}</span>
            </div>
        )}

      </main>
    </div>
  );
};

export default App;
