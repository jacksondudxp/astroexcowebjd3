import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import type { Meeting } from '../types';
import Card from './ui/Card';

const PollResultBar: React.FC<{ label: string; value: number; total: number; color: string }> = ({ label, value, total, color }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-brand-text">{label}</span>
                <span className="text-sm font-medium text-brand-text-dark">{value} vote(s)</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-4">
                <div className={`${color} h-4 rounded-full text-center text-white text-xs font-bold`} style={{ width: `${percentage}%` }}>
                   {percentage > 10 && `${Math.round(percentage)}%`}
                </div>
            </div>
        </div>
    );
};

const MeetingPoll: React.FC<{ meeting: Meeting }> = ({ meeting }) => {
    const { currentUser } = useAuth();
    const { startPoll, castVote, endPoll } = useData();
    const [question, setQuestion] = useState('');

    const isHost = currentUser?.id === meeting.hostId;
    const poll = meeting.activePoll;
    const hasVoted = poll && currentUser ? poll.voters.includes(currentUser.id) : false;

    const handleStartPoll = (e: React.FormEvent) => {
        e.preventDefault();
        if (question.trim()) {
            startPoll(meeting.id, question.trim());
            setQuestion('');
        }
    };
    
    if (!poll) {
        if (!isHost) return null; // Only host can see start poll form
        return (
            <Card>
                <h3 className="text-lg font-semibold text-brand-text mb-3">Live Poll</h3>
                 <form onSubmit={handleStartPoll} className="space-y-3">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Enter poll question..."
                        className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text placeholder:text-slate-400"
                    />
                    <button type="submit" className="w-full bg-brand-accent/80 hover:bg-brand-accent text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">Start Poll</button>
                </form>
            </Card>
        );
    }
    
    const totalVotes = poll.options.yes + poll.options.no + poll.options.abstain;

    return (
        <Card>
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-brand-text">Live Poll</h3>
                {isHost && <button onClick={() => endPoll(meeting.id)} className="text-xs bg-red-500/30 text-red-200 hover:bg-red-500/40 font-semibold px-2 py-1 rounded-md">End Poll</button>}
            </div>
            <p className="font-semibold text-brand-text mb-4">{poll.question}</p>
            
            <div className="space-y-3 mb-4">
                <PollResultBar label="Yes" value={poll.options.yes} total={totalVotes} color="bg-green-500" />
                <PollResultBar label="No" value={poll.options.no} total={totalVotes} color="bg-red-500" />
                <PollResultBar label="Abstain" value={poll.options.abstain} total={totalVotes} color="bg-slate-500" />
            </div>

            {!hasVoted && (
                <div className="flex justify-around pt-3 border-t border-slate-700">
                    <button onClick={() => castVote(meeting.id, 'yes')} className="bg-green-500/30 hover:bg-green-500/40 text-green-200 font-bold py-2 px-4 rounded-lg">Vote Yes</button>
                    <button onClick={() => castVote(meeting.id, 'no')} className="bg-red-500/30 hover:bg-red-500/40 text-red-200 font-bold py-2 px-4 rounded-lg">Vote No</button>
                    <button onClick={() => castVote(meeting.id, 'abstain')} className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-2 px-4 rounded-lg">Abstain</button>
                </div>
            )}
             {hasVoted && (
                <p className="text-center text-sm font-semibold text-brand-accent pt-3 border-t border-slate-700">You have voted.</p>
            )}
        </Card>
    );
};

export default MeetingPoll;