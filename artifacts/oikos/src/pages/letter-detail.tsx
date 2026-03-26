import AppShell from "@/components/AppShell";
import { getAllLetters } from "@/data/store";
import { Link, useRoute, Redirect } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, LockKeyhole, Heart, MessageSquare, Sparkles, CalendarHeart } from "lucide-react";
import type { NoteType } from "@/types";

const sealPattern = `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.4' opacity='0.14'%3E%3Ccircle cx='10' cy='10' r='3.5'/%3E%3Cline x1='10' y1='0' x2='10' y2='6.5'/%3E%3Cline x1='10' y1='13.5' x2='10' y2='20'/%3E%3Cline x1='0' y1='10' x2='6.5' y2='10'/%3E%3Cline x1='13.5' y1='10' x2='20' y2='10'/%3E%3C/g%3E%3C/svg%3E")`;

function noteTypeLabel(t?: NoteType): string {
  if (t === "open-when") return "Open When";
  if (t === "invite") return "Invite";
  return "Note";
}

function noteTypeIcon(t?: NoteType) {
  if (t === "open-when") return Sparkles;
  if (t === "invite") return CalendarHeart;
  return MessageSquare;
}

export default function LetterDetailPage() {
  const [, params] = useRoute("/letters/:id");
  const allLetters = getAllLetters();
  const letter = allLetters.find((l) => l.id === params?.id);
  if (!letter) return <Redirect to="/letters" />;

  if (letter.isLocked) {
    return (
      <AppShell>
        <div className="min-h-screen flex flex-col">
          <div
            className="relative overflow-hidden"
            style={{
              backgroundColor: 'hsl(220,68%,24%)',
              backgroundImage: `${sealPattern}, linear-gradient(160deg, hsl(220,68%,24%) 0%, hsl(218,70%,28%) 100%)`,
              backgroundSize: '20px 20px, 100% 100%',
              padding: '36px 28px 48px',
            }}
          >
            <Link href="/letters" className="flex items-center gap-2 mb-8"
              style={{ color: 'rgba(200,215,255,0.78)' }}>
              <ArrowLeft className="w-4 h-4" />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Back to Notes
              </span>
            </Link>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-14 h-14 flex items-center justify-center mb-5"
                style={{ background: 'rgba(255,252,245,0.08)', border: '1px solid rgba(180,200,255,0.16)', borderRadius: '4px' }}>
                <LockKeyhole className="w-5 h-5" style={{ color: 'rgba(200,215,255,0.55)' }} />
              </div>
              <span style={{
                fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                background: 'rgba(255,252,245,0.08)', border: '1px solid rgba(180,200,255,0.14)',
                borderRadius: '2px', padding: '3px 10px', color: 'rgba(195,210,255,0.45)', marginBottom: '14px',
              }}>
                {noteTypeLabel(letter.noteType)}
              </span>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.6rem', letterSpacing: '0.01em', color: 'rgba(222,210,192,0.82)', lineHeight: 1.25 }}>
                {letter.title}
              </h1>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(175,190,240,0.38)', marginTop: '14px' }}>
                Unlocks {letter.unlockDate}
              </p>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-8">
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: '1.05rem', color: 'hsl(220,18%,60%)', textAlign: 'center', lineHeight: 1.65 }}>
              This note is sealed and waiting for its moment. Some words need time.
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  const TypeIcon = noteTypeIcon(letter.noteType);

  return (
    <AppShell>
      <div className="min-h-screen">
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, hsl(220, 68%, 26%) 0%, hsl(218, 72%, 30%) 100%)',
            padding: '36px 28px 36px',
          }}
        >
          <div className="absolute top-0 right-0 w-56 h-56 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at top right, rgba(255,252,245,0.06) 0%, transparent 60%)' }} />

          <Link href="/letters" className="flex items-center gap-2 mb-8 relative z-10"
            style={{ color: 'rgba(200,215,255,0.78)' }}>
            <ArrowLeft className="w-4 h-4" />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Back to Notes
            </span>
          </Link>

          <div className="relative z-10">
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
              background: 'rgba(255,252,245,0.10)', border: '1px solid rgba(255,252,245,0.16)',
              borderRadius: '2px', padding: '4px 10px', color: 'rgba(200,185,160,0.60)',
            }}>
              {noteTypeLabel(letter.noteType)}
            </span>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600,
              fontSize: '1.85rem', letterSpacing: '0.01em', lineHeight: 1.2,
              color: 'hsl(42,30%,96%)', marginTop: '14px',
            }}>
              {letter.title}
            </h1>
          </div>
        </div>

        <div className="px-4 pt-4 pb-20" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-3"
            style={{
              background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px',
              boxShadow: '0 1px 0 rgba(255,255,255,0.90) inset, 2px 3px 10px rgba(20,40,100,0.06)',
            }}
          >
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 500, color: 'hsl(220,16%,55%)' }}>
              {letter.author || 'Unknown'}
            </span>
            <div style={{ width: 1, height: 10, background: 'rgba(30,60,130,0.10)' }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 500, color: 'hsl(220,16%,55%)' }}>
              {letter.unlockDate}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="px-6 py-7"
            style={{
              background: 'hsl(40, 26%, 95%)',
              border: '1px solid rgba(30,60,130,0.06)',
              borderRadius: '4px',
            }}
          >
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 400,
              fontStyle: 'italic',
              fontSize: '1.25rem',
              lineHeight: 1.85,
              letterSpacing: '0.01em',
              color: 'hsl(222,28%,26%)',
            }}>
              {letter.content}
            </p>
          </motion.div>

          <div className="flex justify-center py-4">
            <Heart className="w-4 h-4" style={{ color: 'rgba(30,60,130,0.14)' }} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
