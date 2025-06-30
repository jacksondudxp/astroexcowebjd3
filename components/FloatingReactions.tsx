import React from 'react';
import type { Reaction } from '../types';

const FloatingReactions: React.FC<{ reactions: Reaction[] }> = ({ reactions }) => {
  return (
    <>
      {reactions.map((reaction, index) => (
        <div
          key={reaction.id}
          className="floating-reaction"
          style={{
            left: `${10 + (parseInt(reaction.id.slice(-4,-2), 16) % 80)}%`, // pseudo-random horizontal position
            animationDelay: `${(index % 5) * 0.1}s`,
          }}
        >
          {reaction.emoji}
        </div>
      ))}
    </>
  );
};

export default FloatingReactions;
