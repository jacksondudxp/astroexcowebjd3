import React from 'react';
import { useData } from '../context/DataContext';
import Card from './ui/Card';

const QuickReactions: React.FC<{ meetingId: string }> = ({ meetingId }) => {
    const { sendReaction } = useData();
    const reactions = ['👍', '🎉', '🤔', '❤️'];

    return (
        <Card>
            <h3 className="text-lg font-semibold text-brand-text mb-3">Quick Reactions</h3>
            <div className="flex justify-around">
                {reactions.map(emoji => (
                    <button
                        key={emoji}
                        onClick={() => sendReaction(meetingId, emoji)}
                        className="text-4xl p-2 rounded-full hover:bg-white/10 transition-transform duration-200 hover:scale-125"
                        aria-label={`Send ${emoji} reaction`}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </Card>
    );
};

export default QuickReactions;