
import React, { useState } from 'react';
import { StoredProject, Language } from '../types';
import { TRANSLATIONS } from '../utils';
import { X, Play, Edit2, Trash2, Plus, Save, LayoutGrid, Clock, Calendar, Download } from 'lucide-react';

interface ProjectLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: StoredProject[];
  onSaveCurrent: (name: string) => void;
  onLoad: (project: StoredProject) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onExport: (project: StoredProject) => void;
  language: Language;
}

const ProjectLibraryModal: React.FC<ProjectLibraryModalProps> = ({
  isOpen,
  onClose,
  projects,
  onSaveCurrent,
  onLoad,
  onDelete,
  onRename,
  onExport,
  language
}) => {
  const [newProjectName, setNewProjectName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  const handleSave = () => {
    if (newProjectName.trim()) {
      onSaveCurrent(newProjectName);
      setNewProjectName(''); // Clear input
    } else {
       onSaveCurrent(`${t.library.untitled} ${new Date().toLocaleDateString()}`);
       setNewProjectName('');
    }
  };

  const startEditing = (project: StoredProject, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(project.id);
    setEditName(project.name);
  };

  const saveEditing = (id: string) => {
    if (editName.trim()) {
      onRename(id, editName);
    }
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="glass-panel rounded-[2rem] w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300 ring-1 ring-white/20 dark:ring-white/10">
        
        {/* Delete Confirmation Overlay - Centered and Elegant */}
        {deletingId && (
           <div className="absolute inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div 
                    className="absolute inset-0 bg-white/20 dark:bg-black/60 backdrop-blur-md transition-opacity" 
                    onClick={() => setDeletingId(null)}
                ></div>
                <div className="relative bg-white dark:bg-[#1c1c1e] p-8 rounded-[2rem] shadow-2xl border border-white/20 dark:border-white/10 max-w-sm w-full transform scale-100 animate-in zoom-in-95 duration-200 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-5 shadow-inner">
                        <Trash2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.library.delete}</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed">{t.library.deleteConfirm}</p>
                    <div className="flex gap-3 w-full">
                        <button 
                           onClick={() => setDeletingId(null)}
                           className="flex-1 px-4 py-3 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-sm"
                        >
                           {t.resize.cancel}
                        </button>
                        <button 
                           onClick={() => { onDelete(deletingId); setDeletingId(null); }}
                           className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow-lg shadow-red-500/30 transition-all active:scale-95 text-sm"
                        >
                           {t.library.delete}
                        </button>
                    </div>
                </div>
           </div>
        )}

        {/* Header Section */}
        <div className="shrink-0 bg-white/50 dark:bg-[#1c1c1e]/50 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 z-20 relative">
            {/* Top Bar */}
            <div className="px-6 py-5 sm:px-8 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
                        <LayoutGrid size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{t.library.title}</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 tracking-wide uppercase opacity-80">{t.library.projectsCount(projects.length)}</p>
                    </div>
                </div>
                <button 
                    onClick={onClose} 
                    className="p-3 bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Save Action Card */}
            <div className="px-6 pb-6 sm:px-8">
                <div className="flex gap-2 p-2 bg-white dark:bg-black/20 border border-slate-200/60 dark:border-white/10 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50 transition-all">
                    <div className="flex items-center pl-3 text-slate-400">
                        <Edit2 size={18} />
                    </div>
                    <input 
                        type="text" 
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder={t.library.placeholder}
                        className="flex-1 bg-transparent border-none px-2 py-2.5 outline-none text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium"
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    />
                    <button 
                        onClick={handleSave}
                        className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
                    >
                        <Save size={18} />
                        <span className="hidden sm:inline">{t.library.saveCurrent}</span>
                    </button>
                </div>
            </div>
        </div>

        {/* Projects Grid Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-slate-50/50 dark:bg-black/20">
           {projects.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-32 h-32 bg-gradient-to-tr from-slate-100 to-white dark:from-white/5 dark:to-white/10 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner border border-white/40 dark:border-white/5">
                   <Plus size={48} className="text-slate-300 dark:text-slate-600 opacity-50"/>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t.library.empty}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-base max-w-sm mx-auto leading-relaxed">
                    {t.library.emptyDesc}
                </p>
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
                {projects.map((project, index) => (
                  <div 
                    key={project.id} 
                    className="group relative flex flex-col bg-white dark:bg-[#1c1c1e]/80 backdrop-blur-sm rounded-[1.5rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-black/50 border border-slate-200/60 dark:border-white/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden ring-1 ring-transparent hover:ring-indigo-500/30 dark:hover:ring-indigo-400/20"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                      {/* Thumbnail Area */}
                      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-[#151517] rounded-t-[1.5rem]">
                         {/* Checkered Background Pattern */}
                         <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.05]" style={{
                            backgroundImage: `linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)`,
                            backgroundSize: '20px 20px',
                            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                         }}/>
                         
                         <img 
                           src={project.thumbnail} 
                           alt={project.name} 
                           className="absolute inset-0 w-full h-full object-contain p-8 image-pixelated transition-transform duration-500 group-hover:scale-110 drop-shadow-md"
                         />

                         {/* Hover Overlay */}
                         <div className="absolute inset-0 bg-indigo-900/10 dark:bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] flex items-center justify-center">
                             <button 
                               type="button"
                               onClick={() => { onLoad(project); onClose(); }}
                               className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 px-6 py-3 bg-white dark:bg-white text-indigo-600 rounded-full font-bold shadow-2xl flex items-center gap-2 hover:bg-indigo-50 hover:scale-105 active:scale-95"
                             >
                               <Play size={20} fill="currentColor" />
                               {t.library.load}
                             </button>
                         </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 flex flex-col gap-3 relative z-10 bg-white dark:bg-[#1e1e20] flex-1">
                          <div className="flex justify-between items-start gap-3 min-h-[40px]">
                              {editingId === project.id ? (
                                <input 
                                  autoFocus
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  onBlur={() => saveEditing(project.id)}
                                  onKeyDown={(e) => e.key === 'Enter' && saveEditing(project.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-full bg-slate-100 dark:bg-white/10 border-0 rounded-lg px-2 py-1 text-sm font-bold outline-none ring-2 ring-indigo-500 text-slate-900 dark:text-white"
                                />
                              ) : (
                                 <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-base truncate leading-tight tracking-tight" title={project.name}>
                                        {project.name}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={10} />
                                            {new Date(project.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={10} />
                                            {new Date(project.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                 </div>
                              )}
                          </div>

                          {/* Action Buttons Toolbar */}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5 mt-auto">
                             <div className="flex items-center gap-1">
                                <button 
                                  type="button"
                                  onClick={(e) => startEditing(project, e)}
                                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10 rounded-xl transition-colors"
                                  title={t.library.rename}
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => onExport(project)}
                                  className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:text-teal-400 dark:hover:bg-teal-500/10 rounded-xl transition-colors"
                                  title={t.library.exportJSON}
                                >
                                    <Download size={16} />
                                </button>
                             </div>
                             
                             <button 
                               type="button"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setDeletingId(project.id);
                               }}
                               className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors group/delete"
                               title={t.library.delete}
                             >
                                <Trash2 size={16} className="group-hover/delete:scale-110 transition-transform" />
                             </button>
                          </div>
                      </div>
                  </div>
                ))}
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default ProjectLibraryModal;
