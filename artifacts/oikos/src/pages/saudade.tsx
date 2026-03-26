import AppShell from "@/components/AppShell";
import { mockMemories } from "@/data/mock";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { MapPin, ArrowDown } from "lucide-react";

// ─── Location mood palettes ───────────────────────────────────────────────────
const locationMood: Record<string, { from: string; mid: string }> = {
  "Rome, Italy":      { from: "rgba(36,10,6,0.90)",  mid: "rgba(38,14,8,0.52)"  },
  "Lisbon, Portugal": { from: "rgba(10,18,52,0.92)",  mid: "rgba(14,24,64,0.52)" },
  "Sintra, Portugal": { from: "rgba(8,20,14,0.90)",   mid: "rgba(12,26,18,0.48)" },
  "Porto, Portugal":  { from: "rgba(5,8,42,0.94)",    mid: "rgba(8,12,52,0.55)"  },
  "Barcelona, Spain": { from: "rgba(32,12,4,0.88)",   mid: "rgba(36,16,6,0.48)"  },
};

const getMoodGradient = (loc: string) => {
  const m = locationMood[loc] ?? { from: "rgba(10,20,60,0.90)", mid: "rgba(14,28,72,0.50)" };
  return `linear-gradient(to top, ${m.from} 0%, ${m.mid} 44%, transparent 100%)`;
};

// ─── Film grain overlay ───────────────────────────────────────────────────────
const grainSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

// ─── Card variant by index ────────────────────────────────────────────────────
type CardVariant = "hero" | "standard" | "compact" | "wide";
const cardPattern: CardVariant[] = ["hero", "standard", "compact", "wide", "standard"];

const variantConfig: Record<CardVariant, {
  height: string;
  mx: number;       // horizontal margin in px (0 = full-bleed)
  borderRadius: string;
  titleSize: string;
  titleWeight: number;
}> = {
  hero:     { height: "70vh",  mx: 0,  borderRadius: "0",   titleSize: "2.6rem",  titleWeight: 600 },
  standard: { height: "228px", mx: 16, borderRadius: "4px", titleSize: "1.55rem", titleWeight: 600 },
  compact:  { height: "160px", mx: 16, borderRadius: "4px", titleSize: "1.20rem", titleWeight: 500 },
  wide:     { height: "256px", mx: 0,  borderRadius: "0",   titleSize: "1.75rem", titleWeight: 600 },
};

