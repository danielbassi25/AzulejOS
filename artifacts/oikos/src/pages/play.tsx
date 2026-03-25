import { useState } from "react";
import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockQuestions } from "@/data/mock";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircleHeart, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["All", "Deep Questions", "Conversation Starters", "Would You Rather"];

// All-blue card backgrounds per category
const cardBg: Record<string, string> = {
  "Deep Questions":
    "linear-gradient(145deg, rgba(190,215,255,0.55) 0%, rgba(160,200,255,0.35) 100%)",
  "Conversation Starters":
    "linear-gradient(145deg, rgba(200,220,255,0.5) 0%, rgba(175,210,255,0.35) 100%)",
  "Would You Rather":
    "linear-gradient(145deg, rgba(175,205,255,0.55) 0%, rgba(145,190,255,0.35) 100%)",
  "All":
    "linear-gradient(145deg, rgba(210,228,255,0.55) 0%, rgba(180,215,255,0.35) 100%)",
};

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
      <div className="min-h-full flex flex-col">
        <SectionHeader title="Play" subtitle="Discover each other, again" />

        {/* Category pills */}
        <div className="pt-5 pb-3 px-5 flex overflow-x-auto gap-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentIndex(0);
              }}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-200 border shrink-0"
              )}
              style={{
                background:
                  activeCategory === cat
                    ? 'hsl(222,30%,18%)'
                    : 'rgba(215,232,255,0.65)',
                color:
                  activeCategory === cat ? 'rgba(220,235,255,0.95)' : 'hsl(218,30%,48%)',
                border:
                  activeCategory === cat
                    ? '1px solid transparent'
                    : '1px solid rgba(175,210,255,0.5)',
                boxShadow:
                  activeCategory === cat
                    ? '0 4px 16px rgba(20,40,100,0.22)'
                    : 'none',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col justify-center px-5 pb-14 pt-3">
          <div
            className="relative w-full max-w-sm mx-auto"
            style={{ aspectRatio: '3/4' }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`${currentQuestion?.id}-${currentIndex}`}
                custom={direction}
                initial={{ opacity: 0, y: 36, scale: 0.94, rotate: direction > 0 ? 2 : -2 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, x: -120 * direction, scale: 0.9, rotate: -4 * direction }}
                transition={{ type: "spring", stiffness: 270, damping: 24 }}
                className="absolute inset-0 rounded-3xl overflow-hidden"
                style={{
                  background: currentQuestion
                    ? (cardBg[currentQuestion.category] || cardBg["All"])
                    : cardBg["All"],
                  border: '1px solid rgba(180,215,255,0.6)',
                  boxShadow: '0 20px 60px rgba(60,100,220,0.13), 0 6px 20px rgba(0,0,0,0.04)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {/* Ambient orb inside card */}
                <div
                  className="absolute top-0 right-0 w-40 h-40 -mr-12 -mt-12 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(130,175,255,0.35) 0%, transparent 70%)',
                    filter: 'blur(24px)',
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 relative z-10">
                  {/* Category badge */}
                  <div className="absolute top-7 left-0 right-0 flex justify-center">
                    <span
                      className="text-[9px] uppercase tracking-[0.14em] font-bold px-4 py-1.5 rounded-full"
                      style={{
                        background: 'rgba(80,120,220,0.12)',
                        color: 'hsl(222,50%,48%)',
                      }}
                    >
                      {currentQuestion?.category}
                    </span>
                  </div>

                  <MessageCircleHeart
                    className="w-10 h-10 mb-7"
                    style={{ color: 'rgba(100,140,255,0.25)' }}
                  />

                  <h2
                    className="font-serif font-semibold leading-snug"
                    style={{ fontSize: '1.45rem', color: 'hsl(220,28%,18%)' }}
                  >
                    "{currentQuestion?.text}"
                  </h2>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next button */}
          <div className="mt-10 flex justify-center">
            <motion.button
              onClick={handleNext}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.03 }}
              disabled={filteredQuestions.length === 0}
              className="flex items-center gap-3 px-8 h-14 rounded-full font-semibold text-sm text-white"
              style={{
                background: 'linear-gradient(135deg, hsl(224,70%,55%), hsl(214,80%,65%))',
                boxShadow: '0 10px 36px rgba(80,120,220,0.35), 0 2px 8px rgba(0,0,0,0.08)',
                letterSpacing: '0.02em',
              }}
            >
              <RefreshCw className="w-4.5 h-4.5" />
              Next Question
            </motion.button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}