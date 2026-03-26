import { useState } from "react";
import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockQuestions } from "@/data/mock";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";

const categories = ["All", "Deep Questions", "Conversation Starters", "Would You Rather"];

const azulejoMotif = `url("data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.45' opacity='0.11'%3E%3Ccircle cx='18' cy='18' r='6'/%3E%3Cline x1='18' y1='0' x2='18' y2='12'/%3E%3Cline x1='18' y1='24' x2='18' y2='36'/%3E%3Cline x1='0' y1='18' x2='12' y2='18'/%3E%3Cline x1='24' y1='18' x2='36' y2='18'/%3E%3Cline x1='3.5' y1='3.5' x2='11' y2='11'/%3E%3Cline x1='25' y1='25' x2='32.5' y2='32.5'/%3E%3Cline x1='32.5' y1='3.5' x2='25' y2='11'/%3E%3Cline x1='11' y1='25' x2='3.5' y2='32.5'/%3E%3C/g%3E%3C/svg%3E")`;

export default function PlayPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const filteredQuestions =
    activeCategory === "All"
      ? mockQuestions
      : mockQuestions.filter((q) => q.category === activeCategory);

  const currentQuestion = filteredQuestions[currentIndex % filteredQuestions.length] || filteredQuestions[0];

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  return (
    <AppShell>
      <SectionHeader title="Play" subtitle="Discover each other, again" />

      <div className="flex flex-col">
        {/* Category tabs */}
        <div className="flex overflow-x-auto no-scrollbar" style={{ borderBottom: '1px solid rgba(30,60,130,0.09)' }}>
          {categories.map((cat, i) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setCurrentIndex(0); }}
              className="flex-shrink-0 px-4 py-3.5 transition-all duration-250"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '8.5px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                background: activeCategory === cat ? 'hsl(218,70%,28%)' : 'transparent',
                color: activeCategory === cat ? 'hsl(42,30%,94%)' : 'hsl(220,18%,55%)',
                borderRight: i < categories.length - 1 ? '1px solid rgba(30,60,130,0.08)' : 'none',
                borderRadius: 0,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Question card — the centrepiece, only cobalt on screen */}
        <div className="flex flex-col items-center px-4 pt-7 pb-8">
          <div className="relative w-full" style={{ maxWidth: 340, aspectRatio: '3/4' }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`${currentQuestion?.id}-${currentIndex}`}
                custom={direction}
                initial={{ opacity: 0, y: 28, scale: 0.96, rotate: direction > 0 ? 1.2 : -1.2 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, x: -90 * direction, scale: 0.94, rotate: -2.5 * direction }}
                transition={{ type: "spring", stiffness: 250, damping: 28 }}
                className="absolute inset-0 overflow-hidden"
                style={{
                  backgroundColor: 'hsl(220,70%,26%)',
                  backgroundImage: `${azulejoMotif}, linear-gradient(155deg, hsl(220,70%,26%) 0%, hsl(218,72%,30%) 100%)`,
                  backgroundSize: '36px 36px, 100% 100%',
                  border: '1px solid rgba(15,45,115,0.50)',
                  borderRadius: '4px',
                  boxShadow: '4px 8px 30px rgba(12,25,72,0.28), -1px -1px 0 rgba(255,255,255,0.06) inset',
                }}
              >
                {/* Warm top glow */}
                <div className="absolute top-0 left-0 right-0 pointer-events-none"
                  style={{ height: 80, background: 'linear-gradient(to bottom, rgba(255,252,245,0.05) 0%, transparent 100%)' }}
                />
                {/* Corner details */}
                <div className="absolute top-0 left-0 w-8 h-8 border-b border-r" style={{ borderColor: 'rgba(180,200,255,0.11)' }} />
                <div className="absolute top-0 right-0 w-8 h-8 border-b border-l" style={{ borderColor: 'rgba(180,200,255,0.11)' }} />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-t border-r" style={{ borderColor: 'rgba(180,200,255,0.11)' }} />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-t border-l" style={{ borderColor: 'rgba(180,200,255,0.11)' }} />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-10">
                  {/* Category badge */}
                  <div className="absolute top-7 left-0 right-0 flex justify-center">
                    <span style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '7.5px',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      border: '1px solid rgba(180,200,255,0.16)',
                      borderRadius: '2px',
                      color: 'rgba(195,210,255,0.46)',
                      padding: '4px 12px',
                    }}>
                      {currentQuestion?.category}
                    </span>
                  </div>

                  {/* Ornament */}
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.5rem', color: 'rgba(200,185,160,0.16)', lineHeight: 1, marginBottom: '24px' }}>
                    ✦
                  </div>

                  <h2 style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontStyle: 'italic',
                    fontWeight: 500,
                    fontSize: '1.52rem',
                    letterSpacing: '0.01em',
                    lineHeight: 1.42,
                    color: 'hsl(42,30%,96%)',
                  }}>
                    "{currentQuestion?.text}"
                  </h2>

                  {/* Counter */}
                  <p className="absolute bottom-6" style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '8px',
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'rgba(175,162,140,0.28)',
                  }}>
                    {(currentIndex % filteredQuestions.length) + 1} / {filteredQuestions.length}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next button — clean ceramic */}
          <motion.button
            onClick={handleNext}
            whileTap={{ scale: 0.97 }}
            whileHover={{ y: -1.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            disabled={filteredQuestions.length === 0}
            className="flex items-center gap-3"
            style={{
              marginTop: '28px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              background: 'hsl(38,30%,99%)',
              border: '1px solid rgba(30,60,130,0.12)',
              borderRadius: '4px',
              color: 'hsl(218,68%,30%)',
              boxShadow: '0 1px 0 rgba(255,255,255,0.90) inset, 2px 4px 12px rgba(20,40,100,0.07)',
              padding: '14px 28px',
            }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Next Question
          </motion.button>
        </div>
      </div>
    </AppShell>
  );
}
