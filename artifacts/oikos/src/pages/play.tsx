import { useState } from "react";
import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import PremiumCard from "@/components/PremiumCard";
import PillTag from "@/components/PillTag";
import { mockQuestions } from "@/data/mock";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircleHeart, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = ["All", "Deep Questions", "Conversation Starters", "Would You Rather"];

export default function PlayPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredQuestions = activeCategory === "All" 
    ? mockQuestions 
    : mockQuestions.filter(q => q.category === activeCategory);

  const currentQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  return (
    <AppShell>
      <div className="min-h-full flex flex-col">
        <SectionHeader 
          title="Play" 
          subtitle="Discover each other, again"
        />

        {/* Categories Horizontal Scroll */}
        <div className="pt-4 pb-2 px-6 flex overflow-x-auto gap-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentIndex(0);
              }}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all",
                activeCategory === cat 
                  ? "bg-foreground text-background shadow-md" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 p-6 flex flex-col justify-center pb-24">
          <div className="relative w-full max-w-sm mx-auto aspect-[3/4]">
            {filteredQuestions.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentQuestion.id}-${currentIndex}`}
                  initial={{ opacity: 0, y: 50, scale: 0.9, rotate: -2 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, x: -100, scale: 0.9, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute inset-0"
                >
                  <PremiumCard className="w-full h-full p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-card to-card shadow-xl shadow-primary/10 border-border/60">
                    <PillTag icon={<Sparkles className="w-3 h-3" />} variant="primary" className="absolute top-6">
                      {currentQuestion.category}
                    </PillTag>
                    
                    <MessageCircleHeart className="w-12 h-12 text-secondary-foreground/30 mb-6" />
                    
                    <h2 className="text-2xl md:text-3xl font-serif font-medium text-foreground leading-snug">
                      "{currentQuestion.text}"
                    </h2>
                  </PremiumCard>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-muted-foreground">No questions in this category.</p>
              </div>
            )}
          </div>

          <div className="mt-12 flex justify-center">
            <Button 
              size="lg" 
              className="rounded-full shadow-lg hover:shadow-xl transition-all h-14 px-8 text-base gap-3"
              onClick={handleNext}
              disabled={filteredQuestions.length === 0}
            >
              <RefreshCw className="w-5 h-5" />
              Next Question
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
