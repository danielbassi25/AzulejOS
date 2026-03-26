import { ReactNode } from "react";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: 'hsl(40, 22%, 93%)' }}
    >
      {/* Warm grain texture over the whole background */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px',
        }}
      />

      <div
        className="max-w-lg mx-auto h-screen flex flex-col relative md:my-8 md:h-[calc(100vh-4rem)] md:rounded-lg overflow-hidden"
        style={{
          background: 'hsl(42, 28%, 97%)',
          border: '1px solid rgba(30,60,130,0.08)',
          boxShadow: '0 32px 80px rgba(15,30,80,0.16), 0 0 0 1px rgba(255,252,248,0.95) inset',
        }}
      >
        <main className="flex-1 overflow-y-auto w-full relative z-10 scroll-smooth">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
