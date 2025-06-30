import React, { useState } from 'react';
import Card from './ui/Card';
import Modal from './ui/Modal';
import { useData } from '../context/DataContext';
import { BrainstormIdea } from '../types';
import { USER_COLORS_BRAINSTORM } from '../constants';
import { useAuth } from '../context/AuthContext';

const getUserColor = (userId: string) => {
    return USER_COLORS_BRAINSTORM[userId] || 'border-gray-500/80';
};

const IdeaCard: React.FC<{ idea: BrainstormIdea }> = ({ idea }) => (
    <Card className={`border-l-4 ${getUserColor(idea.submittedBy)}`}>
        <h3 className="text-xl font-bold text-brand-text mb-3">{idea.title}</h3>
        <div className="space-y-2 text-sm">
            {idea.details.venue && <p><span className="font-semibold text-brand-text-dark">Venue:</span> <span className="text-brand-text">{idea.details.venue}</span></p>}
            {idea.details.time && <p><span className="font-semibold text-brand-text-dark">Time:</span> <span className="text-brand-text">{idea.details.time}</span></p>}
            {idea.details.target && <p><span className="font-semibold text-brand-text-dark">Target:</span> <span className="text-brand-text">{idea.details.target}</span></p>}
            {idea.details.attractions && <p><span className="font-semibold text-brand-text-dark">Attractions:</span> <span className="text-brand-text">{idea.details.attractions}</span></p>}
        </div>
    </Card>
);

const EventBrainstorming: React.FC = () => {
    const { brainstormIdeas, addBrainstormIdea } = useData();
    const { currentUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newIdea, setNewIdea] = useState({
        title: '',
        venue: '',
        time: '',
        target: '',
        attractions: ''
    });

    const canEdit = currentUser?.permissionLevel === 'current';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewIdea(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newIdea.title) return;
        
        addBrainstormIdea({
            title: newIdea.title,
            details: {
                venue: newIdea.venue,
                time: newIdea.time,
                target: newIdea.target,
                attractions: newIdea.attractions
            }
        });

        setIsModalOpen(false);
        setNewIdea({ title: '', venue: '', time: '', target: '', attractions: '' });
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-brand-text">Event Idea Board</h1>
                {canEdit && (
                  <button 
                      onClick={() => setIsModalOpen(true)}
                      className="bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors flex items-center gap-2"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Idea
                  </button>
                )}
            </div>
            <p className="text-lg text-brand-text-dark">Share your event ideas anonymously. All inputs are color-coded per user without revealing names to encourage free thinking.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brainstormIdeas.map(idea => (
                    <IdeaCard key={idea.id} idea={idea} />
                ))}
            </div>
             {brainstormIdeas.length === 0 && <p className="text-center p-4 text-brand-text-dark">No ideas yet. Be the first to share!</p>}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Share a New Event Idea">
                <form onSubmit={handleSubmit} className="space-y-4">
                     <input type="text" name="title" placeholder="Idea Title*" value={newIdea.title} onChange={handleInputChange} required className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text placeholder:text-slate-400"/>
                     <p className="text-sm text-brand-text-dark -mt-2">The following details are optional but helpful!</p>
                     <input type="text" name="venue" placeholder="Suggested Venue" value={newIdea.venue} onChange={handleInputChange} className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text placeholder:text-slate-400"/>
                     <input type="text" name="time" placeholder="Suggested Time (e.g., Weekend evening)" value={newIdea.time} onChange={handleInputChange} className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text placeholder:text-slate-400"/>
                     <input type="text" name="target" placeholder="Target Participants (e.g., All students, members)" value={newIdea.target} onChange={handleInputChange} className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text placeholder:text-slate-400"/>
                     <textarea name="attractions" placeholder="Attractive Points (e.g., Free food, Guest speaker)" value={newIdea.attractions} onChange={handleInputChange} rows={3} className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text placeholder:text-slate-400"></textarea>
                     <button type="submit" className="w-full bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">Add Idea Anonymously</button>
                </form>
            </Modal>
        </div>
    );
};

export default EventBrainstorming;