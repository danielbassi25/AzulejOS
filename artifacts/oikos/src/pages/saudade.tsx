import { useState, useCallback } from "react";
import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { getAllMemories, isCustomItem } from "@/data/store";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { MapPin, Plus, Sparkles, Pencil } from "lucide-react";
import type { Memory } from "@/types";

const cobaltPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' opacity='0.18'%3E%3Ccircle cx='30' cy='30' r='16' stroke-width='0.5'/%3E%3Ccircle cx='30' cy='30' r='9' stroke-width='0.6'/%3E%3Ccircle cx='30' cy='30' r='3' stroke-width='0.5'/%3E%3Cpath d='M30 14c4.5 4 4.5 12 0 16c-4.5-4-4.5-12 0-16z' stroke-width='0.55'/%3E%3Cpath d='M14 30c4-4.5 12-4.5 16 0c-4 4.5-12 4.5-16 0z' stroke-width='0.55'/%3E%3Cpath d='M30 14c-4.5 4-4.5 12 0 16' stroke-width='0.55'/%3E%3Cpath d='M46 30c-4 4.5-12 4.5-16 0' stroke-width='0.55'/%3E%3Cpath d='M18.7 18.7c3.2 1.5 6.8 1.5 10 0' stroke-width='0.4'/%3E%3Cpath d='M41.3 18.7c-3.2 1.5-6.8 1.5-10 0' stroke-width='0.4'/%3E%3Cpath d='M18.7 41.3c3.2-1.5 6.8-1.5 10 0' stroke-width='0.4'/%3E%3Cpath d='M41.3 41.3c-3.2-1.5-6.8-1.5-10 0' stroke-width='0.4'/%3E%3Crect x='0' y='0' width='60' height='60' stroke-width='0.6'/%3E%3C/g%3E%3C/svg%3E")`;

const tealPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' opacity='0.18'%3E%3Crect x='10' y='10' width='40' height='40' stroke-width='0.5'/%3E%3Crect x='18' y='18' width='24' height='24' stroke-width='0.5'/%3E%3Cpath d='M10 10l8 8M50 10l-8 8M10 50l8-8M50 50l-8-8' stroke-width='0.45'/%3E%3Cpath d='M30 10v8M30 42v8M10 30h8M42 30h8' stroke-width='0.4'/%3E%3Ccircle cx='30' cy='30' r='5' stroke-width='0.5'/%3E%3Ccircle cx='30' cy='30' r='2' stroke-width='0.4'/%3E%3Cpath d='M30 25v-7M30 35v7M25 30h-7M35 30h7' stroke-width='0.35'/%3E%3Ccircle cx='10' cy='10' r='3' stroke-width='0.35'/%3E%3Ccircle cx='50' cy='10' r='3' stroke-width='0.35'/%3E%3Ccircle cx='10' cy='50' r='3' stroke-width='0.35'/%3E%3Ccircle cx='50' cy='50' r='3' stroke-width='0.35'/%3E%3Crect x='0' y='0' width='60' height='60' stroke-width='0.6'/%3E%3C/g%3E%3C/svg%3E")`;

const rosePattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' opacity='0.20'%3E%3Ccircle cx='30' cy='30' r='14' stroke-width='0.6'/%3E%3Ccircle cx='30' cy='30' r='8' stroke-width='0.5'/%3E%3Ccircle cx='30' cy='30' r='2.5' stroke-width='0.5'/%3E%3Cpath d='M30 16v-16M30 44v16M16 30H0M44 30h16' stroke-width='0.4'/%3E%3Cpath d='M20.1 20.1L6 6M39.9 20.1L54 6M20.1 39.9L6 54M39.9 39.9L54 54' stroke-width='0.35'/%3E%3Ccircle cx='30' cy='16' r='1.8' stroke-width='0.45'/%3E%3Ccircle cx='30' cy='44' r='1.8' stroke-width='0.45'/%3E%3Ccircle cx='16' cy='30' r='1.8' stroke-width='0.45'/%3E%3Ccircle cx='44' cy='30' r='1.8' stroke-width='0.45'/%3E%3Crect x='0' y='0' width='60' height='60' stroke-width='0.6'/%3E%3C/g%3E%3C/svg%3E")`;

const navyPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' opacity='0.16'%3E%3Cpath d='M30 6l8.5 8.5L30 23l-8.5-8.5z' stroke-width='0.6'/%3E%3Cpath d='M30 37l8.5 8.5L30 54l-8.5-8.5z' stroke-width='0.6'/%3E%3Cpath d='M6 30l8.5-8.5L23 30l-8.5 8.5z' stroke-width='0.6'/%3E%3Cpath d='M37 30l8.5-8.5L54 30l-8.5 8.5z' stroke-width='0.6'/%3E%3Ccircle cx='30' cy='30' r='4' stroke-width='0.6'/%3E%3Ccircle cx='30' cy='30' r='1.5' stroke-width='0.4'/%3E%3Cpath d='M0 0l60 60M60 0L0 60' stroke-width='0.3'/%3E%3Crect x='0' y='0' width='60' height='60' stroke-width='0.6'/%3E%3C/g%3E%3C/svg%3E")`;

const MEMORY_TILES: Record<string, { bg: string; gradient: string; pattern: string; border: string; shadow: string; label: string }> = {
  cobalt: {
    bg: 'hsl(218,70%,28%)', gradient: 'hsl(218,72%,32%)',
    pattern: cobaltPattern,
    border: '1px solid rgba(15,45,130,0.55)', shadow: '2px 4px 14px rgba(12,25,80,0.28)',
    label: 'Everyday',
  },
  teal: {
    bg: 'hsl(168,45%,28%)', gradient: 'hsl(168,48%,32%)',
    pattern: tealPattern,
    border: '1px solid rgba(20,100,80,0.50)', shadow: '2px 4px 14px rgba(15,60,50,0.30)',
    label: 'Adventure',
  },
  rose: {
    bg: 'hsl(338,45%,38%)', gradient: 'hsl(338,48%,42%)',
    pattern: rosePattern,
    border: '1px solid rgba(120,20,50,0.50)', shadow: '2px 4px 14px rgba(80,15,35,0.30)',
    label: 'Romance',
  },
  navy: {
    bg: 'hsl(222,52%,18%)', gradient: 'hsl(222,55%,22%)',
    pattern: navyPattern,
    border: '1px solid rgba(10,30,80,0.60)', shadow: '2px 4px 14px rgba(8,18,55,0.35)',
    label: 'Milestone',
  },
};

function parseDate(dateStr: string): Date {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return new Date();
  return d;
}

function formatYear(dateStr: string): string {
  return parseDate(dateStr).getFullYear().toString();
}

function formatMonthDay(dateStr: string): string {
  const d = parseDate(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const EASE = [0.22, 1, 0.36, 1] as const;

const tile = (i: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.09, duration: 0.55, ease: EASE as unknown as number[] },
});

