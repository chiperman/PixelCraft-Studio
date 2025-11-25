import React, { useState } from 'react';
import { StoredProject, Language } from '../types';
import { TRANSLATIONS } from '../utils';
import { X, Play, Edit2, Trash2, Plus, Save } from 'lucide-react';

interface ProjectLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: StoredProject[];
  onSaveCurrent: (name: string) => void;
  onLoad: (project: StoredProject) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
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
       onSaveCurrent('Untitled Project ' + new Date().toLocaleDateString());
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
    <div className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className="glass-panel rounded-cupertino w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Delete Confirmation Overlay */}
        {deletingId && (
           <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
                <div className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm" onClick={() => setDeletingId(null)}></div>
                <div className="glass-panel p-8 rounded-cupertino shadow-2xl border border-white/40 dark:border-white/10 max-w-sm w-full relative z-10">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.library.delete}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm leading-relaxed">{t.library.deleteConfirm}</p>
                    <div className="flex gap-4">
                        <button 
                           onClick={() => setDeletingId(null)}
                           className="flex-1 px-4 py-3 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-white/20 transition-colors text-sm"
                        >
                           {t.resize.cancel}
                        </button>
                        <button 
                           onClick={() => { onDelete(deletingId); setDeletingId(null); }}
                           className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-500/30 transition-colors text-sm"
                        >
                           {t.library.delete}
                        </button>
                    </div>
                </div>
           </div>
        )}

        {/* Header */}
        <div className="p-6 border-b border-slate-200/50 dark:border-white/5 flex justify-between items-center z-10">
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
             <span className="text-3xl">📚</span> {t.library.title}
           </h2>
           <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
             <X size={24} />
           </button>
        </div>

        {/* Save Current Section */}
        <div className="p-6 border-b border-slate-200/50 dark:border-white/5 flex flex-col sm:flex-row gap-4 items-center z-10">
            <input 
              type="text" 
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder={t.library.placeholder}
              className="w-full flex-1 bg-white/70 dark:bg-white/5 border border-transparent focus:border-indigo-500/30 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 dark:text-white shadow-sm placeholder-slate-400 transition-all"
            />
            <button 
              onClick={handleSave}
              className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-2 whitespace-nowrap transition-all active:scale-95 w-full sm:w-auto justify-center"
            >
              <Save size={20} />
              {t.library.saveCurrent}
            </button>
        </div>

        {/* Projects Grid */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
           {projects.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-6">
                <div className="w-32 h-32 bg-white/50 dark:bg-white/5 rounded-full flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-700">
                   <Plus size={64} className="opacity-20"/>
                </div>
                <p className="text-lg font-medium">{t.library.empty}</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {projects.map(project => (
                  <div key={project.id} className="bg-white/80 dark:bg-[#1c1c1e] rounded-2xl shadow-sm border border-white/40 dark:border-white/5 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                      
                      {/* Thumbnail Container */}
                      <div className="relative aspect-square bg-slate-50 dark:bg-black/40 border-b border-slate-100 dark:border-white/5">
                         {/* Checkered background */}
                         <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: `linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)`,
                            backgroundSize: '20px 20px',
                            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                         }}/>
                         
                         <img 
                           src={project.thumbnail} 
                           alt={project.name} 
                           className="absolute inset-0 w-full h-full object-contain p-4 image-pixelated"
                         />

                         {/* Overlay Actions */}
                         <div className="absolute inset-0 bg-white/20 dark:bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                             <button 
                               type="button"
                               onClick={() => { onLoad(project); onClose(); }}
                               className="p-4 bg-indigo-500 text-white rounded-full hover:scale-110 transition-transform shadow-lg hover:shadow-indigo-500/40"
                               title={t.library.load}
                             >
                               <Play size={28} fill="currentColor" />
                             </button>
                         </div>
                      </div>

                      {/* Footer Info */}
                      <div className="p-4 flex items-center justify-between gap-3 mt-auto relative z-10 bg-white/50 dark:bg-transparent">
                          {editingId === project.id ? (
                            <input 
                              autoFocus
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onBlur={() => saveEditing(project.id)}
                              onKeyDown={(e) => e.key === 'Enter' && saveEditing(project.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full bg-slate-100 dark:bg-white/10 border-0 rounded-lg px-3 py-1.5 text-sm outline-none ring-2 ring-indigo-500"
                            />
                          ) : (
                             <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate mb-0.5" title={project.name}>{project.name}</h3>
                                <p className="text-xs text-slate-500 font-medium">{new Date(project.timestamp).toLocaleDateString()}</p>
                             </div>
                          )}

                          <div className="flex items-center gap-1 shrink-0">
                             <button 
                               type="button"
                               onClick={(e) => startEditing(project, e)}
                               className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
                               title={t.library.rename}
                             >
                                <Edit2 size={16} />
                             </button>
                             <button 
                               type="button"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setDeletingId(project.id);
                               }}
                               className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                               title={t.library.delete}
                             >
                                <Trash2 size={16} />
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