import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockMemories } from "@/data/mock";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { MapPin } from "lucide-react";

export default function SaudadePage() {
  return (
    <AppShell>
      <SectionHeader title="Saudade" subtitle="The presence of absence" />

      {/* Mosaic wall of memory tiles */}
      <div className="p-3 pb-8">
        {/* Intro label */}
        <div className="px-1 py-3 mb-1">
          <p className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: 'hsl(220,22%,58%)' }}>
            ✦ &nbsp; Archive of moments
          </p>
        </div>

        {/* Mosaic: alternating full-width + 2-col layout */}
        <div className="space-y-2.5">
          {mockMemories.map((memory, idx) => {
            const isFeatured = idx % 3 === 0; // every 3rd is a tall hero tile
            return (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={`/saudade/${memory.id}`} className="block focus:outline-none">
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="relative overflow-hidden"
                    style={{
                      borderRadius: '3px',
                      border: '1px solid rgba(30,60,130,0.15)',
                      boxShadow: '2px 4px 12px rgba(20,40,100,0.10)',
                      height: isFeatured ? 240 : 180,
                    }}
                  >
                    {/* Image */}
                    <img
                      src={memory.imageUrl}
                      alt={memory.title}
                      className="w-full h-full object-cover"
                      style={{ filter: 'saturate(0.82) brightness(0.88)' }}
                    />

                    {/* Deep cobalt gradient overlay — like azulejo glaze */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: isFeatured
                          ? 'linear-gradient(to top, rgba(15,30,80,0.88) 0%, rgba(15,30,80,0.45) 50%, rgba(30,60,120,0.10) 100%)'
                          : 'linear-gradient(to top, rgba(15,30,80,0.82) 0%, rgba(15,30,80,0.35) 60%, transparent 100%)',
                      }}
                    />

                    {/* Location chip — top right */}
                    <div
                      className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 text-[9px] font-bold uppercase tracking-wide"
                      style={{
                        background: 'rgba(15,30,80,0.55)',
                        border: '1px solid rgba(180,200,255,0.2)',
                        borderRadius: '2px',
                        color: 'rgba(200,215,255,0.90)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <MapPin className="w-2.5 h-2.5" />
                      {memory.location}
                    </div>

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                      <p className="text-[9px] uppercase tracking-[0.14em] font-semibold mb-1.5" style={{ color: 'rgba(180,195,240,0.65)' }}>
                        {memory.date}
                      </p>
                      <h3
                        className="font-serif font-semibold text-white leading-tight"
                        style={{ fontSize: isFeatured ? '1.35rem' : '1.05rem', textShadow: '0 2px 8px rgba(0,0,30,0.6)' }}
                      >
                        {memory.title}
                      </h3>
                      {isFeatured && (
                        <p className="text-xs mt-1.5 font-light leading-relaxed line-clamp-2" style={{ color: 'rgba(200,210,240,0.72)' }}>
                          {memory.preview}
                        </p>
                      )}
                    </div>

                    {/* Index number — architectural detail */}
                    <div
                      className="absolute top-3 left-3 font-serif font-bold"
                      style={{ fontSize: '11px', color: 'rgba(200,215,255,0.30)' }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
