import { useState } from "react";
import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockQuestions } from "@/data/mock";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircleHeart, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["All", "Deep Questions", "Conversation Starters", "Would You Rather"];

const categoryColors: Record<string, string> = {
  "Deep Questions": "rgba(107,140,255,0.12)",
  "Conversation Starters": "rgba(247,200,224,0.3)",
  "Would You Rather": "rgba(175,203,255,0.25)",
  "All": "rgba(107,140,255,0.08)",
};

export default function PlayPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const filteredQuestions = activeCategory === "All"
    ? mockQuestions
    : mockQuestions.filter(q => q.category === activeCategory);

  const currentQuestion = filteredQuestions[currentIndex % filteredQuestions.length] || filteredQuestions[0];

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  return (
    <AppShell>
      <div className="min-h-full flex flex-col">
        <SectionHeader title="Play" subtitle="Discover each other, again" />

        {/* Categories */}
        <div className="pt-5 pb-3 px-5 flex overflow-x-auto gap-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setCurrentIndex(0); }}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border",
                activeCategory === cat
                  ? "bg-foreground text-white border-transparent shadow-md"
                  : "bg-white/80 text-muted-foreground border-border/40 hover:border-primary/30"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col justify-center px-5 pb-16 pt-2">
          <div className="relative w-full max-w-sm mx-auto" style={{ aspectRatio: '3/4' }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`${currentQuestion?.id}-${currentIndex}`}
                custom={direction}
                initial={{ opacity: 0, y: 40, scale: 0.94, rotate: direction > 0 ? 2 : -2 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, x: -120 * direction, scale: 0.9, rotate: -4 * direction }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="absolute inset-0 rounded-3xl overflow-hidden"
                style={{
                  background: currentQuestion ? categoryColors[currentQuestion.category] || 'white' : 'white',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 20px 60px rgba(107,140,255,0.15), 0 8px 24px rgba(0,0,0,0.06)',
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
                  {/* Category badge */}
                  <div
                    className="absolute top-6 left-0 right-0 flex justify-center"
                  >
                    <span className="text-[10px] uppercase tracking-widest font-bold text-primary/60 px-4 py-1.5 rounded-full" style={{ background: 'rgba(107,140,255,0.1)' }}>
                      {currentQuestion?.category}
                    </span>
                  </div>

                  <MessageCircleHeart
                    className="w-10 h-10 mb-6 text-primary/20"
                  />

                  <h2 className="font-serif text-2xl font-semibold text-foreground/90 leading-snug">
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
              className="flex items-center gap-3 px-8 h-14 rounded-full font-semibold text-base text-white transition-all"
              style={{
                background: 'linear-gradient(135deg, hsl(228,100%,68%), hsl(228,100%,75%))',
                boxShadow: '0 8px 32px rgba(107,140,255,0.35), 0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <RefreshCw className="w-5 h-5" />
              Next Question
            </motion.button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}