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
    <div className="absolute bottom-0 left-0 right-0 z-50 px-4 pb-5 pt-3">
      <nav
        className="flex items-center justify-between rounded-2xl px-3 py-2.5"
        style={{
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.9)',
          boxShadow: '0 8px 32px rgba(107,140,255,0.12), 0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.6) inset',
        }}
      >
        {navItems.map((item) => {
          const isActive = location === item.path || (location.startsWith(item.path + "/") && item.path !== "/system");
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className="relative flex-1 flex flex-col items-center justify-center gap-0.5 py-1 cursor-pointer select-none"
            >
              <div className="relative flex items-center justify-center">
                {isActive && (
                  <motion.div
                    layoutId="nav-bubble"
                    className="absolute inset-0 rounded-full"
                    style={{
                      width: 36,
                      height: 36,
                      marginLeft: -8,
                      marginTop: -8,
                      background: 'linear-gradient(135deg, rgba(107,140,255,0.18), rgba(175,203,255,0.25))',
                      boxShadow: '0 2px 8px rgba(107,140,255,0.2)',
                    }}
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
                <Icon
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={cn(
                    "w-5 h-5 transition-all duration-300 relative z-10",
                    isActive ? "text-primary" : "text-muted-foreground/70"
                  )}
                />
              </div>
              <span className={cn(
                "text-[9.5px] font-semibold tracking-wide transition-all duration-300",
                isActive ? "text-primary" : "text-muted-foreground/60"
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