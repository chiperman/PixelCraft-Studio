
import React, { useRef } from 'react';
import { ToolType, DEFAULT_PALETTE, Language } from '../types';
import { Pencil, Eraser, PaintBucket, Pipette, Download, Upload, Image as ImageIcon, Trash2, Save, FolderOpen, X } from 'lucide-react';
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
      className={`fixed inset-y-0 left-0 z-50 h-full w-72 bg-paper-50 dark:bg-slate-900 border-r border-paper-200 dark:border-slate-800 p-4 flex flex-col shadow-2xl md:shadow-none transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex flex-shrink-0 overflow-y-auto ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      
      {/* Logo & Mobile Close */}
      <div className="mb-4 mt-1 flex items-center justify-center relative w-full flex-shrink-0">
        <h1 
          className="text-lg bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent leading-relaxed text-center"
          style={{ fontFamily: '"Press Start 2P", cursive' }}
        >
          PixelCraft
        </h1>
        <button 
          onClick={onCloseSidebar}
          className="md:hidden absolute right-0 p-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
        >
          <X size={24} />
        </button>
      </div>

      {/* Tools */}
      <div className="flex flex-col gap-2 border-t border-paper-200 dark:border-slate-800 pt-4 pb-4 flex-shrink-0">
        <h3 className="text-xs uppercase font-semibold text-slate-500 tracking-wider text-left">{t.headers.tools}</h3>
        <div className="grid grid-cols-4 gap-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => { setTool(tool.id); if(window.innerWidth < 768) onCloseSidebar(); }}
              className={`p-3 rounded-lg flex justify-center items-center transition-all ${
                activeTool === tool.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-paper-200 text-slate-500 hover:bg-paper-300 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white'
              }`}
              title={tool.label}
            >
              {tool.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Palette */}
      <div className="flex flex-col gap-2 border-t border-paper-200 dark:border-slate-800 pt-4 pb-4 flex-shrink-0">
        <h3 className="text-xs uppercase font-semibold text-slate-500 tracking-wider text-left">
          {t.headers.palette}
        </h3>
        
        <div className="grid grid-cols-5 gap-1.5">
          {/* 5 Rows of Default Colors (25 Total) */}
          {DEFAULT_PALETTE.map((color) => (
            <button
              key={color}
              onClick={() => { setColor(color); if(window.innerWidth < 768) onCloseSidebar(); }}
              className={`w-full aspect-square rounded-lg border transition-all ${
                selectedColor === color
                  ? 'border-indigo-500 dark:border-white scale-110 shadow-md z-10'
                  : 'border-slate-700 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-white/50 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Custom Palette - Separated Block */}
      <div className="flex flex-col gap-2 border-t border-paper-200 dark:border-slate-800 pt-4 flex-shrink-0">
         <h3 className="text-xs uppercase font-semibold text-slate-500 tracking-wider text-left">
            {t.headers.custom}
         </h3>
         <div className="grid grid-cols-5 gap-1.5">
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
      <div className="flex flex-col gap-2 pt-4 border-t border-paper-200 dark:border-slate-800 mt-auto flex-shrink-0">
        <h3 className="text-xs uppercase font-semibold text-slate-500 tracking-wider text-left">{t.headers.actions}</h3>
        
        {/* File Actions Grid */}
        <div className="grid grid-cols-2 gap-2">
            <label className="cursor-pointer bg-paper-100 hover:bg-paper-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 p-2 rounded-lg flex flex-col items-center justify-center gap-1 text-xs transition-colors h-full">
                <FolderOpen size={18} />
                <span className="text-center text-[10px] leading-tight">{t.actions.load}</span>
                <input type="file" className="hidden" accept=".json" onChange={onLoad} />
            </label>
            <button onClick={() => { onSave(); if(window.innerWidth < 768) onCloseSidebar(); }} className="bg-paper-100 hover:bg-paper-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 p-2 rounded-lg flex flex-col items-center justify-center gap-1 text-xs transition-colors h-full">
                <Save size={18} />
                <span className="text-center text-[10px] leading-tight">{t.actions.save}</span>
            </button>

            <label className="cursor-pointer bg-paper-100 hover:bg-paper-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 p-2 rounded-lg flex flex-col items-center justify-center gap-1 text-xs transition-colors h-full">
                <ImageIcon size={18} />
                <span className="text-center text-[10px] leading-tight">{t.actions.importImg}</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => { onImageUpload(e, 'convert'); if(window.innerWidth < 768) onCloseSidebar(); }} />
            </label>
            <label className="cursor-pointer bg-paper-100 hover:bg-paper-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 p-2 rounded-lg flex flex-col items-center justify-center gap-1 text-xs transition-colors h-full">
                <Upload size={18} />
                <span className="text-center text-[10px] leading-tight">{t.actions.refLayer}</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => { onImageUpload(e, 'background'); if(window.innerWidth < 768) onCloseSidebar(); }} />
            </label>
        </div>

        {/* Primary and Destructive Actions - Stacked for consistent spacing */}
        <button onClick={() => { onDownload(); if(window.innerWidth < 768) onCloseSidebar(); }} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg flex flex-row items-center justify-center gap-2 text-xs transition-colors shadow-lg shadow-indigo-500/20">
            <Download size={18} />
            <span className="text-center text-[10px] leading-tight font-bold">{t.actions.export}</span>
        </button>

        <button 
            type="button"
            onClick={() => { onClear(); if(window.innerWidth < 768) onCloseSidebar(); }}
            className="flex items-center justify-center gap-2 p-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:border-red-800/50 dark:text-red-400 text-xs transition-all w-full font-semibold"
        >
            <Trash2 size={16} />
            {t.actions.clear}
        </button>
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
            className={`w-full aspect-square rounded-lg border transition-all cursor-pointer relative group ${
                isSelected
                  ? 'border-indigo-500 dark:border-white scale-110 shadow-md z-10'
                  : 'border-paper-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-white/50 hover:scale-105'
              }`}
            style={{ backgroundColor: color }}
            onClick={onSelect}
            onDoubleClick={() => inputRef.current?.click()}
            title="Click to select, Double-click to edit"
        >
            {/* Tiny indicator for editability */}
            <div className="absolute bottom-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="w-1 h-1 bg-black/20 dark:bg-white/50 rounded-full"></div>
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
