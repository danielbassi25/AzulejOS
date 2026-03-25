import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockScore } from "@/data/mock";
import { motion } from "framer-motion";
import { Trophy, Star } from "lucide-react";
import confetti from "canvas-confetti";

export default function ScorePage() {
  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.55 },
      colors: ['#6B8CFF', '#93B4FF', '#B0CFFF', '#D0E6FF', '#E8F3FF', '#FFD700'],
    });
  };

  const totalPoints = mockScore.daniel + mockScore.sofia;
  const danielPercent = (mockScore.daniel / totalPoints) * 100;
  const sofiaPercent = (mockScore.sofia / totalPoints) * 100;

  return (
    <AppShell>
      <div className="relative min-h-full">
        {/* Top ambient gradient */}
        <div
          className="absolute top-0 left-0 right-0 h-60 -z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(160deg, rgba(120,165,255,0.18) 0%, rgba(160,200,255,0.12) 100%)',
          }}
        />

        <SectionHeader
          title="Score"
          subtitle="A friendly competition"
          action={
            <motion.button
              onClick={triggerConfetti}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.07 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(100,140,255,0.12)',
                border: '1px solid rgba(140,180,255,0.3)',
              }}
            >
              <Trophy className="w-4 h-4" style={{ color: 'hsl(224,65%,54%)' }} />
            </motion.button>
          }
        />

        <div className="p-5 space-y-6 pb-20">
          {/* Scoreboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
          >
            <div
              className="p-6 rounded-2xl"
              style={{
                background: 'rgba(243,249,255,0.96)',
                border: '1px solid rgba(180,210,255,0.55)',
                boxShadow: '0 10px 36px rgba(80,120,220,0.09), 0 2px 6px rgba(0,0,0,0.03), 0 0 0 1px rgba(255,255,255,0.95) inset',
              }}
            >
              <div className="flex justify-between items-center mb-8 relative">
                {/* Daniel */}
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div
                    className="w-16 h-16 rounded-full overflow-hidden"
                    style={{
                      border: '2px solid rgba(180,210,255,0.7)',
                      boxShadow: '0 4px 16px rgba(80,120,220,0.16)',
                    }}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}images/avatar-daniel.png`}
                      alt="Daniel"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: 'hsl(220,22%,22%)' }}
                  >
                    Daniel
                  </p>
                  <p
                    className="font-serif font-bold"
                    style={{ fontSize: '2rem', letterSpacing: '-0.04em', color: 'hsl(224,70%,54%)' }}
                  >
                    {mockScore.daniel}
                  </p>
                </div>

                {/* VS */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold z-0"
                  style={{
                    background: 'rgba(200,218,255,0.5)',
                    border: '1px solid rgba(180,210,255,0.6)',
                    color: 'hsl(218,30%,52%)',
                  }}
                >
                  VS
                </div>

                {/* Sofia */}
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className="relative">
                    <div
                      className="w-16 h-16 rounded-full overflow-hidden"
                      style={{
                        border: '2px solid rgba(140,185,255,0.7)',
                        boxShadow: '0 4px 20px rgba(80,140,255,0.22)',
                      }}
                    >
                      <img
                        src={`${import.meta.env.BASE_URL}images/avatar-sofia.png`}
                        alt="Sofia"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <motion.div
                      className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                        boxShadow: '0 2px 10px rgba(255,165,0,0.4)',
                      }}
                      animate={{ rotate: [0, 6, -6, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity }}
                    >
                      <Trophy className="w-3.5 h-3.5 text-white fill-white" />
                    </motion.div>
                  </div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: 'hsl(220,22%,22%)' }}
                  >
                    Sofia
                  </p>
                  <p
                    className="font-serif font-bold"
                    style={{ fontSize: '2rem', letterSpacing: '-0.04em', color: 'hsl(218,45%,42%)' }}
                  >
                    {mockScore.sofia}
                  </p>
                </div>
              </div>

              {/* Layered progress bar */}
              <div
                className="h-3 w-full rounded-full flex overflow-hidden"
                style={{ background: 'rgba(200,220,255,0.3)' }}
              >
                <motion.div
                  className="h-full rounded-l-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${danielPercent}%` }}
                  transition={{ duration: 1.2, ease: [0.34, 1.1, 0.64, 1], delay: 0.3 }}
                  style={{
                    background: 'linear-gradient(90deg, hsl(224,70%,60%), hsl(216,80%,68%))',
                    boxShadow: '0 0 10px rgba(100,140,255,0.4)',
                  }}
                />
                <motion.div
                  className="h-full rounded-r-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${sofiaPercent}%` }}
                  transition={{ duration: 1.2, ease: [0.34, 1.1, 0.64, 1], delay: 0.3 }}
                  style={{
                    background: 'linear-gradient(90deg, hsl(210,60%,72%), hsl(205,70%,78%))',
                    boxShadow: '0 0 10px rgba(140,190,255,0.4)',
                  }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: 'hsl(224,55%,55%)' }}
                >
                  {danielPercent.toFixed(0)}%
                </span>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: 'hsl(210,45%,52%)' }}
                >
                  {sofiaPercent.toFixed(0)}%
                </span>
              </div>
            </div>
          </motion.div>

          {/* Milestones */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trophy
                className="w-4 h-4"
                style={{ color: 'hsl(224,60%,56%)' }}
              />
              <h3
                className="text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{ color: 'hsl(218,25%,48%)' }}
              >
                Milestones
              </h3>
            </div>
            <div className="space-y-3">
              {mockScore.milestones.map((milestone, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + idx * 0.1 }}
                >
                  <div
                    className="p-4 rounded-xl flex items-center justify-between gap-4"
                    style={{
                      background: milestone.winner
                        ? 'linear-gradient(135deg, rgba(180,215,255,0.35), rgba(160,200,255,0.2))'
                        : 'rgba(243,249,255,0.95)',
                      border: milestone.winner
                        ? '1px solid rgba(160,200,255,0.55)'
                        : '1px solid rgba(190,215,255,0.5)',
                      boxShadow: milestone.winner
                        ? 'none'
                        : '0 2px 12px rgba(80,120,220,0.05), 0 0 0 1px rgba(255,255,255,0.9) inset',
                    }}
                  >
                    <div>
                      <p className="font-medium text-sm text-foreground">{milestone.title}</p>
                      {milestone.winner ? (
                        <p
                          className="text-xs mt-0.5 font-semibold"
                          style={{ color: 'hsl(218,45%,44%)' }}
                        >
                          Won by {milestone.winner} 🏆
                        </p>
                      ) : (
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: 'hsl(218,18%,58%)' }}
                        >
                          In progress...
                        </p>
                      )}
                    </div>
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-bold text-sm"
                      style={{
                        background: 'rgba(190,215,255,0.4)',
                        color: 'hsl(222,40%,38%)',
                      }}
                    >
                      {milestone.target}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star
                className="w-4 h-4"
                style={{ color: 'hsl(224,60%,56%)' }}
              />
              <h3
                className="text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{ color: 'hsl(218,25%,48%)' }}
              >
                Recent Activity
              </h3>
            </div>
            <div className="space-y-3">
              {mockScore.recentActivities.map((activity, idx) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + idx * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      background:
                        activity.user === 'Sofia'
                          ? 'hsl(210,70%,65%)'
                          : 'hsl(224,70%,62%)',
                    }}
                  />
                  <div className="flex-1">
                    <p
                      className="text-sm"
                      style={{ color: 'hsl(220,22%,28%)' }}
                    >
                      <span className="font-semibold">{activity.user}</span>{' '}
                      <span className="font-light" style={{ color: 'hsl(218,18%,52%)' }}>
                        {activity.action}
                      </span>
                    </p>
                    <p
                      className="text-[10px] mt-0.5 font-medium"
                      style={{ color: 'hsl(218,18%,62%)' }}
                    >
                      {activity.date}
                    </p>
                  </div>
                  <div
                    className="text-xs font-bold px-2.5 py-1 rounded-lg shrink-0"
                    style={{
                      background: 'rgba(100,140,255,0.10)',
                      color: 'hsl(224,65%,54%)',
                    }}
                  >
                    +{activity.points}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}