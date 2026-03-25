import AppShell from "@/components/AppShell";
import { mockMemories } from "@/data/mock";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";

export default function SaudadeDetailPage() {
  const [, params] = useRoute("/saudade/:id");
  const memory = mockMemories.find((m) => m.id === params?.id) || mockMemories[0];
  const idx = mockMemories.findIndex((m) => m.id === memory.id);

  return (
    <AppShell>
      <div className="relative">
        {/* Hero image */}
        <div className="relative overflow-hidden" style={{ height: 320 }}>
          <img
            src={memory.imageUrl}
            alt={memory.title}
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.78) brightness(0.84)' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(12,25,72,0.40) 0%, rgba(12,25,72,0.28) 30%, hsl(42,28%,97%) 100%)',
            }}
          />

          {/* Back */}
          <Link
            href="/saudade"
            className="absolute top-5 left-4 flex items-center gap-2"
            style={{
              background: 'rgba(12,25,72,0.38)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(180,200,255,0.18)',
              borderRadius: '3px',
              padding: '7px 14px',
              color: 'rgba(220,230,255,0.92)',
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-sans font-bold uppercase tracking-widest" style={{ fontSize: '9px' }}>Back</span>
          </Link>

          {/* Index */}
          <div
            className="absolute top-5 right-5 font-serif font-medium"
            style={{ fontSize: '13px', color: 'rgba(200,215,255,0.24)' }}
          >
            {String(idx + 1).padStart(2, '0')}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 -mt-8 relative z-10 pb-16 space-y-3">

          {/* Title tile */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-6"
            style={{
              background: 'hsl(38,30%,99%)',
              border: '1px solid rgba(30,60,130,0.10)',
              borderRadius: '4px',
              boxShadow: '0 1px 0 rgba(255,255,255,0.92) inset, 3px 6px 18px rgba(20,40,100,0.10)',
            }}
          >
            <h1
              className="font-serif font-semibold leading-tight"
              style={{ fontSize: '1.75rem', letterSpacing: '-0.03em', color: 'hsl(222,45%,16%)' }}
            >
              {memory.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 font-sans font-semibold uppercase tracking-wide"
                style={{
                  fontSize: '9px',
                  background: 'hsl(40,30%,93%)',
                  borderRadius: '2px',
                  color: 'hsl(220,28%,40%)',
                }}
              >
                <Calendar className="w-3 h-3" />
                {memory.date}
              </div>
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 font-sans font-semibold uppercase tracking-wide"
                style={{
                  fontSize: '9px',
                  background: 'hsl(218,70%,28%)',
                  borderRadius: '2px',
                  color: 'hsl(42,30%,96%)',
                }}
              >
                <MapPin className="w-3 h-3" />
                {memory.location}
              </div>
            </div>
          </motion.div>

          {/* Narrative — warm beige, journal feel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="px-6 py-7"
            style={{
              background: 'hsl(40, 28%, 95%)',
              border: '1px solid rgba(30,60,130,0.07)',
              borderRadius: '4px',
            }}
          >
            <p
              className="font-serif leading-[1.90]"
              style={{ fontSize: '1.02rem', color: 'hsl(222,28%,28%)', letterSpacing: '0.01em' }}
            >
              {memory.content}
            </p>
          </motion.div>

          {/* Inside jokes */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.20 }}
          >
            <div className="flex items-center gap-3 px-1 pb-2.5">
              <div style={{ width: 16, height: 1, background: 'rgba(30,60,130,0.16)' }} />
              <p className="font-sans font-semibold uppercase tracking-[0.18em]"
                style={{ fontSize: '8.5px', color: 'hsl(220,20%,56%)' }}>
                Inside Jokes
              </p>
              <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.08)' }} />
            </div>
            <div className="space-y-2">
              {memory.insideJokes.map((joke, i) => (
                <div
                  key={i}
                  className="px-5 py-4 font-sans font-medium"
                  style={{
                    fontSize: '0.87rem',
                    background: i % 2 === 0 ? 'hsl(218,70%,28%)' : 'hsl(38,30%,99%)',
                    border: '1px solid rgba(30,60,130,0.10)',
                    borderRadius: '4px',
                    color: i % 2 === 0 ? 'hsl(42,30%,94%)' : 'hsl(222,38%,22%)',
                    boxShadow: '1px 2px 8px rgba(20,40,100,0.07)',
                    lineHeight: 1.6,
                  }}
                >
                  {joke}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
