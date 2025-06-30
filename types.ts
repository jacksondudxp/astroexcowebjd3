


export interface ClubMember {
  id: string;
  name: string;
  studentId: string;
  joinDate: string;
  email: string;
  status: 'Active' | 'Inactive';
  memberType: 'Full' | 'Associate';
  membershipValidUntil: string;
}

export interface CommitteeMember {
  id: string;
  name: string;
  role: 'President' | 'Internal Vice President' | 'External Vice President' | 'General Secretary' | 'Financial Secretary' | 'Internal Secretary' | 'External Secretary' | 'Promotion Secretary' | 'Academic Secretary' | 'IT Secretary' | 'Material Secretary' | 'Marketing Secretary';
  email: string;
}

export interface AuthUser extends CommitteeMember {
  permissionLevel: 'current' | 'past';
}

export interface CommitteeSection {
  id: string;
  name: string; // e.g., "Committee 2024-2025"
  members: CommitteeMember[];
}

export interface EventApplication {
  id:string;
  name: string;
  studentId: string;
  email: string;
  applicationDate: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description:string;
  type: 'Event' | 'Deadline' | 'Task';
  isPast: boolean;
  applicationsOpen: boolean;
  applicants: EventApplication[];
  preparationPlanId?: string;
}

export type AnnouncementTargetGroup = 'All Members' | 'Current Committee' | 'Past Committees';

export interface Announcement {
  id:string;
  title: string;
  date: string;
  content: string;
  targetGroup: AnnouncementTargetGroup;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type KnowledgeCategory = 'Admin' | 'Events' | 'Finance' | 'Human Relations' | 'Promotion';

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: KnowledgeCategory;
  content: string;
  author: string; // e.g., "Committee 2023"
  date: string; // creation date
  lastEditedBy?: string;
  lastModifiedDate?: string;
  imageUrl?: string;
  attachments?: { name: string; url: string; }[];
}

export interface ArticleComment {
  id: string;
  articleId: string;
  authorId: string;
  authorName: string;
  content: string;
  date: string;
}

export interface WorkflowTask {
  id: string;
  text: string;
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  tasks: WorkflowTask[];
}

export interface SpaceMuseumEvent {
    title: string;
    date: string;
    link: string;
}

export interface AgendaItem {
  id: string;
  text: string;
  isCompleted: boolean;
  lastEditedBy: string; // CommitteeMember ID
}

export interface MeetingMinutes {
  id: string;
  meetingId: string;
  content: string; // Using markdown format
}

export interface Poll {
  question: string;
  options: {
    yes: number;
    no: number;
    abstain: number;
  };
  voters: string[]; // array of CommitteeMember IDs
}

export interface Reaction {
  id: string;
  emoji: string;
  userId: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  hostId: string; // CommitteeMember ID
  attendees: string[]; // array of CommitteeMember IDs
  agenda: AgendaItem[];
  minutesId: string | null;
  status: 'Scheduled' | 'Completed';
  // New properties for meeting hub
  focusedAgendaItemId: string | null;
  notepadContent: string;
  activePoll: Poll | null;
  reactions: Reaction[];
}

export interface BrainstormIdea {
  id: string;
  title: string;
  details: {
    venue?: string;
    time?: string;
    target?: string;
    attractions?: string;
  };
  submittedBy: string; // Anonymous CommitteeMember ID
}

export interface PrepTask {
  id: string;
  name: string;
  deadline: string; // ISO string
  workload: number;  // 1-10
  requiredPersonnel: number;
  assignedTo: string[]; // CommitteeMember IDs
}

export interface EventPreparationPlan {
  id: string;
  eventId: string;
  tasks: PrepTask[];
  involvedCommitteeMembers: string[];
}