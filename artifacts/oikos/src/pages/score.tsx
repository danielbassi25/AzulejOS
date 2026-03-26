import AppShell from "@/components/AppShell";
import SectionHeader from "@/components/SectionHeader";
import { mockScore } from "@/data/mock";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import confetti from "canvas-confetti";

export default function ScorePage() {
  const triggerConfetti = () => {
    confetti({
      particleCount: 110, spread: 68, origin: { y: 0.50 },
      colors: ['#1e3c82', '#2e5cbf', '#4878d4', '#f5f0e8', '#d4bc8a', '#FFD700'],
    });
  };

  const totalPoints = mockScore.daniel + mockScore.sofia;
  const danielPercent = (mockScore.daniel / totalPoints) * 100;
  const sofiaPercent = (mockScore.sofia / totalPoints) * 100;
  const maxHistoryVal = Math.max(...mockScore.history.flatMap(h => [h.daniel, h.sofia]));

  return (
    <AppShell>
      <SectionHeader title="Score" subtitle="A friendly competition"
        action={
          <motion.button onClick={triggerConfetti} whileTap={{ scale: 0.93 }} whileHover={{ y: -1 }} className="flex items-center gap-2"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'rgba(255,252,245,0.10)', border: '1px solid rgba(255,252,245,0.18)', borderRadius: '3px', color: 'rgba(215,205,185,0.70)', padding: '8px 14px' }}>
            <Trophy className="w-3.5 h-3.5" /> Celebrate
          </motion.button>
        }
      />

      <div className="px-4 pt-4 pb-24" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* Scoreboard */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 gap-3">
          {/* Daniel */}
          <div className="p-6 flex flex-col items-center text-center"
            style={{ background: 'hsl(38,26%,97%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px', boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 2px 4px 14px rgba(20,40,100,0.06)' }}>
            <div className="w-14 h-14 rounded-full overflow-hidden"
              style={{ border: '2px solid hsl(218,68%,30%)', boxShadow: '0 3px 12px rgba(20,40,100,0.18)', marginBottom: '12px' }}>
              <img src={`${import.meta.env.BASE_URL}images/avatar-daniel.png`} alt="Daniel" className="w-full h-full object-cover" />
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'hsl(220,20%,54%)', marginBottom: '10px' }}>Daniel</p>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '3.2rem', letterSpacing: '-0.04em', lineHeight: 1, color: 'hsl(218,70%,28%)' }}>{mockScore.daniel}</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'hsl(220,16%,64%)', marginTop: '8px' }}>points</p>
          </div>

          {/* Sofia */}
          <div className="relative overflow-hidden p-6 flex flex-col items-center text-center"
            style={{ background: 'linear-gradient(155deg, hsl(220,70%,26%) 0%, hsl(218,72%,30%) 100%)', border: '1px solid rgba(15,45,115,0.50)', borderRadius: '4px', boxShadow: '3px 5px 18px rgba(12,25,72,0.26)' }}>
            <div className="absolute top-0 left-0 right-0 pointer-events-none"
              style={{ height: 60, background: 'linear-gradient(to bottom, rgba(255,252,245,0.05) 0%, transparent 100%)' }} />
            <div className="relative" style={{ marginBottom: '12px' }}>
              <div className="w-14 h-14 rounded-full overflow-hidden"
                style={{ border: '2px solid rgba(220,210,192,0.42)', boxShadow: '0 3px 14px rgba(10,20,60,0.30)' }}>
                <img src={`${import.meta.env.BASE_URL}images/avatar-sofia.png`} alt="Sofia" className="w-full h-full object-cover" />
              </div>
              <motion.div className="absolute -top-1.5 -right-1.5 w-7 h-7 flex items-center justify-center"
                style={{ background: '#FFD700', borderRadius: '3px', boxShadow: '0 2px 8px rgba(180,130,0,0.38)' }}
                animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}>
                <Trophy className="w-3.5 h-3.5 fill-current" style={{ color: 'hsl(35,30%,22%)' }} />
              </motion.div>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(195,182,160,0.55)', marginBottom: '10px' }}>Sofia</p>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '3.2rem', letterSpacing: '-0.04em', lineHeight: 1, color: 'hsl(42,32%,96%)' }}>{mockScore.sofia}</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(175,162,142,0.38)', marginTop: '8px' }}>points</p>
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 px-5 py-4"
          style={{ background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px', boxShadow: '0 1px 0 rgba(255,255,255,0.90) inset, 2px 3px 10px rgba(20,40,100,0.05)' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'hsl(218,55%,38%)', minWidth: 30 }}>{danielPercent.toFixed(0)}%</span>
          <div className="flex-1 flex overflow-hidden" style={{ height: 10, borderRadius: '2px', background: 'hsl(40,18%,90%)' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${danielPercent}%` }}
              transition={{ duration: 1.1, ease: [0.34, 1.1, 0.64, 1], delay: 0.2 }}
              style={{ height: '100%', background: 'hsl(218,65%,38%)', borderRadius: '2px 0 0 2px' }} />
            <motion.div initial={{ width: 0 }} animate={{ width: `${sofiaPercent}%` }}
              transition={{ duration: 1.1, ease: [0.34, 1.1, 0.64, 1], delay: 0.2 }}
              style={{ height: '100%', background: 'hsl(38,48%,64%)', borderRadius: '0 2px 2px 0' }} />
          </div>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'hsl(38,42%,48%)', minWidth: 30, textAlign: 'right' }}>{sofiaPercent.toFixed(0)}%</span>
        </div>

        {/* Score History Chart */}
        <div>
          <div className="flex items-center gap-3" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
            <div style={{ width: 20, height: 1, background: 'rgba(30,60,130,0.16)' }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'hsl(220,18%,60%)' }}>Score History</p>
            <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.08)' }} />
          </div>
          <div className="px-5 py-6"
            style={{ background: 'hsl(38,30%,99%)', border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px', boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 2px 3px 10px rgba(20,40,100,0.05)' }}>
            {/* Legend */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5">
                <div style={{ width: 10, height: 3, borderRadius: '1px', background: 'hsl(218,65%,38%)' }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, color: 'hsl(220,18%,54%)' }}>Daniel</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div style={{ width: 10, height: 3, borderRadius: '1px', background: 'hsl(38,48%,58%)' }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, color: 'hsl(220,18%,54%)' }}>Sofia</span>
              </div>
            </div>
            {/* SVG chart */}
            <div style={{ position: 'relative', width: '100%', height: 130 }}>
              <svg viewBox={`0 0 ${(mockScore.history.length - 1) * 36} 120`} className="w-full h-full" preserveAspectRatio="none"
                style={{ overflow: 'visible' }}>
                {/* Grid lines */}
                {[0, 30, 60, 90, 120].map(y => (
                  <line key={y} x1="0" y1={y} x2={(mockScore.history.length - 1) * 36} y2={y} stroke="rgba(30,60,130,0.06)" strokeWidth="0.5" />
                ))}
                {/* Daniel line */}
                <motion.polyline
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  points={mockScore.history.map((h, i) => `${i * 36},${120 - (h.daniel / maxHistoryVal) * 110}`).join(' ')}
                  fill="none" stroke="hsl(218,65%,38%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                />
                {/* Sofia line */}
                <motion.polyline
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  points={mockScore.history.map((h, i) => `${i * 36},${120 - (h.sofia / maxHistoryVal) * 110}`).join(' ')}
                  fill="none" stroke="hsl(38,48%,58%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                />
                {/* Daniel dots */}
                {mockScore.history.map((h, i) => (
                  <motion.circle key={`d-${i}`}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    cx={i * 36} cy={120 - (h.daniel / maxHistoryVal) * 110} r="3"
                    fill="hsl(218,65%,38%)" stroke="hsl(38,30%,99%)" strokeWidth="1.5" />
                ))}
                {/* Sofia dots */}
                {mockScore.history.map((h, i) => (
                  <motion.circle key={`s-${i}`}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.06 }}
                    cx={i * 36} cy={120 - (h.sofia / maxHistoryVal) * 110} r="3"
                    fill="hsl(38,48%,58%)" stroke="hsl(38,30%,99%)" strokeWidth="1.5" />
                ))}
              </svg>
              {/* Week labels */}
              <div className="flex justify-between" style={{ marginTop: '6px' }}>
                {mockScore.history.map((h, i) => (
                  <span key={i} style={{ fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 500, color: 'hsl(220,14%,62%)', width: 36, textAlign: 'center' }}>{h.week}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div>
          <div className="flex items-center gap-3" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
            <div style={{ width: 20, height: 1, background: 'rgba(30,60,130,0.16)' }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'hsl(220,18%,60%)' }}>Milestones</p>
            <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.08)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {mockScore.milestones.map((milestone, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + idx * 0.08, duration: 0.40 }}>
                <div className="flex items-center justify-between gap-4 px-5 py-4"
                  style={{
                    background: milestone.winner ? 'hsl(218,68%,27%)' : 'hsl(38,30%,99%)',
                    border: milestone.winner ? '1px solid rgba(15,45,115,0.42)' : '1px solid rgba(30,60,130,0.08)',
                    borderRadius: '4px',
                    boxShadow: milestone.winner ? '1px 2px 10px rgba(12,25,72,0.20)' : '0 1px 0 rgba(255,255,255,0.90) inset, 2px 3px 8px rgba(20,40,100,0.05)',
                  }}>
                  <div>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontSize: '1.05rem', letterSpacing: '0.01em', color: milestone.winner ? 'hsl(42,30%,93%)' : 'hsl(222,38%,18%)' }}>{milestone.title}</p>
                    {milestone.winner ? (
                      <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.72rem', color: 'rgba(195,182,160,0.55)', marginTop: '4px' }}>Won by {milestone.winner} ✦</p>
                    ) : (
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'hsl(220,15%,57%)', marginTop: '4px' }}>In progress...</p>
                    )}
                  </div>
                  <div className="flex items-center justify-center shrink-0"
                    style={{
                      width: 44, height: 44, borderRadius: '4px',
                      fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.01em',
                      background: milestone.winner ? 'rgba(255,252,245,0.10)' : 'hsl(40,22%,92%)',
                      border: milestone.winner ? '1px solid rgba(175,162,140,0.16)' : '1px solid rgba(30,60,130,0.08)',
                      color: milestone.winner ? 'rgba(215,205,188,0.72)' : 'hsl(222,38%,28%)',
                    }}>
                    {milestone.target}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center gap-3" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
            <div style={{ width: 20, height: 1, background: 'rgba(30,60,130,0.16)' }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'hsl(220,18%,60%)' }}>Recent Activity</p>
            <div style={{ flex: 1, height: 1, background: 'rgba(30,60,130,0.08)' }} />
          </div>
          <div style={{ border: '1px solid rgba(30,60,130,0.08)', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 2px 3px 10px rgba(20,40,100,0.05)' }}>
            {mockScore.recentActivities.map((activity, idx) => (
              <motion.div key={activity.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 + idx * 0.05 }}
                className="flex items-center gap-3 px-5 py-3.5"
                style={{ background: idx % 2 === 0 ? 'hsl(38,30%,99%)' : 'hsl(40,18%,97%)', borderBottom: idx < mockScore.recentActivities.length - 1 ? '1px solid rgba(30,60,130,0.06)' : 'none' }}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: activity.user === 'Sofia' ? 'hsl(38,48%,58%)' : 'hsl(218,60%,42%)' }} />
                <div className="flex-1">
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, fontSize: '1.02rem', letterSpacing: '0.01em', color: 'hsl(222,32%,24%)' }}>
                    <span style={{ fontWeight: 600 }}>{activity.user}</span>{' '}
                    <span style={{ color: 'hsl(220,15%,53%)' }}>{activity.action}</span>
                  </p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.70rem', color: 'hsl(220,13%,63%)', marginTop: '2px' }}>{activity.date}</p>
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, background: 'hsl(218,70%,28%)', color: 'hsl(42,30%,94%)', borderRadius: '2px', padding: '4px 8px' }}>+{activity.points}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
