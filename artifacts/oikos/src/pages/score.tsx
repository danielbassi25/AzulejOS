import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockScore } from "@/data/mock";
import { motion } from "framer-motion";
import { Trophy, Star } from "lucide-react";
import confetti from "canvas-confetti";

const azulejoPattern = `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.14'%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3Cline x1='12' y1='0' x2='12' y2='8'/%3E%3Cline x1='12' y1='16' x2='12' y2='24'/%3E%3Cline x1='0' y1='12' x2='8' y2='12'/%3E%3Cline x1='16' y1='12' x2='24' y2='12'/%3E%3C/g%3E%3C/svg%3E")`;

export default function ScorePage() {
  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.55 },
      colors: ['#1e3c82', '#2952a3', '#4472c4', '#f5f0e8', '#d4bc8a', '#FFD700'],
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
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.06 }}
            className="flex items-center gap-2 px-3 py-2 font-bold text-[9px] uppercase tracking-widest"
            style={{
              background: 'rgba(255,252,245,0.12)',
              border: '1px solid rgba(255,252,245,0.22)',
              borderRadius: '3px',
              color: 'rgba(220,210,190,0.85)',
            }}
          >
            <Trophy className="w-3.5 h-3.5" />
            Celebrate
          </motion.button>
        }
      />

      <div className="p-3 pb-20 space-y-2.5">

        {/* Mosaic scoreboard — side by side tiles */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 24 }}
          className="grid grid-cols-2 gap-2.5"
        >
          {/* Daniel tile — beige warm */}
          <div
            className="p-5 flex flex-col items-center text-center"
            style={{
              background: 'hsl(40, 35%, 93%)',
              border: '1px solid rgba(30,60,130,0.12)',
              borderRadius: '3px',
              boxShadow: '2px 3px 10px rgba(20,40,100,0.07)',
            }}
          >
            <div
              className="w-14 h-14 rounded-full overflow-hidden mb-3"
              style={{
                border: '2px solid hsl(218,70%,28%)',
                boxShadow: '0 3px 10px rgba(20,40,100,0.18)',
              }}
            >
              <img src={`${import.meta.env.BASE_URL}images/avatar-daniel.png`} alt="Daniel" className="w-full h-full object-cover" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'hsl(220,25%,48%)' }}>Daniel</p>
            <p className="font-serif font-bold" style={{ fontSize: '2.8rem', letterSpacing: '-0.05em', lineHeight: 1, color: 'hsl(218,70%,28%)' }}>
              {mockScore.daniel}
            </p>
            <p className="text-[9px] font-semibold mt-2 uppercase tracking-widest" style={{ color: 'hsl(220,22%,58%)' }}>points</p>
          </div>

          {/* Sofia tile — cobalt blue */}
          <div
            className="relative p-5 flex flex-col items-center text-center overflow-hidden"
            style={{
              background: 'hsl(218, 70%, 28%)',
              backgroundImage: azulejoPattern,
              backgroundSize: '24px 24px',
              border: '1px solid rgba(20,50,120,0.45)',
              borderRadius: '3px',
              boxShadow: '3px 4px 14px rgba(15,30,80,0.25)',
            }}
          >
            <div className="relative mb-3">
              <div
                className="w-14 h-14 rounded-full overflow-hidden"
                style={{
                  border: '2px solid rgba(220,210,190,0.55)',
                  boxShadow: '0 3px 12px rgba(10,20,60,0.30)',
                }}
              >
                <img src={`${import.meta.env.BASE_URL}images/avatar-sofia.png`} alt="Sofia" className="w-full h-full object-cover" />
              </div>
              <motion.div
                className="absolute -top-1.5 -right-1.5 w-7 h-7 flex items-center justify-center"
                style={{ background: '#FFD700', borderRadius: '2px', boxShadow: '0 2px 6px rgba(200,150,0,0.4)' }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Trophy className="w-3.5 h-3.5 fill-current" style={{ color: 'hsl(35,30%,25%)' }} />
              </motion.div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(200,190,165,0.65)' }}>Sofia</p>
            <p className="font-serif font-bold" style={{ fontSize: '2.8rem', letterSpacing: '-0.05em', lineHeight: 1, color: 'hsl(42,30%,95%)' }}>
              {mockScore.sofia}
            </p>
            <p className="text-[9px] font-semibold mt-2 uppercase tracking-widest" style={{ color: 'rgba(180,165,140,0.45)' }}>points</p>
          </div>
        </motion.div>

        {/* VS divider / progress tile */}
        <div
          className="px-5 py-3 flex items-center gap-3"
          style={{
            background: 'hsl(38, 30%, 99%)',
            border: '1px solid rgba(30,60,130,0.12)',
            borderRadius: '3px',
          }}
        >
          <span className="text-[9px] font-bold uppercase tracking-widest shrink-0" style={{ color: 'hsl(218,55%,40%)', minWidth: 28 }}>
            {danielPercent.toFixed(0)}%
          </span>
          <div className="flex-1 h-3 flex overflow-hidden" style={{ borderRadius: '1px', background: 'hsl(40,18%,88%)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${danielPercent}%` }}
              transition={{ duration: 1.0, ease: [0.34, 1.1, 0.64, 1], delay: 0.2 }}
              className="h-full"
              style={{ background: 'hsl(218, 68%, 38%)', borderRadius: '1px 0 0 1px' }}
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${sofiaPercent}%` }}
              transition={{ duration: 1.0, ease: [0.34, 1.1, 0.64, 1], delay: 0.2 }}
              className="h-full"
              style={{ background: 'hsl(42, 45%, 68%)', borderRadius: '0 1px 1px 0' }}
            />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest shrink-0 text-right" style={{ color: 'hsl(40,40%,45%)', minWidth: 28 }}>
            {sofiaPercent.toFixed(0)}%
          </span>
        </div>

        {/* Milestones */}
        <div>
          <div className="px-1 py-2 mb-1">
            <p className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: 'hsl(220,22%,58%)' }}>
              ✦ &nbsp; Milestones
            </p>
          </div>
          <div className="space-y-2">
            {mockScore.milestones.map((milestone, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + idx * 0.09 }}
              >
                <div
                  className="px-4 py-4 flex items-center justify-between gap-4"
                  style={{
                    background: milestone.winner ? 'hsl(218,68%,27%)' : 'hsl(38,30%,99%)',
                    border: milestone.winner ? '1px solid rgba(20,50,120,0.40)' : '1px solid rgba(30,60,130,0.12)',
                    borderRadius: '3px',
                    boxShadow: milestone.winner ? '1px 2px 8px rgba(15,30,80,0.18)' : '2px 3px 8px rgba(20,40,100,0.06)',
                  }}
                >
                  <div>
                    <p className="font-medium text-sm" style={{ color: milestone.winner ? 'hsl(42,30%,92%)' : 'hsl(222,40%,18%)' }}>
                      {milestone.title}
                    </p>
                    {milestone.winner ? (
                      <p className="text-[10px] font-semibold mt-0.5" style={{ color: 'rgba(200,185,160,0.65)' }}>
                        Won by {milestone.winner} ✦
                      </p>
                    ) : (
                      <p className="text-[10px] mt-0.5" style={{ color: 'hsl(220,18%,55%)' }}>In progress...</p>
                    )}
                  </div>
                  <div
                    className="w-10 h-10 flex items-center justify-center shrink-0 font-bold text-sm"
                    style={{
                      borderRadius: '3px',
                      background: milestone.winner ? 'rgba(255,252,245,0.12)' : 'hsl(40,22%,90%)',
                      border: milestone.winner ? '1px solid rgba(180,165,140,0.20)' : '1px solid rgba(30,60,130,0.10)',
                      color: milestone.winner ? 'rgba(220,210,190,0.80)' : 'hsl(222,40%,28%)',
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
          <div className="px-1 py-2 mb-1">
            <p className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: 'hsl(220,22%,58%)' }}>
              ✦ &nbsp; Recent Activity
            </p>
          </div>
          <div
            className="divide-y"
            style={{ borderRadius: '3px', border: '1px solid rgba(30,60,130,0.10)', overflow: 'hidden', divideColor: 'rgba(30,60,130,0.07)' }}
          >
            {mockScore.recentActivities.map((activity, idx) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                className="flex items-center gap-3 px-4 py-3"
                style={{ background: idx % 2 === 0 ? 'hsl(38,30%,99%)' : 'hsl(40,20%,97%)' }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: activity.user === 'Sofia' ? 'hsl(40,55%,58%)' : 'hsl(218,65%,38%)' }}
                />
                <div className="flex-1">
                  <p className="text-sm" style={{ color: 'hsl(222,35%,22%)' }}>
                    <span className="font-semibold">{activity.user}</span>{' '}
                    <span className="font-light" style={{ color: 'hsl(220,18%,50%)' }}>{activity.action}</span>
                  </p>
                  <p className="text-[10px] mt-0.5 font-medium" style={{ color: 'hsl(220,15%,60%)' }}>{activity.date}</p>
                </div>
                <div
                  className="text-[10px] font-bold px-2 py-1 shrink-0"
                  style={{
                    background: 'hsl(218,70%,28%)',
                    color: 'hsl(42,30%,93%)',
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
