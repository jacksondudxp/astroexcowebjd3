import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from './ui/Card';
import Modal from './ui/Modal';
import { useData } from '../context/DataContext';
import type { AgendaItem } from '../types';
import { USER_COLORS } from '../constants';
import { useAuth } from '../context/AuthContext';
import MeetingPoll from './MeetingPoll';
import QuickReactions from './QuickReactions';
import FloatingReactions from './FloatingReactions';

const getUserColor = (userId: string) => {
  return USER_COLORS[userId] || 'bg-gray-500';
};

const EditableAgendaItem: React.FC<{ 
    item: AgendaItem; 
    meetingId: string;
    isFocused: boolean;
    canEdit: boolean;
    onFocus: () => void;
}> = ({ item, meetingId, isFocused, canEdit, onFocus }) => {
    const { updateAgendaItem, toggleAgendaItemStatus } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(item.text);

    const handleSave = () => {
        if(text.trim() !== item.text) {
            updateAgendaItem(meetingId, item.id, text.trim());
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') {
            setText(item.text);
            setIsEditing(false);
        }
    };
    
    const focusClasses = isFocused ? 'border-brand-accent ring-2 ring-brand-accent/50 shadow-lg' : 'border-transparent';

    return (
        <li className={`flex items-center gap-3 p-3 bg-slate-800/70 rounded-lg border-2 ${focusClasses} transition-all duration-300`}>
            <input
                type="checkbox"
                checked={item.isCompleted}
                onChange={() => toggleAgendaItemStatus(meetingId, item.id)}
                disabled={!canEdit}
                className="w-5 h-5 text-brand-accent bg-slate-700 border-slate-500 rounded focus:ring-brand-accent disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            />
            <div className="flex-1" onClick={() => !isEditing && canEdit && setIsEditing(true)}>
                {isEditing && canEdit ? (
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="w-full bg-transparent px-1 rounded-md border-b border-brand-accent focus:outline-none"
                    />
                ) : (
                    <span className={`${item.isCompleted ? 'line-through text-brand-text-dark' : 'text-brand-text'}`}>
                        {item.text}
                    </span>
                )}
            </div>
            {canEdit && (
                <button onClick={onFocus} className={`text-xs font-semibold py-1 px-2 rounded-md transition-colors ${isFocused ? 'bg-brand-accent text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>
                   {isFocused ? 'Focused' : 'Focus'}
                </button>
            )}
            <span title={`Last edited by user ${item.lastEditedBy}`} className={`w-3 h-3 rounded-full flex-shrink-0 ${getUserColor(item.lastEditedBy)}`}></span>
        </li>
    );
};


const MeetingAgenda: React.FC = () => {
    const { meetingId } = useParams<{ meetingId: string }>();
    const { meetings, minutes, getCommitteeMemberById, addMinutes, addAgendaItem, setFocusAgendaItem, updateNotepadContent } = useData();
    const { currentUser } = useAuth();
    const [isMinutesModalOpen, setIsMinutesModalOpen] = useState(false);
    const [newMinutesContent, setNewMinutesContent] = useState('');
    const [newAgendaText, setNewAgendaText] = useState('');

    const meeting = meetings.find(m => m.id === meetingId);
    const meetingMinutes = minutes.find(m => m.id === meeting?.minutesId);
    
    const isHost = currentUser?.id === meeting?.hostId;
    const canEdit = currentUser?.permissionLevel === 'current';

    if (!meeting) {
        return <div className="text-center text-xl">Meeting not found.</div>;
    }
    
    const handleAddMinutes = () => {
        if (newMinutesContent.trim()) {
            addMinutes(meeting.id, newMinutesContent);
            setIsMinutesModalOpen(false);
            setNewMinutesContent('');
        }
    };

    const handleAddAgendaItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (newAgendaText.trim()) {
            addAgendaItem(meeting.id, newAgendaText.trim());
            setNewAgendaText('');
        }
    };
    
    const handleFocus = (itemId: string) => {
        const newFocusId = meeting.focusedAgendaItemId === itemId ? null : itemId;
        setFocusAgendaItem(meeting.id, newFocusId);
    };

    return (
        <div className="animate-fade-in space-y-6 relative">
            <FloatingReactions reactions={meeting.reactions} />
            <div className="flex justify-between items-center">
                <Link to="/meetings" className="text-brand-accent hover:text-brand-accent-dark font-semibold">&larr; Back to all meetings</Link>
                {meeting.status === 'Scheduled' && isHost && (
                    <button onClick={() => setIsMinutesModalOpen(true)} className="bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">
                        Finalize & Add Minutes
                    </button>
                 )}
            </div>
            
            <Card>
                <h1 className="text-3xl font-bold text-brand-text">{meeting.title}</h1>
                <p className="text-brand-text-dark mt-1">
                    {new Date(meeting.date).toDateString()} at {meeting.time} | Host: {getCommitteeMemberById(meeting.hostId)?.name || 'N/A'}
                </p>
                 <div className="mt-4 flex flex-wrap gap-2">
                    <span className="font-semibold text-sm mr-2 text-brand-text">Attendees:</span>
                    {meeting.attendees.map(id => (
                        <span key={id} className={`text-xs px-2 py-1 rounded-full text-white ${getUserColor(id)}`}>
                            {getCommitteeMemberById(id)?.name}
                        </span>
                    ))}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                <div className="lg:col-span-3 space-y-4">
                    <h2 className="text-2xl font-semibold text-brand-text">Agenda</h2>
                    <ul className="space-y-3">
                        {meeting.agenda.map(item => (
                            <EditableAgendaItem 
                                key={item.id} 
                                item={item} 
                                meetingId={meeting.id} 
                                isFocused={meeting.focusedAgendaItemId === item.id}
                                canEdit={canEdit}
                                onFocus={() => handleFocus(item.id)}
                            />
                        ))}
                    </ul>
                    {canEdit && (
                        <form onSubmit={handleAddAgendaItem} className="flex gap-2 pt-2">
                            <input type="text" value={newAgendaText} onChange={e => setNewAgendaText(e.target.value)} placeholder="Add new agenda item..." className="flex-1 p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text placeholder:text-slate-400"/>
                            <button type="submit" className="bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-3 rounded-lg shadow-md transition-colors">Add</button>
                        </form>
                    )}
                </div>
                
                <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-8">
                     <Card>
                        <h3 className="text-lg font-semibold text-brand-text mb-3">Shared Notepad</h3>
                        <textarea
                            value={meeting.notepadContent}
                            onChange={(e) => updateNotepadContent(meeting.id, e.target.value)}
                            rows={8}
                            className="w-full p-2 text-sm rounded-md bg-slate-800/70 border border-slate-700 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text"
                            placeholder="Type notes here..."
                        ></textarea>
                    </Card>
                    
                    <MeetingPoll meeting={meeting} />

                    <QuickReactions meetingId={meeting.id} />
                    
                    {meetingMinutes && (
                         <Card>
                             <h2 className="text-2xl font-semibold text-brand-text mb-2">Minutes</h2>
                             <div className="prose prose-sm max-w-none bg-slate-800/60 p-3 rounded-md max-h-60 overflow-y-auto text-brand-text">
                                <p className="whitespace-pre-wrap">{meetingMinutes.content}</p>
                            </div>
                         </Card>
                    )}
                </div>
            </div>

            <Modal isOpen={isMinutesModalOpen} onClose={() => setIsMinutesModalOpen(false)} title="File Meeting Minutes">
                <div className="space-y-4">
                    <p className="text-sm text-brand-text-dark">Finalize the meeting by adding the minutes. This will mark the meeting as 'Completed'. You can use Markdown for formatting.</p>
                    <textarea
                        value={newMinutesContent}
                        onChange={e => setNewMinutesContent(e.target.value)}
                        rows={15}
                        className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text placeholder:text-slate-400"
                        placeholder="### Title&#10;**Attendees:**..."
                    ></textarea>
                    <button onClick={handleAddMinutes} className="w-full bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-4 rounded-lg">Save Minutes</button>
                </div>
            </Modal>
        </div>
    );
};

export default MeetingAgenda;