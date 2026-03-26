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

      <div className="px-4 pt-5 pb-12">
        {/* Kicker */}
        <div className="flex items-center gap-3 mb-5">
          <div style={{ width: 20, height: 1, background: 'rgba(30,60,130,0.16)' }} />
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'hsl(220,18%,60%)' }}>
            Archive of moments
          </p>
          <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.08)' }} />
        </div>

        <div className="space-y-4">
          {mockMemories.map((memory, idx) => {
            const isFeatured = idx % 3 === 0;
            return (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={`/saudade/${memory.id}`} className="block">
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 360, damping: 28 }}
                    className="relative overflow-hidden"
                    style={{
                      borderRadius: '4px',
                      border: '1px solid rgba(30,60,130,0.12)',
                      boxShadow: '2px 4px 14px rgba(20,40,100,0.09)',
                      height: isFeatured ? 256 : 180,
                    }}
                  >
                    <img
                      src={memory.imageUrl}
                      alt={memory.title}
                      className="w-full h-full object-cover"
                      style={{ filter: 'saturate(0.78) brightness(0.86)' }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: isFeatured
                          ? 'linear-gradient(to top, rgba(12,25,72,0.90) 0%, rgba(18,38,96,0.50) 45%, rgba(30,55,120,0.08) 100%)'
                          : 'linear-gradient(to top, rgba(12,25,72,0.86) 0%, rgba(18,38,96,0.38) 55%, transparent 100%)',
                      }}
                    />

                    {/* Location */}
                    <div
                      className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2 py-1"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '8px',
                        fontWeight: 700,
                        letterSpacing: '0.10em',
                        textTransform: 'uppercase',
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

                    {/* Index */}
                    <div className="absolute top-3.5 left-4"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontSize: '11px', letterSpacing: '0.05em', color: 'rgba(200,215,255,0.22)' }}>
                      {String(idx + 1).padStart(2, '0')}
                    </div>

                    {/* Text */}
                    <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(170,188,240,0.58)', marginBottom: '7px' }}>
                        {memory.date}
                      </p>
                      <h3 style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontWeight: 600,
                        fontSize: isFeatured ? '1.55rem' : '1.15rem',
                        letterSpacing: '0.01em',
                        lineHeight: 1.2,
                        color: 'rgba(240,238,232,0.96)',
                        textShadow: '0 2px 12px rgba(0,0,30,0.50)',
                      }}>
                        {memory.title}
                      </h3>
                      {isFeatured && (
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 300, lineHeight: 1.55, color: 'rgba(195,210,245,0.65)', marginTop: '8px' }} className="line-clamp-2">
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
