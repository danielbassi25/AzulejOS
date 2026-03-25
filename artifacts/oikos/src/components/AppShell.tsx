import { ReactNode } from "react";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background: 'linear-gradient(160deg, hsl(218,55%,96%) 0%, hsl(214,45%,98%) 40%, hsl(220,40%,96%) 100%)',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Grain texture overlay for warmth */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.022]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '160px 160px',
        }}
      />
      {/* Ambient glow orbs */}
      <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
        <div
          className="absolute"
          style={{
            top: '-10%',
            right: '-15%',
            width: '60%',
            height: '50%',
            background: 'radial-gradient(ellipse, rgba(147,178,255,0.18) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: '10%',
            left: '-15%',
            width: '55%',
            height: '45%',
            background: 'radial-gradient(ellipse, rgba(180,210,255,0.15) 0%, transparent 70%)',
            filter: 'blur(48px)',
          }}
        />
      </div>

      <div
        className="max-w-lg mx-auto min-h-screen flex flex-col relative md:my-8 md:min-h-[calc(100vh-4rem)] md:rounded-[2.8rem] overflow-hidden"
        style={{
          background: 'rgba(240,245,255,0.72)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          border: '1px solid rgba(200,218,255,0.5)',
          boxShadow: '0 40px 100px -20px rgba(80,110,220,0.16), 0 0 0 1px rgba(255,255,255,0.85) inset',
        }}
      >
        <main className="flex-1 overflow-y-auto w-full relative z-10 scroll-smooth pb-28">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}