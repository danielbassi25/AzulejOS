import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import PremiumCard from "@/components/PremiumCard";
import PillTag from "@/components/PillTag";
import { mockMemories } from "@/data/mock";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { MapPin } from "lucide-react";

export default function SaudadePage() {
  return (
    <AppShell>
      <SectionHeader 
        title="Saudade" 
        subtitle="The presence of absence"
      />
      
      <div className="p-6 relative">
        {/* Timeline line */}
        <div className="absolute left-10 top-8 bottom-8 w-px bg-border/60" />

        <div className="space-y-8">
          {mockMemories.map((memory, idx) => (
            <motion.div 
              key={memory.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative pl-12"
            >
              {/* Timeline dot */}
              <div className="absolute left-[11px] top-6 w-3 h-3 rounded-full bg-primary ring-4 ring-background z-10" />
              
              <Link href={`/saudade/${memory.id}`} className="block focus:outline-none">
                <PremiumCard className="overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                  <div className="h-32 w-full relative">
                    <img 
                      src={memory.imageUrl} 
                      alt={memory.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <h3 className="absolute bottom-3 left-4 right-4 text-white font-display font-bold text-xl leading-tight">
                      {memory.title}
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-primary">{memory.date}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {memory.location}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2">
                      {memory.preview}
                    </p>
                  </div>
                </PremiumCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
