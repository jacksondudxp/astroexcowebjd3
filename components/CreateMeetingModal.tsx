

import React, { useState } from 'react';
import Modal from './ui/Modal';
import { useData } from '../context/DataContext';

const CreateMeetingModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { currentCommitteeMembers, scheduleMeeting } = useData();
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
    
    // Assume current user is the first member, they are the default host
    const hostId = currentCommitteeMembers[0]?.id || ''; 

    const handleAttendeeChange = (memberId: string) => {
        setSelectedAttendees(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !date || !time || !hostId || selectedAttendees.length === 0) {
            alert('Please fill all fields and select at least one attendee.');
            return;
        }

        const attendeeEmails = selectedAttendees.map(id => currentCommitteeMembers.find(m => m.id === id)?.email).filter(Boolean) as string[];

        scheduleMeeting({
            title,
            date,
            time,
            hostId,
            attendees: selectedAttendees
        }, attendeeEmails);

        onClose();
        // Reset form
        setTitle('');
        setDate('');
        setTime('');
        setSelectedAttendees([]);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Schedule New Meeting">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Meeting Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text placeholder:text-slate-400"/>
                <div className="flex gap-4">
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text" style={{colorScheme: 'dark'}}/>
                    <input type="time" value={time} onChange={e => setTime(e.target.value)} required className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text" style={{colorScheme: 'dark'}}/>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-brand-text-dark mb-2">Select Attendees (Current Committee)</label>
                    <div className="max-h-40 overflow-y-auto space-y-2 p-3 bg-slate-800/60 rounded-md border border-slate-700">
                        {currentCommitteeMembers.map(member => (
                            <div key={member.id} className="flex items-center">
                                <input
                                    id={`att-${member.id}`}
                                    type="checkbox"
                                    checked={selectedAttendees.includes(member.id)}
                                    onChange={() => handleAttendeeChange(member.id)}
                                    className="h-4 w-4 text-brand-accent bg-slate-700 border-slate-500 rounded focus:ring-brand-accent"
                                />
                                <label htmlFor={`att-${member.id}`} className="ml-3 block text-sm text-brand-text">
                                    {member.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="w-full bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">Schedule & Send Invitations</button>
            </form>
        </Modal>
    );
};

export default CreateMeetingModal;