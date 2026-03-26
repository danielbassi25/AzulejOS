import { useMemo } from "react";
import AppShell from "@/components/AppShell";
import { getAllMemories } from "@/data/store";
import { Link, useRoute, Redirect } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Sparkles } from "lucide-react";

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  trip: { bg: 'rgba(30,80,180,0.60)', color: 'rgba(200,215,255,0.92)' },
  milestone: { bg: 'rgba(180,140,60,0.55)', color: 'rgba(255,250,220,0.92)' },
  tender: { bg: 'rgba(160,60,80,0.45)', color: 'rgba(255,220,225,0.90)' },
  funny: { bg: 'rgba(60,140,100,0.50)', color: 'rgba(210,255,230,0.92)' },
  routine: { bg: 'rgba(100,80,160,0.50)', color: 'rgba(230,220,255,0.92)' },
};

const MOOD_COLORS: Record<string, string> = {
  magical: 'hsl(270,50%,60%)',
  nostalgic: 'hsl(35,55%,55%)',
  adventurous: 'hsl(160,45%,42%)',
  euphoric: 'hsl(48,70%,55%)',
  peaceful: 'hsl(200,40%,58%)',
};

export default function SaudadeDetailPage() {
  const [, params] = useRoute("/saudade/:id");
  const allMemories = useMemo(() => getAllMemories(), []);
  const memory = allMemories.find((m) => m.id === params?.id);
  if (!memory) return <Redirect to="/saudade" />;
  const idx = allMemories.findIndex((m) => m.id === memory.id);

  const relatedMemories = useMemo(() => {
    if (!memory.tags || memory.tags.length === 0) return [];
    return allMemories
      .filter(m => m.id !== memory.id && m.tags?.some(t => memory.tags!.includes(t)))
      .sort((a, b) => {
        const aOverlap = a.tags?.filter(t => memory.tags!.includes(t)).length || 0;
        const bOverlap = b.tags?.filter(t => memory.tags!.includes(t)).length || 0;
        return bOverlap - aOverlap;
      })
      .slice(0, 3);
  }, [memory]);

  const hasGallery = memory.gallery && memory.gallery.length > 1;

  return (
    <AppShell>
      <div className="relative">
        {/* Hero */}
        <div className="relative overflow-hidden" style={{ height: 320 }}>
          <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.78) brightness(0.84)' }} />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, rgba(12,25,72,0.42) 0%, rgba(12,25,72,0.28) 30%, hsl(42,28%,97%) 100%)',
          }} />

          <Link href="/saudade" className="absolute top-5 left-4 flex items-center gap-2"
            style={{
              background: 'rgba(12,25,72,0.38)', backdropFilter: 'blur(14px)',
              border: '1px solid rgba(180,200,255,0.18)', borderRadius: '3px', padding: '8px 14px',
              color: 'rgba(220,230,255,0.92)',
            }}>
            <ArrowLeft className="w-4 h-4" />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Back</span>
          </Link>

          <div className="absolute top-5 right-5"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontSize: '14px', letterSpacing: '0.04em', color: 'rgba(200,215,255,0.22)' }}>
            {String(idx + 1).padStart(2, '0')}
          </div>
        </div>

        <div className="px-4 -mt-8 relative z-10 pb-16" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Title tile */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="px-7 py-7"
            style={{
              background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.09)', borderRadius: '4px',
              boxShadow: '0 1px 0 rgba(255,255,255,0.92) inset, 3px 6px 20px rgba(20,40,100,0.10)',
            }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '2.0rem', letterSpacing: '0.01em', lineHeight: 1.18, color: 'hsl(222,45%,16%)' }}>
              {memory.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2" style={{ marginTop: '16px' }}>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', background: 'hsl(40,28%,92%)', borderRadius: '2px', color: 'hsl(220,26%,42%)' }}>
                <Calendar className="w-3 h-3" />{memory.date}
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', background: 'hsl(218,70%,28%)', borderRadius: '2px', color: 'hsl(42,30%,96%)' }}>
                <MapPin className="w-3 h-3" />{memory.location}
              </div>
              {memory.mood && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', borderRadius: '2px', background: 'hsl(40,28%,92%)', color: MOOD_COLORS[memory.mood] || 'hsl(220,26%,42%)' }}>
                  <Sparkles className="w-3 h-3" />{memory.mood}
                </div>
              )}
            </div>
            {/* Tags */}
            {memory.tags && memory.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5" style={{ marginTop: '12px' }}>
                {memory.tags.map(tag => {
                  const tc = TAG_COLORS[tag] || { bg: 'rgba(100,100,140,0.45)', color: 'rgba(220,220,240,0.88)' };
                  return (
                    <span key={tag} style={{ fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: tc.bg, color: tc.color, borderRadius: '2px', padding: '3px 10px' }}>
                      {tag}
                    </span>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Photo Gallery */}
          {hasGallery && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}>
              <div className="flex items-center gap-3 px-1" style={{ marginBottom: '10px' }}>
                <div style={{ width: 16, height: 1, background: 'rgba(30,60,130,0.16)' }} />
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'hsl(220,18%,57%)' }}>
                  Gallery · {memory.gallery!.length} photos
                </p>
                <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.08)' }} />
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1" style={{ scrollSnapType: 'x mandatory' }}>
                {memory.gallery!.map((url, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                    className="shrink-0 overflow-hidden"
                    style={{
                      width: 200, height: 140, borderRadius: '4px',
                      border: '1px solid rgba(30,60,130,0.10)',
                      boxShadow: '2px 3px 10px rgba(20,40,100,0.08)',
                      scrollSnapAlign: 'start',
                    }}
                  >
                    <img src={url} alt={`${memory.title} photo ${i + 1}`} className="w-full h-full object-cover"
                      style={{ filter: 'saturate(0.82) brightness(0.92)' }} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Content */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}
            className="px-7 py-8"
            style={{ background: 'hsl(40, 26%, 95%)', border: '1px solid rgba(30,60,130,0.07)', borderRadius: '4px' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: '1.18rem', letterSpacing: '0.01em', lineHeight: 1.90, color: 'hsl(222,28%,28%)' }}>
              {memory.content}
            </p>
          </motion.div>

          {/* Inside jokes */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.20 }}>
            <div className="flex items-center gap-3 px-1" style={{ marginBottom: '10px' }}>
              <div style={{ width: 16, height: 1, background: 'rgba(30,60,130,0.16)' }} />
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'hsl(220,18%,57%)' }}>Inside Jokes</p>
              <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.08)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {memory.insideJokes.map((joke, i) => (
                <div key={i} className="px-6 py-4"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: '1.05rem', letterSpacing: '0.01em', lineHeight: 1.55,
                    background: i % 2 === 0 ? 'hsl(218,70%,28%)' : 'hsl(38,30%,99%)',
                    border: '1px solid rgba(30,60,130,0.09)', borderRadius: '4px',
                    color: i % 2 === 0 ? 'hsl(42,30%,94%)' : 'hsl(222,38%,22%)',
                    boxShadow: '1px 2px 8px rgba(20,40,100,0.07)',
                  }}>
                  {joke}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Related Memories */}
          {relatedMemories.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
              <div className="flex items-center gap-3 px-1" style={{ marginBottom: '10px', marginTop: '8px' }}>
                <div style={{ width: 16, height: 1, background: 'rgba(30,60,130,0.16)' }} />
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'hsl(220,18%,57%)' }}>Related Memories</p>
                <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.08)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {relatedMemories.map((rm, i) => (
                  <Link key={rm.id} href={`/saudade/${rm.id}`} className="block">
                    <motion.div
                      initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.30 + i * 0.06 }}
                      whileHover={{ y: -1.5 }}
                      className="relative overflow-hidden"
                      style={{
                        height: 100, borderRadius: '4px',
                        border: '1px solid rgba(30,60,130,0.10)',
                        boxShadow: '2px 3px 10px rgba(20,40,100,0.08)',
                      }}>
                      <img src={rm.imageUrl} alt={rm.title} className="w-full h-full object-cover"
                        style={{ filter: 'saturate(0.72) brightness(0.78)' }} />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(12,25,72,0.85) 0%, rgba(12,25,72,0.45) 60%, transparent 100%)' }} />
                      <div className="absolute inset-0 flex flex-col justify-center px-5">
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(170,188,240,0.58)', marginBottom: '4px' }}>{rm.date}</p>
                        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.05rem', color: 'rgba(240,238,232,0.94)', letterSpacing: '0.01em' }}>{rm.title}</h3>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
