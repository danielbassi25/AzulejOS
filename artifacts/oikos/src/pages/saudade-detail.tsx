import AppShell from "@/components/AppShell";
import { mockMemories } from "@/data/mock";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Heart } from "lucide-react";
import PillTag from "@/components/PillTag";
import PremiumCard from "@/components/PremiumCard";

export default function SaudadeDetailPage() {
  const [, params] = useRoute("/saudade/:id");
  const memory = mockMemories.find(m => m.id === params?.id) || mockMemories[0];

  return (
    <AppShell>
      <div className="relative">
        {/* Header Hero Image */}
        <div className="h-72 md:h-96 w-full relative">
          <img 
            src={memory.imageUrl} 
            alt={memory.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />
          
          <Link href="/saudade" className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        {/* Content */}
        <div className="px-6 -mt-16 relative z-10 space-y-6 pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PremiumCard className="p-6">
              <h1 className="text-3xl font-display font-bold text-foreground leading-tight mb-4">
                {memory.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3">
                <PillTag icon={<Calendar className="w-3 h-3" />} variant="outline">
                  {memory.date}
                </PillTag>
                <PillTag icon={<MapPin className="w-3 h-3" />} variant="primary">
                  {memory.location}
                </PillTag>
              </div>
            </PremiumCard>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="px-2"
          >
            <p className="text-base md:text-lg leading-relaxed text-foreground/90 font-serif">
              {memory.content}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-3 px-2 flex items-center gap-2">
              <Heart className="w-4 h-4 text-secondary-foreground" /> 
              Inside Jokes
            </h3>
            <div className="grid gap-3">
              {memory.insideJokes.map((joke, idx) => (
                <PremiumCard key={idx} className="p-4 bg-secondary/10 border-secondary/20">
                  <p className="font-medium text-foreground">{joke}</p>
                </PremiumCard>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
