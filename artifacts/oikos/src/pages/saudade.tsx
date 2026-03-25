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

      <div className="p-4 pb-10">
        {/* Kicker label */}
        <div className="pt-3 pb-4 flex items-center gap-3">
          <div style={{ width: 20, height: 1, background: 'rgba(30,60,130,0.18)' }} />
          <p className="font-sans font-semibold uppercase tracking-[0.18em]" style={{ fontSize: '8.5px', color: 'hsl(220,20%,58%)' }}>
            Archive of moments
          </p>
          <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.09)' }} />
        </div>

        <div className="space-y-3">
          {mockMemories.map((memory, idx) => {
            const isFeatured = idx % 3 === 0;
            return (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={`/saudade/${memory.id}`} className="block focus:outline-none">
                  <motion.div
                    whileHover={{ y: -2, boxShadow: '3px 8px 24px rgba(15,30,80,0.18)' }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 360, damping: 28 }}
                    className="relative overflow-hidden"
                    style={{
                      borderRadius: '4px',
                      border: '1px solid rgba(30,60,130,0.12)',
                      boxShadow: '2px 4px 14px rgba(20,40,100,0.09)',
                      height: isFeatured ? 248 : 172,
                    }}
                  >
                    <img
                      src={memory.imageUrl}
                      alt={memory.title}
                      className="w-full h-full object-cover"
                      style={{ filter: 'saturate(0.78) brightness(0.86)' }}
                    />

                    {/* Cobalt glaze gradient — the azulejo effect on photography */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: isFeatured
                          ? 'linear-gradient(to top, rgba(12,25,72,0.90) 0%, rgba(18,38,96,0.50) 45%, rgba(30,55,120,0.08) 100%)'
                          : 'linear-gradient(to top, rgba(12,25,72,0.86) 0%, rgba(18,38,96,0.38) 55%, transparent 100%)',
                      }}
                    />

                    {/* Location badge */}
                    <div
                      className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 font-sans font-bold uppercase tracking-wide"
                      style={{
                        fontSize: '8px',
                        background: 'rgba(12,25,72,0.50)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(180,200,255,0.18)',
                        borderRadius: '2px',
                        color: 'rgba(200,215,255,0.88)',
                      }}
                    >
                      <MapPin className="w-2.5 h-2.5" />
                      {memory.location}
                    </div>

                    {/* Index number — quiet architectural detail */}
                    <div
                      className="absolute top-3 left-4 font-serif font-medium"
                      style={{ fontSize: '10px', color: 'rgba(200,215,255,0.22)', letterSpacing: '0.04em' }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </div>

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-10">
                      <p
                        className="font-sans font-semibold uppercase tracking-widest mb-1.5"
                        style={{ fontSize: '8px', color: 'rgba(170,188,240,0.58)' }}
                      >
                        {memory.date}
                      </p>
                      <h3
                        className="font-serif font-semibold text-white leading-tight"
                        style={{
                          fontSize: isFeatured ? '1.4rem' : '1.05rem',
                          letterSpacing: isFeatured ? '-0.02em' : '0',
                          textShadow: '0 2px 10px rgba(0,0,30,0.55)',
                        }}
                      >
                        {memory.title}
                      </h3>
                      {isFeatured && (
                        <p
                          className="font-sans font-light leading-relaxed mt-1.5 line-clamp-2"
                          style={{ fontSize: '0.72rem', color: 'rgba(195,210,245,0.68)' }}
                        >
                          {memory.preview}
                        </p>
                      )}
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
