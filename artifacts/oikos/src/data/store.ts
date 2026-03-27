import { mockMemories, mockLetters, mockGoals } from "./mock";
import type { Memory, Letter, Goal, Question } from "@/types";

export function isCustomItem(id: string): boolean {
  return id.includes("custom") || id.startsWith("note-");
}

export function getAllMemories(): Memory[] {
  try {
    const custom: Memory[] = JSON.parse(localStorage.getItem("oikos-custom-memories") || "[]");
    return [...mockMemories, ...custom.map(m => ({
      ...m,
      imageUrl: m.imageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop",
      insideJokes: m.insideJokes || [],
      preview: m.preview || (m.content ? m.content.slice(0, 60) + '...' : ''),
    }))];
  } catch {
    return mockMemories;
  }
}

export function deleteCustomMemory(id: string): void {
  try {
    const custom: Memory[] = JSON.parse(localStorage.getItem("oikos-custom-memories") || "[]");
    localStorage.setItem("oikos-custom-memories", JSON.stringify(custom.filter(m => m.id !== id)));
  } catch {}
}

export function updateCustomMemory(id: string, updates: Partial<Memory>): void {
  try {
    const custom: Memory[] = JSON.parse(localStorage.getItem("oikos-custom-memories") || "[]");
    localStorage.setItem("oikos-custom-memories", JSON.stringify(
      custom.map(m => m.id === id ? { ...m, ...updates, preview: (updates.content || m.content || '').slice(0, 60) + '...' } : m)
    ));
  } catch {}
}

function computeLetterLockState(letter: Letter): Letter {
  if (letter.lockedUntil) {
    const unlockTime = new Date(letter.lockedUntil).getTime();
    const now = Date.now();
    if (now >= unlockTime) {
      return { ...letter, isLocked: false };
    }
    return { ...letter, isLocked: true };
  }
  return letter;
}

export function getAllLetters(): Letter[] {
  try {
    const custom: Letter[] = JSON.parse(localStorage.getItem("oikos-custom-letters") || "[]");
    return [...mockLetters, ...custom].map(computeLetterLockState);
  } catch {
    return mockLetters;
  }
}

export function deleteCustomLetter(id: string): void {
  try {
    const custom: Letter[] = JSON.parse(localStorage.getItem("oikos-custom-letters") || "[]");
    localStorage.setItem("oikos-custom-letters", JSON.stringify(custom.filter(l => l.id !== id)));
  } catch {}
}

export function updateCustomLetter(id: string, updates: Partial<Letter>): void {
  try {
    const custom: Letter[] = JSON.parse(localStorage.getItem("oikos-custom-letters") || "[]");
    localStorage.setItem("oikos-custom-letters", JSON.stringify(
      custom.map(l => l.id === id ? { ...l, ...updates } : l)
    ));
  } catch {}
}

export function getAllGoals(): Goal[] {
  try {
    const custom: Goal[] = JSON.parse(localStorage.getItem("oikos-custom-goals") || "[]");
    return [...mockGoals, ...custom];
  } catch {
    return mockGoals;
  }
}

export function deleteCustomGoal(id: string): void {
  try {
    const custom: Goal[] = JSON.parse(localStorage.getItem("oikos-custom-goals") || "[]");
    localStorage.setItem("oikos-custom-goals", JSON.stringify(custom.filter(g => g.id !== id)));
    const status: Record<string, boolean> = JSON.parse(localStorage.getItem("oikos-goal-status") || "{}");
    delete status[id];
    localStorage.setItem("oikos-goal-status", JSON.stringify(status));
  } catch {}
}

export function updateCustomGoal(id: string, updates: Partial<Goal>): void {
  try {
    const custom: Goal[] = JSON.parse(localStorage.getItem("oikos-custom-goals") || "[]");
    localStorage.setItem("oikos-custom-goals", JSON.stringify(
      custom.map(g => g.id === id ? { ...g, ...updates } : g)
    ));
  } catch {}
}

export function getCustomQuestions(): Question[] {
  try {
    return JSON.parse(localStorage.getItem("oikos-custom-questions") || "[]");
  } catch {
    return [];
  }
}

export function deleteCustomQuestion(id: string): void {
  try {
    const custom: Question[] = JSON.parse(localStorage.getItem("oikos-custom-questions") || "[]");
    localStorage.setItem("oikos-custom-questions", JSON.stringify(custom.filter(q => q.id !== id)));
  } catch {}
}

export function updateCustomQuestion(id: string, updates: Partial<Question>): void {
  try {
    const custom: Question[] = JSON.parse(localStorage.getItem("oikos-custom-questions") || "[]");
    localStorage.setItem("oikos-custom-questions", JSON.stringify(
      custom.map(q => q.id === id ? { ...q, ...updates } : q)
    ));
  } catch {}
}
