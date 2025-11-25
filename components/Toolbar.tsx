import React, { useRef } from 'react';
import { ToolType, DEFAULT_PALETTE, Language } from '../types';
import { Pencil, Eraser, PaintBucket, Pipette, Download, Upload, Image as ImageIcon, Trash2, Save, FolderOpen, X, Library } from 'lucide-react';
import { TRANSLATIONS } from '../utils';

interface ToolbarProps {
  activeTool: ToolType;
  setTool: (tool: ToolType) => void;
  selectedColor: string;
  setColor: (color: string) => void;
  customPalette: string[];
  onUpdateCustomColor: (index: number, color: string) => void;
  onDownload: () => void;
  onSave: () => void;
  onLoad: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'convert' | 'background') => void;
  onOpenLibrary: () => void;
  language: Language;
  isSidebarOpen: boolean;
  onCloseSidebar: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  setTool,
  selectedColor,
  setColor,
  customPalette,
  onUpdateCustomColor,
  onDownload,
  onSave,
  onLoad,
  onClear,
  onImageUpload,
  onOpenLibrary,
  language,
  isSidebarOpen,
  onCloseSidebar,
}) => {
  
  const t = TRANSLATIONS[language];

  const tools = [
    { id: 'pencil', icon: <Pencil size={24} />, label: t.tools.pencil },
    { id: 'eraser', icon: <Eraser size={24} />, label: t.tools.eraser },
    { id: 'bucket', icon: <PaintBucket size={24} />, label: t.tools.fill },
    { id: 'picker', icon: <Pipette size={24} />, label: t.tools.picker },
  ] as const;

  return (
    <div 
      className={`fixed z-50 w-72 transform transition-transform duration-300 ease-spring rounded-[1.5rem] glass-panel overflow-y-auto md:overflow-hidden md:relative md:translate-x-0 md:flex flex-col flex-shrink-0 md:h-[calc(100vh-2rem)] md:my-4 md:ml-4 md:inset-auto custom-scrollbar border border-white/40 dark:border-white/10 ${
        isSidebarOpen 
          ? 'top-4 bottom-4 left-4 translate-x-0 shadow-2xl' 
          : 'top-4 bottom-4 left-4 -translate-x-[calc(100%+2rem)] md:shadow-none md:translate-x-0'
      }`}
    >
      
      <div className="p-4 flex flex-col h-full gap-2">
          {/* Logo & Mobile Close */}
          <div className="flex items-center justify-between relative w-full flex-shrink-0 pt-1 mb-1">
            <h1 
              className="text-xl bg-gradient-to-r from-indigo-500 to-blue-400 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent leading-relaxed text-left font-bold tracking-tight filter drop-shadow-sm"
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
              PixelCraft
            </h1>
            <button 
              onClick={onCloseSidebar}
              className="md:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tools */}
          <div className="flex flex-col gap-1.5 flex-shrink-0">
            <h3 className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider text-left pl-1">{t.headers.tools}</h3>
            <div className="grid grid-cols-4 gap-2 place-items-center">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => { setTool(tool.id); if(window.innerWidth < 768) onCloseSidebar(); }}
                  className={`w-11 h-11 rounded-xl flex justify-center items-center transition-all duration-200 groupqk relative overflow-hidden ${
                    activeTool === tool.id
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-500 ring-offset-1 ring-offset-white dark:ring-offset-[#1c1c1e] scale-105'
                      : 'bg-white/60 dark:bg-white/5 text-slate-500 hover:bg-white dark:hover:bg-white/10 dark:text-slate-400 dark:hover:text-white border border-white/20 dark:border-white/5 hover:scale-105 hover:shadow-sm'
                  }`}
                  title={tool.label}
                >
                  <div className={`transition-transform duration-200 ${activeTool === tool.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {tool.icon}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Palette Container */}
          <div className="flex flex-col gap-3 flex-shrink-0">
            
            {/* Presets */}
            <div className="flex flex-col gap-1.5">
              <h3 className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider text-left pl-1">
                {t.headers.palette}
              </h3>
              
              <div className="grid grid-cols-5 gap-2 justify-items-center">
                {DEFAULT_PALETTE.map((color) => (
                  <button
                    key={color}
                    onClick={() => { setColor(color); if(window.innerWidth < 768) onCloseSidebar(); }}
                    className={`w-9 h-9 rounded-full border border-black/5 dark:border-white/10 transition-all duration-200 ${
                      selectedColor === color
                        ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-white dark:ring-offset-[#1c1c1e] scale-110 shadow-md z-10'
                        : 'hover:scale-110 hover:shadow-sm hover:z-10'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Custom Palette */}
            <div className="flex flex-col gap-1.5">
              <h3 className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider text-left pl-1">
                  {t.headers.custom}
              </h3>
              <div className="grid grid-cols-5 gap-2 justify-items-center">
                  {customPalette.map((color, idx) => (
                    <CustomColorSlot 
                        key={idx} 
                        color={color} 
                        isSelected={selectedColor === color}
                        onSelect={() => { setColor(color); if(window.innerWidth < 768) onCloseSidebar(); }}
                        onChange={(newColor) => onUpdateCustomColor(idx, newColor)}
                    />
                  ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-auto flex-shrink-0 pt-3 border-t border-slate-200/50 dark:border-white/5">
            <h3 className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider text-left pl-1 mb-0.5">{t.headers.actions}</h3>
            
            <button 
              onClick={() => { onOpenLibrary(); if(window.innerWidth < 768) onCloseSidebar(); }}
              className="w-full h-9 bg-white/60 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 border border-white/20 dark:border-white/5 text-slate-700 dark:text-slate-200 px-4 rounded-xl flex flex-row items-center justify-center gap-3 text-sm transition-all font-semibold active:scale-[0.98] hover:shadow-sm"
            >
                <Library size={18} className="text-indigo-500" />
                <span>{t.actions.library}</span>
            </button>

            {/* Big Grid Actions */}
            <div className="grid grid-cols-2 gap-2">
                <ActionCard 
                    icon={<FolderOpen size={22}/>} 
                    label={t.actions.load} 
                    isFile
                >
                    <input type="file" className="hidden" accept=".json" onChange={onLoad} />
                </ActionCard>

                <ActionCard 
                    icon={<Save size={22}/>} 
                    label={t.actions.save} 
                    onClick={() => { onSave(); if(window.innerWidth < 768) onCloseSidebar(); }}
                />

                <ActionCard 
                    icon={<ImageIcon size={22}/>} 
                    label={t.actions.importImg} 
                    isFile
                >
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => { onImageUpload(e, 'convert'); if(window.innerWidth < 768) onCloseSidebar(); }} />
                </ActionCard>

                <ActionCard 
                    icon={<Upload size={22}/>} 
                    label={t.actions.refLayer} 
                    isFile
                >
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => { onImageUpload(e, 'background'); if(window.innerWidth < 768) onCloseSidebar(); }} />
                </ActionCard>
            </div>

            <div className="flex flex-col gap-2 mt-1">
                <button onClick={() => { onDownload(); if(window.innerWidth < 768) onCloseSidebar(); }} className="w-full h-9 bg-indigo-500 hover:bg-indigo-600 text-white px-4 rounded-xl flex flex-row items-center justify-center gap-3 text-sm transition-all shadow-lg shadow-indigo-500/30 font-bold active:scale-[0.98]">
                    <Download size={18} />
                    <span>{t.actions.export}</span>
                </button>

                <button 
                    type="button"
                    onClick={() => { onClear(); if(window.innerWidth < 768) onCloseSidebar(); }}
                    className="flex items-center justify-center h-9 gap-3 px-4 rounded-xl bg-white/80 hover:bg-red-50 text-red-500 dark:bg-white/5 dark:hover:bg-red-900/20 dark:text-red-400 text-sm transition-all w-full font-bold group active:scale-[0.98] border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                >
                    <Trash2 size={18} className="group-hover:scale-110 transition-transform"/>
                    {t.actions.clear}
                </button>
            </div>
          </div>
      </div>

    </div>
  );
};

// Larger Action Card Component
const ActionCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    isFile?: boolean;
    children?: React.ReactNode;
}> = ({ icon, label, onClick, isFile, children }) => {
    // Increased min-h and padding
    const className = "group relative w-full bg-white/60 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 border border-white/20 dark:border-white/5 text-slate-700 dark:text-slate-200 p-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.98] hover:shadow-md min-h-[56px] cursor-pointer";
    
    const content = (
        <>
            <div className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-300 group-hover:scale-110">
                {icon}
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-center leading-tight tracking-wide">{label}</span>
        </>
    );

    if (isFile) {
        return (
            <label className={className}>
                {children}
                {content}
            </label>
        );
    }
    
    return (
        <button onClick={onClick} className={className}>
            {content}
        </button>
    );
};

// Helper component for Custom Color Logic
const CustomColorSlot: React.FC<{
    color: string; 
    isSelected: boolean; 
    onSelect: () => void; 
    onChange: (c: string) => void;
}> = ({ color, isSelected, onSelect, onChange }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div 
            className={`w-9 h-9 rounded-full border border-black/5 dark:border-white/10 transition-all duration-300 cursor-pointer relative group ${
                isSelected
                  ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-white dark:ring-offset-[#1c1c1e] scale-110 shadow-md z-10'
                  : 'hover:scale-110 hover:shadow-sm hover:z-10'
              }`}
            style={{ backgroundColor: color }}
            onClick={onSelect}
            onDoubleClick={() => inputRef.current?.click()}
            title="Click to select, Double-click to edit"
        >
            {/* Tiny indicator for editability */}
            <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="w-1.5 h-1.5 bg-black/20 dark:bg-white/50 rounded-full shadow-sm"></div>
            </div>
            
            <input 
                ref={inputRef}
                type="color" 
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="invisible absolute bottom-0 right-0 w-0 h-0"
            />
        </div>
    )
}

export default Toolbar;