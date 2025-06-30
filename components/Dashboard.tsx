import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import type { Event, SpaceMuseumEvent } from '../types';
import { fetchSpaceMuseumEvents } from '../services/externalApiService';


const StatCard = ({ value, label, icon }: { value: number, label: string, icon: React.ReactNode }) => (
  <Card className="flex items-center p-4">
    <div className="p-3 bg-brand-accent/20 rounded-full text-brand-accent mr-4">{icon}</div>
    <div>
      <p className="text-3xl font-bold text-brand-text">{value}</p>
      <p className="text-brand-text-dark">{label}</p>
    </div>
  </Card>
);

const SpaceMuseumCard: React.FC = () => {
  const [events, setEvents] = useState<SpaceMuseumEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSpaceMuseumEvents().then(data => {
      setEvents(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <Card className="h-full">
      <h2 className="text-xl font-semibold text-brand-text mb-4">From HK Space Museum</h2>
       {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {events.length > 0 ? events.map((event, index) => (
            <div key={index} className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-accent flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <a href={event.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-text hover:text-brand-accent transition-colors">{event.title}</a>
                <p className="text-sm text-brand-text-dark">{event.date}</p>
              </div>
            </div>
          )) : <p className="text-brand-text-dark">Could not fetch events.</p>}
        </div>
      )}
    </Card>
  );
};


const Dashboard: React.FC = () => {
  const { clubMembers, events, announcements } = useData();
  const upcomingEvents = events.filter(e => !e.isPast).slice(0, 3);


  return (
    <div className="animate-fade-in space-y-8">
      <h1 className="text-4xl font-bold text-brand-text">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard value={clubMembers.length} label="Total Club Members" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.273-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.273.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
        <StatCard value={events.filter(e => !e.isPast).length} label="Upcoming Events" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
        <StatCard value={announcements.length} label="Announcements" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.514C18.354 1.85 18.67 1.173 18.5 1S18.059 0 17.5 0c-.559 0-1.059.448-1.059 1c0 .261.084.512.236.708C15.25 4.973 12.763 6 10.001 6H7a2 2 0 00-1.99 1.447A4.002 4.002 0 005.436 13.683z" /></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 h-full">
          <h2 className="text-xl font-semibold text-brand-text mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents.length > 0 ? upcomingEvents.map((event: Event) => (
              <div key={event.id} className="bg-slate-800/70 p-3 rounded-md border border-slate-700">
                <p className="font-semibold text-brand-text">{event.title}</p>
                <p className="text-sm text-brand-text-dark">{new Date(event.date).toLocaleDateString()} at {event.location}</p>
              </div>
            )) : <p className="text-brand-text-dark">No upcoming events.</p>}
          </div>
          <Link to="/events" className="text-brand-accent hover:text-brand-accent-dark mt-4 inline-block font-semibold">View All Events &rarr;</Link>
        </Card>

        <div className="space-y-8">
            <SpaceMuseumCard />
            
            <Card>
                <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-brand-accent/20 rounded-full text-brand-accent mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    </div>
                    <h2 className="text-xl font-semibold text-brand-text mb-2">Event Brainstorming</h2>
                    <p className="text-brand-text-dark mb-4">Have a new idea for an event? Share it anonymously with the committee.</p>
                    <Link to="/brainstorming" className="bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors w-full">
                        Go to Idea Board
                    </Link>
                </div>
            </Card>

            <Card>
                <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-brand-accent/20 rounded-full text-brand-accent mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.273-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.273.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm-9 8a3 3 0 116 0 3 3 0 01-6 0z" /></svg>
                    </div>
                    <h2 className="text-xl font-semibold text-brand-text mb-2">Work Distribution</h2>
                    <p className="text-brand-text-dark mb-4">Automatically assign and balance preparation tasks for upcoming events.</p>
                    <Link to="/work-distribution" className="bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors w-full">
                        Start Planning
                    </Link>
                </div>
            </Card>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;