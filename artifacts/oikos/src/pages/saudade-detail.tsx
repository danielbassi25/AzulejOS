import AppShell from "@/components/AppShell";
import { mockMemories } from "@/data/mock";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Feather } from "lucide-react";

export default function SaudadeDetailPage() {
  const [, params] = useRoute("/saudade/:id");
  const memory = mockMemories.find((m) => m.id === params?.id) || mockMemories[0];

  return (
    <AppShell>
      <div className="relative">
        {/* Hero image */}
        <div className="relative h-80 w-full overflow-hidden">
          <img
            src={memory.imageUrl}
            alt={memory.title}
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.85) brightness(0.95)' }}
          />
          {/* Blue-tinted cinematic gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(30,50,120,0.35) 0%, transparent 40%, rgba(230,240,255,0.98) 100%)',
            }}
          />
          {/* Back button */}
          <Link
            href="/saudade"
            className="absolute top-6 left-5 w-10 h-10 flex items-center justify-center rounded-full"
            style={{
              background: 'rgba(10,20,60,0.3)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: '1px solid rgba(200,220,255,0.25)',
              color: 'rgba(255,255,255,0.95)',
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        {/* Content floats up over image */}
        <div className="px-6 -mt-14 relative z-10 pb-16 space-y-7">
          {/* Title card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(242,248,255,0.96)',
                border: '1px solid rgba(180,210,255,0.5)',
                boxShadow: '0 4px 24px rgba(80,120,220,0.09), 0 0 0 1px rgba(255,255,255,0.95) inset',
              }}
            >
              <h1
                className="font-serif font-semibold text-foreground leading-tight mb-4"
                style={{ fontSize: '1.75rem', letterSpacing: '-0.03em' }}
              >
                {memory.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(180,210,255,0.25)', color: 'hsl(220,40%,40%)' }}
                >
                  <Calendar className="w-3 h-3" />
                  {memory.date}
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(100,140,255,0.12)', color: 'hsl(224,60%,50%)' }}
                >
                  <MapPin className="w-3 h-3" />
                  {memory.location}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Narrative — journal feel */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.14 }}>
            <p
              className="font-serif leading-[1.9] tracking-[0.01em]"
              style={{ fontSize: '1.04rem', color: 'hsl(220,20%,32%)' }}
            >
              {memory.content}
            </p>
          </motion.div>

          {/* Inside Jokes */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
            <div className="flex items-center gap-2 mb-4">
              <Feather className="w-3.5 h-3.5" style={{ color: 'hsl(220,40%,60%)' }} />
              <span
                className="text-[10px] uppercase tracking-[0.14em] font-bold"
                style={{ color: 'hsl(218,28%,55%)' }}
              >
                Inside Jokes
              </span>
            </div>
            <div className="space-y-2.5">
              {memory.insideJokes.map((joke, idx) => (
                <div
                  key={idx}
                  className="px-5 py-4 rounded-xl text-sm font-medium"
                  style={{
                    background: 'linear-gradient(135deg, rgba(200,222,255,0.28), rgba(175,205,255,0.18))',
                    border: '1px solid rgba(180,210,255,0.45)',
                    color: 'hsl(220,28%,35%)',
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