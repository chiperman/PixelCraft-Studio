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
  const [deletingId, setDeletingId] = useState<string | null>(null); // New state for delete confirmation

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-paper-200 dark:border-slate-700 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden relative">
        
        {/* Delete Confirmation Overlay */}
        {deletingId && (
           <div className="absolute inset-0 z-50 bg-white/90 dark:bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl border border-paper-200 dark:border-slate-700 max-w-sm w-full">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{t.library.delete}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">{t.library.deleteConfirm}</p>
                    <div className="flex gap-3">
                        <button 
                           onClick={() => setDeletingId(null)}
                           className="flex-1 px-4 py-2 bg-paper-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-paper-300 dark:hover:bg-slate-600 transition-colors text-sm"
                        >
                           {t.resize.cancel}
                        </button>
                        <button 
                           onClick={() => { onDelete(deletingId); setDeletingId(null); }}
                           className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium shadow-lg shadow-red-500/30 transition-colors text-sm"
                        >
                           {t.library.delete}
                        </button>
                    </div>
                </div>
           </div>
        )}

        {/* Header */}
        <div className="p-4 border-b border-paper-200 dark:border-slate-800 flex justify-between items-center bg-paper-50 dark:bg-slate-800/50">
           <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
             <span className="text-2xl">📚</span> {t.library.title}
           </h2>
           <button onClick={onClose} className="p-1 hover:bg-paper-200 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400">
             <X size={24} />
           </button>
        </div>

        {/*eb Save Current Section */}
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-500/20 flex flex-col sm:flex-row gap-3 items-center">
            <input 
              type="text" 
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder={t.library.placeholder}
              className="flex-1 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-500/30 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
            />
            <button 
              onClick={handleSave}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/20 flex items-center gap-2 whitespace-nowrap transition-all active:scale-95 w-full sm:w-auto justify-center"
            >
              <Save size={18} />
              {t.library.saveCurrent}
            </button>
        </div>

        {/* Projects Grid */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-paper-100 dark:bg-slate-950">
           {projects.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 gap-4">
                <div className="w-24 h-24 bg-paper-200 dark:bg-slate-800 rounded-full flex items-center justify-center">
                   <Plus size={48} className="opacity-50"/>
                </div>
                <p>{t.library.empty}</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {projects.map(project => (
                  <div key={project.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-paper-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                      
                      {/* Thumbnail Container */}
                      <div className="relative aspect-square bg-slate-100 dark:bg-slate-900 border-b border-paper-200 dark:border-slate-700">
                         {/* Checkered background for transparency */}
                         <div className="absolute inset-0 opacity-20" style={{
                            backgroundImage: `linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)`,
                            backgroundSize: '20px 20px',
                            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                         }}/>
                         
                         <img 
                           src={project.thumbnail} 
                           alt={project.name} 
                           className="absolute inset-0 w-full h-full object-contain p-2 image-pixelated"
                         />

                         {/* Overlay Actions */}
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[1px]">
                             <button 
                               type="button"
                               onClick={() => { onLoad(project); onClose(); }}
                               className="p-3 bg-indigo-600 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                               title={t.library.load}
                             >
                               <Play size={24} fill="currentColor" />
                             </button>
                         </div>
                      </div>

                      {/* Footer Info */}
                      <div className="p-3 flex items-center justify-between gap-2 mt-auto relative z-10">
                          {editingId === project.id ? (
                            <input 
                              autoFocus
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onBlur={() => saveEditing(project.id)}
                              onKeyDown={(e) => e.key === 'Enter' && saveEditing(project.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 bg-paper-100 dark:bg-slate-700 border border-indigo-300 dark:border-indigo-500 rounded px-2 py-1 text-xs outline-none min-w-0"
                            />
                          ) : (
                             <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm truncate" title={project.name}>{project.name}</h3>
                                <p className="text-[10px] text-slate-400">{new Date(project.timestamp).toLocaleDateString()}</p>
                             </div>
                          )}

                          <div className="flex items-center gap-1 shrink-0">
                             <button 
                               type="button"
                               onClick={(e) => startEditing(project, e)}
                               className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded transition-colors"
                               title={t.library.rename}
                             >
                                <Edit2 size={14} />
                             </button>
                             <button 
                               type="button"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setDeletingId(project.id); // Trigger custom confirmation
                               }}
                               className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                               title={t.library.delete}
                             >
                                <Trash2 size={14} />
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