import { mockMemories, mockLetters, mockGoals } from "./mock";
import type { Memory, Letter, Goal, Question } from "@/types";
import type { KVData } from "./kv-store";

export function isCustomItem(id: string): boolean {
  return id.includes("custom") || id.startsWith("note-");
}

function computeLetterLockState(letter: Letter): Letter {
  if (letter.lockedUntil) {
    const unlockTime = new Date(letter.lockedUntil).getTime();
    if (Date.now() >= unlockTime) return { ...letter, isLocked: false };
    return { ...letter, isLocked: true };
  }
  return letter;
}

export function getAllMemoriesFromKV(data: KVData): Memory[] {
  const custom = (data['oikos-custom-memories'] as Memory[]) || [];
  return [...mockMemories, ...custom.map(m => ({
    ...m,
    imageUrl: m.imageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop",
    insideJokes: m.insideJokes || [],
    preview: m.preview || (m.content ? m.content.slice(0, 60) + '...' : ''),
  }))];
}

export function getAllLettersFromKV(data: KVData): Letter[] {
  const custom = (data['oikos-custom-letters'] as Letter[]) || [];
  return [...mockLetters, ...custom].map(computeLetterLockState);
}

export function getAllGoalsFromKV(data: KVData): Goal[] {
  const custom = (data['oikos-custom-goals'] as Goal[]) || [];
  const goalStatus = (data['oikos-goal-status'] as Record<string, boolean>) || {};
  return [...mockGoals, ...custom].map(g => ({
    ...g,
    completed: goalStatus[g.id] !== undefined ? goalStatus[g.id] : g.completed,
  }));
}

export function getCustomQuestionsFromKV(data: KVData): Question[] {
  return (data['oikos-custom-questions'] as Question[]) || [];
}
