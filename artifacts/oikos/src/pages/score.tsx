import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockScore } from "@/data/mock";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import confetti from "canvas-confetti";

export default function ScorePage() {
  const triggerConfetti = () => {
    confetti({
      particleCount: 110,
      spread: 68,
      origin: { y: 0.50 },
      colors: ['#1e3c82', '#2e5cbf', '#4878d4', '#f5f0e8', '#d4bc8a', '#FFD700'],
    });
  };

  const totalPoints = mockScore.daniel + mockScore.sofia;
  const danielPercent = (mockScore.daniel / totalPoints) * 100;
  const sofiaPercent = (mockScore.sofia / totalPoints) * 100;

  return (
    <AppShell>
      <SectionHeader
        title="Score"
        subtitle="A friendly competition"
        action={
          <motion.button
            onClick={triggerConfetti}
            whileTap={{ scale: 0.93 }}
            whileHover={{ y: -1 }}
            className="flex items-center gap-2 px-3 py-2 font-sans font-bold uppercase tracking-widest"
            style={{
              fontSize: '8px',
              background: 'rgba(255,252,245,0.10)',
              border: '1px solid rgba(255,252,245,0.18)',
              borderRadius: '3px',
              color: 'rgba(215,205,185,0.72)',
              letterSpacing: '0.12em',
            }}
          >
            <Trophy className="w-3.5 h-3.5" />
            Celebrate
          </motion.button>
        }
      />

      <div className="p-4 pb-20 space-y-3">

        {/* Scoreboard mosaic — two side-by-side tiles, no pattern, let color speak */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 gap-3"
        >
          {/* Daniel — warm ivory ceramic */}
          <div
            className="p-6 flex flex-col items-center text-center"
            style={{
              background: 'hsl(38, 28%, 97%)',
              border: '1px solid rgba(30,60,130,0.09)',
              borderRadius: '4px',
              boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 2px 4px 14px rgba(20,40,100,0.07)',
            }}
          >
            <div
              className="w-14 h-14 rounded-full overflow-hidden mb-3"
              style={{
                border: '2px solid hsl(218,70%,28%)',
                boxShadow: '0 3px 12px rgba(20,40,100,0.18)',
              }}
            >
              <img src={`${import.meta.env.BASE_URL}images/avatar-daniel.png`} alt="Daniel" className="w-full h-full object-cover" />
            </div>
            <p className="font-sans font-bold uppercase tracking-widest mb-2" style={{ fontSize: '8.5px', color: 'hsl(220,22%,52%)' }}>
              Daniel
            </p>
            <p
              className="font-serif font-bold"
              style={{ fontSize: '3rem', letterSpacing: '-0.06em', lineHeight: 1, color: 'hsl(218,70%,28%)' }}
            >
              {mockScore.daniel}
            </p>
            <p className="font-sans mt-2 uppercase tracking-widest" style={{ fontSize: '8px', color: 'hsl(220,18%,62%)' }}>
              points
            </p>
          </div>

          {/* Sofia — deep cobalt, clean (no pattern — color is enough) */}
          <div
            className="relative p-6 flex flex-col items-center text-center overflow-hidden"
            style={{
              background: 'linear-gradient(155deg, hsl(220,70%,26%) 0%, hsl(218,72%,30%) 100%)',
              border: '1px solid rgba(15,45,115,0.50)',
              borderRadius: '4px',
              boxShadow: '3px 5px 18px rgba(12,25,72,0.26)',
            }}
          >
            {/* Subtle warm top glow */}
            <div
              className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, rgba(255,252,245,0.05) 0%, transparent 100%)' }}
            />
            <div className="relative mb-3">
              <div
                className="w-14 h-14 rounded-full overflow-hidden"
                style={{
                  border: '2px solid rgba(220,210,192,0.45)',
                  boxShadow: '0 3px 14px rgba(10,20,60,0.30)',
                }}
              >
                <img src={`${import.meta.env.BASE_URL}images/avatar-sofia.png`} alt="Sofia" className="w-full h-full object-cover" />
              </div>
              <motion.div
                className="absolute -top-1.5 -right-1.5 w-7 h-7 flex items-center justify-center"
                style={{ background: '#FFD700', borderRadius: '3px', boxShadow: '0 2px 8px rgba(180,130,0,0.40)' }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Trophy className="w-3.5 h-3.5 fill-current" style={{ color: 'hsl(35,30%,22%)' }} />
              </motion.div>
            </div>
            <p className="font-sans font-bold uppercase tracking-widest mb-2" style={{ fontSize: '8.5px', color: 'rgba(195,182,160,0.58)' }}>
              Sofia
            </p>
            <p
              className="font-serif font-bold"
              style={{ fontSize: '3rem', letterSpacing: '-0.06em', lineHeight: 1, color: 'hsl(42,32%,96%)' }}
            >
              {mockScore.sofia}
            </p>
            <p className="font-sans mt-2 uppercase tracking-widest" style={{ fontSize: '8px', color: 'rgba(175,162,142,0.40)' }}>
              points
            </p>
          </div>
        </motion.div>

        {/* Progress bar tile — clean ceramic */}
        <div
          className="px-5 py-4 flex items-center gap-3"
          style={{
            background: 'hsl(38,30%,99%)',
            border: '1px solid rgba(30,60,130,0.09)',
            borderRadius: '4px',
            boxShadow: '0 1px 0 rgba(255,255,255,0.90) inset, 2px 3px 10px rgba(20,40,100,0.06)',
          }}
        >
          <span className="font-sans font-bold uppercase tracking-widest shrink-0" style={{ fontSize: '8.5px', color: 'hsl(218,55%,38%)', minWidth: 30 }}>
            {danielPercent.toFixed(0)}%
          </span>
          <div className="flex-1 flex overflow-hidden" style={{ height: 10, borderRadius: '2px', background: 'hsl(40,20%,90%)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${danielPercent}%` }}
              transition={{ duration: 1.1, ease: [0.34, 1.1, 0.64, 1], delay: 0.2 }}
              style={{ height: '100%', background: 'hsl(218,65%,38%)', borderRadius: '2px 0 0 2px' }}
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${sofiaPercent}%` }}
              transition={{ duration: 1.1, ease: [0.34, 1.1, 0.64, 1], delay: 0.2 }}
              style={{ height: '100%', background: 'hsl(38,48%,64%)', borderRadius: '0 2px 2px 0' }}
            />
          </div>
          <span className="font-sans font-bold uppercase tracking-widest shrink-0 text-right" style={{ fontSize: '8.5px', color: 'hsl(38,42%,48%)', minWidth: 30 }}>
            {sofiaPercent.toFixed(0)}%
          </span>
        </div>

        {/* Milestones */}
        <div>
          <div className="flex items-center gap-3 py-3">
            <div style={{ width: 20, height: 1, background: 'rgba(30,60,130,0.18)' }} />
            <p className="font-sans font-semibold uppercase tracking-[0.18em]" style={{ fontSize: '8.5px', color: 'hsl(220,20%,58%)' }}>
              Milestones
            </p>
            <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.09)' }} />
          </div>
          <div className="space-y-2">
            {mockScore.milestones.map((milestone, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + idx * 0.08, duration: 0.40 }}
              >
                <div
                  className="px-5 py-4 flex items-center justify-between gap-4"
                  style={{
                    background: milestone.winner ? 'hsl(218,68%,27%)' : 'hsl(38,30%,99%)',
                    border: milestone.winner ? '1px solid rgba(15,45,115,0.42)' : '1px solid rgba(30,60,130,0.09)',
                    borderRadius: '4px',
                    boxShadow: milestone.winner
                      ? '1px 2px 10px rgba(12,25,72,0.20)'
                      : '0 1px 0 rgba(255,255,255,0.90) inset, 2px 3px 8px rgba(20,40,100,0.05)',
                  }}
                >
                  <div>
                    <p
                      className="font-sans font-medium"
                      style={{ fontSize: '0.875rem', color: milestone.winner ? 'hsl(42,30%,93%)' : 'hsl(222,38%,18%)' }}
                    >
                      {milestone.title}
                    </p>
                    {milestone.winner ? (
                      <p className="font-sans font-semibold mt-0.5" style={{ fontSize: '0.72rem', color: 'rgba(195,182,160,0.58)' }}>
                        Won by {milestone.winner} ✦
                      </p>
                    ) : (
                      <p className="font-sans mt-0.5" style={{ fontSize: '0.72rem', color: 'hsl(220,16%,56%)' }}>
                        In progress...
                      </p>
                    )}
                  </div>
                  <div
                    className="w-11 h-11 flex items-center justify-center shrink-0 font-serif font-semibold"
                    style={{
                      fontSize: '0.92rem',
                      borderRadius: '4px',
                      background: milestone.winner ? 'rgba(255,252,245,0.10)' : 'hsl(40,22%,92%)',
                      border: milestone.winner ? '1px solid rgba(175,162,140,0.18)' : '1px solid rgba(30,60,130,0.08)',
                      color: milestone.winner ? 'rgba(215,205,188,0.75)' : 'hsl(222,38%,28%)',
                    }}
                  >
                    {milestone.target}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity — clean striped list, no noise */}
        <div>
          <div className="flex items-center gap-3 py-3">
            <div style={{ width: 20, height: 1, background: 'rgba(30,60,130,0.18)' }} />
            <p className="font-sans font-semibold uppercase tracking-[0.18em]" style={{ fontSize: '8.5px', color: 'hsl(220,20%,58%)' }}>
              Recent Activity
            </p>
            <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.09)' }} />
          </div>
          <div
            style={{
              border: '1px solid rgba(30,60,130,0.09)',
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 2px 3px 10px rgba(20,40,100,0.05)',
            }}
          >
            {mockScore.recentActivities.map((activity, idx) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.18 + idx * 0.05 }}
                className="flex items-center gap-3 px-5 py-3.5"
                style={{
                  background: idx % 2 === 0 ? 'hsl(38,30%,99%)' : 'hsl(40,20%,97%)',
                  borderBottom: idx < mockScore.recentActivities.length - 1 ? '1px solid rgba(30,60,130,0.06)' : 'none',
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: activity.user === 'Sofia' ? 'hsl(38,48%,58%)' : 'hsl(218,60%,42%)' }}
                />
                <div className="flex-1">
                  <p className="font-sans" style={{ fontSize: '0.84rem', color: 'hsl(222,32%,24%)' }}>
                    <span className="font-semibold">{activity.user}</span>
                    {' '}
                    <span className="font-light" style={{ color: 'hsl(220,16%,52%)' }}>{activity.action}</span>
                  </p>
                  <p className="font-sans font-medium mt-0.5" style={{ fontSize: '0.70rem', color: 'hsl(220,14%,62%)' }}>
                    {activity.date}
                  </p>
                </div>
                <div
                  className="font-sans font-bold px-2 py-1 shrink-0"
                  style={{
                    fontSize: '9px',
                    background: 'hsl(218,70%,28%)',
                    color: 'hsl(42,30%,94%)',
                    borderRadius: '2px',
                  }}
                >
                  +{activity.points}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
