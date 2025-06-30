import React, { useState, useMemo } from 'react';
import Card from './ui/Card';
import Modal from './ui/Modal';
import { useData } from '../context/DataContext';
import ApplicantsModal from './ApplicantsModal';
import type { Event } from '../types';
import { useAuth } from '../context/AuthContext';

const Events: React.FC = () => {
  const { events, addEvent } = useData();
  const { currentUser } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingApplicantsFor, setViewingApplicantsFor] = useState<Event | null>(null);
  const [showPastEvents, setShowPastEvents] = useState(false);
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    applicationsOpen: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setNewEvent(prev => ({ ...prev, [name]: checked }));
    } else {
        setNewEvent(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvent.title && newEvent.date && newEvent.time && newEvent.location && newEvent.description) {
      addEvent(newEvent);
      setIsCreateModalOpen(false);
      setNewEvent({ title: '', date: '', time: '', location: '', description: '', applicationsOpen: false });
    }
  };
  
  const displayedEvents = useMemo(() => {
    return events.filter(event => showPastEvents ? event.isPast : !event.isPast);
  }, [events, showPastEvents]);

  const canEdit = currentUser?.permissionLevel === 'current';

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-brand-text">Events</h1>
        {canEdit && (
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Event
          </button>
        )}
      </div>
      
      <div className="flex space-x-2 border-b border-slate-700">
        <button onClick={() => setShowPastEvents(false)} className={`py-2 px-4 text-sm font-medium ${!showPastEvents ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-brand-text-dark hover:text-brand-text'}`}>Upcoming</button>
        <button onClick={() => setShowPastEvents(true)} className={`py-2 px-4 text-sm font-medium ${showPastEvents ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-brand-text-dark hover:text-brand-text'}`}>Past</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedEvents.map(event => (
          <Card key={event.id} className="flex flex-col">
            <div className="flex-grow">
                <h3 className="text-xl font-bold text-brand-text mb-2">{event.title}</h3>
                <p className="text-brand-text-dark text-sm mb-1">
                {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {event.time}
                </p>
                <p className="text-brand-text-dark text-sm mb-4">
                <span className="font-semibold">Location:</span> {event.location}
                </p>
                <p className="text-brand-text leading-relaxed">{event.description}</p>
            </div>
            {event.applicationsOpen && !event.isPast && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                    <button onClick={() => setViewingApplicantsFor(event)} className="w-full text-center bg-slate-700 hover:bg-slate-600 text-brand-text font-semibold py-2 px-4 rounded-md transition-colors">
                        View Applicants ({event.applicants.length})
                    </button>
                </div>
            )}
          </Card>
        ))}
      </div>
       {displayedEvents.length === 0 && <p className="text-center p-4 text-brand-text-dark">No {showPastEvents ? 'past' : 'upcoming'} events.</p>}

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Event">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="title" placeholder="Event Title" value={newEvent.title} onChange={handleInputChange} required className="w-full p-2 rounded-md bg-slate-700/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text"/>
          <div className="flex gap-4">
            <input type="date" name="date" value={newEvent.date} onChange={handleInputChange} required className="w-full p-2 rounded-md bg-slate-700/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text" style={{colorScheme: 'dark'}}/>
            <input type="time" name="time" value={newEvent.time} onChange={handleInputChange} required className="w-full p-2 rounded-md bg-slate-700/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text" style={{colorScheme: 'dark'}}/>
          </div>
          <input type="text" name="location" placeholder="Location" value={newEvent.location} onChange={handleInputChange} required className="w-full p-2 rounded-md bg-slate-700/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text"/>
          <textarea name="description" placeholder="Description" value={newEvent.description} onChange={handleInputChange} required rows={4} className="w-full p-2 rounded-md bg-slate-700/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text"></textarea>
          <div className="flex items-center">
            <input 
                id="applicationsOpen"
                name="applicationsOpen"
                type="checkbox"
                checked={newEvent.applicationsOpen}
                onChange={handleInputChange}
                className="h-4 w-4 text-brand-accent bg-slate-600 border-slate-500 rounded focus:ring-brand-accent"
            />
            <label htmlFor="applicationsOpen" className="ml-2 block text-sm text-brand-text">
                Enable applications for this event
            </label>
           </div>
          <button type="submit" className="w-full bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">Add Event</button>
        </form>
      </Modal>
      
      <ApplicantsModal isOpen={!!viewingApplicantsFor} onClose={() => setViewingApplicantsFor(null)} event={viewingApplicantsFor} />
    </div>
  );
};

export default Events;