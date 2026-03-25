import AppShell from "@/components/AppShell";
import { mockMemories } from "@/data/mock";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Heart } from "lucide-react";

export default function SaudadeDetailPage() {
  const [, params] = useRoute("/saudade/:id");
  const memory = mockMemories.find(m => m.id === params?.id) || mockMemories[0];

  return (
    <AppShell>
      <div className="relative">
        {/* Hero image */}
        <div className="relative h-80 w-full">
          <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(245,243,255,0.95) 100%)',
            }}
          />
          <Link
            href="/saudade"
            className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center text-white rounded-full"
            style={{
              background: 'rgba(0,0,0,0.25)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        {/* Content */}
        <div className="px-6 -mt-12 relative z-10 pb-16 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div
              className="bg-white/90 rounded-2xl p-6"
              style={{ boxShadow: '0 4px 24px rgba(107,140,255,0.10), 0 0 0 1px rgba(255,255,255,0.9) inset' }}
            >
              <h1 className="text-3xl font-serif font-semibold text-foreground leading-tight mb-5">
                {memory.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/70 text-xs font-medium text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {memory.date}
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-primary"
                  style={{ background: 'rgba(107,140,255,0.1)' }}
                >
                  <MapPin className="w-3 h-3" />
                  {memory.location}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Narrative */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
            <p className="font-serif text-[1.05rem] leading-[1.85] text-foreground/85 tracking-[0.01em]">
              {memory.content}
            </p>
          </motion.div>

          {/* Inside Jokes */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-3.5 h-3.5 text-secondary-foreground/70" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                Inside Jokes
              </span>
            </div>
            <div className="space-y-3">
              {memory.insideJokes.map((joke, idx) => (
                <div
                  key={idx}
                  className="px-5 py-4 rounded-xl font-medium text-foreground/90 text-sm"
                  style={{
                    background: 'linear-gradient(135deg, rgba(247,200,224,0.18), rgba(175,203,255,0.12))',
                    border: '1px solid rgba(247,200,224,0.4)',
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