export default function SaudadePage() {
  const [memories, setMemories] = useState(() => getAllMemories());

  const reload = useCallback(() => setMemories(getAllMemories()), []);

  const sorted = [...memories].sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());

  const grouped: { year: string; items: typeof sorted }[] = [];
  let currentYear = '';
  for (const mem of sorted) {
    const yr = formatYear(mem.date);
    if (yr !== currentYear) {
      currentYear = yr;
      grouped.push({ year: yr, items: [] });
    }
    grouped[grouped.length - 1].items.push(mem);
  }

  let globalIdx = 0;

  return (
    <AppShell>
      <SectionHeader title="Saudade" subtitle="What never really leaves you"
        action={
          <Link href="/saudade/new">
            <motion.div whileTap={{ scale: 0.92 }} className="flex items-center gap-1.5"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(255,252,245,0.10)', border: '1px solid rgba(255,252,245,0.18)', borderRadius: '3px', color: 'rgba(215,205,185,0.70)', padding: '6px 12px' }}>
              <Plus className="w-3 h-3" /> New
            </motion.div>
          </Link>
        }
      />

      <div className="px-4 pt-5 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <div style={{ width: 20, height: 1, background: 'rgba(30,60,130,0.16)' }} />
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'hsl(220,18%,60%)' }}>
            {memories.length} moments archived
          </p>
          <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.08)' }} />
        </div>

        <div className="relative" style={{ paddingLeft: '28px' }}>
          <div className="absolute top-0 bottom-0" style={{ left: '9px', width: '1.5px', background: 'linear-gradient(to bottom, rgba(30,60,130,0.20), rgba(30,60,130,0.08) 90%, transparent)' }} />

          <motion.div {...tile(0)} className="relative mb-6">
            <div className="absolute" style={{ left: '-23px', top: '50%', transform: 'translateY(-50%)', width: '10px', height: '10px', borderRadius: '50%', background: 'hsl(218,70%,28%)', border: '2px solid hsl(42,28%,97%)', boxShadow: '0 0 0 3px rgba(30,60,130,0.12)' }} />
            <Link href="/saudade/new" className="block">
              <motion.div
                whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-4 py-3.5"
                style={{
                  backgroundColor: 'hsl(218,70%,28%)',
                  backgroundImage: `${cobaltPattern}, linear-gradient(155deg, hsl(218,68%,26%) 0%, hsl(218,72%,32%) 100%)`,
                  backgroundSize: '60px 60px, 100% 100%',
                  borderRadius: '4px',
                  border: '1px solid rgba(15,45,115,0.50)',
                  boxShadow: '0 3px 12px rgba(15,30,80,0.20)',
                }}>
                <div className="w-7 h-7 flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(255,252,245,0.12)', border: '1px solid rgba(255,252,245,0.18)', borderRadius: '3px' }}>
                  <Plus className="w-3.5 h-3.5" style={{ color: 'hsl(42,30%,90%)' }} />
                </div>
                <div>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '0.95rem', color: 'hsl(42,30%,96%)', letterSpacing: '0.01em' }}>Add a new memory</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 500, color: 'rgba(195,185,165,0.50)', marginTop: '2px' }}>Capture this moment</p>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {grouped.map((group) => (
            <div key={group.year}>
              <motion.div
                {...tile(globalIdx)}
                className="relative mb-5 mt-2"
              >
                <div className="absolute" style={{ left: '-27px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', borderRadius: '50%', background: 'hsl(42,28%,97%)', border: '2px solid hsl(218,70%,28%)', boxShadow: '0 2px 8px rgba(15,30,80,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'hsl(218,70%,28%)' }} />
                </div>
                <div className="flex items-center gap-3 pl-1">
                  <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '1.65rem', letterSpacing: '-0.02em', color: 'hsl(218,70%,28%)' }}>
                    {group.year}
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.10)' }} />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(220,16%,62%)' }}>
                    {group.items.length} {group.items.length === 1 ? 'moment' : 'moments'}
                  </span>
                </div>
              </motion.div>

              {group.items.map((memory) => {
                const idx = ++globalIdx;
                const isCustom = isCustomItem(memory.id);
                const mt = MEMORY_TILES[memory.memoryColor || 'cobalt'] || MEMORY_TILES.cobalt;
                const hasImage = !!memory.imageUrl;

                return (
                  <motion.div key={memory.id} {...tile(idx)} className="relative mb-5">
                    <div className="absolute" style={{ left: '-24px', top: '24px', width: '12px', height: '12px', borderRadius: '50%', background: mt.bg, border: '2px solid hsl(42,28%,97%)', boxShadow: '0 1px 4px rgba(15,30,80,0.08)' }} />

                    <div className="absolute" style={{ left: '-28px', top: '42px' }}>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 700, letterSpacing: '0.08em', color: 'hsl(220,16%,62%)', textAlign: 'center', width: '20px', lineHeight: 1.2 }}>
                        {formatMonthDay(memory.date).split(' ')[0]}
                      </p>
                    </div>

                    <div className="relative">
                      <Link href={`/saudade/${memory.id}`} className="block">
                        <motion.div
                          whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}
                          transition={{ type: "spring", stiffness: 360, damping: 28 }}
                          className="overflow-hidden"
                          style={{
                            borderRadius: '4px',
                            border: '1px solid rgba(30,60,130,0.10)',
                            boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 2px 4px 14px rgba(20,40,100,0.08)',
                            background: 'hsl(38,30%,99%)',
                          }}>

                          <div className="absolute top-0 left-0 bottom-0" style={{
                            width: '4px', borderRadius: '4px 0 0 4px',
                            background: `linear-gradient(to bottom, ${mt.bg}, ${mt.gradient})`,
                            zIndex: 2,
                          }} />

                          {hasImage ? (
                            <div className="relative overflow-hidden" style={{ height: 140 }}>
                              <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover"
                                style={{ filter: 'saturate(0.80) brightness(0.88)' }} />
                              <div className="absolute inset-0" style={{
                                background: `linear-gradient(to top, ${mt.bg}dd 0%, ${mt.bg}44 50%, transparent 100%)`,
                              }} />

                              <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1"
                                style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', background: 'rgba(12,25,72,0.45)', backdropFilter: 'blur(8px)', border: '1px solid rgba(180,200,255,0.18)', borderRadius: '2px', color: 'rgba(200,215,255,0.88)' }}>
                                <MapPin className="w-2.5 h-2.5" />{memory.location}
                              </div>

                              <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
                                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.15rem', letterSpacing: '0.01em', lineHeight: 1.2, color: 'rgba(240,238,232,0.96)', textShadow: '0 2px 10px rgba(0,0,30,0.50)' }}>
                                  {memory.title}
                                </h3>
                              </div>
                            </div>
                          ) : (
                            <div className="relative overflow-hidden" style={{
                              height: 80,
                              backgroundColor: mt.bg,
                              backgroundImage: `${mt.pattern}, linear-gradient(155deg, ${mt.bg} 0%, ${mt.gradient} 100%)`,
                              backgroundSize: '60px 60px, 100% 100%',
                            }}>
                              <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
                                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.15rem', letterSpacing: '0.01em', lineHeight: 1.2, color: 'rgba(240,238,232,0.96)' }}>
                                  {memory.title}
                                </h3>
                              </div>
                              <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1"
                                style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', background: 'rgba(255,252,245,0.10)', border: '1px solid rgba(255,252,245,0.15)', borderRadius: '2px', color: 'rgba(255,252,245,0.60)' }}>
                                <MapPin className="w-2.5 h-2.5" />{memory.location}
                              </div>
                            </div>
                          )}

                          <div className="relative px-4 py-3.5" style={{
                            backgroundImage: mt.pattern,
                            backgroundSize: '60px 60px',
                          }}>
                            <div className="absolute inset-0" style={{ background: 'rgba(255,252,248,0.92)' }} />
                            <div className="relative">
                              <div className="flex items-center justify-between mb-2">
                                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(220,16%,62%)' }}>
                                  {memory.date}
                                </p>
                                <span style={{
                                  fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 700,
                                  letterSpacing: '0.10em', textTransform: 'uppercase',
                                  background: mt.bg, color: 'hsl(42,30%,96%)',
                                  padding: '2px 6px', borderRadius: '2px',
                                }}>
                                  {mt.label}
                                </span>
                              </div>
                              {memory.preview && (
                                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 400, lineHeight: 1.55, color: 'hsl(220,15%,45%)' }} className="line-clamp-2">
                                  {memory.preview}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </Link>

                      {isCustom && (
                        <Link href={`/saudade/edit/${memory.id}`}>
                          <motion.div
                            whileTap={{ scale: 0.90 }}
                            className="absolute flex items-center justify-center z-10"
                            style={{
                              bottom: 12, right: 12,
                              width: 32, height: 32, borderRadius: '4px',
                              background: mt.bg,
                              border: `1px solid ${mt.border}`,
                              boxShadow: '0 2px 8px rgba(12,25,72,0.22)',
                              cursor: 'pointer',
                            }}
                          >
                            <Pencil className="w-3.5 h-3.5" style={{ color: 'hsl(42,30%,94%)' }} />
                          </motion.div>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}

          <motion.div {...tile(globalIdx + 1)} className="relative py-3">
            <div className="absolute" style={{ left: '-25px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', borderRadius: '50%', background: 'hsl(42,28%,97%)', border: '2px solid rgba(30,60,130,0.15)' }}>
              <Sparkles className="w-2.5 h-2.5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: 'rgba(30,60,130,0.30)' }} />
            </div>
            <p className="pl-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: '0.82rem', color: 'rgba(30,60,130,0.28)', letterSpacing: '0.02em' }}>
              Where it all began...
            </p>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
