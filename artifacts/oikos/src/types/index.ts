export type MemoryColor = "cobalt" | "teal" | "rose" | "navy";

export interface Memory {
  id: string;
  title: string;
  date: string;
  location: string;
  preview: string;
  content: string;
  insideJokes: string[];
  imageUrl: string;
  tags?: string[];
  mood?: string;
  gallery?: string[];
  memoryColor?: MemoryColor;
}

export type NoteType = "note" | "open-when" | "invite" | "pillar";

export interface Letter {
  id: string;
  title: string;
  unlockDate: string;
  isLocked: boolean;
  lockedUntil?: string;
  author?: string;
  category?: string;
  content?: string;
  mood?: string;
  noteType?: NoteType;
  suggestedDate?: string;
}

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
}

export interface Question {
  id: string;
  category: string;
  text: string;
}

export interface ScoreData {
  daniel: number;
  sofia: number;
  milestones: { title: string; winner: string | null; target: number }[];
  recentActivities: { id: string; user: string; action: string; points: number; date: string }[];
  history: { week: string; daniel: number; sofia: number }[];
}

export interface Milestone {
  id: string;
  title: string;
  reward: string;
  targetPoints: number;
  completed: boolean;
  winner: string | null;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  points: number;
  date: string;
}

export interface SeasonResult {
  id: string;
  name: string;
  trophyName: string;
  description: string;
  month: string;
  year: number;
  danielPoints: number;
  sofiaPoints: number;
  winner: string;
}

export interface ScoreSnapshot {
  daniel: number;
  sofia: number;
  date: string;
  ts?: number;
}

export interface DashboardData {
  daysTogether: number;
  nextEvent: { name: string; daysAway: number };
  randomPhrase: string;
  nextLetterUnlock: { name: string; daysAway: number };
  activeGoals: number;
  suggestions: string[];
  memoryOfTheDay: { id: string; title: string; preview: string };
}
