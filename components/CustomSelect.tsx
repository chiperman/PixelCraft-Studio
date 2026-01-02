import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface CustomSelectProps {
    value: string;
    onChange: (val: string) => void;
    options: { code: string; label: string }[];
    isDarkMode: boolean;
    className?: string;
    labelClass?: string;
    chevronClass?: string;
    containerClass?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
    value,
    onChange,
    options,
    isDarkMode,
    className = 'w-full h-12 justify-between px-3',
    labelClass = '',
    chevronClass = '',
    containerClass = 'flex-1 min-w-0',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState<{
        top?: number;
        bottom?: number;
        left: number;
        width: number;
    } | null>(null);

    const toggleOpen = () => {
        if (isOpen) {
            setIsOpen(false);
        } else {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const spaceBelow = viewportHeight - rect.bottom;
                const spaceAbove = rect.top;

                // Decide whether to open upwards or downwards
                const openUp = spaceBelow < 250 && spaceAbove > spaceBelow;

                setCoords({
                    left: rect.left,
                    width: Math.max(rect.width, 160),
                    ...(openUp ? { bottom: viewportHeight - rect.top + 8 } : { top: rect.bottom + 8 }),
                });
                setIsOpen(true);
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleScroll = (e: Event) => {
            if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) {
                return;
            }
            setIsOpen(false);
        };

        const handleResize = () => setIsOpen(false);

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('scroll', handleScroll, true);
            window.addEventListener('resize', handleResize);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpen]);

    const selectedLabel = options.find((o) => o.code === value)?.label || value;

    return (
        <div className={`relative ${containerClass}`} ref={containerRef}>
            <button
                onClick={toggleOpen}
                className={`flex items-center bg-[#fcf7f1] dark:bg-white/5 rounded-xl border border-[var(--color-muted)]/30 dark:border-white/5 text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-white transition-colors hover:bg-[#fcf7f1] dark:hover:bg-white/10 shadow-sm active:scale-[0.98] ${className}`}
            >
                <span className="flex items-center gap-2 truncate">
                    <Globe size={20} className="shrink-0" />
                    <span className={`text-sm font-medium truncate ${labelClass}`}>{selectedLabel}</span>
                </span>
                <ChevronDown
                    size={16}
                    className={`opacity-50 shrink-0 transition-transform duration-200 ${chevronClass} ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {isOpen &&
                coords &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        className="fixed z-[100] p-1 glass-panel rounded-xl shadow-xl max-h-64 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200 border border-slate-200/50 dark:border-white/5"
                        style={{
                            left: coords.left,
                            width: coords.width,
                            top: coords.top,
                            bottom: coords.bottom,
                        }}
                    >
                        {options.map((opt) => (
                            <button
                                key={opt.code}
                                onClick={() => {
                                    onChange(opt.code);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors flex items-center justify-between group ${value === opt.code
                                        ? 'bg-indigo-500 text-white shadow-md'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                                    }`}
                            >
                                <span>{opt.label}</span>
                                {value === opt.code && <Check size={14} />}
                            </button>
                        ))}
                    </div>,
                    document.body
                )}
        </div>
    );
};
