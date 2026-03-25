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
          className="absolute top-0 left-0 right-0 h-56 -z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(140,175,255,0.22) 0%, transparent 100%)',
          }}
        />
        <SectionHeader title="Saudade" subtitle="The presence of absence" />

        <div className="p-5 space-y-5 pb-6">
          {mockMemories.map((memory, idx) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.09, type: "spring", stiffness: 190, damping: 24 }}
            >
              <Link href={`/saudade/${memory.id}`} className="block focus:outline-none">
                <motion.div
                  whileHover={{ y: -3, scale: 1.008 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: 'rgba(245,250,255,0.95)',
                    border: '1px solid rgba(180,210,255,0.5)',
                    boxShadow: '0 8px 32px rgba(80,120,220,0.09), 0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px rgba(255,255,255,0.9) inset',
                  }}
                >
                  {/* Cinematic hero image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={memory.imageUrl}
                      alt={memory.title}
                      className="w-full h-full object-cover"
                      style={{ filter: 'saturate(0.88) brightness(0.96)' }}
                    />
                    {/* Blue-tinted cinematic overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(20,35,80,0.72) 0%, rgba(40,60,120,0.25) 55%, rgba(80,110,200,0.08) 100%)',
                      }}
                    />
                    {/* Location chip */}
                    <div
                      className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide"
                      style={{
                        background: 'rgba(10,20,60,0.45)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(180,210,255,0.25)',
                        color: 'rgba(200,225,255,0.95)',
                      }}
                    >
                      <MapPin className="w-2.5 h-2.5" />
                      {memory.location}
                    </div>
                    {/* Title overlaid on image */}
                    <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-8">
                      <h3
                        className="font-serif font-semibold text-white leading-tight"
                        style={{ fontSize: '1.2rem', textShadow: '0 2px 12px rgba(0,0,30,0.5)' }}
                      >
                        {memory.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="px-5 py-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Calendar className="w-3 h-3" style={{ color: 'hsl(220,55%,58%)' }} />
                      <span
                        className="text-xs font-semibold tracking-wide"
                        style={{ color: 'hsl(220,55%,55%)' }}
                      >
                        {memory.date}
                      </span>
                    </div>
                    <p
                      className="text-sm leading-relaxed line-clamp-2 font-light"
                      style={{ color: 'hsl(220,18%,45%)' }}
                    >
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