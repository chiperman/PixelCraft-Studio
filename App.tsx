import React, { useState, useEffect, useCallback, useRef } from 'react';
import CanvasBoard from './components/CanvasBoard';
import Toolbar from './components/Toolbar';
import ProjectLibraryModal from './components/ProjectLibraryModal';
import { AppState, DEFAULT_PALETTE, DEFAULT_SIZE, Language, ToolType, StoredProject } from './types';
import { imageToPixelGrid, TRANSLATIONS } from './utils';
import { Undo, Redo, Grid3X3, X, Settings, Eye, EyeOff, Layers, Moon, Sun, Monitor, Globe, HelpCircle, Pencil, Palette, Move, Image as ImageIcon, Save, LayersIcon, BookOpen, Keyboard, MoreVertical, Hand, Menu, Check, ChevronDown } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';

// Custom Select Component for Language
const CustomSelect = ({ value, onChange, options, isDarkMode, className = "h-12" }: { value: string, onChange: (val: string) => void, options: {code: string, label: string}[], isDarkMode: boolean, className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            setIsOpen(false);
        }
    }
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const selectedLabel = options.find((o) => o.code === value)?.label || value;

  return (
    <div className="relative flex-1 min-w-0" ref={containerRef}>
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between px-3 bg-white/50 dark:bg-white/5 rounded-xl border border-white/20 dark:border-white/5 text-slate-700 dark:text-slate-200 transition-all active:scale-[0.98] hover:bg-white/70 dark:hover:bg-white/10 ${className}`}
        >
            <span className="flex items-center gap-2 truncate pr-2">
                <Globe size={16} className="opacity-70 shrink-0" />
                <span className="text-sm font-medium truncate">{selectedLabel}</span>
            </span>
            <ChevronDown size={16} className={`opacity-50 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 p-1 bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
                {options.map((opt) => (
                    <button
                        key={opt.code}
                        onClick={() => { onChange(opt.code); setIsOpen(false); }}
                        className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors flex items-center justify-between group ${
                            value === opt.code 
                            ? 'bg-indigo-500 text-white shadow-md' 
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                        }`}
                    >
                        <span>{opt.label}</span>
                        {value === opt.code && <Check size={14} />}
                    </button>
                ))}
            </div>
        )}
    </div>
  )
}

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
    <div className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
       <div className="glass-panel p-6 rounded-cupertino w-full max-w-sm animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.resize.title}</h3>
             <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"><X size={20}/></button>
          </div>
          
          <div className="bg-orange-50/80 dark:bg-orange-500/10 border border-orange-200/50 dark:border-orange-500/20 text-orange-700 dark:text-orange-200 text-xs p-3.5 rounded-2xl mb-6 backdrop-blur-sm">
             {t.resize.warning}
          </div>

          {/* Presets */}
          <div className="mb-6">
             <label className="block text-[11px] uppercase text-slate-500 font-semibold mb-2.5 tracking-wide pl-1">{t.resize.presets}</label>
             <div className="grid grid-cols-3 gap-2">
               {PRESETS.map((preset) => (
                 <button
                    key={preset.label}
                    onClick={() => { setWidth(preset.w); setHeight(preset.h); }}
                    className="px-2 py-2.5 bg-white/60 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 hover:text-indigo-600 dark:hover:text-indigo-300 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-xl transition-all"
                 >
                   {preset.label}
                 </button>
               ))}
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-[11px] uppercase text-slate-500 font-semibold mb-2.5 tracking-wide pl-1">{t.resize.width}</label>
              <input 
                type="number" 
                value={width} 
                onChange={e => setWidth(Math.min(128, Math.max(1, parseInt(e.target.value) || 0)))} 
                className="w-full bg-white/60 dark:bg-black/20 border border-transparent focus:border-indigo-500/30 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-sm" 
                min="1" 
                max="128" 
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase text-slate-500 font-semibold mb-2.5 tracking-wide pl-1">{t.resize.height}</label>
              <input 
                type="number" 
                value={height} 
                onChange={e => setHeight(Math.min(128, Math.max(1, parseInt(e.target.value) || 0)))} 
                className="w-full bg-white/60 dark:bg-black/20 border border-transparent focus:border-indigo-500/30 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-sm" 
                min="1" 
                max="128" 
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
             <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl transition-colors">{t.resize.cancel}</button>
             <button 
                onClick={() => onResize(width, height)} 
                className="px-6 py-2.5 text-sm font-semibold bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
             >
                {t.resize.apply}
             </button>
          </div>
       </div>
    </div>
  );
};

const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd className="px-2 py-1 bg-white/60 dark:bg-white/10 border-b-2 border-slate-200/60 dark:border-white/10 rounded-lg text-[10px] sm:text-xs font-mono text-slate-500 dark:text-slate-300 min-w-[20px] inline-flex justify-center items-center mx-0.5 shadow-sm">
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
    <div className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
       {/* Main Container - Unified layout */}
       <div className="glass-panel rounded-cupertino w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
          
          {/* Header */}
          <div className="px-8 pt-8 pb-4 flex justify-between items-start flex-shrink-0">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{t.tutorial.title}</h2>
                <div className="h-1.5 w-16 bg-indigo-500 rounded-full shadow-sm"></div>
              </div>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 rounded-full backdrop-blur-sm">
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
                        <div key={feature.key} className="flex items-start gap-4 p-5 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/5 hover:bg-white/60 dark:hover:bg-white/10 transition-all hover:scale-[1.02] shadow-sm">
                            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white dark:bg-[#2c2c2e] rounded-2xl shadow-sm">
                                {feature.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{section.title}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {section.desc}
                                </p>
                            </div>
                        </div>
                     )
                 })}
              </div>

              {/* Shortcuts Section */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Keyboard size={24} className="text-teal-500" />
                    {t.tutorial.sections.shortcuts.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tools Shortcuts */}
                    <div className="bg-white/40 dark:bg-white/5 rounded-2xl border border-white/20 dark:border-white/5 p-6 backdrop-blur-sm shadow-sm">
                        <h4 className="text-[11px] uppercase font-bold text-slate-400 mb-4 tracking-wider">{t.headers.tools}</h4>
                        <div className="space-y-3">
                            {TOOL_SHORTCUTS.map((shortcut) => (
                                <div key={shortcut.label} className="flex items-center justify-between text-sm">
                                    <span className="text-slate-700 dark:text-slate-300 font-medium">{shortcut.label}</span>
                                    <div className="flex items-center">
                                        {shortcut.keys.map((k, i) => <Kbd key={i}>{k}</Kbd>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Editor Shortcuts */}
                    <div className="bg-white/40 dark:bg-white/5 rounded-2xl border border-white/20 dark:border-white/5 p-6 backdrop-blur-sm shadow-sm">
                         <h4 className="text-[11px] uppercase font-bold text-slate-400 mb-4 tracking-wider">Editor</h4>
                         <div className="space-y-3">
                            {EDITOR_SHORTCUTS.map((shortcut) => (
                                <div key={shortcut.label} className="flex items-center justify-between text-sm">
                                    <span className="text-slate-700 dark:text-slate-300 font-medium">{shortcut.label}</span>
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
          <div className="p-6 flex flex-col items-center justify-center gap-6 bg-white/40 dark:bg-[#1c1c1e]/50 border-t border-white/20 dark:border-white/5 shrink-0 backdrop-blur-xl">
               <button 
                onClick={onClose}
                className="w-full md:w-auto min-w-[200px] px-8 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                  <BookOpen size={18} />
                  {t.tutorial.close}
              </button>
              
              <div className="flex items-center gap-6">
                <a 
                    href="https://github.com/chiperman/PixelCraft-Studio"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-800 dark:text-slate-500 dark:hover:text-white transition-colors flex items-center gap-2 text-xs font-medium"
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

const SUPPORTED_LANGUAGES = [
    { code: 'en', label: '🇺🇸 English' },
    { code: 'zh-CN', label: '🇨🇳 简体中文' },
    { code: 'zh-HK', label: '🇭🇰 繁體中文' },
    { code: 'ja', label: '🇯🇵 日本語' },
    { code: 'ko', label: '🇰🇷 한국어' },
    { code: 'fr', label: '🇫🇷 Français' },
    { code: 'de', label: '🇩🇪 Deutsch' },
    { code: 'es', label: '🇪🇸 Español' },
    { code: 'pt-BR', label: '🇧🇷 Português' },
    { code: 'ru', label: '🇷🇺 Русский' },
    { code: 'ar', label: '🇸🇦 العربية' }
];

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
          metaThemeColor.setAttribute('content', isDark ? '#000000' : '#fbfbfd');
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

  // Helper function for blank grid
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
                setState(s => {
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
               setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
               lastTouchPos.current = { x: midX, y: midY };
          } else {
               lastTouchPos.current = { x: midX, y: midY };
          }
          return;
      }
      if (isMobilePanning && e.touches.length === 1 && lastTouchPos.current) {
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
    <div className="flex h-[100dvh] w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors selection:bg-indigo-500/30" dir={state.language === 'ar' ? 'rtl' : 'ltr'}>
      
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
                        onClick={() => { setIsResizeModalOpen(true); setIsMobileHeaderMenuOpen(false); }}
                        className="flex-1 h-12 flex items-center justify-center gap-2 bg-white/50 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 rounded-xl border border-white/20 dark:border-white/5 font-medium text-sm transition-colors active:scale-95"
                    >
                        <Grid3X3 size={18} className="text-indigo-500"/>
                        {state.config.width} × {state.config.height}
                    </button>
                    <button 
                        onClick={() => setState(s => ({ ...s, showGrid: !s.showGrid }))}
                        className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-xl border border-white/20 dark:border-white/5 text-sm font-medium transition-colors active:scale-95 ${
                            state.showGrid 
                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 border-transparent' 
                            : 'bg-white/50 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                        }`}
                    >
                        {state.showGrid ? t.ui.gridOn : t.ui.gridOff}
                    </button>
                </div>

                {/* Zoom Row */}
                <div className="bg-white/40 dark:bg-white/5 p-4 rounded-2xl border border-white/20 dark:border-white/5 shadow-sm">
                     <div className="flex justify-between mb-3">
                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.ui.zoom}</label>
                         <span className="text-[10px] font-mono text-slate-500">{state.config.size}px</span>
                     </div>
                     <input 
                        type="range" 
                        min="4" max="60" 
                        value={state.config.size} 
                        onChange={(e) => setState(s => ({ ...s, config: { ...s.config, size: parseInt(e.target.value) } }))}
                        className="w-full accent-indigo-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                     />
                </div>

                {/* Layers Row */}
                <div className="bg-white/40 dark:bg-white/5 p-4 rounded-2xl border border-white/20 dark:border-white/5 shadow-sm">
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-3 block tracking-widest">{t.ui.layers}</label>
                    <div className="flex gap-2 mb-4">
                         <button 
                            onClick={() => setState(s => ({...s, showDrawingLayer: !s.showDrawingLayer}))}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors active:scale-95 ${state.showDrawingLayer ? 'bg-indigo-500 text-white shadow-md' : 'bg-slate-200/50 dark:bg-white/5 text-slate-500'}`}
                         >
                             {state.showDrawingLayer ? <Eye size={16} /> : <EyeOff size={16} />}
                             {t.ui.layers}
                         </button>
                         <button 
                            onClick={() => setState(s => ({...s, showReferenceLayer: !s.showReferenceLayer}))}
                            disabled={!state.backgroundImage}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors active:scale-95 ${
                                !state.backgroundImage 
                                    ? 'opacity-50 cursor-not-allowed bg-slate-200/50 dark:bg-white/5 text-slate-400' 
                                    : state.showReferenceLayer 
                                        ? 'bg-green-500 text-white shadow-md' 
                                        : 'bg-slate-200/50 dark:bg-white/5 text-slate-500'
                            }`}
                         >
                             {state.showReferenceLayer ? <Eye size={16} /> : <EyeOff size={16} />}
                             {t.ui.refLayer}
                         </button>
                    </div>
                    {state.backgroundImage && state.showReferenceLayer && (
                        <div className="pt-3 border-t border-slate-200/50 dark:border-white/10">
                             <div className="flex justify-between mb-2">
                                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.ui.refOpacity}</span>
                                 <span className="text-[10px] font-mono text-slate-500">{Math.round(state.backgroundOpacity * 100)}%</span>
                             </div>
                             <input 
                                 type="range" min="0" max="1" step="0.1"
                                 value={state.backgroundOpacity}
                                 onChange={(e) => setState(s => ({ ...s, backgroundOpacity: parseFloat(e.target.value) }))}
                                 className="w-full accent-green-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                             />
                        </div>
                    )}
                </div>

                {/* Theme & Language Row */}
                <div className="flex gap-3">
                     <CustomSelect 
                        value={state.language}
                        onChange={(val) => setState(s => ({...s, language: val as Language}))}
                        options={SUPPORTED_LANGUAGES}
                        isDarkMode={computedIsDarkMode}
                     />

                     <button 
                         onClick={() => setState(s => ({...s, theme: state.theme === 'dark' ? 'light' : 'dark'}))} 
                         className="h-12 w-12 flex-shrink-0 flex items-center justify-center bg-white/50 dark:bg-white/5 rounded-xl border border-white/20 dark:border-white/5 text-slate-700 dark:text-slate-200 active:scale-95 transition-all shadow-sm"
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
        
        {/* Top Bar (Floating Glass) */}
        <div className="absolute top-0 left-0 right-0 z-40 p-4 pt-[calc(1rem+env(safe-area-inset-top))] pointer-events-none">
            <header className="h-16 glass-panel rounded-cupertino flex items-center px-4 md:px-6 pointer-events-auto justify-between shadow-sm transition-all animate-in slide-in-from-top-4 duration-500">
            
            {/* MOBILE LAYOUT */}
            <div className="flex md:hidden items-center justify-between w-full h-full">
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        
                        <div className="h-5 w-px bg-slate-200/50 dark:bg-white/10 mx-1"></div>
                        
                        <button 
                            onClick={() => setIsMobilePanning(!isMobilePanning)}
                            className={`p-2.5 rounded-xl transition-all ${isMobilePanning ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10'}`}
                            title={t.ui.pan}
                        >
                            <Hand size={20} />
                        </button>

                        <div className="flex items-center gap-1">
                            <button onClick={handleUndo} disabled={state.historyIndex === 0} className="p-2.5 hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 rounded-xl disabled:opacity-30 transition-colors"><Undo size={20} /></button>
                            <button onClick={handleRedo} disabled={state.historyIndex === state.history.length - 1} className="p-2.5 hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 rounded-xl disabled:opacity-30 transition-colors"><Redo size={20} /></button>
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsMobileHeaderMenuOpen(!isMobileHeaderMenuOpen)}
                        className={`p-2.5 rounded-xl transition-colors ${isMobileHeaderMenuOpen ? 'bg-indigo-500 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10'}`}
                    >
                        <MoreVertical size={20} />
                    </button>
            </div>


            {/* DESKTOP LAYOUT */}
            <div className="hidden md:flex flex-1 items-center justify-between min-w-0 gap-4">
                
                {/* LEFT SIDE: Undo/Redo & Size */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white/50 dark:bg-white/5 rounded-xl p-1 border border-white/20 dark:border-white/5 shadow-sm">
                        <button onClick={handleUndo} disabled={state.historyIndex === 0} className="p-2 hover:bg-white dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-slate-400 rounded-lg disabled:opacity-30 transition-all shadow-sm hover:shadow" title={`${t.ui.undo} (Ctrl + Z)`}><Undo size={18} /></button>
                        <div className="w-px h-4 bg-slate-300/50 dark:bg-white/10 mx-1"></div>
                        <button onClick={handleRedo} disabled={state.historyIndex === state.history.length - 1} className="p-2 hover:bg-white dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-slate-400 rounded-lg disabled:opacity-30 transition-all shadow-sm hover:shadow" title={`${t.ui.redo} (Ctrl + Y)`}><Redo size={18} /></button>
                    </div>

                    <button 
                        onClick={() => setIsResizeModalOpen(true)}
                        className="h-10 flex items-center gap-2 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 px-4 rounded-xl border border-white/20 dark:border-white/5 transition-all group hover:shadow-sm"
                    >
                        <Grid3X3 size={18} className="text-indigo-500 group-hover:scale-110 transition-transform"/>
                        <span className="text-sm font-semibold hidden sm:inline">
                            {state.config.width} × {state.config.height}
                        </span>
                        <Settings size={14} className="ml-1 opacity-50 group-hover:opacity-100"/>
                    </button>

                    <div className="h-10 flex items-center gap-3 bg-white/50 dark:bg-white/5 px-4 rounded-xl border border-white/20 dark:border-white/5 shadow-sm">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest hidden sm:block">{t.ui.zoom}</label>
                        <input 
                            type="range" 
                            min="4" max="60" 
                            value={state.config.size} 
                            onChange={(e) => setState(s => ({ ...s, config: { ...s.config, size: parseInt(e.target.value) } }))}
                            onWheel={handleZoomWheel}
                            className="w-24 accent-indigo-500 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                {/*ZG RIGHT SIDE: Layers, Grid, Theme */}
                <div className="flex items-center gap-3 pl-2">
                    
                    {/* Layers Control */}
                    <div className="h-10 flex items-center gap-1 bg-white/50 dark:bg-white/5 px-2 rounded-xl border border-white/20 dark:border-white/5 shadow-sm">
                        <Layers size={16} className="text-slate-400 mx-2 hidden sm:block" />
                        <button 
                            onClick={() => setState(s => ({...s, showDrawingLayer: !s.showDrawingLayer}))}
                            className={`p-1.5 rounded-lg transition-all ${state.showDrawingLayer ? 'bg-white dark:bg-white/20 text-indigo-500 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-500'}`}
                            title={t.ui.layers}
                        >
                            {state.showDrawingLayer ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                        <button 
                            onClick={() => setState(s => ({...s, showReferenceLayer: !s.showReferenceLayer}))}
                            disabled={!state.backgroundImage}
                            className={`p-1.5 rounded-lg transition-all ${
                                !state.backgroundImage 
                                    ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' 
                                    : state.showReferenceLayer 
                                        ? 'bg-white dark:bg-white/20 text-green-500 shadow-sm' 
                                        : 'text-slate-400 hover:text-slate-500'
                            }`}
                            title={t.ui.refLayer}
                        >
                            {state.showReferenceLayer ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                    </div>

                    {state.backgroundImage && state.showReferenceLayer && (
                        <div className="h-10 flex items-center gap-3 bg-white/50 dark:bg-white/5 px-3 rounded-xl border border-white/20 dark:border-white/5 animate-in fade-in slide-in-from-right-2 shadow-sm">
                            <span className="text-[10px] text-slate-500 font-bold uppercase hidden sm:block tracking-widest">{t.ui.refOpacity}</span>
                            <input 
                                type="range" min="0" max="1" step="0.1"
                                value={state.backgroundOpacity}
                                onChange={(e) => setState(s => ({ ...s, backgroundOpacity: parseFloat(e.target.value) }))}
                                onWheel={handleOpacityWheel}
                                className="w-16 sm:w-20 accent-green-500 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer"
                            />
                        </div>
                    )}
                    <button 
                        onClick={() => setState(s => ({ ...s, showGrid: !s.showGrid }))}
                        className={`h-10 px-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border flex items-center justify-center ${
                            state.showGrid 
                            ? 'bg-indigo-500 text-white border-transparent shadow-md shadow-indigo-500/20' 
                            : 'bg-white/50 dark:bg-white/5 border-white/20 dark:border-white/5 text-slate-500 hover:bg-white dark:hover:bg-white/10 shadow-sm'
                        }`}
                    >
                        {state.showGrid ? t.ui.gridOn : t.ui.gridOff}
                    </button>

                    {/* Language Switcher */}
                    <div className="relative group z-50 w-40">
                         <CustomSelect 
                            value={state.language}
                            onChange={(val) => setState(s => ({...s, language: val as Language}))}
                            options={SUPPORTED_LANGUAGES}
                            isDarkMode={computedIsDarkMode}
                            className="h-10"
                        />
                    </div>

                    {/* Theme Toggle */}
                    <div className="relative group z-50">
                        <button className="h-10 w-10 flex items-center justify-center bg-white/50 dark:bg-white/5 rounded-xl border border-white/20 dark:border-white/5 text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-white transition-colors hover:bg-white dark:hover:bg-white/10 shadow-sm">
                            {state.theme === 'light' && <Sun size={18} />}
                            {state.theme === 'dark' && <Moon size={18} />}
                            {state.theme === 'system' && <Monitor size={18} />}
                        </button>
                        <div className="absolute right-0 top-full pt-2 w-40 hidden group-hover:block">
                            <div className="glass-panel rounded-xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden p-1">
                                <button onClick={() => setState(s => ({...s, theme: 'light'}))} className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 transition-colors ${state.theme === 'light' ? 'bg-indigo-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'}`}>
                                    <Sun size={16} /> {t.ui.lightMode}
                                </button>
                                <button onClick={() => setState(s => ({...s, theme: 'dark'}))} className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 transition-colors ${state.theme === 'dark' ? 'bg-indigo-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'}`}>
                                    <Moon size={16} /> {t.ui.darkMode}
                                </button>
                                <button onClick={() => setState(s => ({...s, theme: 'system'}))} className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 transition-colors ${state.theme === 'system' ? 'bg-indigo-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'}`}>
                                    <Monitor size={16} /> {t.ui.systemMode}
                                </button>
                            </div>
                        </div>
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
             className={`flex-1 overflow-hidden relative transition-colors ${
                isPanning || isMobilePanning ? 'cursor-grabbing' : isSpacePressed ? 'cursor-grab' : 'cursor-default'
             }`}
             style={{
                 // Clean dot pattern - Cupertino Style
                 backgroundImage: `radial-gradient(${computedIsDarkMode ? '#3a3a3c' : '#d1d1d6'} 1px, transparent 1px)`,
                 backgroundSize: '24px 24px',
                 backgroundColor: computedIsDarkMode ? '#000000' : '#f5f5f7',
                 touchAction: 'none'
             }}
        >
            {/* Movable/Scalable Wrapper */}
            <div 
                className="absolute top-1/2 left-1/2"
                style={{ 
                    transform: `translate(-50%, -50%) translate(${panOffset.x}px, ${panOffset.y}px)` 
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
                        onEyeDropper={(c) => setState(s => ({ ...s, selectedColor: c, tool: 'pencil' }))}
                        isSpacePressed={isSpacePressed || isMobilePanning}
                    />
                </div>
            </div>
        </div>

        {/* Floating Help Button */}
        <button 
            onClick={() => setIsTutorialOpen(true)}
            className="absolute bottom-6 right-6 z-40 h-12 w-12 flex items-center justify-center bg-white/75 dark:bg-[#1c1c1e]/75 hover:bg-white dark:hover:bg-[#2c2c2e] text-slate-600 dark:text-slate-300 rounded-full shadow-lg backdrop-blur-md transition-all hover:scale-110 active:scale-95 border border-white/20 dark:border-white/10"
            title={t.tutorial.title}
        >
            <HelpCircle size={24} />
        </button>

        {/* Notification Toast */}
        {isNotificationVisible && (
            <div className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 z-[100] w-max max-w-[90vw] whitespace-nowrap glass-panel animate-in slide-in-from-bottom-5 fade-in duration-300 backdrop-blur-xl ${
                isNotificationVisible.type === 'success' 
                ? 'border-green-500/20 text-green-600 dark:text-green-400' 
                : 'border-red-500/20 text-red-600 dark:text-red-400'
            }`}>
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm ${isNotificationVisible.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-semibold text-sm">{isNotificationVisible.msg}</span>
            </div>
        )}

      </main>
    </div>
  );
};

export default App;