import React, { useRef } from 'react';
import { ToolType, DEFAULT_PALETTE, Language } from '../types';
import { ZF, Pencil, Eraser, PaintBucket, Pipette, Download, Upload, Image as ImageIcon, Trash2, Save, FolderOpen, X, Library } from 'lucide-react';
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
    { id: 'pencil', icon: <Pencil size={20} />, label: t.tools.pencil },
    { id: 'eraser', icon: <Eraser size={20} />, label: t.tools.eraser },
    { id: 'bucket', icon: <PaintBucket size={20} />, label: t.tools.fill },
    { id: 'picker', icon: <Pipette size={20} />, label: t.tools.picker },
  ] as const;

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-spring md:relative md:translate-x-0 md:flex flex-col flex-shrink-0 md:h-[calc(100vh-2rem)] md:my-4 md:ml-4 rounded-[1.25rem] glass-panel overflow-y-auto ${
        isSidebarOpen ? 'translate-x-0 h-full shadow-2xl' : '-translate-x-full md:shadow-none'
      }`}
    >
      
      <div className="p-5 pt-[calc(1.25rem+env(safe-area-inset-top))] flex flex-col h-full">
          {/* Logo & Mobile Close */}
          <div className="mb-8 mt-2 flex items-center justify-between relative w-full flex-shrink-0">
            <h1 
              className="text-lg bg-gradient-to-r from-indigo-500 to-blue-400 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent leading-relaxed text-left font-bold tracking-tight"
              style={{ fontFamily: '"Press Start 2P", cursive' }}
            >
              PixelCraft
            </h1>
            <button 
              onClick={onCloseSidebar}
              className="md:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tools */}
          <div className="flex flex-col gap-3 pb-8 flex-shrink-0">
            <h3 className="text-[11px] uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider text-left pl-1">{t.headers.tools}</h3>
            <div className="grid grid-cols-4 gap-2">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => { setTool(tool.id); if(window.innerWidth < 768) onCloseSidebar(); }}
                  className={`aspect-square rounded-2xl flex justify-center items-center transition-all duration-300 ${
                    activeTool === tool.id
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 scale-105'
                      : 'bg-white/50 dark:bg-white/5 text-slate-500 hover:bg-white dark:hover:bg-white/10 dark:text-slate-400 dark:hover:text-white border border-white/20 dark:border-white/5'
                  }`}
                  title={tool.label}
                >
                  {tool.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Palette */}
          <div className="flex flex-col gap-3 pb-8 flex-shrink-0">
            <h3 className="text-[11px] uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider text-left pl-1">
              {t.headers.palette}
            </h3>
            
            <div className="grid grid-cols-5 gap-2.5">
              {/* 5 Rows of Default Colors (25 Total) */}
              {DEFAULT_PALETTE.map((color) => (
                <button
                  key={color}
                  onClick={() => { setColor(color); if(window.innerWidth < 768) onCloseSidebar(); }}
                  className={`w-full aspect-square rounded-full border border-black/5 dark:border-white/10 transition-all duration-300 ${
                    selectedColor === color
                      ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-[#1c1c1e] scale-110 shadow-md z-10'
                      : 'hover:scale-110 hover:shadow-sm'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Custom Palette */}
          <div className="flex flex-col gap-3 pb-8 flex-shrink-0">
            <h3 className="text-[11px] uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider text-left pl-1">
                {t.headers.custom}
            </h3>
            <div className="grid grid-cols-5 gap-2.5">
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

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-auto flex-shrink-0">
            <h3 className="text-[11px] uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider text-left pl-1">{t.headers.actions}</h3>
            
            <button 
              onClick={() => { onOpenLibrary(); if(window.innerWidth < 768) onCloseSidebar(); }}
              className="w-full bg-white/50 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 border border-white/20 dark:border-white/5 text-slate-700 dark:text-slate-200 p-3.5 rounded-2xl flex flex-row items-center justify-center gap-2 text-xs transition-all font-medium active:scale-95"
            >
                <Library size={18} className="text-indigo-500" />
                <span>{t.actions.library}</span>
            </button>

            {/* File Actions Grid */}
            <div className="grid grid-cols-2 gap-2">
                <label className="cursor-pointer bg-white/50 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 border border-white/20 dark:border-white/5 text-slate-600 dark:text-slate-300 p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs transition-all h-full active:scale-95">
                    <FolderOpen size={18} />
                    <span className="text-center text-[10px] leading-tight font-medium">{t.actions.load}</span>
                    <input type="file" className="hidden" accept=".json" onChange={onLoad} />
                </label>
                <button onClick={() => { onSave(); if(window.innerWidth < 768) onCloseSidebar(); }} className="bg-white/50 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 border border-white/20 dark:border-white/5 text-slate-600 dark:text-slate-300 p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs transition-all h-full active:scale-95">
                    <Save size={18} />
                    <span className="text-center text-[10px] leading-tight font-medium">{t.actions.save}</span>
                </button>

                <label className="cursor-pointer bg-white/50 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 border border-white/20 dark:border-white/5 text-slate-600 dark:text-slate-300 p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs transition-all h-full active:scale-95">
                    <ImageIcon size={18} />
                    <span className="text-center text-[10px] leading-tight font-medium">{t.actions.importImg}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => { onImageUpload(e, 'convert'); if(window.innerWidth < 768) onCloseSidebar(); }} />
                </label>
                <label className="cursor-pointer bg-white/50 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 border border-white/20 dark:border-white/5 text-slate-600 dark:text-slate-300 p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs transition-all h-full active:scale-95">
                    <Upload size={18} />
                    <span className="text-center text-[10px] leading-tight font-medium">{t.actions.refLayer}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => { onImageUpload(e, 'background'); if(window.innerWidth < 768) onCloseSidebar(); }} />
                </label>
            </div>

            {/* Primary and Destructive Actions */}
            <button onClick={() => { onDownload(); if(window.innerWidth < 768) onCloseSidebar(); }} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white p-3.5 rounded-2xl flex flex-row items-center justify-center gap-2 text-xs transition-all shadow-lg shadow-indigo-500/30 font-semibold active:scale-95">
                <Download size={18} />
                <span className="text-center text-[10px] leading-tight">{t.actions.export}</span>
            </button>

            <button 
                type="button"
                onClick={() => { onClear(); if(window.innerWidth < 768) onCloseSidebar(); }}
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white/80 hover:bg-red-50 text-red-500 dark:bg-white/5 dark:hover:bg-red-900/20 dark:text-red-400 text-xs transition-all w-full font-semibold group active:scale-95 border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
            >
                <Trash2 size={16} className="group-hover:scale-110 transition-transform"/>
                {t.actions.clear}
            </button>
          </div>
      </div>

    </div>
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
            className={`w-full aspect-square rounded-full border border-black/5 dark:border-white/10 transition-all duration-300 cursor-pointerYZ relative group ${
                isSelected
                  ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-[#1c1c1e] scale-110 shadow-md z-10'
                  : 'hover:scale-110 hover:shadow-sm'
              }`}
            style={{ backgroundColor: color }}
            onClick={onSelect}
            onDoubleClick={() => inputRef.current?.click()}
            title="Click to select, Double-click to edit"
        >
            {/* Tiny indicator for editability */}
            <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="w-1.5 h-1.5 bg-black/20 dark:bg-white/50 rounded-full"></div>
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