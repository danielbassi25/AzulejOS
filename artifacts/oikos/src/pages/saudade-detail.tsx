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
        {/* Hero tile — full bleed image with cobalt glaze */}
        <div className="relative overflow-hidden" style={{ height: 300 }}>
          <img
            src={memory.imageUrl}
            alt={memory.title}
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.80) brightness(0.85)' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(15,30,80,0.45) 0%, rgba(15,30,80,0.30) 30%, hsl(42,28%,97%) 100%)',
            }}
          />

          {/* Back button */}
          <Link
            href="/saudade"
            className="absolute top-5 left-4 flex items-center gap-2"
            style={{
              background: 'rgba(15,30,80,0.40)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(180,200,255,0.2)',
              borderRadius: '3px',
              padding: '7px 12px',
              color: 'rgba(220,230,255,0.95)',
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Back</span>
          </Link>

          {/* Index number */}
          <div className="absolute top-5 right-5 font-serif font-bold" style={{ fontSize: '14px', color: 'rgba(200,215,255,0.28)' }}>
            {String(idx + 1).padStart(2, '0')}
          </div>
        </div>

        {/* Content area */}
        <div className="px-4 -mt-6 relative z-10 pb-16 space-y-3">

          {/* Title tile */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6"
            style={{
              background: 'hsl(38, 30%, 99%)',
              border: '1px solid rgba(30,60,130,0.12)',
              borderRadius: '3px',
              boxShadow: '2px 4px 14px rgba(20,40,100,0.10)',
            }}
          >
            <h1
              className="font-serif font-semibold leading-tight mb-4"
              style={{ fontSize: '1.65rem', letterSpacing: '-0.03em', color: 'hsl(222,45%,16%)' }}
            >
              {memory.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide"
                style={{ background: 'hsl(40,35%,91%)', borderRadius: '2px', color: 'hsl(220,35%,38%)' }}>
                <Calendar className="w-3 h-3" />
                {memory.date}
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide"
                style={{ background: 'hsl(218,70%,28%)', borderRadius: '2px', color: 'hsl(42,30%,95%)' }}>
                <MapPin className="w-3 h-3" />
                {memory.location}
              </div>
            </div>
          </motion.div>

          {/* Content tile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="p-6"
            style={{
              background: 'hsl(40, 35%, 93%)',
              border: '1px solid rgba(30,60,130,0.09)',
              borderRadius: '3px',
            }}
          >
            <p
              className="font-serif leading-[1.85]"
              style={{ fontSize: '1.02rem', color: 'hsl(222,30%,28%)', letterSpacing: '0.01em' }}
            >
              {memory.content}
            </p>
          </motion.div>

          {/* Inside jokes — cobalt tiles */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.20 }}
          >
            <p className="px-1 pb-2 text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: 'hsl(220,22%,55%)' }}>
              ✦ &nbsp; Inside Jokes
            </p>
            <div className="space-y-2">
              {memory.insideJokes.map((joke, i) => (
                <div
                  key={i}
                  className="px-5 py-4 text-sm font-medium"
                  style={{
                    background: i % 2 === 0 ? 'hsl(218,70%,28%)' : 'hsl(38,30%,99%)',
                    border: '1px solid rgba(30,60,130,0.15)',
                    borderRadius: '3px',
                    color: i % 2 === 0 ? 'hsl(42,30%,93%)' : 'hsl(222,40%,22%)',
                    boxShadow: '1px 2px 6px rgba(20,40,100,0.08)',
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
