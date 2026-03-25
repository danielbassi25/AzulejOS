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
    <div className="absolute bottom-0 left-0 right-0 z-50">
      {/* Thin border line — architectural, like a tile grout line */}
      <div style={{ height: '1px', background: 'rgba(30,60,130,0.12)' }} />
      <nav
        className="flex items-stretch"
        style={{
          background: 'hsl(38, 25%, 99%)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
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
              className="relative flex-1 flex flex-col items-center justify-center py-3 cursor-pointer select-none"
              style={{
                background: isActive ? 'hsl(218, 70%, 28%)' : 'transparent',
                transition: 'background 0.25s ease',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active-tile"
                  className="absolute inset-0"
                  style={{ background: 'hsl(218, 70%, 28%)' }}
                  transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                />
              )}
              <Icon
                strokeWidth={isActive ? 2 : 1.5}
                className="relative z-10 transition-all duration-250"
                style={{
                  width: 18,
                  height: 18,
                  color: isActive ? 'hsl(42, 30%, 95%)' : 'hsl(220, 25%, 52%)',
                }}
              />
              <span
                className="relative z-10 mt-1 font-semibold uppercase tracking-widest"
                style={{
                  fontSize: '8px',
                  letterSpacing: '0.10em',
                  color: isActive ? 'hsl(42, 25%, 85%)' : 'hsl(220, 20%, 58%)',
                }}
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
