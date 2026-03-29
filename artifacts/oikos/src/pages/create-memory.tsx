import { useState, useRef } from "react";
import AppShell from "@/components/AppShell";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Camera, X } from "lucide-react";
import { useKV } from "@/data/kv-store";
import type { MemoryColor, Memory } from "@/types";

const MEMORY_COLORS: { key: MemoryColor; label: string; bg: string; border: string }[] = [
  { key: 'cobalt', label: 'Everyday', bg: 'hsl(218,70%,28%)', border: 'rgba(15,45,115,0.40)' },
  { key: 'teal', label: 'Adventure', bg: 'hsl(168,45%,28%)', border: 'rgba(10,80,65,0.40)' },
  { key: 'rose', label: 'Romance', bg: 'hsl(338,45%,38%)', border: 'rgba(130,25,55,0.40)' },
  { key: 'navy', label: 'Milestone', bg: 'hsl(222,52%,18%)', border: 'rgba(10,20,60,0.40)' },
];

export default function CreateMemoryPage() {
  const [, setLocation] = useLocation();
  const { data, set } = useKV();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocationVal] = useState("");
  const [content, setContent] = useState("");
  const [insideJokes, setInsideJokes] = useState("");
  const [memoryColor, setMemoryColor] = useState<MemoryColor>("cobalt");
  const [saved, setSaved] = useState(false);
  const [coverImage, setCoverImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large. Please choose an image under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCoverImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const memory: Memory = {
      id: `mem-custom-${Date.now()}`,
      title: title.trim(),
      date: date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      location: location || 'Somewhere special',
      preview: content.slice(0, 60) + '...',
      content: content.trim(),
      insideJokes: insideJokes.split('\n').filter(j => j.trim()),
      imageUrl: coverImage || '',
      memoryColor,
    };
    const existing = (data['oikos-custom-memories'] as Memory[]) || [];
    set('oikos-custom-memories', [...existing, memory]);
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
          <label style={labelStyle}>Cover Photo</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          {coverImage ? (
            <div className="relative overflow-hidden" style={{ borderRadius: '4px', border: '1px solid rgba(30,60,130,0.10)' }}>
              <img src={coverImage} alt="Cover preview" style={{ width: '100%', height: 160, objectFit: 'cover' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(12,25,72,0.50) 0%, transparent 60%)' }} />
              <motion.button
                onClick={() => setCoverImage('')}
                whileTap={{ scale: 0.88 }}
                className="absolute flex items-center justify-center"
                style={{ top: 8, right: 8, width: 28, height: 28, borderRadius: '4px', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.18)' }}>
                <X className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.85)' }} />
              </motion.button>
              <motion.button
                onClick={() => fileInputRef.current?.click()}
                whileTap={{ scale: 0.92 }}
                className="absolute flex items-center gap-1.5"
                style={{ bottom: 8, right: 8, fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '3px', color: 'rgba(255,255,255,0.85)', padding: '6px 10px' }}>
                <Camera className="w-3 h-3" /> Change
              </motion.button>
            </div>
          ) : (
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              whileTap={{ scale: 0.98 }}
              className="w-full flex flex-col items-center justify-center gap-3"
              style={{ height: 120, background: 'hsl(40,26%,95%)', border: '2px dashed rgba(30,60,130,0.15)', borderRadius: '4px' }}>
              <div className="w-10 h-10 flex items-center justify-center" style={{ background: 'rgba(30,60,130,0.08)', borderRadius: '50%' }}>
                <Camera className="w-5 h-5" style={{ color: 'hsl(218,50%,42%)' }} />
              </div>
              <div className="text-center">
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontSize: '0.95rem', color: 'hsl(222,30%,35%)' }}>
                  Add a cover photo
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 500, color: 'hsl(220,16%,62%)', marginTop: '2px' }}>
                  Tap to upload (max 5MB)
                </p>
              </div>
            </motion.button>
          )}
        </div>

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
          <label style={labelStyle}>Color</label>
          <div className="grid grid-cols-4 gap-2">
            {MEMORY_COLORS.map(c => (
              <motion.button key={c.key} whileTap={{ scale: 0.93 }}
                onClick={() => setMemoryColor(c.key)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                  padding: '10px 4px', borderRadius: '4px',
                  background: memoryColor === c.key ? c.bg : 'hsl(40,22%,95%)',
                  border: memoryColor === c.key ? `1.5px solid ${c.border}` : '1.5px solid rgba(30,60,130,0.08)',
                  boxShadow: memoryColor === c.key ? '0 2px 8px rgba(12,25,72,0.18)' : 'none',
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: c.bg,
                  border: memoryColor === c.key ? '2px solid rgba(255,252,245,0.50)' : `2px solid ${c.border}`,
                }} />
                <span style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '7px', fontWeight: 700,
                  letterSpacing: '0.10em', textTransform: 'uppercase',
                  color: memoryColor === c.key ? 'hsl(42,30%,94%)' : 'hsl(222,30%,40%)',
                }}>
                  {c.label}
                </span>
              </motion.button>
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
          {saved ? 'Saved' : 'Save Memory'}
        </motion.button>
      </div>
    </AppShell>
  );
}
