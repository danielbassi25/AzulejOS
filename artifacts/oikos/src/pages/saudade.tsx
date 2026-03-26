import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { getAllMemories } from "@/data/store";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useMemo } from "react";
import { MapPin, Plus, Sparkles } from "lucide-react";

const TAG_COLORS: Record<string, { bg: string; color: string; lightBg: string; lightColor: string }> = {
  trip: { bg: 'rgba(30,80,180,0.60)', color: 'rgba(200,215,255,0.92)', lightBg: 'rgba(30,80,180,0.10)', lightColor: 'rgb(30,80,180)' },
  milestone: { bg: 'rgba(180,140,60,0.55)', color: 'rgba(255,250,220,0.92)', lightBg: 'rgba(180,140,60,0.12)', lightColor: 'rgb(180,140,60)' },
  tender: { bg: 'rgba(160,60,80,0.45)', color: 'rgba(255,220,225,0.90)', lightBg: 'rgba(160,60,80,0.10)', lightColor: 'rgb(160,60,80)' },
  funny: { bg: 'rgba(60,140,100,0.50)', color: 'rgba(210,255,230,0.92)', lightBg: 'rgba(60,140,100,0.10)', lightColor: 'rgb(60,140,100)' },
  routine: { bg: 'rgba(100,80,160,0.50)', color: 'rgba(230,220,255,0.92)', lightBg: 'rgba(100,80,160,0.10)', lightColor: 'rgb(100,80,160)' },
};

