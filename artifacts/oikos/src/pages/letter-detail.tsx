import AppShell from "@/components/AppShell";
import { getAllLetters } from "@/data/store";
import { Link, useRoute, Redirect } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, LockKeyhole, User, Calendar, Heart } from "lucide-react";

const sealPattern = `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.4' opacity='0.14'%3E%3Ccircle cx='10' cy='10' r='3.5'/%3E%3Cline x1='10' y1='0' x2='10' y2='6.5'/%3E%3Cline x1='10' y1='13.5' x2='10' y2='20'/%3E%3Cline x1='0' y1='10' x2='6.5' y2='10'/%3E%3Cline x1='13.5' y1='10' x2='20' y2='10'/%3E%3C/g%3E%3C/svg%3E")`;

export default function LetterDetailPage() {
  const [, params] = useRoute("/letters/:id");
  const allLetters = getAllLetters();
  const letter = allLetters.find((l) => l.id === params?.id);
  if (!letter) return <Redirect to="/letters" />;
  const idx = allLetters.findIndex((l) => l.id === letter.id);

  if (letter.isLocked) {
    return (
      <AppShell>
        <div className="min-h-screen flex flex-col">
          {/* Sealed header */}
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
                Back to Letters
              </span>
            </Link>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 flex items-center justify-center mb-5"
                style={{ background: 'rgba(255,252,245,0.08)', border: '1px solid rgba(180,200,255,0.16)', borderRadius: '4px' }}>
                <LockKeyhole className="w-6 h-6" style={{ color: 'rgba(200,215,255,0.55)' }} />
              </div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '1.75rem', letterSpacing: '0.01em', color: 'rgba(222,210,192,0.82)', lineHeight: 1.2 }}>
                {letter.title}
              </h1>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(175,190,240,0.38)', marginTop: '14px' }}>
                Unlocks {letter.unlockDate}
              </p>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-8">
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: '1.1rem', color: 'hsl(220,18%,60%)', textAlign: 'center', lineHeight: 1.65 }}>
              This letter is sealed and waiting for its moment. Some words need time.
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  const paragraphs = (letter.content || '').split('\n').filter(p => p.trim());

  return (
    <AppShell>
      <div className="min-h-screen">
        {/* Header */}
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, hsl(220, 68%, 26%) 0%, hsl(218, 72%, 30%) 100%)',
            padding: '36px 28px 40px',
          }}
        >
          <div className="absolute top-0 right-0 w-56 h-56 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at top right, rgba(255,252,245,0.06) 0%, transparent 60%)' }} />

          <Link href="/letters" className="flex items-center gap-2 mb-8 relative z-10"
            style={{ color: 'rgba(200,215,255,0.78)' }}>
            <ArrowLeft className="w-4 h-4" />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Back to Letters
            </span>
          </Link>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-5">
              {letter.category && (
                <span style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
                  background: 'rgba(255,252,245,0.10)', border: '1px solid rgba(255,252,245,0.16)',
                  borderRadius: '2px', padding: '4px 10px', color: 'rgba(200,185,160,0.60)',
                }}>
                  {letter.category}
                </span>
              )}
              {letter.mood && (
                <span style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
                  border: '1px solid rgba(255,252,245,0.12)', borderRadius: '2px',
                  padding: '4px 10px', color: 'rgba(200,185,160,0.42)',
                }}>
                  {letter.mood}
                </span>
              )}
            </div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600,
              fontSize: '2.0rem', letterSpacing: '0.01em', lineHeight: 1.15,
              color: 'hsl(42,30%,96%)',
            }}>
              {letter.title}
            </h1>
          </div>
        </div>

        {/* Letter content */}
        <div className="px-4 pt-4 pb-20" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* Meta tile */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-5 py-4"
            style={{
              background: 'hsl(38,30%,99%)',
              border: '1px solid rgba(30,60,130,0.08)',
              borderRadius: '4px',
              boxShadow: '0 1px 0 rgba(255,255,255,0.90) inset, 2px 3px 10px rgba(20,40,100,0.06)',
            }}
          >
            <div className="flex items-center gap-1.5">
              <User className="w-3 h-3" style={{ color: 'hsl(218,55%,38%)' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'hsl(220,24%,38%)' }}>
                {letter.author || 'Unknown'}
              </span>
            </div>
            <div style={{ width: 1, height: 14, background: 'rgba(30,60,130,0.10)' }} />
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" style={{ color: 'hsl(218,55%,38%)' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'hsl(220,24%,38%)' }}>
                {letter.unlockDate}
              </span>
            </div>
            <div style={{ width: 1, height: 14, background: 'rgba(30,60,130,0.10)' }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'hsl(220,16%,58%)' }}>
              No. {idx + 1}
            </span>
          </motion.div>

          {/* Content tile — the letter itself */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="px-7 py-8"
            style={{
              background: 'hsl(40, 26%, 95%)',
              border: '1px solid rgba(30,60,130,0.06)',
              borderRadius: '4px',
            }}
          >
            {paragraphs.map((para, i) => {
              const isSignature = para.length < 30 && (para.includes(',') || i === paragraphs.length - 1);
              return (
                <p
                  key={i}
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: isSignature ? 500 : 400,
                    fontStyle: isSignature ? 'italic' : 'normal',
                    fontSize: isSignature ? '1.05rem' : '1.18rem',
                    lineHeight: 1.85,
                    letterSpacing: '0.01em',
                    color: isSignature ? 'hsl(218,50%,35%)' : 'hsl(222,28%,26%)',
                    marginBottom: i < paragraphs.length - 1 ? '18px' : 0,
                  }}
                >
                  {para}
                </p>
              );
            })}
          </motion.div>

          {/* Decorative end mark */}
          <div className="flex justify-center py-4">
            <Heart className="w-4 h-4" style={{ color: 'rgba(30,60,130,0.14)' }} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
