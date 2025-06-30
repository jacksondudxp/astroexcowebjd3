import React, { useState } from 'react';
import Card from './ui/Card';
import { useData } from '../context/DataContext';
import type { Event } from '../types';

const CalendarPage: React.FC = () => {
    const { events } = useData();
    const [currentDate, setCurrentDate] = useState(new Date());

    const changeMonth = (amount: number) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };
    
    const getEventTypeColor = (type: Event['type']): string => {
        switch (type) {
            case 'Event': return 'bg-blue-500';
            case 'Deadline': return 'bg-red-500';
            case 'Task': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    };

    const renderHeader = () => {
        const dateFormat = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' });
        return (
            <div className="flex justify-between items-center mb-4 p-2 text-brand-text">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Previous month">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="text-2xl font-bold">{dateFormat.format(currentDate)}</h2>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Next month">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className="grid grid-cols-7 text-center font-semibold text-brand-text-dark">
                {days.map(day => <div key={day} className="py-2 border-b-2 border-slate-700">{day}</div>)}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startDate = new Date(monthStart);
        startDate.setDate(startDate.getDate() - monthStart.getDay());
        const endDate = new Date(monthEnd);
        if (monthEnd.getDay() !== 6) {
          endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));
        }

        const cells = [];
        let day = new Date(startDate);

        while (day <= endDate) {
            const dayKey = day.toISOString().split('T')[0];
            const eventsForDay = events.filter(event => event.date === dayKey);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === new Date().toDateString();

            cells.push(
                <div key={dayKey} className={`border-l border-t border-slate-700 h-36 flex flex-col p-1.5 ${isCurrentMonth ? 'bg-transparent text-brand-text' : 'bg-black/20 text-brand-text-dark'}`}>
                    <span className={`font-bold self-start ${isToday ? 'bg-brand-accent text-white rounded-full w-7 h-7 flex items-center justify-center' : ''}`}>
                        {day.getDate()}
                    </span>
                    <div className="flex-1 overflow-y-auto mt-1 space-y-1 text-xs">
                        {eventsForDay.map(event => (
                            <div key={event.id} title={event.title} className={`p-1 rounded text-white flex items-center gap-1.5 ${getEventTypeColor(event.type)}`}>
                                <p className="truncate font-medium">{event.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
            day.setDate(day.getDate() + 1);
        }
        return <div className="grid grid-cols-7 border-r border-b border-slate-700">{cells}</div>;
    };


    return (
        <div className="animate-fade-in space-y-6">
            <h1 className="text-4xl font-bold text-brand-text">Club Calendar</h1>
            <p className="text-lg text-brand-text-dark">A shared calendar showing key events, deadlines, and preparation work.</p>
            <Card className="p-4 overflow-hidden">
                {renderHeader()}
                {renderDays()}
                {renderCells()}
                 <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 justify-center text-brand-text">
                    <div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-sm ${getEventTypeColor('Event')}`}></div><span className="text-sm">Event</span></div>
                    <div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-sm ${getEventTypeColor('Deadline')}`}></div><span className="text-sm">Deadline</span></div>
                    <div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-sm ${getEventTypeColor('Task')}`}></div><span className="text-sm">Task</span></div>
                </div>
            </Card>
        </div>
    );
};

export default CalendarPage;