const MOOD_EMOJI: Record<string, string> = {
  magical: '✨', nostalgic: '🌙', adventurous: '⛰️', euphoric: '🎆', peaceful: '🕊️',
  joyful: '☀️', tender: '💛', grateful: '🙏', playful: '🎭', hopeful: '🌱',
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
  const memories = useMemo(() => getAllMemories(), []);

  const sorted = useMemo(() => {
    return [...memories].sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
  }, [memories]);

  const grouped = useMemo(() => {
    const groups: { year: string; items: typeof sorted }[] = [];
    let currentYear = '';
    for (const mem of sorted) {
      const yr = formatYear(mem.date);
      if (yr !== currentYear) {
        currentYear = yr;
        groups.push({ year: yr, items: [] });
      }
      groups[groups.length - 1].items.push(mem);
    }
    return groups;
  }, [sorted]);

  let globalIdx = 0;

  return (
    <AppShell>
      <SectionHeader title="Saudade" subtitle="The presence of absence"
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

        {/* Timeline */}
        <div className="relative" style={{ paddingLeft: '28px' }}>
          {/* Vertical line */}
          <div className="absolute top-0 bottom-0" style={{ left: '9px', width: '1.5px', background: 'linear-gradient(to bottom, rgba(30,60,130,0.20), rgba(30,60,130,0.08) 90%, transparent)' }} />

          {/* Add memory node at top */}
          <motion.div {...tile(0)} className="relative mb-6">
            <div className="absolute" style={{ left: '-23px', top: '50%', transform: 'translateY(-50%)', width: '10px', height: '10px', borderRadius: '50%', background: 'hsl(218,70%,28%)', border: '2px solid hsl(42,28%,97%)', boxShadow: '0 0 0 3px rgba(30,60,130,0.12)' }} />
            <Link href="/saudade/new" className="block">
              <motion.div
                whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-4 py-3.5"
                style={{
                  background: 'hsl(218,70%,28%)', borderRadius: '4px',
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

          {grouped.map((group, gi) => (
            <div key={group.year}>
              {/* Year marker */}
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

              {group.items.map((memory, mi) => {
                const idx = ++globalIdx;
                const moodEmoji = memory.mood ? MOOD_EMOJI[memory.mood] || '✦' : '';

                return (
                  <motion.div key={memory.id} {...tile(idx)} className="relative mb-5">
                    {/* Timeline node */}
                    <div className="absolute" style={{ left: '-24px', top: '24px', width: '12px', height: '12px', borderRadius: '50%', background: 'hsl(42,28%,97%)', border: '2px solid rgba(30,60,130,0.25)', boxShadow: '0 1px 4px rgba(15,30,80,0.08)' }} />

                    {/* Date label on line */}
                    <div className="absolute" style={{ left: '-28px', top: '42px' }}>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 700, letterSpacing: '0.08em', color: 'hsl(220,16%,62%)', textAlign: 'center', width: '20px', lineHeight: 1.2 }}>
                        {formatMonthDay(memory.date).split(' ')[0]}
                      </p>
                    </div>

                    <Link href={`/saudade/${memory.id}`} className="block">
                      <motion.div
                        whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}
                        transition={{ type: "spring", stiffness: 360, damping: 28 }}
                        className="overflow-hidden"
                        style={{ borderRadius: '4px', border: '1px solid rgba(30,60,130,0.10)', boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 2px 4px 14px rgba(20,40,100,0.08)', background: 'hsl(38,30%,99%)' }}>

                        {/* Image */}
                        <div className="relative overflow-hidden" style={{ height: 130 }}>
                          <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover"
                            style={{ filter: 'saturate(0.80) brightness(0.88)' }} />
                          <div className="absolute inset-0" style={{
                            background: 'linear-gradient(to top, rgba(12,25,72,0.78) 0%, rgba(18,38,96,0.20) 60%, transparent 100%)',
                          }} />

                          {/* Location badge */}
                          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1"
                            style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', background: 'rgba(12,25,72,0.45)', backdropFilter: 'blur(8px)', border: '1px solid rgba(180,200,255,0.18)', borderRadius: '2px', color: 'rgba(200,215,255,0.88)' }}>
                            <MapPin className="w-2.5 h-2.5" />{memory.location}
                          </div>

                          {/* Mood emoji */}
                          {moodEmoji && (
                            <div className="absolute top-2.5 left-2.5 w-6 h-6 flex items-center justify-center"
                              style={{ background: 'rgba(12,25,72,0.40)', backdropFilter: 'blur(8px)', borderRadius: '3px', border: '1px solid rgba(180,200,255,0.15)', fontSize: '12px' }}>
                              {moodEmoji}
                            </div>
                          )}

                          {/* Title over image */}
                          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
                            <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.15rem', letterSpacing: '0.01em', lineHeight: 1.2, color: 'rgba(240,238,232,0.96)', textShadow: '0 2px 10px rgba(0,0,30,0.50)' }}>
                              {memory.title}
                            </h3>
                          </div>
                        </div>

                        {/* Content area */}
                        <div className="px-4 py-3.5">
                          <div className="flex items-center justify-between mb-2">
                            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(220,16%,62%)' }}>
                              {memory.date}
                            </p>
                            {memory.gallery && memory.gallery.length > 1 && (
                              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 600, color: 'hsl(218,50%,42%)' }}>
                                {memory.gallery.length} photos
                              </p>
                            )}
                          </div>
                          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 400, lineHeight: 1.55, color: 'hsl(220,15%,45%)' }} className="line-clamp-2">
                            {memory.preview}
                          </p>

                          {/* Tags */}
                          {memory.tags && memory.tags.length > 0 && (
                            <div className="flex gap-1.5 mt-3">
                              {memory.tags.map(tag => {
                                const tc = TAG_COLORS[tag] || { lightBg: 'rgba(100,100,140,0.10)', lightColor: 'rgb(100,100,140)' };
                                return (
                                  <span key={tag} style={{
                                    fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 700,
                                    letterSpacing: '0.10em', textTransform: 'uppercase',
                                    background: tc.lightBg, color: tc.lightColor,
                                    borderRadius: '2px', padding: '2.5px 7px',
                                  }}>
                                    {tag}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ))}

          {/* Timeline end marker */}
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
