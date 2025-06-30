import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import { useData } from '../context/DataContext';
import type { Meeting } from '../types';
import CreateMeetingModal from './CreateMeetingModal';
import { useAuth } from '../context/AuthContext';

const MeetingCard: React.FC<{ meeting: Meeting }> = ({ meeting }) => {
    const { getCommitteeMemberById } = useData();
    const attendeeNames = meeting.attendees
        .map(attId => getCommitteeMemberById(attId)?.name)
        .filter(Boolean);

    return (
        <Card className="flex flex-col justify-between">
            <div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${meeting.status === 'Scheduled' ? 'bg-blue-500/30 text-blue-200' : 'bg-slate-700 text-slate-300'}`}>
                    {meeting.status}
                </span>
                <h3 className="text-xl font-bold text-brand-text mt-3 mb-2">{meeting.title}</h3>
                <p className="text-brand-text-dark text-sm mb-4">
                    {new Date(meeting.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {meeting.time}
                </p>
                <div className="mb-4">
                    <p className="font-semibold text-sm text-brand-text mb-2">Attendees ({attendeeNames.length}):</p>
                    <div className="flex flex-wrap gap-2">
                        {attendeeNames.slice(0, 5).map(name => (
                            <span key={name} className="text-xs bg-slate-700 text-slate-200 px-2 py-1 rounded-full">{name}</span>
                        ))}
                        {attendeeNames.length > 5 && <span className="text-xs bg-slate-700 text-slate-200 px-2 py-1 rounded-full">+{attendeeNames.length - 5} more</span>}
                    </div>
                </div>
            </div>
            <Link to={`/meetings/${meeting.id}`} className="w-full text-center bg-brand-accent/80 hover:bg-brand-accent text-white font-semibold py-2 px-4 rounded-md transition-colors block">
                View Details
            </Link>
        </Card>
    );
};


const Meetings: React.FC = () => {
  const { meetings } = useData();
  const { currentUser } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showPastMeetings, setShowPastMeetings] = useState(false);
  
  const canEdit = currentUser?.permissionLevel === 'current';

  const displayedMeetings = useMemo(() => {
    const now = new Date();
    return meetings
        .filter(meeting => {
            const meetingDate = new Date(`${meeting.date}T${meeting.time}`);
            const isPast = meetingDate < now || meeting.status === 'Completed';
            return showPastMeetings ? isPast : !isPast;
        })
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [meetings, showPastMeetings]);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-brand-text">Committee Meetings</h1>
        {canEdit && (
            <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
            Schedule New Meeting
            </button>
        )}
      </div>
      
      <div className="flex space-x-2 border-b border-slate-700">
        <button onClick={() => setShowPastMeetings(false)} className={`py-2 px-4 text-sm font-medium ${!showPastMeetings ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-brand-text-dark hover:text-brand-text'}`}>Upcoming</button>
        <button onClick={() => setShowPastMeetings(true)} className={`py-2 px-4 text-sm font-medium ${showPastMeetings ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-brand-text-dark hover:text-brand-text'}`}>Past</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedMeetings.map(meeting => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
      </div>
       {displayedMeetings.length === 0 && <p className="text-center p-4 text-brand-text-dark">No {showPastMeetings ? 'past' : 'upcoming'} meetings.</p>}

      <CreateMeetingModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
};

export default Meetings;