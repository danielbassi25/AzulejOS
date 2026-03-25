import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockMemories } from "@/data/mock";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { MapPin, Calendar } from "lucide-react";

export default function SaudadePage() {
  return (
    <AppShell>
      <div className="relative min-h-full">
        <div
          className="absolute top-0 left-0 right-0 h-48 -z-10 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(247,200,224,0.2) 0%, transparent 100%)' }}
        />
        <SectionHeader title="Saudade" subtitle="The presence of absence" />

        <div className="p-5 space-y-5">
          {mockMemories.map((memory, idx) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 200, damping: 24 }}
            >
              <Link href={`/saudade/${memory.id}`} className="block focus:outline-none">
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="rounded-2xl overflow-hidden relative"
                  style={{
                    boxShadow: '0 8px 32px rgba(107,140,255,0.10), 0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.8) inset',
                    background: 'white',
                  }}
                >
                  {/* Cinematic image */}
                  <div className="relative h-44 w-full">
                    <img
                      src={memory.imageUrl}
                      alt={memory.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0" style={{
                      background: 'linear-gradient(to top, rgba(15,15,30,0.75) 0%, rgba(15,15,30,0.2) 50%, transparent 100%)'
                    }} />
                    {/* Location chip overlaid on image */}
                    <div
                      className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white/95 tracking-wide"
                      style={{ background: 'rgba(15,15,30,0.45)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
                    >
                      <MapPin className="w-2.5 h-2.5" />
                      {memory.location}
                    </div>
                    {/* Title on image */}
                    <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
                      <h3 className="text-white font-serif font-semibold text-xl leading-tight" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
                        {memory.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="px-5 py-4">
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <Calendar className="w-3 h-3 text-primary/60" />
                      <span className="text-xs font-semibold text-primary/80 tracking-wide">{memory.date}</span>
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed line-clamp-2 font-light">
                      {memory.preview}
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}