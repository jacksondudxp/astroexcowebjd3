import type { SpaceMuseumEvent } from '../types';

// This is a mock service. In a real application, this would fetch data from a live API.
export const fetchSpaceMuseumEvents = async (): Promise<SpaceMuseumEvent[]> => {
    console.log("Fetching latest events from HK Space Museum...");
    
    // Mock data representing events that could be fetched
    const mockData: SpaceMuseumEvent[] = [
        {
            title: "All-sky Film: 'Worlds Beyond Earth'",
            date: "Ongoing",
            link: "https://hk.space.museum/en_US/web/spm/exhibitions/sky-shows/all-sky-film.html"
        },
        {
            title: "Sky Show: 'The Sun and the Little Star'",
            date: "Ongoing",
            link: "https://hk.space.museum/en_US/web/spm/exhibitions/sky-shows/sky-show.html"
        },
        {
            title: "Stargazing with Your Own Telescope",
            date: "Check website for dates",
            link: "https://hk.space.museum/en_US/web/spm/activities/astronomical-observation.html"
        }
    ];

    // Simulate network delay
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockData);
        }, 1500);
    });
};
