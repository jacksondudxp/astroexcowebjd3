

import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { getAiStreamResponse } from '../services/geminiService';
import { useData } from '../context/DataContext';

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { clubMembers, events, announcements, currentCommitteeMembers } = useData();

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    // Add context to the prompt
    const context = `
    ---
    Here is the current club data for your reference:
    Total Club Members: ${clubMembers.length}
    Current Committee Members: ${currentCommitteeMembers.length}
    Upcoming Events: ${JSON.stringify(events.filter(ev => !ev.isPast).map(ev => ({title: ev.title, date: ev.date})))}
    Recent Announcements: ${JSON.stringify(announcements.slice(0, 2).map(an => an.title))}
    ---
    User question: ${input}`;

    const historyForApi: ChatMessage[] = [...messages, {role: 'user', text: context}];

    setMessages(prev => [...prev, { role: 'model', text: '' }]);

    await getAiStreamResponse(historyForApi, (chunk) => {
        setMessages(prev => {
            const lastMsgIndex = prev.length - 1;
            const updatedMessages = [...prev];
            updatedMessages[lastMsgIndex] = {
                ...updatedMessages[lastMsgIndex],
                text: updatedMessages[lastMsgIndex].text + chunk,
            };
            return updatedMessages;
        });
    });

    setIsLoading(false);
  };

  const assistantButton = (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="fixed bottom-8 right-8 bg-brand-accent hover:bg-brand-accent-dark text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-110 z-50"
      aria-label="Toggle AI Assistant"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L11.414 15H9v-2.414l5.293-5.293a1 1 0 011.414 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
    </button>
  );

  if (!isOpen) {
    return assistantButton;
  }

  return (
    <>
      {assistantButton}
      <div className="fixed bottom-28 right-8 w-full max-w-md h-[60vh] bg-slate-900/80 backdrop-blur-md rounded-xl shadow-2xl flex flex-col z-40 animate-slide-in-up border border-white/10">
        <header className="bg-transparent p-4 rounded-t-xl border-b border-white/10">
          <h3 className="text-lg font-bold text-brand-text">AstroClub AI Assistant</h3>
        </header>
        <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-brand-accent text-white rounded-br-none' : 'bg-slate-700 text-slate-100 rounded-bl-none'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text || '...'}</p>
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length-1].role === 'user' && (
             <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-2xl bg-slate-700 text-slate-100 rounded-bl-none">
                <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 bg-brand-accent rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-brand-accent rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-brand-accent rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
          <div className="flex items-center bg-transparent rounded-lg border border-slate-500">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for help..."
              className="flex-1 bg-transparent p-3 text-brand-text focus:outline-none placeholder:text-slate-400"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="p-3 text-brand-accent disabled:text-slate-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AiAssistant;