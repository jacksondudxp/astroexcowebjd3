import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import type { ClubMember, Event, Announcement, KnowledgeArticle, Workflow, Meeting, MeetingMinutes, AgendaItem, BrainstormIdea, EventPreparationPlan, PrepTask, CommitteeMember, ArticleComment, CommitteeSection } from '../types';
import { MOCK_CLUB_MEMBERS, MOCK_EVENTS, MOCK_ANNOUNCEMENTS, MOCK_KNOWLEDGE_ARTICLES, MOCK_WORKFLOWS, MOCK_MEETINGS, MOCK_MEETING_MINUTES, MOCK_BRAINSTORM_IDEAS, MOCK_PREPARATION_PLANS, MOCK_COMMITTEE_SECTIONS, MOCK_ARTICLE_COMMENTS } from '../constants';
import { useAuth } from './AuthContext';


interface DataContextType {
  clubMembers: ClubMember[];
  events: Event[];
  announcements: Announcement[];
  knowledgeArticles: KnowledgeArticle[];
  articleComments: ArticleComment[];
  workflows: Workflow[];
  meetings: Meeting[];
  minutes: MeetingMinutes[];
  brainstormIdeas: BrainstormIdea[];
  eventPreparationPlans: EventPreparationPlan[];
  
  // Committee Section
  committeeSections: CommitteeSection[];
  currentCommitteeMembers: CommitteeMember[];
  pastCommitteeMembers: CommitteeMember[];
  allCommitteeMembers: CommitteeMember[];
  getCommitteeMemberById: (memberId: string) => CommitteeMember | undefined;
  addCommitteeSection: (name: string) => void;
  addCommitteeMember: (sectionId: string, member: CommitteeMember) => void;
  updateCommitteeMember: (sectionId: string, member: CommitteeMember) => void;
  deleteCommitteeMember: (sectionId: string, memberId: string) => void;

  addClubMembers: (newMembers: ClubMember[]) => void;
  addEvent: (event: Omit<Event, 'id' | 'isPast' | 'type' | 'applicants'>) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  
  scheduleMeeting: (meetingData: Omit<Meeting, 'id' | 'status' | 'minutesId' | 'agenda' | 'focusedAgendaItemId' | 'notepadContent' | 'activePoll' | 'reactions'>, memberEmails: string[]) => void;
  updateAgendaItem: (meetingId: string, itemId: string, newText: string) => void;
  toggleAgendaItemStatus: (meetingId: string, itemId: string) => void;
  addMinutes: (meetingId: string, content: string) => void;
  addAgendaItem: (meetingId: string, text: string) => void;
  
  // Meeting Hub functions
  setFocusAgendaItem: (meetingId: string, itemId: string | null) => void;
  updateNotepadContent: (meetingId: string, content: string) => void;
  startPoll: (meetingId: string, question: string) => void;
  castVote: (meetingId: string, vote: 'yes' | 'no' | 'abstain') => void;
  endPoll: (meetingId: string) => void;
  sendReaction: (meetingId: string, emoji: string) => void;

