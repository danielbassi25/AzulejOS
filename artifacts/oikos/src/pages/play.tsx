import { useState } from "react";
import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockQuestions } from "@/data/mock";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";

const categories = ["All", "Deep Questions", "Conversation Starters", "Would You Rather"];

// Azulejo motif only on the card — the centrepiece
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
        {/* Category tabs — clean, flat, architectural */}
        <div
          className="flex overflow-x-auto no-scrollbar"
          style={{ borderBottom: '1px solid rgba(30,60,130,0.09)' }}
        >
          {categories.map((cat, i) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setCurrentIndex(0); }}
              className="flex-shrink-0 px-4 py-3 font-sans font-semibold uppercase tracking-widest transition-all duration-250"
              style={{
                fontSize: '8.5px',
                letterSpacing: '0.11em',
                background: activeCategory === cat ? 'hsl(218,70%,28%)' : 'transparent',
                color: activeCategory === cat ? 'hsl(42,30%,94%)' : 'hsl(220,20%,54%)',
                borderRight: i < categories.length - 1 ? '1px solid rgba(30,60,130,0.08)' : 'none',
                borderRadius: 0,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Question card — the one dominant element */}
        <div className="flex flex-col items-center px-4 pt-6 pb-6">
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
                  boxShadow: '4px 8px 28px rgba(12,25,72,0.28), -1px -1px 0 rgba(255,255,255,0.06) inset',
                }}
              >
                {/* Warm light leak at top */}
                <div
                  className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(255,252,245,0.05) 0%, transparent 100%)',
                  }}
                />

                {/* Corner details */}
                <div className="absolute top-0 left-0 w-8 h-8 border-b border-r" style={{ borderColor: 'rgba(180,200,255,0.12)' }} />
                <div className="absolute top-0 right-0 w-8 h-8 border-b border-l" style={{ borderColor: 'rgba(180,200,255,0.12)' }} />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-t border-r" style={{ borderColor: 'rgba(180,200,255,0.12)' }} />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-t border-l" style={{ borderColor: 'rgba(180,200,255,0.12)' }} />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-10">
                  {/* Category label */}
                  <div className="absolute top-7 left-0 right-0 flex justify-center">
                    <span
                      className="font-sans font-bold uppercase tracking-widest px-3 py-1"
                      style={{
                        fontSize: '7.5px',
                        border: '1px solid rgba(180,200,255,0.18)',
                        borderRadius: '2px',
                        color: 'rgba(195,210,255,0.48)',
                        letterSpacing: '0.15em',
                      }}
                    >
                      {currentQuestion?.category}
                    </span>
                  </div>

                  {/* Decorative ornament */}
                  <div
                    className="mb-7 font-serif"
                    style={{ fontSize: '1.6rem', color: 'rgba(200,185,160,0.18)', lineHeight: 1 }}
                  >
                    ✦
                  </div>

                  <h2
                    className="font-serif italic font-medium leading-snug"
                    style={{
                      fontSize: '1.40rem',
                      color: 'hsl(42,30%,95%)',
                      letterSpacing: '-0.01em',
                      lineHeight: 1.45,
                    }}
                  >
                    "{currentQuestion?.text}"
                  </h2>

                  {/* Counter */}
                  <p
                    className="absolute bottom-6 font-sans font-bold uppercase tracking-widest"
                    style={{ fontSize: '8px', color: 'rgba(175,162,140,0.30)' }}
                  >
                    {(currentIndex % filteredQuestions.length) + 1} / {filteredQuestions.length}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next — clean tile button */}
          <motion.button
            onClick={handleNext}
            whileTap={{ scale: 0.97 }}
            whileHover={{ y: -1.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            disabled={filteredQuestions.length === 0}
            className="mt-7 flex items-center gap-3 px-8 py-3.5 font-sans font-bold uppercase tracking-widest"
            style={{
              fontSize: '9px',
              background: 'hsl(38,30%,99%)',
              border: '1px solid rgba(30,60,130,0.14)',
              borderRadius: '4px',
              color: 'hsl(218,68%,30%)',
              boxShadow: '0 1px 0 rgba(255,255,255,0.90) inset, 2px 4px 12px rgba(20,40,100,0.08)',
              letterSpacing: '0.14em',
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
