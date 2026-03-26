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
}

export interface Letter {
  id: string;
  title: string;
  unlockDate: string;
  isLocked: boolean;
  author?: string;
  category?: string;
  content?: string;
  mood?: string;
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
