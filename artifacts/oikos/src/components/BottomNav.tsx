import { Link, useLocation } from "wouter";
import { Home, Heart, Mail, Target, Dices, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { path: "/dashboard", icon: Home, label: "Home", activeBg: 'hsl(218, 70%, 28%)' },
  { path: "/saudade", icon: Heart, label: "Saudade", activeBg: 'hsl(338, 45%, 38%)' },
  { path: "/letters", icon: Mail, label: "Tiles", activeBg: 'hsl(218, 70%, 28%)' },
  { path: "/build", icon: Target, label: "Build", activeBg: 'hsl(218, 70%, 28%)' },
  { path: "/play", icon: Dices, label: "Play", activeBg: 'hsl(218, 70%, 28%)' },
  { path: "/score", icon: Trophy, label: "Score", activeBg: 'hsl(218, 70%, 28%)' },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <div className="shrink-0 z-50">
      {/* Thin grout line */}
      <div style={{ height: '1px', background: 'rgba(30,60,130,0.10)' }} />
      <nav
        className="flex items-stretch"
        style={{
          background: 'hsl(38, 28%, 99%)',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
        }}
      >
        {navItems.map((item, i) => {
          const isActive =
            location === item.path ||
            (location.startsWith(item.path + "/") && item.path !== "/dashboard");
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className="relative flex-1 flex flex-col items-center justify-center py-2 select-none"
              style={{
                borderRight: i < navItems.length - 1 ? '1px solid rgba(30,60,130,0.07)' : 'none',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0"
                  style={{ background: item.activeBg }}
                  transition={{ type: "spring", bounce: 0.12, duration: 0.38 }}
                />
              )}
              <Icon
                strokeWidth={1.5}
                className="relative z-10"
                style={{
                  width: 17,
                  height: 17,
                  color: isActive ? 'hsl(42, 30%, 94%)' : 'hsl(220, 22%, 56%)',
                }}
              />
              <span
                className="relative z-10 mt-1 font-semibold uppercase"
                style={{
                  fontSize: '7px',
                  letterSpacing: '0.08em',
                  color: isActive ? 'rgba(220, 210, 190, 0.72)' : 'hsl(220, 18%, 62%)',
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
