import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import { useData } from '../context/DataContext';
import type { KnowledgeArticle } from '../types';
import { KNOWLEDGE_CATEGORIES } from '../constants';

interface ArticleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: KnowledgeArticle | null;
}

const ArticleFormModal: React.FC<ArticleFormModalProps> = ({ isOpen, onClose, article }) => {
    const { addKnowledgeArticle, updateKnowledgeArticle } = useData();
    
    const getInitialData = () => ({
        title: article?.title || '',
        category: article?.category || 'Admin',
        content: article?.content || '',
        imageUrl: article?.imageUrl || '',
        attachments: article?.attachments || [],
    });

    const [formData, setFormData] = useState(getInitialData());
    const [newAttachment, setNewAttachment] = useState({ name: '', url: '' });

    useEffect(() => {
        setFormData(getInitialData());
    }, [article, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAddAttachment = () => {
        if (newAttachment.name && newAttachment.url) {
            setFormData(prev => ({ ...prev, attachments: [...prev.attachments, newAttachment] }));
            setNewAttachment({ name: '', url: '' });
        }
    };

    const handleRemoveAttachment = (index: number) => {
        setFormData(prev => ({...prev, attachments: prev.attachments.filter((_, i) => i !== index)}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (article) { // Editing existing article
            updateKnowledgeArticle({ ...article, ...formData });
        } else { // Creating new article
            addKnowledgeArticle(formData);
        }
        onClose();
    };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={article ? 'Edit Article' : 'Create New Article'}>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <input type="text" name="title" placeholder="Article Title" value={formData.title} onChange={handleChange} required className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text placeholder:text-slate-400"/>
            <select name="category" value={formData.category} onChange={handleChange} required className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text" style={{colorScheme: 'dark'}}>
                {KNOWLEDGE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <textarea name="content" placeholder="Article Content (Markdown supported)" value={formData.content} onChange={handleChange} required rows={8} className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text placeholder:text-slate-400"></textarea>
            
            <div>
                <label className="block text-sm font-medium text-brand-text-dark mb-1">Header Image URL (Optional)</label>
                <input type="text" name="imageUrl" placeholder="https://example.com/image.png" value={formData.imageUrl} onChange={handleChange} className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text placeholder:text-slate-400"/>
                {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-md mt-2 border border-slate-700" />}
            </div>

            <div>
                 <label className="block text-sm font-medium text-brand-text-dark mb-1">Attachments (Optional)</label>
                 <div className="space-y-2 p-2 bg-slate-800/60 rounded-md border border-slate-700">
                    {formData.attachments.map((att, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                            <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">{att.name}</a>
                            <button type="button" onClick={() => handleRemoveAttachment(index)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                        </div>
                    ))}
                    {formData.attachments.length === 0 && <p className="text-xs text-brand-text-dark text-center">No attachments yet.</p>}
                 </div>
                 <div className="flex gap-2 mt-2">
                    <input type="text" placeholder="File Name" value={newAttachment.name} onChange={e => setNewAttachment({...newAttachment, name: e.target.value})} className="flex-1 p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text text-sm placeholder:text-slate-400" />
                    <input type="text" placeholder="File URL" value={newAttachment.url} onChange={e => setNewAttachment({...newAttachment, url: e.target.value})} className="flex-1 p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text text-sm placeholder:text-slate-400" />
                    <button type="button" onClick={handleAddAttachment} className="bg-slate-700 hover:bg-slate-600 text-brand-text font-bold py-2 px-3 rounded-lg text-sm">Add</button>
                 </div>
            </div>

            <div className="flex justify-end pt-4 gap-3">
                <button type="button" onClick={onClose} className="bg-slate-700 hover:bg-slate-600 text-brand-text font-bold py-2 px-4 rounded-lg shadow-md transition-colors">Cancel</button>
                <button type="submit" className="bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">{article ? 'Save Changes' : 'Create Article'}</button>
            </div>
        </form>
    </Modal>
  );
};

export default ArticleFormModal;