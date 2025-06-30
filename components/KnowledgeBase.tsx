import React, { useState, useMemo } from 'react';
import Card from './ui/Card';
import { useData } from '../context/DataContext';
import { KNOWLEDGE_CATEGORIES } from '../constants';
import type { KnowledgeArticle, KnowledgeCategory } from '../types';
import ArticleFormModal from './ArticleFormModal';
import { useAuth } from '../context/AuthContext';

const CommentSection: React.FC<{ articleId: string }> = ({ articleId }) => {
    const { articleComments, addArticleComment } = useData();
    const [newComment, setNewComment] = useState('');

    const commentsForArticle = articleComments
        .filter(c => c.articleId === articleId)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            addArticleComment(articleId, newComment.trim());
            setNewComment('');
        }
    };

    return (
        <div className="mt-6">
            <h4 className="text-md font-semibold text-brand-text mb-3">Comments ({commentsForArticle.length})</h4>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {commentsForArticle.map(comment => (
                    <div key={comment.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
                            {comment.authorName.charAt(0)}
                        </div>
                        <div className="bg-slate-800/60 p-3 rounded-lg flex-1">
                            <div className="flex items-baseline justify-between">
                                <p className="font-semibold text-brand-text text-sm">{comment.authorName}</p>
                                <p className="text-xs text-brand-text-dark">{new Date(comment.date).toLocaleString()}</p>
                            </div>
                            <p className="text-brand-text text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>
                        </div>
                    </div>
                ))}
                {commentsForArticle.length === 0 && <p className="text-brand-text-dark text-sm text-center py-4">No comments yet. Be the first to discuss!</p>}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2 mt-4 pt-4 border-t border-slate-700">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text placeholder:text-slate-400"
                />
                <button type="submit" className="bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-3 rounded-lg shadow-md transition-colors">Post</button>
            </form>
        </div>
    );
};


const KnowledgeBase: React.FC = () => {
    const { knowledgeArticles, deleteKnowledgeArticle } = useData();
    const { currentUser } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | 'All'>('All');
    const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<KnowledgeArticle | null>(null);

    const canEdit = currentUser?.permissionLevel === 'current';

    const filteredArticles = useMemo(() => {
        return knowledgeArticles
            .filter(article => {
                if (selectedCategory === 'All') return true;
                return article.category === selectedCategory;
            })
            .filter(article => {
                const term = searchTerm.toLowerCase();
                return article.title.toLowerCase().includes(term) || article.content.toLowerCase().includes(term);
            });
    }, [knowledgeArticles, searchTerm, selectedCategory]);

    const toggleArticle = (id: string) => {
        setExpandedArticleId(prevId => (prevId === id ? null : id));
    };

    const handleOpenModal = (article: KnowledgeArticle | null = null) => {
        setEditingArticle(article);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingArticle(null);
    };

    const handleDelete = (articleId: string) => {
        if (window.confirm('Are you sure you want to permanently delete this article?')) {
            deleteKnowledgeArticle(articleId);
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
                <div >
                    <h1 className="text-4xl font-bold text-brand-text">Knowledge Base</h1>
                    <p className="text-lg text-brand-text-dark">Leverage the wisdom of past committees to excel in your roles.</p>
                </div>
                { canEdit && 
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        New Article
                    </button>
                }
            </div>
            
            <Card>
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/2 p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text placeholder:text-slate-400"
                    />
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => setSelectedCategory('All')} className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${selectedCategory === 'All' ? 'bg-brand-accent text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'}`}>All</button>
                        {KNOWLEDGE_CATEGORIES.map(category => (
                            <button key={category} onClick={() => setSelectedCategory(category)} className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${selectedCategory === category ? 'bg-brand-accent text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'}`}>{category}</button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredArticles.length > 0 ? filteredArticles.map(article => (
                        <div key={article.id} className="bg-slate-800/80 border border-slate-700 rounded-lg overflow-hidden">
                            <button onClick={() => toggleArticle(article.id)} className="w-full text-left p-4 flex justify-between items-center hover:bg-white/5 transition-colors" aria-expanded={expandedArticleId === article.id}>
                                <div>
                                    <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-brand-accent/20 text-brand-accent`}>{article.category}</span>
                                    <h3 className="text-lg font-bold text-brand-text mt-2">{article.title}</h3>
                                    <p className="text-sm text-brand-text-dark">By {article.author} on {new Date(article.date).toLocaleDateString()}</p>
                                    {article.lastEditedBy && article.lastModifiedDate && (
                                        <p className="text-xs text-brand-text-dark italic mt-1">
                                            Last updated by {article.lastEditedBy} on {new Date(article.lastModifiedDate).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-slate-400 transition-transform duration-300 ${expandedArticleId === article.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {expandedArticleId === article.id && (
                                <div className="p-4 border-t border-slate-700 animate-fade-in">
                                    {article.imageUrl && <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover rounded-md mb-4" />}
                                    <p className="text-brand-text whitespace-pre-wrap">{article.content}</p>
                                    
                                    {article.attachments && article.attachments.length > 0 && (
                                        <div className="mt-6">
                                            <h4 className="text-md font-semibold text-brand-text mb-2">Attachments</h4>
                                            <div className="space-y-2">
                                                {article.attachments.map((file, index) => (
                                                    <a href={file.url} key={index} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-slate-800/60 p-2 rounded-md hover:bg-slate-700/80 transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                                        <span className="text-sm text-brand-text-dark">{file.name}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {canEdit && (
                                        <div className="mt-6 pt-4 border-t border-slate-700 flex justify-end gap-3">
                                            <button onClick={() => handleOpenModal(article)} className="bg-slate-700 hover:bg-slate-600 text-brand-text font-semibold py-2 px-4 rounded-lg shadow-md transition-colors">Edit Article</button>
                                            <button onClick={() => handleDelete(article.id)} className="bg-red-500/30 hover:bg-red-500/40 text-red-200 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors">Delete Article</button>
                                        </div>
                                    )}
                                    
                                    <div className="mt-4 border-t border-slate-700 pt-4">
                                        <CommentSection articleId={article.id} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )) : (
                        <p className="text-center p-4 text-brand-text-dark">No articles found matching your criteria.</p>
                    )}
                </div>
            </Card>

            <ArticleFormModal isOpen={isModalOpen} onClose={handleCloseModal} article={editingArticle} />
        </div>
    );
};

export default KnowledgeBase;