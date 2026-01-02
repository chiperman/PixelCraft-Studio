import React from 'react';
import { X, Pencil, Palette, Move, Layers as LayersIcon, Image as ImageIcon, Save, BookOpen, Keyboard } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils';

export const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <kbd className="px-2 py-1 bg-[#fcf7f1] dark:bg-white/10 border-b-2 border-slate-200/60 dark:border-white/10 rounded-lg text-[10px] sm:text-xs font-mono text-slate-500 dark:text-slate-300 min-w-[20px] inline-flex justify-center items-center mx-0.5 shadow-sm">
        {children}
    </kbd>
);

interface TutorialModalProps {
    isOpen: boolean;
    onClose: () => void;
    language: Language;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose, language }) => {
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
        {
            label: t.ui.redo,
            combinations: [
                ['Ctrl', 'Y'],
                ['Ctrl', 'Shift', 'Z'],
            ],
        },
        { label: t.ui.pan, combinations: [['Space', 'Drag']] },
        { label: t.ui.zoom, combinations: [['Ctrl', 'Scroll']] },
    ];

    return (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
            <div className="glass-panel rounded-cupertino w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="px-8 pt-8 pb-4 flex justify-between items-start flex-shrink-0">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                            {t.tutorial.title}
                        </h2>
                        <div className="h-1.5 w-16 bg-indigo-500 rounded-full shadow-sm"></div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors bg-[#fcf7f1] dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 rounded-full backdrop-blur-sm"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto px-8 pb-8 flex-1 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {FEATURES.map((feature) => {
                            // @ts-ignore
                            const section = t.tutorial.sections[feature.key];
                            return (
                                <div
                                    key={feature.key}
                                    className="flex items-start gap-4 p-5 rounded-2xl bg-[#fcf7f1] dark:bg-white/5 border border-white/20 dark:border-white/5 hover:bg-white/60 dark:hover:bg-white/10 transition-all hover:scale-[1.02] shadow-sm"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white dark:bg-[#2c2c2e] rounded-2xl shadow-sm">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                                            {section.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                            {section.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Keyboard size={24} className="text-teal-500" />
                            {t.tutorial.sections.shortcuts.title}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-[#fcf7f1] dark:bg-white/5 rounded-2xl border border-white/20 dark:border-white/5 p-6 backdrop-blur-sm shadow-sm">
                                <h4 className="text-[11px] uppercase font-bold text-slate-400 mb-4 tracking-wider">
                                    {t.headers.tools}
                                </h4>
                                <div className="space-y-3">
                                    {TOOL_SHORTCUTS.map((shortcut) => (
                                        <div key={shortcut.label} className="flex items-center justify-between text-sm">
                                            <span className="text-slate-700 dark:text-slate-300 font-medium">
                                                {shortcut.label}
                                            </span>
                                            <div className="flex items-center">
                                                {shortcut.keys.map((k, i) => (
                                                    <Kbd key={i}>{k}</Kbd>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#fcf7f1] dark:bg-white/5 rounded-2xl border border-white/20 dark:border-white/5 p-6 backdrop-blur-sm shadow-sm">
                                <h4 className="text-[11px] uppercase font-bold text-slate-400 mb-4 tracking-wider">
                                    {t.headers.actions}
                                </h4>
                                <div className="space-y-3">
                                    {EDITOR_SHORTCUTS.map((shortcut) => (
                                        <div key={shortcut.label} className="flex items-center justify-between text-sm">
                                            <span className="text-slate-700 dark:text-slate-300 font-medium">
                                                {shortcut.label}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {shortcut.combinations.map((combo, i) => (
                                                    <React.Fragment key={i}>
                                                        {i > 0 && <span className="text-xs text-slate-400">or</span>}
                                                        <div className="flex items-center gap-0.5">
                                                            {combo.map((k, j) => (
                                                                <React.Fragment key={j}>
                                                                    {j > 0 && (
                                                                        <span className="text-slate-400 mx-0.5 text-[10px]">+</span>
                                                                    )}
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

                <div className="p-6 flex flex-col items-center justify-center gap-6 border-t border-white/20 dark:border-white/5 shrink-0 z-10">
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
    );
};
