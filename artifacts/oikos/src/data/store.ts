import { mockMemories, mockLetters } from "./mock";
import type { Memory, Letter } from "@/types";

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

export function getAllLetters(): Letter[] {
  try {
    const custom: Letter[] = JSON.parse(localStorage.getItem("oikos-custom-letters") || "[]");
    return [...mockLetters, ...custom];
  } catch {
    return mockLetters;
  }
}
