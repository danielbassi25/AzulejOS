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
    <div className="absolute bottom-0 left-0 right-0 z-50 px-5 pb-6 pt-2">
      <nav
        className="flex items-center justify-between rounded-[22px] px-3 py-2"
        style={{
          background: 'rgba(230,238,255,0.78)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(200,220,255,0.7)',
          boxShadow: '0 8px 40px rgba(80,110,220,0.14), 0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px rgba(255,255,255,0.8) inset',
        }}
      >
        {navItems.map((item) => {
          const isActive =
            location === item.path ||
            (location.startsWith(item.path + "/") && item.path !== "/system");
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
                    className="absolute rounded-2xl"
                    style={{
                      width: 40,
                      height: 32,
                      marginLeft: -10,
                      marginTop: -6,
                      background: 'linear-gradient(135deg, rgba(100,140,255,0.22), rgba(160,195,255,0.28))',
                      boxShadow: '0 2px 12px rgba(80,120,255,0.22), 0 0 0 1px rgba(255,255,255,0.5) inset',
                    }}
                    transition={{ type: "spring", bounce: 0.22, duration: 0.45 }}
                  />
                )}
                <Icon
                  strokeWidth={isActive ? 2.2 : 1.6}
                  className={cn(
                    "w-[18px] h-[18px] transition-all duration-300 relative z-10",
                    isActive
                      ? "text-[hsl(224,80%,52%)]"
                      : "text-[hsl(218,20%,58%)]"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[9px] font-semibold tracking-wider transition-all duration-300 uppercase",
                  isActive
                    ? "text-[hsl(224,80%,52%)]"
                    : "text-[hsl(218,18%,62%)]"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}