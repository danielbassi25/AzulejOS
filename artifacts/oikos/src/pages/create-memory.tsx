import { useState } from "react";
import AppShell from "@/components/AppShell";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";

const TAG_OPTIONS = ["trip", "milestone", "tender", "funny", "routine"];
const MOOD_OPTIONS = ["magical", "nostalgic", "adventurous", "euphoric", "peaceful", "grateful", "bittersweet"];

export default function CreateMemoryPage() {
  const [, setLocation] = useLocation();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocationVal] = useState("");
  const [content, setContent] = useState("");
  const [insideJokes, setInsideJokes] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mood, setMood] = useState("");
  const [saved, setSaved] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const memory = {
      id: `mem-custom-${Date.now()}`,
      title: title.trim(),
      date: date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      location: location || 'Somewhere special',
      preview: content.slice(0, 60) + '...',
      content: content.trim(),
      insideJokes: insideJokes.split('\n').filter(j => j.trim()),
      imageUrl: '',
      tags: selectedTags,
      mood: mood || undefined,
    };
    try {
      const existing = JSON.parse(localStorage.getItem("oikos-custom-memories") || "[]");
      localStorage.setItem("oikos-custom-memories", JSON.stringify([...existing, memory]));
    } catch {}
    setSaved(true);
    setTimeout(() => setLocation("/saudade"), 1200);
  };

  const inputStyle = {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: '1.08rem', fontWeight: 400 as const,
    color: 'hsl(222,38%,22%)', background: 'hsl(40,26%,95%)',
    border: '1px solid rgba(30,60,130,0.10)', borderRadius: '4px',
    padding: '12px 16px', outline: 'none', width: '100%',
  };

  const labelStyle = {
    fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700 as const,
    letterSpacing: '0.14em', textTransform: 'uppercase' as const,
    color: 'hsl(218,68%,28%)', marginBottom: '8px', display: 'block',
  };

  return (
    <AppShell>
      <div style={{
        background: 'linear-gradient(160deg, hsl(220, 68%, 26%) 0%, hsl(218, 72%, 30%) 100%)',
        padding: '36px 28px 32px',
      }}>
        <Link href="/saudade" className="flex items-center gap-2 mb-6"
          style={{ color: 'rgba(200,215,255,0.78)' }}>
          <ArrowLeft className="w-4 h-4" />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Back</span>
        </Link>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: '2.0rem', letterSpacing: '0.01em', color: 'hsl(42,30%,96%)', lineHeight: 1.15 }}>
          Save a Memory
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: '0.92rem', color: 'rgba(200,188,165,0.50)', marginTop: '8px' }}>
          Preserve what matters
        </p>
      </div>

      <div className="px-4 pt-5 pb-20" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label style={labelStyle}>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What do you call this moment?"
            style={inputStyle} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label style={labelStyle}>Date</label>
            <input value={date} onChange={e => setDate(e.target.value)} placeholder="March 15, 2024"
              style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Location</label>
            <input value={location} onChange={e => setLocationVal(e.target.value)} placeholder="Lisbon, Portugal"
              style={inputStyle} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>The Story</label>
          <textarea value={content} onChange={e => setContent(e.target.value)}
            placeholder="Write what you want to remember about this moment..."
            rows={5}
            style={{ ...inputStyle, resize: 'none' as const }} />
        </div>

        <div>
          <label style={labelStyle}>Inside Jokes (one per line)</label>
          <textarea value={insideJokes} onChange={e => setInsideJokes(e.target.value)}
            placeholder="The aggressive pigeon&#10;That one weird painting"
            rows={3}
            style={{ ...inputStyle, resize: 'none' as const }} />
        </div>

        <div>
          <label style={labelStyle}>Mood</label>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map(m => (
              <button key={m} onClick={() => setMood(mood === m ? '' : m)}
                className="transition-all duration-200"
                style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase',
                  background: mood === m ? 'hsl(218,70%,28%)' : 'hsl(40,22%,95%)',
                  color: mood === m ? 'hsl(42,30%,94%)' : 'hsl(222,30%,30%)',
                  border: mood === m ? '1px solid rgba(15,45,115,0.40)' : '1px solid rgba(30,60,130,0.06)',
                  borderRadius: '3px', padding: '7px 14px',
                }}>
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Tags</label>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map(tag => (
              <button key={tag} onClick={() => toggleTag(tag)}
                className="transition-all duration-200"
                style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase',
                  background: selectedTags.includes(tag) ? 'hsl(218,70%,28%)' : 'hsl(40,22%,95%)',
                  color: selectedTags.includes(tag) ? 'hsl(42,30%,94%)' : 'hsl(222,30%,30%)',
                  border: selectedTags.includes(tag) ? '1px solid rgba(15,45,115,0.40)' : '1px solid rgba(30,60,130,0.06)',
                  borderRadius: '3px', padding: '7px 14px',
                }}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          onClick={handleSave}
          whileTap={{ scale: 0.97 }}
          disabled={!title.trim() || saved}
          className="flex items-center justify-center gap-2.5 w-full"
          style={{
            fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
            background: saved ? 'hsl(160,40%,42%)' : 'hsl(218,70%,28%)',
            color: 'hsl(42,30%,96%)', borderRadius: '4px', padding: '16px 20px',
            border: 'none', marginTop: '8px',
            opacity: !title.trim() ? 0.5 : 1,
            boxShadow: '2px 4px 14px rgba(12,25,72,0.22)',
          }}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved ✦' : 'Save Memory'}
        </motion.button>
      </div>
    </AppShell>
  );
}
