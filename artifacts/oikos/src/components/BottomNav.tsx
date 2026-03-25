import { Link, useLocation } from "wouter";
import { Home, Heart, Mail, Target, Dices, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/system", icon: Home, label: "System" },
  { path: "/saudade", icon: Heart, label: "Saudade" },
  { path: "/letters", icon: Mail, label: "Letters" },
  { path: "/build", icon: Target, label: "Build" },
  { path: "/play", icon: Dices, label: "Play" },
  { path: "/score", icon: Trophy, label: "Score" },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:absolute md:bottom-4 md:left-4 md:right-4 flex justify-center">
      <nav className="w-full md:w-auto bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t md:border border-border/50 md:rounded-full px-2 py-3 md:py-2 flex items-center justify-between md:justify-center md:gap-2 md:shadow-lg md:shadow-primary/5">
        {navItems.map((item) => {
          // Precise matching for root or details
          const isActive = location === item.path || (location.startsWith(item.path) && item.path !== "/system");
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path} className="relative group flex-1 md:flex-none flex flex-col items-center justify-center w-14 h-12 md:w-16 md:h-12 cursor-pointer tap-highlight-transparent">
              <div className="relative flex items-center justify-center z-10">
                {isActive && (
                  <motion.div
                    layoutId="bubble"
                    className="absolute inset-0 bg-primary/10 rounded-full w-10 h-10 -ml-2 -mt-2"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={cn(
                    "w-[22px] h-[22px] transition-colors duration-300",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} 
                />
              </div>
              <span className={cn(
                "text-[10px] mt-1 font-medium transition-all duration-300 z-10",
                isActive ? "text-primary opacity-100" : "text-muted-foreground opacity-70"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
