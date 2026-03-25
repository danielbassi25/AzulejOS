import { ReactNode } from "react";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground pb-24 md:pb-0 overflow-x-hidden">
      <div className="max-w-lg mx-auto min-h-screen flex flex-col relative bg-background/50 shadow-2xl shadow-primary/5 md:my-8 md:min-h-[calc(100vh-4rem)] md:rounded-[2.5rem] md:border md:border-border overflow-hidden ring-1 ring-black/5">
        <main className="flex-1 overflow-y-auto w-full relative z-10 scroll-smooth pb-24 md:pb-0">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
