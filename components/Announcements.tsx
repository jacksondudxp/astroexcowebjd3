import React, { useState } from 'react';
import Card from './ui/Card';
import Modal from './ui/Modal';
import { useData } from '../context/DataContext';
import { AnnouncementTargetGroup } from '../types';
import { useAuth } from '../context/AuthContext';

const Announcements: React.FC = () => {
  const { announcements, addAnnouncement } = useData();
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    targetGroup: 'All Members' as AnnouncementTargetGroup,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAnnouncement(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAnnouncement.title && newAnnouncement.content) {
      addAnnouncement(newAnnouncement);
      setIsModalOpen(false);
      setNewAnnouncement({ title: '', content: '', targetGroup: 'All Members' });
    }
  };

  const getTargetGroupPill = (targetGroup: AnnouncementTargetGroup) => {
    const styles = {
      'All Members': 'bg-blue-500/30 text-blue-200',
      'Current Committee': 'bg-green-500/30 text-green-200',
      'Past Committees': 'bg-purple-500/30 text-purple-200',
    };
    return (
      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles[targetGroup]}`}>
        {targetGroup}
      </span>
    );
  };

  const canEdit = currentUser?.permissionLevel === 'current';

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-brand-text">Announcements</h1>
        {canEdit && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Announcement
          </button>
        )}
      </div>

      <div className="space-y-4">
        {announcements.map(announcement => (
          <Card key={announcement.id} className="border-l-4 border-brand-star">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-brand-text mb-1">{announcement.title}</h3>
                <p className="text-sm text-brand-text-dark mb-3">{new Date(announcement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              {getTargetGroupPill(announcement.targetGroup)}
            </div>
            <p className="text-brand-text leading-relaxed">{announcement.content}</p>
          </Card>
        ))}
      </div>
      {announcements.length === 0 && <p className="text-center p-4 text-brand-text-dark">No announcements yet.</p>}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Announcement">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            name="title" 
            placeholder="Announcement Title" 
            value={newAnnouncement.title} 
            onChange={handleInputChange} 
            required 
            className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text placeholder:text-slate-400"
          />
          <textarea 
            name="content" 
            placeholder="Content" 
            value={newAnnouncement.content} 
            onChange={handleInputChange} 
            required 
            rows={5} 
            className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text placeholder:text-slate-400"
          ></textarea>
          <div>
            <label htmlFor="targetGroup" className="block text-sm font-medium text-brand-text-dark mb-1">Send Email To</label>
            <select
              id="targetGroup"
              name="targetGroup"
              value={newAnnouncement.targetGroup}
              onChange={handleInputChange}
              className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text"
              style={{colorScheme: 'dark'}}
            >
              <option>All Members</option>
              <option>Current Committee</option>
              <option>Past Committees</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">Post & Send Email</button>
        </form>
      </Modal>
    </div>
  );
};

export default Announcements;