  addBrainstormIdea: (idea: Omit<BrainstormIdea, 'id' | 'submittedBy'>) => void;
  distributeWork: (planId: string) => void;
  updatePreparationPlan: (planId: string, newPlan: Partial<EventPreparationPlan>) => void;
  createPreparationPlan: (eventId: string) => string;
  addKnowledgeArticle: (article: Omit<KnowledgeArticle, 'id' | 'author' | 'date' | 'lastEditedBy' | 'lastModifiedDate'>) => void;
  updateKnowledgeArticle: (article: KnowledgeArticle) => void;
  deleteKnowledgeArticle: (articleId: string) => void;
  addArticleComment: (articleId: string, content: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [clubMembers, setClubMembers] = useState<ClubMember[]>(MOCK_CLUB_MEMBERS);
  const [committeeSections, setCommitteeSections] = useState<CommitteeSection[]>(MOCK_COMMITTEE_SECTIONS);
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [knowledgeArticles, setKnowledgeArticles] = useState<KnowledgeArticle[]>(MOCK_KNOWLEDGE_ARTICLES);
  const [articleComments, setArticleComments] = useState<ArticleComment[]>(MOCK_ARTICLE_COMMENTS);
  const [workflows] = useState<Workflow[]>(MOCK_WORKFLOWS);
  const [meetings, setMeetings] = useState<Meeting[]>(MOCK_MEETINGS);
  const [minutes, setMinutes] = useState<MeetingMinutes[]>(MOCK_MEETING_MINUTES);
  const [brainstormIdeas, setBrainstormIdeas] = useState<BrainstormIdea[]>(MOCK_BRAINSTORM_IDEAS);
  const [eventPreparationPlans, setEventPreparationPlans] = useState<EventPreparationPlan[]>(MOCK_PREPARATION_PLANS);

  // Derived committee data
  const allCommitteeMembers = useMemo(() => committeeSections.flatMap(s => s.members), [committeeSections]);
  const currentCommitteeMembers = useMemo(() => committeeSections.find(s => s.name.includes('(Current)'))?.members || [], [committeeSections]);
  const pastCommitteeMembers = useMemo(() => committeeSections.filter(s => !s.name.includes('(Current)')).flatMap(s => s.members), [committeeSections]);
  
  const getCommitteeMemberById = (memberId: string) => allCommitteeMembers.find(m => m.id === memberId);

  const addClubMembers = (newMembers: ClubMember[]) => {
    setClubMembers(prevMembers => {
        const existingStudentIds = new Set(prevMembers.map(m => m.studentId));
        const trulyNewMembers = newMembers.filter(m => !existingStudentIds.has(m.studentId));
        
        const skippedCount = newMembers.length - trulyNewMembers.length;
        if (skippedCount > 0) {
            alert(`${skippedCount} member(s) were skipped because their Student ID already exists in the system.`);
        }
        
        if (trulyNewMembers.length > 0) {
            return [...prevMembers, ...trulyNewMembers];
        }
        return prevMembers;
    });
  };

  const addEvent = (eventData: Omit<Event, 'id' | 'isPast' | 'type' | 'applicants'>) => {
    const newEvent: Event = {
      ...eventData,
      id: `evt-${Date.now()}`,
      isPast: new Date(eventData.date) < new Date(),
      type: 'Event',
      applicants: [],
    };
    setEvents(prevEvents => [newEvent, ...prevEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };
  
  const addAnnouncement = (announcementData: Omit<Announcement, 'id' | 'date'>) => {
    const newAnnouncement: Announcement = { 
        ...announcementData, 
        id: `ann-${Date.now()}`,
        date: new Date().toISOString()
    };
    setAnnouncements(prev => [newAnnouncement, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    
    // Simulate sending email
    alert(`Announcement posted and email sent to: ${announcementData.targetGroup}`);
    console.log(`Simulating sending email for "${announcementData.title}" to target group: ${announcementData.targetGroup}`);
  };
  
  // --- Committee Section Management ---
  const addCommitteeSection = (name: string) => {
    const newSection: CommitteeSection = {
        id: `sec-${Date.now()}`,
        name,
        members: []
    };
    setCommitteeSections(prev => [newSection, ...prev]);
  };

  const addCommitteeMember = (sectionId: string, newMember: CommitteeMember) => {
    setCommitteeSections(prev => prev.map(sec => 
        sec.id === sectionId ? {...sec, members: [...sec.members, newMember]} : sec
    ));
  };
  
  const updateCommitteeMember = (sectionId: string, updatedMember: CommitteeMember) => {
    setCommitteeSections(prev => prev.map(sec => 
        sec.id === sectionId ? {...sec, members: sec.members.map(m => m.id === updatedMember.id ? updatedMember : m)} : sec
    ));
  };
  
  const deleteCommitteeMember = (sectionId: string, memberId: string) => {
    setCommitteeSections(prev => prev.map(sec => 
        sec.id === sectionId ? {...sec, members: sec.members.filter(m => m.id !== memberId)} : sec
    ));
  };
  
  const scheduleMeeting = (meetingData: Omit<Meeting, 'id' | 'status' | 'minutesId' | 'agenda' | 'focusedAgendaItemId' | 'notepadContent' | 'activePoll' | 'reactions'>, memberEmails: string[]) => {
    if(!currentUser) return;
    const newMeeting: Meeting = {
        ...meetingData,
        id: `m-${Date.now()}`,
        status: 'Scheduled',
        minutesId: null,
        agenda: [{id: 'a-1', text: 'Opening remarks', isCompleted: false, lastEditedBy: currentUser.id}],
        focusedAgendaItemId: null,
        notepadContent: `## Shared Notes for ${meetingData.title}\n\n- Start typing here... all attendees can edit this notepad simultaneously.`,
        activePoll: null,
        reactions: [],
    };
    setMeetings(prev => [newMeeting, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    console.log(`Simulating sending email invitations for meeting "${meetingData.title}" to:`, memberEmails);
    alert(`Meeting scheduled! Invitations have been sent to ${memberEmails.length} members.`);
  };

  const updateAgendaItem = (meetingId: string, itemId: string, newText: string) => {
    if(!currentUser) return;
    setMeetings(prev => prev.map(m => m.id === meetingId ? { ...m, agenda: m.agenda.map(item => item.id === itemId ? {...item, text: newText, lastEditedBy: currentUser.id} : item) } : m));
  };

    const addAgendaItem = (meetingId: string, text: string) => {
        if(!currentUser) return;
        setMeetings(prev => prev.map(m => {
            if (m.id === meetingId) {
                const newItem: AgendaItem = { id: `a-${Date.now()}`, text, isCompleted: false, lastEditedBy: currentUser.id };
                return { ...m, agenda: [...m.agenda, newItem] };
            }
            return m;
        }));
    };

  const toggleAgendaItemStatus = (meetingId: string, itemId: string) => {
    setMeetings(prev => prev.map(m => m.id === meetingId ? { ...m, agenda: m.agenda.map(item => item.id === itemId ? {...item, isCompleted: !item.isCompleted} : item) } : m));
  };

  const addMinutes = (meetingId: string, content: string) => {
    const newMinutes: MeetingMinutes = { id: `min-${Date.now()}`, meetingId, content };
    setMinutes(prev => [...prev, newMinutes]);
    setMeetings(prev => prev.map(m => m.id === meetingId ? {...m, minutesId: newMinutes.id, status: 'Completed'} : m));
  };

  // --- Meeting Hub Functions ---
  const setFocusAgendaItem = (meetingId: string, itemId: string | null) => {
    setMeetings(prev => prev.map(m => m.id === meetingId ? { ...m, focusedAgendaItemId: itemId } : m));
  };

  const updateNotepadContent = (meetingId: string, content: string) => {
      setMeetings(prev => prev.map(m => m.id === meetingId ? { ...m, notepadContent: content } : m));
  };

  const startPoll = (meetingId: string, question: string) => {
      if (!question.trim()) return;
      setMeetings(prev => prev.map(m => m.id === meetingId ? { ...m, activePoll: { question, options: { yes: 0, no: 0, abstain: 0 }, voters: [] } } : m));
  };

  const castVote = (meetingId: string, vote: 'yes' | 'no' | 'abstain') => {
      if(!currentUser) return;
      setMeetings(prev => prev.map(m => {
          if (m.id === meetingId && m.activePoll && !m.activePoll.voters.includes(currentUser.id)) {
              const newPoll = { ...m.activePoll };
              newPoll.options[vote]++;
              newPoll.voters.push(currentUser.id);
              return { ...m, activePoll: newPoll };
          }
          return m;
      }));
  };

  const endPoll = (meetingId: string) => {
      setMeetings(prev => prev.map(m => m.id === meetingId ? { ...m, activePoll: null } : m));
  };

  const sendReaction = (meetingId: string, emoji: string) => {
      if (!currentUser) return;
      const reactionId = `reac-${Date.now()}-${Math.random()}`;
      const newReaction = { id: reactionId, emoji, userId: currentUser.id };
      
      setMeetings(prev => prev.map(m => m.id === meetingId ? { ...m, reactions: [...m.reactions, newReaction] } : m));

      setTimeout(() => {
          setMeetings(prev => prev.map(m => m.id === meetingId ? { ...m, reactions: m.reactions.filter(r => r.id !== reactionId) } : m));
      }, 4000);
  };


  const addBrainstormIdea = (ideaData: Omit<BrainstormIdea, 'id' | 'submittedBy'>) => {
    if(!currentUser) return;
    const newIdea: BrainstormIdea = { ...ideaData, id: `bs-${Date.now()}`, submittedBy: currentUser.id };
    setBrainstormIdeas(prev => [newIdea, ...prev]);
  };

  const updatePreparationPlan = (planId: string, newPlanData: Partial<EventPreparationPlan>) => {
    setEventPreparationPlans(prev => prev.map(p => p.id === planId ? { ...p, ...newPlanData } : p));
  };
    
  const createPreparationPlan = (eventId: string): string => {
    const newPlan: EventPreparationPlan = {
        id: `plan-${Date.now()}`,
        eventId: eventId,
        tasks: [],
        involvedCommitteeMembers: currentCommitteeMembers.map(m => m.id) // Default to current committee members
    };
    setEventPreparationPlans(prev => [...prev, newPlan]);
    setEvents(prev => prev.map(e => e.id === eventId ? {...e, preparationPlanId: newPlan.id} : e));
    return newPlan.id;
  };
    
  const distributeWork = (planId: string) => {
    const plan = eventPreparationPlans.find(p => p.id === planId);
    if (!plan || plan.involvedCommitteeMembers.length === 0) {
        alert("Cannot distribute work without involved committee members.");
        return;
    };

    const workload: Record<string, number> = plan.involvedCommitteeMembers.reduce((acc, id) => ({...acc, [id]: 0 }), {});
    
    // Deep copy tasks and clear assignments
    const tasksToAssign: PrepTask[] = JSON.parse(JSON.stringify(plan.tasks));
    tasksToAssign.forEach(task => task.assignedTo = []);
    
    // Sort tasks by workload descending to assign heavier tasks first
    tasksToAssign.sort((a, b) => b.workload - a.workload);

    for (const task of tasksToAssign) {
      // For each task, sort available members by their current workload
      const sortedMembers = [...plan.involvedCommitteeMembers].sort((a, b) => workload[a] - workload[b]);

      // Assign the task to the N members with the lowest workload
      for(let i=0; i < task.requiredPersonnel; i++) {
        const memberId = sortedMembers[i];
        if (memberId) {
          task.assignedTo.push(memberId);
          // Update workload for the assigned member
          const workloadPerPerson = task.workload / task.requiredPersonnel;
          workload[memberId] += workloadPerPerson;
        } else {
            console.warn(`Could not find enough members for task "${task.name}". Required: ${task.requiredPersonnel}, Available: ${i}`);
            break;
        }
      }
    }

    updatePreparationPlan(planId, { tasks: tasksToAssign });
    alert('Work has been distributed based on workload balance!');
  };

  const addKnowledgeArticle = (articleData: Omit<KnowledgeArticle, 'id' | 'author' | 'date' | 'lastEditedBy' | 'lastModifiedDate'>) => {
    if(!currentUser) return;

    const currentSectionName = committeeSections.find(sec => sec.members.some(m => m.id === currentUser.id))?.name || "Committee";
    const now = new Date().toISOString();
    const newArticle: KnowledgeArticle = {
      ...articleData,
      id: `ka-${Date.now()}`,
      author: currentSectionName,
      date: now,
      lastEditedBy: currentUser.name,
      lastModifiedDate: now,
    };
    setKnowledgeArticles(prev => [newArticle, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const updateKnowledgeArticle = (updatedArticle: KnowledgeArticle) => {
    if(!currentUser) return;
    const now = new Date().toISOString();
    const finalArticle = {
      ...updatedArticle,
      lastEditedBy: currentUser.name,
      lastModifiedDate: now,
    };
    setKnowledgeArticles(prev => prev.map(a => a.id === finalArticle.id ? finalArticle : a));
  };

  const deleteKnowledgeArticle = (articleId: string) => {
    setKnowledgeArticles(prev => prev.filter(a => a.id !== articleId));
  };

  const addArticleComment = (articleId: string, content: string) => {
    if (!currentUser) return;

    const newComment: ArticleComment = {
      id: `comm-${Date.now()}`,
      articleId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      content,
      date: new Date().toISOString(),
    };
    setArticleComments(prev => [...prev, newComment]);
  };

  return (
    <DataContext.Provider value={{ 
        clubMembers, 
        events, 
        announcements, 
        knowledgeArticles,
        articleComments, 
        workflows, 
        meetings,
        minutes,
        brainstormIdeas,
        eventPreparationPlans,
        
        committeeSections,
        currentCommitteeMembers,
        pastCommitteeMembers,
        allCommitteeMembers,
        getCommitteeMemberById,
        addCommitteeSection,
        addCommitteeMember,
        updateCommitteeMember,
        deleteCommitteeMember,
        
        addClubMembers,
        addEvent, 
        addAnnouncement, 
        scheduleMeeting,
        updateAgendaItem,
        toggleAgendaItemStatus,
        addMinutes,
        addAgendaItem,
        setFocusAgendaItem,
        updateNotepadContent,
        startPoll,
        castVote,
        endPoll,
        sendReaction,
        addBrainstormIdea,
        distributeWork,
        updatePreparationPlan,
        createPreparationPlan,
        addKnowledgeArticle,
        updateKnowledgeArticle,
        deleteKnowledgeArticle,
        addArticleComment
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};