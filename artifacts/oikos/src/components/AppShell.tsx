import { ReactNode } from "react";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{
      background: 'linear-gradient(135deg, hsl(220, 60%, 97%) 0%, hsl(0, 0%, 99%) 50%, hsl(330, 40%, 97%) 100%)',
      backgroundAttachment: 'fixed',
    }}>
      {/* Grain texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.018]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />
      <div className="max-w-lg mx-auto min-h-screen flex flex-col relative bg-white/60 backdrop-blur-sm shadow-2xl md:my-8 md:min-h-[calc(100vh-4rem)] md:rounded-[2.5rem] md:border md:border-white/70 overflow-hidden" style={{ boxShadow: '0 32px 80px -16px rgba(107,140,255,0.18), 0 0 0 1px rgba(255,255,255,0.8) inset' }}>
        <main className="flex-1 overflow-y-auto w-full relative z-10 scroll-smooth pb-28">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}