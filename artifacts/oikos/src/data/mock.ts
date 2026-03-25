import { differenceInDays } from "date-fns";
import type { Memory, Letter, Goal, Question, ScoreData, DashboardData } from "@/types";

const startDate = new Date("2022-06-15");
const today = new Date();
const daysTogether = differenceInDays(today, startDate);

export const mockDashboard: DashboardData = {
  daysTogether,
  nextEvent: { name: "Azores trip planning", daysAway: 12 },
  randomPhrase: "Every ordinary moment we choose to remember becomes extraordinary.",
  nextLetterUnlock: { name: "Letter No. 4 — One Year", daysAway: 23 },
  activeGoals: 5,
};

export const mockMemories: Memory[] = [
  {
    id: "mem-1",
    title: "First Coffee in Rome",
    date: "March 15, 2023",
    location: "Rome, Italy",
    preview: "The smell of espresso and rain on cobblestones...",
    content: "We sat by the window in that tiny cafe near the Pantheon. You ordered an espresso, I had a cappuccino. We watched the rain wash over the cobblestones. You said it felt like we were in a movie, and for a moment, I completely believed it. I still have the sugar packet from that morning.",
    insideJokes: ["The aggressive pigeon", "Unintentional matching coats"],
    imageUrl: "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "mem-2",
    title: "That Night in Lisboa",
    date: "July 8, 2023",
    location: "Lisbon, Portugal",
    preview: "We got lost on purpose and found the best fado bar...",
    content: "Wandering through Alfama without a map was the best decision we made. We heard the guitar from three streets away and followed it until we found that tiny tavern. We drank green wine and you cried a little at the music, even though neither of us understood the words.",
    insideJokes: ["Pastel de nata count: 14", "The endless stairs"],
    imageUrl: "https://images.unsplash.com/photo-1558348259-21665a3c2005?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "mem-3",
    title: "Hiking at Dawn",
    date: "October 2, 2023",
    location: "Sintra, Portugal",
    preview: "The fog lifted just as we reached the top...",
    content: "We woke up at 5 AM, both complaining about it the entire drive. But when we reached the top of the Moorish Castle and the morning fog finally broke to reveal the palace across the valley, we both went completely silent. It was pure magic.",
    insideJokes: ["The 'shortcut'", "Pre-coffee personalities"],
    imageUrl: "https://images.unsplash.com/photo-1620802051771-33bc03c800b7?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "mem-4",
    title: "New Year's Eve",
    date: "December 31, 2023",
    location: "Porto, Portugal",
    preview: "The fireworks reflected in the Douro...",
    content: "Standing on the Dom Luís I Bridge, freezing but holding onto each other. When the fireworks started, they reflected perfectly in the river below. I remember thinking I didn't want to be anywhere else in the world, with anyone else.",
    insideJokes: ["The missing corkscrew", "Midnight francesinha"],
    imageUrl: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "mem-5",
    title: "Sunday Market",
    date: "February 18, 2024",
    location: "Barcelona, Spain",
    preview: "You found that vintage bookshop in the market...",
    content: "A lazy Sunday morning. We bought fresh fruit, warm bread, and then you spotted that hidden bookstore stall. You spent an hour looking through old maps while I watched you be completely in your element. We carried flowers and old paper all the way back.",
    insideJokes: ["The overly friendly dog", "That one weird painting"],
    imageUrl: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=800&auto=format&fit=crop"
  }
];

export const mockLetters: Letter[] = [
  { id: "let-1", title: "Letter No. 1 — Hello, Us", unlockDate: "Jan 1, 2024", isLocked: false },
  { id: "let-2", title: "Letter No. 2 — Six Months", unlockDate: "Jul 1, 2024", isLocked: false },
  { id: "let-3", title: "Letter No. 3 — The Small Things", unlockDate: "Oct 15, 2024", isLocked: false },
  { id: "let-4", title: "Letter No. 4 — One Year", unlockDate: "Jan 1, 2025", isLocked: true },
  { id: "let-5", title: "Letter No. 5 — To the Future", unlockDate: "Jan 1, 2026", isLocked: true },
];

export const mockGoals: Goal[] = [
  { id: "goal-1", text: "Visit Douro Valley wine country", completed: true },
  { id: "goal-2", text: "Cook a proper Sunday roast together", completed: true },
  { id: "goal-3", text: "Learn two songs on guitar together", completed: true },
  { id: "goal-4", text: "Weekend in Seville", completed: false },
  { id: "goal-5", text: "Take a pottery class", completed: false },
  { id: "goal-6", text: "Find our 'regular' restaurant in Lisbon", completed: false },
  { id: "goal-7", text: "Hike Rota Vicentina (3-day section)", completed: false },
  { id: "goal-8", text: "Spend a week in the Azores", completed: false },
];

export const mockQuestions: Question[] = [
  { id: "q-1", category: "Deep Questions", text: "What's a belief you held strongly that I've completely changed your mind about?" },
  { id: "q-2", category: "Deep Questions", text: "When was the exact moment you realized you loved me?" },
  { id: "q-3", category: "Conversation Starters", text: "If we had to move to a new country tomorrow, where would we go and why?" },
  { id: "q-4", category: "Conversation Starters", text: "What's your favorite small, everyday habit we share?" },
  { id: "q-5", category: "Would You Rather", text: "Would you rather have a personal chef for life or unlimited free travel anywhere in the world?" },
  { id: "q-6", category: "Would You Rather", text: "Would you rather only be able to whisper to me, or only be able to shout?" },
];

export const mockScore: ScoreData = {
  daniel: 47,
  sofia: 52,
  milestones: [
    { title: "First to 50 points (Weekend Trip)", winner: "Sofia", target: 50 },
    { title: "First to 100 points (Special Dinner)", winner: null, target: 100 },
  ],
  recentActivities: [
    { id: "act-1", user: "Sofia", action: "Planned the perfect date night", points: 5, date: "Yesterday" },
    { id: "act-2", user: "Daniel", action: "Made breakfast in bed", points: 3, date: "2 days ago" },
    { id: "act-3", user: "Sofia", action: "Won Mario Kart", points: 2, date: "3 days ago" },
    { id: "act-4", user: "Sofia", action: "Completed a shared goal", points: 10, date: "Last week" },
    { id: "act-5", user: "Daniel", action: "Bought spontaneous flowers", points: 4, date: "Last week" },
  ]
};
