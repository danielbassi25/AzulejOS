import { useMemo, useCallback } from "react";
import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { getAllMemoriesFromKV, isCustomItem } from "@/data/store";
import { useKV } from "@/data/kv-store";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { Memory } from "@/types";

const cobaltPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' opacity='0.10'%3E%3Ccircle cx='30' cy='30' r='12' stroke-width='0.6'/%3E%3Ccircle cx='30' cy='30' r='6' stroke-width='0.4'/%3E%3Cpath d='M30 0v18M30 42v18M0 30h18M42 30h60' stroke-width='0.4'/%3E%3Cpath d='M30 18l-12 12 12 12 12-12z' stroke-width='0.5'/%3E%3Ccircle cx='0' cy='0' r='8' stroke-width='0.4'/%3E%3Ccircle cx='60' cy='0' r='8' stroke-width='0.4'/%3E%3Ccircle cx='0' cy='60' r='8' stroke-width='0.4'/%3E%3Ccircle cx='60' cy='60' r='8' stroke-width='0.4'/%3E%3Cpath d='M0 0l18 18M42 42l18 18M60 0l-18 18M18 42l-18 18' stroke-width='0.3'/%3E%3C/g%3E%3C/svg%3E")`;

const tealPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' opacity='0.10'%3E%3Cpath d='M30 6l24 12v24L30 54 6 42V18z' stroke-width='0.5'/%3E%3Cpath d='M30 6v48M6 18l48 24M54 18L6 42' stroke-width='0.3'/%3E%3Ccircle cx='30' cy='30' r='8' stroke-width='0.4'/%3E%3Ccircle cx='30' cy='30' r='3' stroke-width='0.4'/%3E%3Crect x='0' y='0' width='60' height='60' stroke-width='0.5'/%3E%3C/g%3E%3C/svg%3E")`;

const rosePattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' opacity='0.20'%3E%3Ccircle cx='30' cy='30' r='14' stroke-width='0.6'/%3E%3Ccircle cx='30' cy='30' r='8' stroke-width='0.5'/%3E%3Ccircle cx='30' cy='30' r='2.5' stroke-width='0.5'/%3E%3Cpath d='M30 16v-16M30 44v16M16 30H0M44 30h16' stroke-width='0.4'/%3E%3Crect x='0' y='0' width='60' height='60' stroke-width='0.6'/%3E%3C/g%3E%3C/svg%3E")`;

const navyPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' opacity='0.09'%3E%3Crect x='10' y='10' width='40' height='40' stroke-width='0.5'/%3E%3Crect x='18' y='18' width='24' height='24' stroke-width='0.5'/%3E%3Cpath d='M10 10l8 8M50 10l-8 8M10 50l8-8M50 50l-8-8' stroke-width='0.35'/%3E%3Ccircle cx='30' cy='30' r='5' stroke-width='0.4'/%3E%3Crect x='0' y='0' width='60' height='60' stroke-width='0.5'/%3E%3C/g%3E%3C/svg%3E")`;

const COLOR_STYLES: Record<string, { bg: string; gradient: string; pattern: string; border: string; shadow: string }> = {
  cobalt: { bg: 'hsl(218,70%,28%)', gradient: 'linear-gradient(155deg, hsl(218,68%,26%) 0%, hsl(218,72%,32%) 100%)', pattern: cobaltPattern, border: '1px solid rgba(15,45,115,0.50)', shadow: '0 3px 12px rgba(15,30,80,0.20)' },
  teal: { bg: 'hsl(168,45%,28%)', gradient: 'linear-gradient(155deg, hsl(168,42%,24%) 0%, hsl(170,48%,32%) 100%)', pattern: tealPattern, border: '1px solid rgba(10,80,65,0.45)', shadow: '0 3px 12px rgba(10,55,45,0.22)' },
  rose: { bg: 'hsl(338,45%,38%)', gradient: 'linear-gradient(155deg, hsl(338,42%,34%) 0%, hsl(340,48%,42%) 100%)', pattern: rosePattern, border: '1px solid rgba(120,20,50,0.50)', shadow: '0 3px 12px rgba(80,15,35,0.22)' },
  navy: { bg: 'hsl(222,52%,18%)', gradient: 'linear-gradient(155deg, hsl(222,50%,16%) 0%, hsl(222,55%,22%) 100%)', pattern: navyPattern, border: '1px solid rgba(10,30,80,0.60)', shadow: '0 3px 12px rgba(8,18,55,0.28)' },
};