export default function SaudadePage() {
  return (
    <AppShell>
      {/* ─── Minimal header — no SectionHeader, we go cinematic immediately ─── */}
      <div
        className="relative flex items-end justify-between"
        style={{
          background: "linear-gradient(160deg, hsl(220,68%,26%) 0%, hsl(218,72%,30%) 100%)",
          padding: "32px 24px 22px",
          borderBottom: "1px solid rgba(15,40,110,0.35)",
        }}
      >
        <div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 600,
            fontSize: "2.6rem",
            letterSpacing: "0.01em",
            lineHeight: 1,
            color: "hsl(42,30%,96%)",
          }}>
            Saudade
          </h1>
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "0.92rem",
            letterSpacing: "0.03em",
            color: "rgba(215,205,185,0.52)",
            marginTop: "8px",
          }}>
            The presence of absence
          </p>
        </div>
        <div
          className="flex items-center gap-2 mb-1"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "8.5px",
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(195,182,160,0.48)",
          }}
        >
          <span>{mockMemories.length} memories</span>
        </div>
      </div>

      {/* ─── Timeline container ───────────────────────────────────────────────── */}
      <div className="relative pb-16">

        {/* Vertical timeline guide — barely there, purely structural */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            left: "28px",
            width: "1px",
            background: "linear-gradient(to bottom, transparent 0%, rgba(30,60,130,0.14) 8%, rgba(30,60,130,0.14) 92%, transparent 100%)",
            zIndex: 1,
          }}
        />

        {mockMemories.map((memory, idx) => {
          const variant = cardPattern[idx] ?? "standard";
          const cfg = variantConfig[variant];
          const gradient = getMoodGradient(memory.location);
          const isHero = variant === "hero";
          const isFullBleed = cfg.mx === 0;

          return (
            <div key={memory.id} className="relative">
              {/* ── Timeline connector ── */}
              <div
                className="absolute flex flex-col items-center"
                style={{
                  left: "20px",
                  top: isHero ? "24px" : "20px",
                  zIndex: 2,
                }}
              >
                {/* Dot */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.12, duration: 0.4 }}
                  style={{
                    width: isHero ? "18px" : "12px",
                    height: isHero ? "18px" : "12px",
                    borderRadius: "2px",
                    background: isHero ? "hsl(42,46%,76%)" : "hsl(218,70%,28%)",
                    border: isHero ? "none" : "1px solid rgba(30,60,130,0.20)",
                    transform: "rotate(45deg)",
                    flexShrink: 0,
                  }}
                />
              </div>

              {/* ── Card ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: idx * 0.10,
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  marginLeft: cfg.mx,
                  marginRight: cfg.mx,
                  marginTop: isHero ? 0 : idx === 0 ? 0 : "12px",
                  marginBottom: "12px",
                }}
              >
                <Link href={`/saudade/${memory.id}`} className="block focus:outline-none">
                  <motion.div
                    className="relative overflow-hidden"
                    style={{
                      height: cfg.height,
                      borderRadius: cfg.borderRadius,
                      border: isFullBleed ? "none" : "1px solid rgba(20,40,100,0.12)",
                      boxShadow: isFullBleed
                        ? "none"
                        : "3px 6px 20px rgba(15,30,80,0.14), 0 1px 0 rgba(255,255,255,0.05) inset",
                      cursor: "pointer",
                    }}
                    whileHover={{ boxShadow: isFullBleed ? "none" : "4px 10px 32px rgba(12,25,72,0.22)" }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* ── Slow-zoom image ── */}
                    <motion.img
                      src={memory.imageUrl}
                      alt={memory.title}
                      className="w-full h-full object-cover"
                      style={{
                        filter: `saturate(0.70) brightness(${isHero ? 0.88 : 0.80})`,
                        transformOrigin: "center center",
                      }}
                      initial={{ scale: 1.04 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.8, delay: idx * 0.08, ease: "easeOut" }}
                      whileHover={{ scale: 1.04 }}
                    />

                    {/* ── Film grain ── */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: grainSvg,
                        backgroundRepeat: "repeat",
                        backgroundSize: "200px 200px",
                        mixBlendMode: "overlay",
                        opacity: 0.55,
                      }}
                    />

                    {/* ── Location mood gradient ── */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: gradient }}
                    />

                    {/* ── Vignette ── */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        boxShadow: "inset 0 0 60px rgba(8,15,40,0.35)",
                      }}
                    />

                    {/* ── Hero — special top treatment ── */}
                    {isHero && (
                      <>
                        {/* Subtle top haze */}
                        <div
                          className="absolute top-0 left-0 right-0 pointer-events-none"
                          style={{
                            height: "35%",
                            background: "linear-gradient(to bottom, rgba(8,14,40,0.35) 0%, transparent 100%)",
                          }}
                        />
                        {/* Hero label */}
                        <div
                          className="absolute top-7 right-6 flex items-center gap-1.5"
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "8px",
                            fontWeight: 700,
                            letterSpacing: "0.20em",
                            textTransform: "uppercase",
                            color: "rgba(200,215,255,0.50)",
                          }}
                        >
                          <span className="w-3 h-px" style={{ background: "rgba(200,215,255,0.35)" }} />
                          First memory
                        </div>
                        {/* Scroll hint */}
                        <motion.div
                          className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
                          animate={{ y: [0, 5, 0] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                          style={{ opacity: 0.30 }}
                        >
                          <ArrowDown className="w-4 h-4" style={{ color: "rgba(200,215,255,0.9)" }} />
                        </motion.div>
                      </>
                    )}

                    {/* ── Bottom content ── */}
                    <div
                      className="absolute bottom-0 left-0 right-0"
                      style={{ padding: isHero ? "0 32px 36px" : isFullBleed ? "0 24px 22px" : "0 20px 20px" }}
                    >
                      {/* Location + Date row */}
                      <div
                        className="flex items-center gap-3 flex-wrap"
                        style={{ marginBottom: isHero ? "16px" : "10px" }}
                      >
                        <div
                          className="flex items-center gap-1"
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "8px",
                            fontWeight: 700,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "rgba(170,190,245,0.70)",
                          }}
                        >
                          <MapPin className="w-2.5 h-2.5" />
                          {memory.location}
                        </div>
                        <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "rgba(170,190,245,0.25)" }} />
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "8px",
                            fontWeight: 500,
                            letterSpacing: "0.10em",
                            textTransform: "uppercase",
                            color: "rgba(170,190,245,0.45)",
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {memory.date}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontWeight: cfg.titleWeight,
                          fontSize: cfg.titleSize,
                          letterSpacing: "0.01em",
                          lineHeight: 1.15,
                          color: "rgba(238,234,228,0.97)",
                          textShadow: "0 2px 16px rgba(0,0,30,0.50)",
                        }}
                      >
                        {memory.title}
                      </h3>

                      {/* Hero preview text */}
                      {isHero && (
                        <p
                          style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontStyle: "italic",
                            fontWeight: 300,
                            fontSize: "1.08rem",
                            letterSpacing: "0.01em",
                            lineHeight: 1.65,
                            color: "rgba(205,198,185,0.68)",
                            marginTop: "12px",
                            maxWidth: "320px",
                          }}
                        >
                          {memory.preview}
                        </p>
                      )}

                      {/* Wide card preview */}
                      {variant === "wide" && (
                        <p
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 300,
                            fontSize: "0.72rem",
                            lineHeight: 1.55,
                            color: "rgba(190,205,240,0.55)",
                            marginTop: "8px",
                          }}
                          className="line-clamp-2"
                        >
                          {memory.preview}
                        </p>
                      )}
                    </div>

                    {/* ── Index number — top left, elegant ── */}
                    <div
                      className="absolute"
                      style={{
                        top: isHero ? "auto" : "16px",
                        bottom: isHero ? "36px" : "auto",
                        ...(isHero ? { right: "32px" } : { left: isFullBleed ? "20px" : "16px" }),
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontWeight: 300,
                        fontSize: isHero ? "4rem" : "0.85rem",
                        letterSpacing: isHero ? "-0.04em" : "0.06em",
                        color: isHero ? "rgba(180,195,235,0.08)" : "rgba(180,195,235,0.30)",
                        lineHeight: 1,
                        userSelect: "none",
                      }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>

              {/* ── Between-card spacer with timestamp label ── */}
              {idx < mockMemories.length - 1 && (
                <div
                  className="flex items-center"
                  style={{ marginLeft: "48px", marginBottom: "0px", height: "32px" }}
                >
                  <div style={{ width: "16px", height: "1px", background: "rgba(30,60,130,0.12)" }} />
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "7.5px",
                      fontWeight: 600,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "rgba(120,140,190,0.32)",
                      marginLeft: "8px",
                    }}
                  >
                    {getTimeDiff(mockMemories[idx].date, mockMemories[idx + 1].date)}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* ── End of archive marker ── */}
        <div className="flex flex-col items-center py-10" style={{ marginLeft: "16px" }}>
          <div
            style={{
              width: "1px",
              height: "28px",
              background: "linear-gradient(to bottom, rgba(30,60,130,0.14) 0%, transparent 100%)",
              marginBottom: "12px",
            }}
          />
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "1px",
              border: "1px solid rgba(30,60,130,0.18)",
              transform: "rotate(45deg)",
            }}
          />
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "8px",
              fontWeight: 600,
              letterSpacing: "0.20em",
              textTransform: "uppercase",
              color: "rgba(30,60,130,0.30)",
              marginTop: "14px",
            }}
          >
            Archive · {mockMemories.length} moments
          </p>
        </div>
      </div>
    </AppShell>
  );
}

// ─── Utility — generate a simple time gap label ───────────────────────────────
function getTimeDiff(dateA: string, dateB: string): string {
  try {
    const a = new Date(dateA);
    const b = new Date(dateB);
    const days = Math.abs(Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)));
    if (days < 30) return `${days}d later`;
    if (days < 365) return `${Math.round(days / 30)}mo later`;
    return `${Math.round(days / 365)}yr later`;
  } catch {
    return "";
  }
}
