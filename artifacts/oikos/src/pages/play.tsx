import { useState } from "react";
import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockQuestions } from "@/data/mock";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";

const categories = ["All", "Deep Questions", "Conversation Starters", "Would You Rather"];

const azulejoPattern = `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.12'%3E%3Ccircle cx='16' cy='16' r='6'/%3E%3Cline x1='16' y1='0' x2='16' y2='10'/%3E%3Cline x1='16' y1='22' x2='16' y2='32'/%3E%3Cline x1='0' y1='16' x2='10' y2='16'/%3E%3Cline x1='22' y1='16' x2='32' y2='16'/%3E%3Cline x1='3' y1='3' x2='10' y2='10'/%3E%3Cline x1='22' y1='22' x2='29' y2='29'/%3E%3Cline x1='29' y1='3' x2='22' y2='10'/%3E%3Cline x1='10' y1='22' x2='3' y2='29'/%3E%3C/g%3E%3C/svg%3E")`;

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

      <div className="flex flex-col min-h-0 pb-4">
        {/* Category tiles — horizontal row */}
        <div className="flex overflow-x-auto gap-0 px-3 pt-4 pb-3 no-scrollbar" style={{ borderBottom: '1px solid rgba(30,60,130,0.09)' }}>
          {categories.map((cat, i) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setCurrentIndex(0); }}
              className="flex-shrink-0 px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest transition-all duration-200"
              style={{
                background: activeCategory === cat ? 'hsl(218,70%,28%)' : 'transparent',
                color: activeCategory === cat ? 'hsl(42,30%,95%)' : 'hsl(220,22%,52%)',
                borderRight: i < categories.length - 1 ? '1px solid rgba(30,60,130,0.10)' : 'none',
                borderRadius: 0,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Question card — central tile, very tall */}
        <div className="flex-1 flex flex-col items-center justify-center px-3 py-5">
          <div className="relative w-full" style={{ maxWidth: 340, aspectRatio: '3/4' }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`${currentQuestion?.id}-${currentIndex}`}
                custom={direction}
                initial={{ opacity: 0, y: 30, scale: 0.95, rotate: direction > 0 ? 1.5 : -1.5 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, x: -100 * direction, scale: 0.93, rotate: -3 * direction }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                className="absolute inset-0 overflow-hidden"
                style={{
                  background: 'hsl(218, 70%, 28%)',
                  backgroundImage: azulejoPattern,
                  backgroundSize: '32px 32px',
                  border: '1px solid rgba(20,50,120,0.45)',
                  borderRadius: '3px',
                  boxShadow: '4px 6px 24px rgba(15,30,80,0.25), -1px -1px 0 rgba(255,255,255,0.08) inset',
                }}
              >
                {/* Decorative corner tiles */}
                <div className="absolute top-0 left-0 w-8 h-8 border-b border-r" style={{ borderColor: 'rgba(180,200,255,0.15)' }} />
                <div className="absolute top-0 right-0 w-8 h-8 border-b border-l" style={{ borderColor: 'rgba(180,200,255,0.15)' }} />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-t border-r" style={{ borderColor: 'rgba(180,200,255,0.15)' }} />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-t border-l" style={{ borderColor: 'rgba(180,200,255,0.15)' }} />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
                  {/* Category label */}
                  <div
                    className="absolute top-7 left-0 right-0 flex justify-center"
                  >
                    <span
                      className="text-[8px] uppercase tracking-[0.18em] font-bold px-3 py-1"
                      style={{
                        border: '1px solid rgba(180,200,255,0.22)',
                        borderRadius: '2px',
                        color: 'rgba(200,215,255,0.55)',
                      }}
                    >
                      {currentQuestion?.category}
                    </span>
                  </div>

                  {/* Decorative mark */}
                  <div className="mb-6 font-serif" style={{ fontSize: '1.8rem', color: 'rgba(200,185,160,0.22)', lineHeight: 1 }}>
                    ✦
                  </div>

                  <h2
                    className="font-serif italic font-medium leading-snug"
                    style={{ fontSize: '1.35rem', color: 'hsl(42,30%,95%)', letterSpacing: '-0.01em' }}
                  >
                    "{currentQuestion?.text}"
                  </h2>

                  {/* Card counter */}
                  <p
                    className="absolute bottom-6 text-[9px] font-bold uppercase tracking-widest"
                    style={{ color: 'rgba(180,165,140,0.35)' }}
                  >
                    {(currentIndex % filteredQuestions.length) + 1} / {filteredQuestions.length}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next button — tile style */}
          <motion.button
            onClick={handleNext}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            disabled={filteredQuestions.length === 0}
            className="mt-8 flex items-center gap-3 px-8 py-4 font-bold text-[11px] uppercase tracking-widest"
            style={{
              background: 'hsl(222, 40%, 14%)',
              border: '1px solid rgba(30,60,130,0.40)',
              borderRadius: '3px',
              color: 'hsl(42,30%,90%)',
              boxShadow: '2px 3px 10px rgba(10,20,60,0.22)',
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Next Question
          </motion.button>
        </div>
      </div>
    </AppShell>
  );
}