function parseDate(dateStr: string): Date {
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;
  const parts = dateStr.match(/(\w+)\s+(\d+),?\s+(\d{4})/);
  if (parts) {
    const months: Record<string, number> = { January: 0, February: 1, March: 2, April: 3, May: 4, June: 5, July: 6, August: 7, September: 8, October: 9, November: 10, December: 11 };
    const month = months[parts[1]];
    if (month !== undefined) return new Date(parseInt(parts[3]), month, parseInt(parts[2]));
  }
  return new Date(0);
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
  const { data } = useKV();
  const [, setLocation] = useLocation();

  const memories = useMemo(() => getAllMemoriesFromKV(data), [data]);

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
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, color: 'hsl(220,18%,62%)', letterSpacing: '0.10em' }}>
                    {group.items.length}
                  </span>
                </div>
              </motion.div>

              {group.items.map((memory) => {
                const colorKey = (memory.memoryColor as string) || 'cobalt';
                const style = COLOR_STYLES[colorKey] || COLOR_STYLES.cobalt;
                const isEditable = isCustomItem(memory.id);
                globalIdx++;
                return (
                  <motion.div key={memory.id} {...tile(globalIdx)} className="relative mb-4">
                    <div className="absolute" style={{ left: '-23px', top: '50%', transform: 'translateY(-50%)', width: '10px', height: '10px', borderRadius: '50%', background: style.bg, border: '2px solid hsl(42,28%,97%)', boxShadow: '0 0 0 3px rgba(30,60,130,0.08)' }} />

                    <Link href={`/saudade/${memory.id}`} className="block">
                      <motion.div whileHover={{ y: -1.5 }} whileTap={{ scale: 0.985 }} className="relative overflow-hidden"
                        style={{
                          backgroundColor: style.bg,
                          backgroundImage: `${style.pattern}, ${style.gradient}`,
                          backgroundSize: '60px 60px, 100% 100%',
                          border: style.border, borderRadius: '4px', boxShadow: style.shadow,
                        }}>
                        {memory.imageUrl && (
                          <div className="relative" style={{ height: 110 }}>
                            <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover"
                              style={{ filter: 'saturate(0.80) brightness(0.85)' }} />
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(12,25,72,0.55) 0%, transparent 55%)' }} />
                          </div>
                        )}

                        <div style={{ padding: memory.imageUrl ? '10px 16px 14px' : '14px 16px' }}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.08rem', letterSpacing: '0.01em', lineHeight: 1.28, color: 'hsl(42,30%,96%)' }}>
                                {memory.title}
                              </h3>
                              {memory.preview && (
                                <p className="line-clamp-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: '0.80rem', lineHeight: 1.55, color: 'rgba(235,225,208,0.88)', marginTop: '5px' }}>
                                  {memory.preview}
                                </p>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(220,208,188,0.82)', whiteSpace: 'nowrap' }}>
                                {formatMonthDay(memory.date)}
                              </p>
                              {memory.location && (
                                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 500, color: 'rgba(210,200,180,0.75)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90px' }}>
                                  {memory.location}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {isEditable && (
                          <div className="absolute top-2 right-2 flex gap-1">
                            <motion.button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLocation(`/saudade/edit/${memory.id}`); }}
                              whileTap={{ scale: 0.88 }}
                              className="flex items-center justify-center"
                              style={{ width: 26, height: 26, borderRadius: '3px', background: 'rgba(255,252,245,0.14)', border: '1px solid rgba(255,252,245,0.20)', backdropFilter: 'blur(4px)' }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(222,212,194,0.75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                              </svg>
                            </motion.button>
                          </div>
                        )}
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
