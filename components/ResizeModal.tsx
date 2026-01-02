import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils';

interface ResizeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onResize: (w: number, h: number) => void;
    currentWidth: number;
    currentHeight: number;
    language: Language;
}

export const ResizeModal: React.FC<ResizeModalProps> = ({
    isOpen,
    onClose,
    onResize,
    currentWidth,
    currentHeight,
    language,
}) => {
    const [width, setWidth] = useState(currentWidth);
    const [height, setHeight] = useState(currentHeight);
    const t = TRANSLATIONS[language];

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
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="bg-orange-50/80 dark:bg-orange-500/10 border border-orange-200/50 dark:border-orange-500/20 text-orange-700 dark:text-orange-200 text-xs p-3.5 rounded-2xl mb-6 backdrop-blur-sm">
                    {t.resize.warning}
                </div>

                <div className="mb-6">
                    <label className="block text-[11px] uppercase text-slate-500 font-semibold mb-2.5 tracking-wide pl-1">
                        {t.resize.presets}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {PRESETS.map((preset) => (
                            <button
                                key={preset.label}
                                onClick={() => {
                                    setWidth(preset.w);
                                    setHeight(preset.h);
                                }}
                                className="px-2 py-2.5 bg-[#fcf7f1] dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 hover:text-indigo-600 dark:hover:text-indigo-300 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-xl transition-all"
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                        <label className="block text-[11px] uppercase text-slate-500 font-semibold mb-2.5 tracking-wide pl-1">
                            {t.resize.width}
                        </label>
                        <input
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(Math.min(128, Math.max(1, parseInt(e.target.value) || 0)))}
                            className="w-full bg-[#fcf7f1] dark:bg-black/20 border border-transparent focus:border-indigo-500/30 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] uppercase text-slate-500 font-semibold mb-2.5 tracking-wide pl-1">
                            {t.resize.height}
                        </label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(Math.min(128, Math.max(1, parseInt(e.target.value) || 0)))}
                            className="w-full bg-[#fcf7f1] dark:bg-black/20 border border-transparent focus:border-indigo-500/30 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl transition-colors"
                    >
                        {t.resize.cancel}
                    </button>
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
