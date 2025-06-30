

import React from 'react';
import type { ClubMember, Event, Announcement, KnowledgeArticle, KnowledgeCategory, Workflow, Meeting, MeetingMinutes, BrainstormIdea, EventPreparationPlan, CommitteeMember, ArticleComment, CommitteeSection } from './types';

export const NAV_ITEMS = [
  {
    path: '/',
    label: 'Dashboard',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    path: '/members',
    label: 'Club Members',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.273-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.273.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    path: '/committee',
    label: 'Committee',
    icon: (
       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
   {
    path: '/meetings',
    label: 'Meetings',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4h5m-5 4h5M5 7h1m-1 4h1" />
      </svg>
    ),
  },
  {
    path: '/events',
    label: 'Events',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
   {
    path: '/calendar',
    label: 'Calendar',
    icon: (
       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
    {
    path: '/workflows',
    label: 'Workflows',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
    ),
    },
     {
    path: '/work-distribution',
    label: 'Work Distribution',
    icon: (
       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    path: '/announcements',
    label: 'Announcements',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.514C18.354 1.85 18.67 1.173 18.5 1S18.059 0 17.5 0c-.559 0-1.059.448-1.059 1c0 .261.084.512.236.708C15.25 4.973 12.763 6 10.001 6H7a2 2 0 00-1.99 1.447A4.002 4.002 0 005.436 13.683z" />
      </svg>
    ),
  },
  {
    path: '/knowledge-base',
    label: 'Knowledge Base',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
];

const today = new Date();
const getFutureDate = (days: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + days).toISOString().split('T')[0];
const getPastDate = (days: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - days).toISOString().split('T')[0];

export const MOCK_CLUB_MEMBERS: ClubMember[] = [
  { id: 'm1', name: 'Alice Chan', studentId: '20123456', joinDate: '2023-09-01', email: 'achan@connect.ust.hk', status: 'Active', memberType: 'Full', membershipValidUntil: getFutureDate(150) },
  { id: 'm2', name: 'Bob Lee', studentId: '20234567', joinDate: '2023-09-01', email: 'blee@connect.ust.hk', status: 'Active', memberType: 'Full', membershipValidUntil: getFutureDate(25) }, // Expiring soon
  { id: 'm3', name: 'Charlie Wong', studentId: '20345678', joinDate: '2023-09-02', email: 'cwong@connect.ust.hk', status: 'Inactive', memberType: 'Associate', membershipValidUntil: getPastDate(10) }, // Expired
  { id: 'm4', name: 'Diana Prince', studentId: '20456789', joinDate: '2023-09-05', email: 'dprince@connect.ust.hk', status: 'Active', memberType: 'Full', membershipValidUntil: getFutureDate(300) },
  { id: 'm5', name: 'Ethan Hunt', studentId: '20567890', joinDate: '2023-09-10', email: 'ehunt@connect.ust.hk', status: 'Active', memberType: 'Associate', membershipValidUntil: getFutureDate(5) }, // Expiring soon
  { id: 'm6', name: 'Frank Castle', studentId: '20678901', joinDate: '2023-09-11', email: 'fcast@connect.ust.hk', status: 'Active', memberType: 'Full', membershipValidUntil: getFutureDate(200) },
];

const generateCommitteeSections = (): CommitteeSection[] => {
  const sections: CommitteeSection[] = [];
  const startYear = 1991;
  const endYear = 2025;

  const members2024: CommitteeMember[] = [
    { id: 'c1', name: 'Alice Chan', role: 'President', email: 'achan@connect.ust.hk' },
    { id: 'c2', name: 'Bob Lee', role: 'General Secretary', email: 'blee@connect.ust.hk' },
    { id: 'c3', name: 'Diana Prince', role: 'Financial Secretary', email: 'dprince@connect.ust.hk' },
    { id: 'c4', name: 'Ethan Hunt', role: 'General Secretary', email: 'ehunt@connect.ust.hk' },
  ];

  const members2023: CommitteeMember[] = [
    { id: 'c5', name: 'Frank Castle', role: 'President', email: 'fcastle@connect.ust.hk' },
    { id: 'c6', name: 'Gwen Stacy', role: 'Internal Vice President', email: 'gstacy@connect.ust.hk' },
  ];

  for (let year = endYear; year >= startYear; year--) {
    const nextYear = year + 1;
    let sectionName = `Committee ${year}-${nextYear}`;
    let members: CommitteeMember[] = [];
    let id = `sec-${year}`;
    
    if (year === 2024) {
      sectionName = `${sectionName} (Current)`;
      members = members2024;
      id = 'sec1';
    } else if (year === 2023) {
      sectionName = `${sectionName} (Past)`;
      members = members2023;
      id = 'sec2';
    } else if (year < 2024) {
      sectionName = `${sectionName} (Past)`;
    }

    sections.push({
      id,
      name: sectionName,
      members,
    });
  }

  return sections;
};


export const MOCK_COMMITTEE_SECTIONS: CommitteeSection[] = generateCommitteeSections();


export const MOCK_EVENTS: Event[] = [
  { id: '1', title: 'Perseid Meteor Shower Observation', date: '2024-08-12', time: '22:00', location: 'Clear Water Bay', description: 'Annual meteor shower observation night. Bring your telescopes and snacks!', type: 'Event', isPast: false, applicationsOpen: true, applicants: [
      { id: 'app1', name: 'Frank Castle', studentId: '20678901', email: 'fcast@connect.ust.hk', applicationDate: '2024-07-20' },
      { id: 'app2', name: 'Gwen Stacy', studentId: '20789012', email: 'gstacy@connect.ust.hk', applicationDate: '2024-07-21' },
  ], preparationPlanId: 'plan1' },
  { id: '2', title: 'Astrophotography Workshop', date: '2024-09-20', time: '18:30', location: 'LG4 Common Room', description: 'Learn the basics of capturing stunning images of the night sky.', type: 'Event', isPast: false, applicationsOpen: true, applicants: [] },
  { id: '3', title: 'Welcome Session & Stargazing', date: '2024-09-05', time: '19:00', location: 'Atrium', description: 'Kick off the new semester with an introduction to our club and some casual stargazing.', type: 'Event', isPast: false, applicationsOpen: false, applicants: [] },
  { id: '4', title: 'Lunar Eclipse Viewing Party', date: '2024-05-26', time: '20:00', location: 'Bridge Link', description: 'Watched the total lunar eclipse together.', type: 'Event', isPast: true, applicationsOpen: false, applicants: [] },
  { id: '5', title: 'Committee Recruitment Deadline', date: '2024-08-31', time: '23:59', location: 'Online', description: 'Final day for committee applications.', type: 'Deadline', isPast: false, applicationsOpen: false, applicants: [] },
  { id: '6', title: 'Prepare for Welcome Session', date: '2024-09-01', time: '14:00', location: 'Club Room', description: 'Prepare materials and logistics for the upcoming welcome session.', type: 'Task', isPast: false, applicationsOpen: false, applicants: [] },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
    { id: '1', title: 'Welcome New Members!', date: '2023-09-10', content: 'A big welcome to all new members who joined us during the recruitment period! We are excited to have you on board.', targetGroup: 'All Members' },
    { id: '2', title: 'Committee Recruitment Now Open', date: '2023-08-20', content: 'Want to be a part of the team that brings amazing astronomical events to campus? We are now recruiting for the next session\'s committee. Apply now!', targetGroup: 'All Members' },
    { id: '3', title: 'Upcoming: Perseid Meteor Shower Observation', date: '2024-08-01', content: 'Get ready for one of the best meteor showers of the year! Join us on August 12th for a night under the stars. More details to follow.', targetGroup: 'All Members' },
    { id: '4', title: 'Minutes for Q3 Planning Meeting Released', date: getPastDate(29), content: 'The minutes for our recent planning meeting have been finalized and are available in the Meetings tab. Please review them at your convenience.', targetGroup: 'Current Committee' },
];

export const KNOWLEDGE_CATEGORIES: KnowledgeCategory[] = ['Admin', 'Events', 'Finance', 'Human Relations', 'Promotion'];

export const MOCK_KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: '1',
    title: 'How to Book a Venue on Campus',
    category: 'Admin',
    author: 'Committee 2023',
    date: '2023-10-05T11:00:00Z',
    lastEditedBy: 'Alice Chan',
    lastModifiedDate: '2023-10-06T10:00:00Z',
    content: 'Booking venues at HKUST requires using the FMO booking system. First, log in with your committee\'s ITSC account. Then navigate to "Venue Booking" and select the desired location and time. Make sure to book at least 2 weeks in advance, especially for popular spots like the Atrium.',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
    attachments: [
        { name: 'FMO_Booking_Guide.pdf', url: '#' },
        { name: 'Venue_Request_Form.docx', url: '#' }
    ]
  },
  {
    id: '2',
    title: 'Tips for a Successful Stargazing Event',
    category: 'Events',
    author: 'Committee 2022',
    date: '2022-09-15T20:00:00Z',
    lastEditedBy: 'Bob Lee',
    lastModifiedDate: '2023-08-15T14:30:00Z',
    content: '1. Check the weather forecast obsessively.\n2. Have backup indoor activities planned.\n3. Bring red flashlights to preserve night vision.\n4. Prepare a list of constellations and objects that will be visible.\n5. Hot chocolate is always a good idea.',
    imageUrl: 'https://images.unsplash.com/photo-1534239898078-2B6c405586f4?q=80&w=1974&auto=format&fit=crop',
    attachments: []
  },
  {
    id: '3',
    title: 'Annual Budgeting Process',
    category: 'Finance',
    author: 'Committee 2023',
    date: '2023-08-20T18:00:00Z',
    content: 'The annual budget must be submitted to the SU by the end of August. It should include projected income from membership fees and sponsorship, and estimated expenses for all planned events, workshops, and operational costs. Use the provided SU template.',
    attachments: [
        { name: 'SU_Budget_Template.xlsx', url: '#' }
    ]
  },
  {
    id: '4',
    title: 'Organizing Committee Handover',
    category: 'Human Relations',
    author: 'Committee 2021',
    date: '2021-05-30T13:00:00Z',
    content: 'A smooth handover is crucial. Schedule a joint meeting with the incoming and outgoing committees. Prepare detailed handover documents for each post, including ongoing tasks, key contacts, and passwords. A shared cloud drive is essential for this.',
    imageUrl: '',
    attachments: []
  },
  {
    id: '5',
    title: 'Social Media Promotion Strategy',
    category: 'Promotion',
    author: 'Committee 2023',
    date: '2024-01-10T16:00:00Z',
    lastEditedBy: 'Alice Chan',
    lastModifiedDate: '2024-01-11T09:20:00Z',
    content: 'Our primary platforms are Instagram and Facebook. For event promotion, create an event page on Facebook and post a series of countdown posts on Instagram stories. Use high-quality astrophotography to grab attention. Collaborate with other societies for cross-promotion.',
    imageUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=1974&auto=format&fit=crop',
    attachments: []
  },
];

export const MOCK_ARTICLE_COMMENTS: ArticleComment[] = [
    { id: 'com1', articleId: '1', authorId: 'c2', authorName: 'Bob Lee', content: 'This is super helpful! Just a note, the FMO system is sometimes down for maintenance on weekends.', date: '2023-10-07T11:00:00Z' },
    { id: 'com2', articleId: '1', authorId: 'c3', authorName: 'Diana Prince', content: 'Great guide. We should also add a link to the list of bookable venues.', date: '2023-10-07T12:30:00Z' },
    { id: 'com3', articleId: '2', authorId: 'c1', authorName: 'Alice Chan', content: 'Point 5 is the most important one!', date: '2023-08-16T09:00:00Z' }
];

export const MOCK_WORKFLOWS: Workflow[] = [
    {
        id: 'wf1',
        title: 'New Event Onboarding Checklist',
        description: 'Standard procedure for creating and promoting a new club event.',
        tasks: [
            { id: 't1', text: 'Finalize event details (date, time, location).' },
            { id: 't2', text: 'Book venue through FMO system.' },
            { id: 't3', text: 'Create event page on the website and open applications if needed.' },
            { id: 't4', text: 'Draft promotional materials (poster, social media posts).' },
            { id: 't5', text: 'Post announcement on Instagram and Facebook.' },
            { id: 't6', text: 'Send announcement email to all members.' },
            { id: 't7', text: 'Arrange for necessary equipment (telescopes, etc.).' },
            { id: 't8', text: 'Confirm manpower and roles for event day.' },
        ]
    },
    {
        id: 'wf2',
        title: 'Committee Handover Workflow',
        description: 'Tasks to ensure a smooth transition between committees.',
        tasks: [
            { id: 't1', text: 'Compile annual report and financial statement.' },
            { id: 't2', text: 'Update and document all key contacts.' },
            { id: 't3', text: 'Organize all documents in a shared cloud drive.' },
            { id: 't4', text: 'Prepare handover documents for each position.' },
            { id: 't5', text: 'Change passwords for all society accounts.' },
            { id: 't6', text: 'Schedule and conduct a joint handover meeting.' },
            { id: 't7', text: 'Introduce new committee to SU and other stakeholders.' },
        ]
    }
];

export const MOCK_MEETING_MINUTES: MeetingMinutes[] = [
    {
        id: 'min1',
        meetingId: 'm2',
        content: `### Meeting Minutes: Q3 Planning\n**Date:** ${getPastDate(30)}\n\n**Attendees:** Alice Chan, Bob Lee, Diana Prince\n\n**Key Decisions:**\n- Confirmed Perseid Meteor Shower Observation for Aug 12.\n- Astrophotography workshop scheduled for Sep 20.\n- Budget for new telescope approved.`
    }
];

export const MOCK_MEETINGS: Meeting[] = [
    {
        id: 'm1',
        title: 'Weekly Sync - Welcome Session Prep',
        date: getFutureDate(7),
        time: '15:00',
        hostId: 'c1', // Alice
        attendees: ['c1', 'c2', 'c3', 'c4'],
        status: 'Scheduled',
        minutesId: null,
        agenda: [
            { id: 'a1-1', text: 'Review presentation slides for welcome session', isCompleted: false, lastEditedBy: 'c1' },
            { id: 'a1-2', text: 'Finalize logistics for stargazing part (telescope transport)', isCompleted: false, lastEditedBy: 'c2' },
            { id: 'a1-3', text: 'Confirm marketing materials distribution timeline', isCompleted: false, lastEditedBy: 'c3' },
            { id: 'a1-4', text: 'Open discussion and Q&A', isCompleted: false, lastEditedBy: 'c1' },
        ],
        focusedAgendaItemId: null,
        notepadContent: `## Shared Notes for Weekly Sync - Welcome Session Prep\n\n- Start typing here... all attendees can edit this notepad simultaneously.`,
        activePoll: null,
        reactions: [],
    },
    {
        id: 'm2',
        title: 'Q3 Planning Meeting',
        date: getPastDate(30),
        time: '14:00',
        hostId: 'c1', // Alice
        attendees: ['c1', 'c2', 'c3'],
        status: 'Completed',
        minutesId: 'min1',
        agenda: [
            { id: 'a2-1', text: 'Review Q2 performance', isCompleted: true, lastEditedBy: 'c1' },
            { id: 'a2-2', text: 'Plan major events for Q3 (Meteor Shower, Workshops)', isCompleted: true, lastEditedBy: 'c2' },
            { id: 'a2-3', text: 'Budget allocation for new equipment', isCompleted: true, lastEditedBy: 'c3' },
        ],
        focusedAgendaItemId: null,
        notepadContent: `## Shared Notes for Q3 Planning Meeting\n\n- Start typing here... all attendees can edit this notepad simultaneously.`,
        activePoll: null,
        reactions: [],
    }
];

export const USER_COLORS: { [key: string]: string } = {
  'c1': 'bg-red-500',
  'c2': 'bg-blue-500',
  'c3': 'bg-yellow-500',
  'c4': 'bg-purple-500',
  'c5': 'bg-green-500',
  'c6': 'bg-pink-500',
};

export const USER_COLORS_BRAINSTORM: { [key: string]: string } = {
  'c1': 'border-red-500/80',
  'c2': 'border-blue-500/80',
  'c3': 'border-yellow-500/80',
  'c4': 'border-purple-500/80',
  'c5': 'border-green-500/80',
  'c6': 'border-pink-500/80',
};


export const MOCK_BRAINSTORM_IDEAS: BrainstormIdea[] = [
    {
        id: 'b1',
        title: "Astronomy-themed Movie Night",
        details: {
            venue: "LG4 Common Room",
            target: "All students",
            attractions: "Free popcorn, vote for the movie (e.g., Interstellar, The Martian, Gravity)"
        },
        submittedBy: 'c2', // Bob
    },
    {
        id: 'b2',
        title: "DIY Telescope Workshop",
        details: {
            venue: "Club Room or a lecture theater",
            target: "Members only, limited spots",
            attractions: "Build a small, working telescope to take home. Material fee required."
        },
        submittedBy: 'c3', // Diana
    },
    {
        id: 'b3',
        title: "Sunrise Observation at High Junk Peak",
        details: {
            venue: "High Junk Peak",
            time: "Early morning (e.g., 4 AM meetup)",
            target: "Experienced hikers, fitness required",
            attractions: "Stunning views, combined with morning stargazing."
        },
        submittedBy: 'c1', // Alice
    },
];

export const MOCK_PREPARATION_PLANS: EventPreparationPlan[] = [
    {
        id: 'plan1',
        eventId: '1', // Perseid Meteor Shower
        involvedCommitteeMembers: ['c1', 'c2', 'c3', 'c4'],
        tasks: [
            { id: 'pt1', name: 'Transport Telescopes', deadline: '2024-08-12T19:00:00Z', workload: 8, requiredPersonnel: 2, assignedTo: ['c1', 'c4'] },
            { id: 'pt2', name: 'Set up Observation Site', deadline: '2024-08-12T20:30:00Z', workload: 6, requiredPersonnel: 3, assignedTo: ['c1', 'c2', 'c3'] },
            { id: 'pt3', name: 'Prepare Snacks & Drinks', deadline: '2024-08-12T18:00:00Z', workload: 3, requiredPersonnel: 1, assignedTo: ['c3'] },
            { id: 'pt4', name: 'On-site Registration', deadline: '2024-08-12T22:30:00Z', workload: 4, requiredPersonnel: 1, assignedTo: ['c4'] },
            { id: 'pt5', name: 'Guide & Explanation', deadline: '2024-08-13T01:00:00Z', workload: 7, requiredPersonnel: 2, assignedTo: ['c1', 'c2'] },
        ]
    }
];