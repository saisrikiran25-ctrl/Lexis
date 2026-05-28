import { useState, useEffect, useRef, useCallback, useReducer, createContext, useContext, memo, lazy, Suspense } from "react";

// ─── GLOBAL STYLES ───────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg-base: #0A0A0F;
      --bg-surface: #0F0F1A;
      --bg-card: rgba(255,255,255,0.04);
      --bg-card-hover: rgba(255,255,255,0.07);
      --border: rgba(255,255,255,0.08);
      --border-active: rgba(74,255,145,0.4);
      --text-primary: #F0F0F5;
      --text-secondary: rgba(240,240,245,0.55);
      --text-muted: rgba(240,240,245,0.35);
      --accent-mint: #4AFF91;
      --accent-mint-dim: rgba(74,255,145,0.15);
      --accent-mint-glow: rgba(74,255,145,0.3);
      --accent-red: #FF4A4A;
      --accent-red-dim: rgba(255,74,74,0.15);
      --accent-amber: #FFB84A;
      --accent-amber-dim: rgba(255,184,74,0.15);
      --font-display: 'Space Grotesk', sans-serif;
      --font-mono: 'DM Mono', monospace;
      --font-body: 'DM Sans', sans-serif;
      --radius: 12px;
      --radius-sm: 8px;
      --shadow-card: 0 1px 0 rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.4);
      --shadow-glow: 0 0 40px rgba(74,255,145,0.12);
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg-base);
      color: var(--text-primary);
      font-family: var(--font-body);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    ::selection { background: var(--accent-mint-dim); color: var(--accent-mint); }

    :focus-visible {
      outline: 2px solid var(--accent-mint);
      outline-offset: 2px;
      border-radius: 4px;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg-base); }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

    /* Noise grain */
    .grain::before {
      content: '';
      position: fixed;
      top: -50%; left: -50%;
      width: 200%; height: 200%;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 1000;
      opacity: 0.4;
    }

    /* Animations */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideRight {
      from { width: 0; }
      to { width: 100%; }
    }
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(74,255,145,0.3); }
      50% { box-shadow: 0 0 0 8px rgba(74,255,145,0); }
    }
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes scroll-text {
      0% { transform: translateY(0); opacity: 1; }
      25% { transform: translateY(-8px); opacity: 0; }
      26% { transform: translateY(8px); opacity: 0; }
      50% { transform: translateY(0); opacity: 1; }
    }
    @keyframes gauge-fill {
      from { stroke-dashoffset: 251; }
    }
    @keyframes countUp {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }

    .animate-fade-up { animation: fadeUp 0.6s ease forwards; }
    .animate-fade-up-delay-1 { animation: fadeUp 0.6s 0.1s ease both; }
    .animate-fade-up-delay-2 { animation: fadeUp 0.6s 0.2s ease both; }
    .animate-fade-up-delay-3 { animation: fadeUp 0.6s 0.3s ease both; }
    .animate-fade-up-delay-4 { animation: fadeUp 0.6s 0.4s ease both; }
    .animate-fade-up-delay-5 { animation: fadeUp 0.6s 0.5s ease both; }
    .animate-fade-up-delay-6 { animation: fadeUp 0.6s 0.6s ease both; }

    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      font-family: var(--font-display);
      font-weight: 600; font-size: 14px; letter-spacing: 0.02em;
      padding: 12px 24px; border-radius: var(--radius-sm);
      cursor: pointer; transition: all 0.2s ease;
      text-decoration: none; border: none; white-space: nowrap;
      position: relative; overflow: hidden;
    }
    .btn::after {
      content: ''; position: absolute;
      inset: 0; background: rgba(255,255,255,0.1);
      opacity: 0; transition: opacity 0.2s;
    }
    .btn:hover::after { opacity: 1; }
    .btn:active { transform: scale(0.98); }

    .btn-primary {
      background: var(--accent-mint); color: #0A0A0F;
    }
    .btn-primary:hover { box-shadow: 0 0 24px rgba(74,255,145,0.35); }

    .btn-ghost {
      background: transparent; color: var(--text-primary);
      border: 1px solid var(--border);
    }
    .btn-ghost:hover { border-color: rgba(255,255,255,0.2); background: var(--bg-card); }

    .btn-outline-mint {
      background: transparent; color: var(--accent-mint);
      border: 1px solid rgba(74,255,145,0.4);
    }
    .btn-outline-mint:hover { background: var(--accent-mint-dim); }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow-card);
      backdrop-filter: blur(12px);
    }

    .section-rule {
      height: 1px; background: var(--border);
      margin: 0; border: none;
    }

    .tag {
      display: inline-flex; align-items: center; gap: 4px;
      font-family: var(--font-mono); font-size: 11px; font-weight: 500;
      padding: 3px 8px; border-radius: 4px; letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .tag-high { background: var(--accent-red-dim); color: var(--accent-red); border: 1px solid rgba(255,74,74,0.2); }
    .tag-caution { background: var(--accent-amber-dim); color: var(--accent-amber); border: 1px solid rgba(255,184,74,0.2); }
    .tag-low { background: var(--accent-mint-dim); color: var(--accent-mint); border: 1px solid rgba(74,255,145,0.2); }

    .skeleton {
      background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
      background-size: 1000px 100%;
      animation: shimmer 1.5s infinite;
      border-radius: var(--radius-sm);
    }

    input, textarea {
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border);
      color: var(--text-primary);
      font-family: var(--font-body);
      border-radius: var(--radius-sm);
      transition: border-color 0.2s, box-shadow 0.2s;
      width: 100%;
    }
    input:focus, textarea:focus {
      outline: none;
      border-color: var(--border-active);
      box-shadow: 0 0 0 3px rgba(74,255,145,0.08);
    }
    input::placeholder, textarea::placeholder { color: var(--text-muted); }

    details > summary { list-style: none; cursor: pointer; }
    details > summary::-webkit-details-marker { display: none; }
  `}</style>
);

// ─── CONTEXT ─────────────────────────────────────────────────────────────────
const AnalysisContext = createContext(null);

const initialState = {
  mode: localStorage.getItem('lexis-mode') || 'consumer',
  input: '',
  results: null,
  loading: false,
  error: null,
  currentPage: 'landing',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_MODE': return { ...state, mode: action.payload };
    case 'SET_INPUT': return { ...state, input: action.payload };
    case 'SET_RESULTS': return { ...state, results: action.payload };
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'SET_ERROR': return { ...state, error: action.payload };
    case 'SET_PAGE': return { ...state, currentPage: action.payload };
    case 'RESET': return { ...state, results: null, error: null, loading: false };
    default: return state;
  }
}

function AnalysisProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => { localStorage.setItem('lexis-mode', state.mode); }, [state.mode]);
  return <AnalysisContext.Provider value={{ state, dispatch }}>{children}</AnalysisContext.Provider>;
}

const useAnalysis = () => useContext(AnalysisContext);

// ─── API ──────────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a legal document analyst specializing in plain-language explanation of Terms & Conditions, Privacy Policies, and similar legal agreements. Your job is NOT to provide legal advice — you are an educational tool that helps people understand what they're agreeing to.

Analyze the provided legal document and return a structured JSON response with EXACTLY this schema:

{
  "documentType": "string",
  "detectedSource": "string",
  "wordCount": 0,
  "estimatedReadMinutes": 0,
  "tldrSummary": "string",
  "overallRiskLevel": "low|moderate|high|very_high",
  "riskScore": 0,
  "clauses": [
    {
      "id": "string",
      "category": "string",
      "riskLevel": "low|caution|high",
      "plainExplanation": "string",
      "userImpact": "string",
      "originalSnippet": "string",
      "isAISpecific": false
    }
  ],
  "questionsBeforeAgreeing": ["string"],
  "redFlags": [
    {
      "clauseId": "string",
      "summary": "string"
    }
  ],
  "founderSpecificInsights": ["string"],
  "consumerSpecificInsights": ["string"]
}

Respond ONLY with valid JSON. No preamble, no markdown fences, no explanation outside the JSON object. Generate at least 5-8 clauses covering different categories. Make the analysis thorough and practical.`;

async function analyzePolicy(policyText, mode) {
  const apiKey = 
    (typeof process !== "undefined" && process.env?.REACT_APP_OPENROUTER_API_KEY) ||
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_OPENROUTER_API_KEY) ||
    (typeof window !== "undefined" && window.localStorage?.getItem('lexis-openrouter-key')) ||
    "";

  if (!apiKey) {
    throw new Error("OpenRouter API key not found. Please set VITE_OPENROUTER_API_KEY or REACT_APP_OPENROUTER_API_KEY in your environment, or save it to localStorage under 'lexis-openrouter-key'.");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "",
      "X-Title": "LEXIS Policy Analyzer",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `MODE: ${mode.toUpperCase()}\n\nAnalyze this legal document:\n\n${policyText}`
        }
      ],
      max_tokens: 4000,
      response_format: { type: "json_object" }
    })
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || "{}";
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const RiskBadge = ({ level, size = 'sm' }) => {
  const config = {
    high: { label: 'High Risk', icon: '●', cls: 'tag-high' },
    caution: { label: 'Caution', icon: '▲', cls: 'tag-caution' },
    low: { label: 'Standard', icon: '●', cls: 'tag-low' },
    moderate: { label: 'Moderate', icon: '▲', cls: 'tag-caution' },
    very_high: { label: 'Very High', icon: '●', cls: 'tag-high' },
  };
  const c = config[level] || config.low;
  return (
    <span className={`tag ${c.cls}`} aria-label={`Risk level: ${c.label}`}>
      <span aria-hidden="true">{c.icon}</span> {c.label}
    </span>
  );
};

const Disclaimer = ({ compact = false }) => (
  <p style={{
    fontFamily: 'var(--font-mono)', fontSize: compact ? 10 : 11,
    color: 'var(--text-muted)', lineHeight: 1.5,
    padding: compact ? '8px 0' : '12px 16px',
    borderTop: compact ? '1px solid var(--border)' : 'none',
    background: compact ? 'transparent' : 'rgba(255,184,74,0.05)',
    borderRadius: compact ? 0 : 'var(--radius-sm)',
    border: compact ? 'none' : '1px solid rgba(255,184,74,0.12)',
  }}>
    ⚠ Policy / T&C Simplifier provides educational summaries for informational purposes only. This is not legal advice. Do not rely on this tool as a substitute for consultation with a qualified attorney, especially for high-stakes business or legal decisions.
  </p>
);

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar() {
  const { dispatch } = useAnalysis();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nav = (page) => { dispatch({ type: 'SET_PAGE', payload: page }); setMobileOpen(false); };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 24px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(10,10,15,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <button onClick={() => nav('landing')} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            LEX<span style={{ color: 'var(--accent-mint)' }}>IS</span>
          </span>
          <span style={{ position: 'absolute', bottom: -2, left: 0, width: '100%', height: 1, background: 'var(--accent-mint)', transform: 'scaleX(0)', transition: 'transform 0.2s', transformOrigin: 'left' }} className="nav-underline" />
        </button>
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {[['how-it-works', 'How it works'], ['analyze', 'Modes'], ['about', 'About']].map(([page, label]) => (
            <button key={page} onClick={() => nav(page)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-secondary)',
              padding: '8px 14px', borderRadius: 6, transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >{label}</button>
          ))}
          <button className="btn btn-primary" style={{ marginLeft: 8, padding: '9px 20px', fontSize: 13 }}
            onClick={() => nav('analyze')}>
            Analyze a Policy →
          </button>
        </div>
        <button
          onClick={() => setMobileOpen(o => !o)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontSize: 20, padding: 8 }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >{mobileOpen ? '✕' : '☰'}</button>
      </nav>
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99,
          background: 'rgba(10,10,15,0.97)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          padding: 24, display: 'flex', flexDirection: 'column', gap: 8,
          animation: 'fadeIn 0.2s ease',
        }}>
          {[['how-it-works', 'How it works'], ['analyze', 'Modes'], ['about', 'About']].map(([page, label]) => (
            <button key={page} onClick={() => nav(page)} style={{
              background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
              fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--text-primary)',
              padding: '12px 0', borderBottom: '1px solid var(--border)',
            }}>{label}</button>
          ))}
          <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => nav('analyze')}>
            Analyze a Policy →
          </button>
        </div>
      )}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  const { dispatch } = useAnalysis();
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 24px', marginTop: 80 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24, marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
              LEX<span style={{ color: 'var(--accent-mint)' }}>IS</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 300 }}>
              Plain-language policy analysis for real people.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[['Privacy', 'about'], ['About', 'about'], ['How it works', 'how-it-works']].map(([l, p]) => (
              <button key={l} onClick={() => dispatch({ type: 'SET_PAGE', payload: p })} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >{l}</button>
            ))}
          </div>
        </div>
        <Disclaimer compact />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginTop: 16 }}>
          © 2026 LEXIS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
const CYCLING_ALERTS = [
  "⚠ Your content may be used to train AI models",
  "🔴 Arbitration clause waives your right to sue",
  "⚠ Company can change terms without notifying you",
  "🔴 Your data may be sold to third-party advertisers",
  "⚠ Account can be terminated without explanation",
  "🔴 You grant a perpetual, irrevocable license to your content",
];

function HeroTypingAlert() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % CYCLING_ALERTS.length);
        setVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: 13,
      color: 'var(--text-secondary)', padding: '10px 16px',
      background: 'rgba(255,255,255,0.04)', borderRadius: 6,
      border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', gap: 8,
      minWidth: 420, maxWidth: '100%',
    }}>
      <span style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
        display: 'block', width: '100%',
      }}>{CYCLING_ALERTS[idx]}</span>
      <span style={{ animation: 'blink 1s step-end infinite', color: 'var(--accent-mint)', flexShrink: 0 }}>▌</span>
    </div>
  );
}

function AnimatedCounter({ value, suffix = '', prefix = '' }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const num = parseFloat(value);
        const duration = 1500;
        const steps = 60;
        const increment = num / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= num) { setDisplay(num); clearInterval(timer); }
          else setDisplay(Math.floor(current));
        }, duration / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

function Landing() {
  const { dispatch } = useAnalysis();
  const nav = (page) => dispatch({ type: 'SET_PAGE', payload: page });

  return (
    <div>
      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '120px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Abstract background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '20%', left: '10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,255,145,0.04) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', top: '40%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,74,74,0.04) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          {/* Floating doc lines */}
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${5 + (i * 8)}%`,
              top: `${10 + (i * 7)}%`,
              width: `${40 + (i * 5)}px`,
              height: 1,
              background: `rgba(255,255,255,${0.02 + (i % 3) * 0.01})`,
              transform: `rotate(${-20 + i * 5}deg)`,
            }} />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800 }}>
          <div className="animate-fade-up" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-mint)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24 }}>
            AI-Powered Legal Clarity
          </div>
          <h1 className="animate-fade-up-delay-1" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px, 8vw, 88px)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 24, color: 'var(--text-primary)' }}>
            Stop clicking<br />
            <span style={{ color: 'var(--accent-mint)' }}>Accept</span> blindly.
          </h1>
          <p className="animate-fade-up-delay-2" style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6 }}>
            Paste any Terms & Conditions or Privacy Policy. Get a plain-English breakdown of what you're actually agreeing to — in under 60 seconds.
          </p>
          <div className="animate-fade-up-delay-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            <button className="btn btn-primary" style={{ padding: '14px 32px', fontSize: 16 }} onClick={() => nav('analyze')}>
              Analyze Now
            </button>
            <button className="btn btn-ghost" style={{ padding: '14px 32px', fontSize: 16 }} onClick={() => {
              dispatch({ type: 'SET_INPUT', payload: SAMPLE_POLICY });
              nav('analyze');
            }}>
              See a Sample
            </button>
          </div>
          <div className="animate-fade-up-delay-4" style={{ display: 'flex', justifyContent: 'center' }}>
            <HeroTypingAlert />
          </div>
        </div>
      </section>

      <hr className="section-rule" />

      {/* Stats */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {[
            { value: 91, suffix: '%', label: 'of people never read T&Cs', note: 'Deloitte Consumer Survey' },
            { value: 32, suffix: ' pages', label: 'avg length of major platform terms', note: 'NYU Law Review, 2023' },
            { value: 0, suffix: ' minutes', label: 'most people spend reviewing them', note: 'Carnegie Mellon Study' },
          ].map((stat, i) => (
            <div key={i} className={`card animate-fade-up-delay-${i + 2}`} style={{ padding: '32px 28px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 56, fontWeight: 800, color: 'var(--accent-mint)', lineHeight: 1, marginBottom: 12 }}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.4 }}>{stat.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.note}</div>
            </div>
          ))}
        </div>
      </section>

      <hr className="section-rule" />

      {/* How it works */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 }}>
              How it works
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Three steps to legal clarity.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, position: 'relative' }}>
            {[
              { step: '01', icon: '📋', title: 'Paste URL or text', desc: 'Drop in any policy text directly, or provide a URL to the policy page.' },
              { step: '02', icon: '🤖', title: 'AI analyzes clauses', desc: 'Our AI reads every clause, classifies risk levels, and maps plain-English meaning.' },
              { step: '03', icon: '📊', title: 'Get your risk report', desc: 'See a full breakdown, risk score, and the key questions to ask before agreeing.' },
            ].map((step, i) => (
              <div key={i} className="card" style={{ padding: '32px 28px', position: 'relative' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-mint)', letterSpacing: '0.1em', marginBottom: 20, textTransform: 'uppercase' }}>
                  Step {step.step}
                </div>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{step.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-rule" />

      {/* Mode Selector */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 }}>
              Choose your mode
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Different insights for different needs.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {[
              {
                mode: 'consumer', icon: '🧑', title: 'Consumer Mode',
                desc: 'For individuals reviewing app and website policies',
                points: ['Data rights & privacy tracking', 'Content ownership clauses', 'Account termination terms', 'Auto-renewal traps', 'Third-party data sharing'],
                color: 'var(--accent-mint)',
              },
              {
                mode: 'founder', icon: '🏢', title: 'Founder / Business Mode',
                desc: 'For startups, operators, and teams reviewing vendor terms',
                points: ['IP ownership & licensing', 'Liability caps & indemnification', 'Data processing agreements', 'AI training clause detection', 'Termination & off-boarding'],
                color: 'var(--accent-amber)',
              },
            ].map(m => (
              <div key={m.mode} className="card" style={{ padding: '32px 28px', borderColor: 'transparent', cursor: 'pointer', transition: 'all 0.2s', border: `1px solid rgba(255,255,255,0.06)` }}
                onClick={() => { dispatch({ type: 'SET_MODE', payload: m.mode }); nav('analyze'); }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = m.color.replace(')', ',0.3)').replace('var(--accent-mint)', 'rgba(74,255,145,0.3)').replace('var(--accent-amber)', 'rgba(255,184,74,0.3)'); e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>{m.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{m.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>{m.desc}</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {m.points.map(p => (
                    <li key={p} style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: m.color === 'var(--accent-mint)' ? 'var(--accent-mint)' : 'var(--accent-amber)', fontSize: 10 }}>✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 24 }}>
                  <span className="btn btn-ghost" style={{ fontSize: 13, padding: '8px 16px' }}>
                    Analyze in this mode →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-rule" />

      {/* Sample Teaser */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 }}>
              What a real analysis looks like
            </h2>
          </div>
          <div style={{ position: 'relative' }}>
            <div className="card" style={{ padding: '24px', pointerEvents: 'none', userSelect: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Data Collection</span>
                </div>
                <RiskBadge level="high" />
              </div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, marginBottom: 10 }}>
                Your behavioral data is collected and shared with advertising partners
              </h4>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                The company tracks your activity across their platform and sells this data to third-party advertisers. This includes your browsing habits, purchase history, and demographic information.
              </p>
              <div style={{ padding: '10px 14px', background: 'rgba(255,74,74,0.08)', borderLeft: '3px solid var(--accent-red)', borderRadius: 4 }}>
                <strong style={{ fontSize: 13, color: 'var(--accent-red)' }}>What this means for you:</strong>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}> You are the product. Your data finances the service.</span>
              </div>
            </div>
            {/* Blur overlay */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(transparent, var(--bg-base))', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 16 }}>
              <button className="btn btn-primary" onClick={() => nav('analyze')}>
                Unlock Full Analysis →
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ─── ANALYZE PAGE ─────────────────────────────────────────────────────────────
const LOADING_MESSAGES = [
  "Parsing document structure...",
  "Identifying clause categories...",
  "Flagging high-impact provisions...",
  "Scoring risk levels...",
  "Generating plain-language summary...",
  "Assembling your report...",
];

function LoadingState() {
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgTimer = setInterval(() => setMsgIdx(i => Math.min(i + 1, LOADING_MESSAGES.length - 1)), 2500);
    const progTimer = setInterval(() => setProgress(p => Math.min(p + Math.random() * 8, 95)), 300);
    return () => { clearInterval(msgTimer); clearInterval(progTimer); };
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
      <div style={{ width: '100%', maxWidth: 500, margin: '0 auto', marginBottom: 32 }}>
        <div style={{ height: 2, background: 'var(--border)', borderRadius: 1, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--accent-mint), rgba(74,255,145,0.6))',
            transition: 'width 0.3s ease',
            boxShadow: '0 0 12px rgba(74,255,145,0.4)',
          }} />
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent-mint)', marginBottom: 8 }}>
          {LOADING_MESSAGES[msgIdx]}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
          {Math.round(progress)}% complete
        </div>
      </div>
      {/* Skeleton */}
      <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="skeleton" style={{ height: 80, borderRadius: 'var(--radius)' }} />
        <div className="skeleton" style={{ height: 120, borderRadius: 'var(--radius)' }} />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--radius)' }} />
        ))}
      </div>
    </div>
  );
}

function RiskGauge({ score, level }) {
  const [animated, setAnimated] = useState(false);
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  const colors = { low: '#4AFF91', moderate: '#FFB84A', high: '#FF4A4A', very_high: '#FF4A4A' };
  const color = colors[level] || colors.moderate;

  useEffect(() => { setTimeout(() => setAnimated(true), 100); }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r="40" fill="none"
          stroke={color} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : circumference}
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)', filter: `drop-shadow(0 0 6px ${color})` }}
        />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fill={color} fontSize="20" fontFamily="'Syne', sans-serif" fontWeight="800">{score}</text>
      </svg>
      <RiskBadge level={level} />
    </div>
  );
}

const ClauseCard = memo(function ClauseCard({ clause }) {
  const [open, setOpen] = useState(false);

  return (
    <details style={{ borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}
      open={open} onToggle={e => setOpen(e.currentTarget.open)}>
      <summary style={{
        padding: '16px 20px', cursor: 'pointer',
        background: open ? 'rgba(255,255,255,0.04)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        transition: 'background 0.2s',
      }}
        aria-expanded={open}
        onMouseEnter={e => !open && (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
        onMouseLeave={e => !open && (e.currentTarget.style.background = 'transparent')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          {clause.isAISpecific && (
            <span title="AI-related clause" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-amber)', background: 'var(--accent-amber-dim)', padding: '2px 6px', borderRadius: 3, flexShrink: 0 }}>AI</span>
          )}
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{clause.category}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <RiskBadge level={clause.riskLevel} />
          <span style={{ color: 'var(--text-muted)', fontSize: 12, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>▼</span>
        </div>
      </summary>
      <div style={{ padding: '20px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{clause.plainExplanation}</p>
        <div style={{
          padding: '12px 16px',
          background: clause.riskLevel === 'high' ? 'rgba(255,74,74,0.08)' : clause.riskLevel === 'caution' ? 'rgba(255,184,74,0.08)' : 'rgba(74,255,145,0.08)',
          borderLeft: `3px solid ${clause.riskLevel === 'high' ? 'var(--accent-red)' : clause.riskLevel === 'caution' ? 'var(--accent-amber)' : 'var(--accent-mint)'}`,
          borderRadius: '0 4px 4px 0',
        }}>
          <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>What this means for you:</strong>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}> {clause.userImpact}</span>
        </div>
        {clause.originalSnippet && (
          <details style={{ borderRadius: 6, overflow: 'hidden' }}>
            <summary style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer', padding: '8px 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Original clause text ▼
            </summary>
            <div style={{ marginTop: 8, padding: '12px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 6, border: '1px solid var(--border)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{clause.originalSnippet}</p>
            </div>
          </details>
        )}
      </div>
    </details>
  );
});

function ResultsPanel({ results, mode }) {
  const [checkedQuestions, setCheckedQuestions] = useState({});
  const [copied, setCopied] = useState(false);

  const toggleQuestion = (i) => setCheckedQuestions(q => ({ ...q, [i]: !q[i] }));

  const copySummary = () => {
    const text = `LEXIS Policy Analysis\n\n${results.detectedSource} — ${results.documentType}\nRisk Score: ${results.riskScore}/100 (${results.overallRiskLevel})\n\nSummary:\n${results.tldrSummary}\n\nRed Flags:\n${results.redFlags?.map(r => `• ${r.summary}`).join('\n')}\n\nGenerated by LEXIS — lexis.app`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <div style={{ animation: 'fadeUp 0.6s ease' }}>
      {/* Disclaimer */}
      <div style={{ marginBottom: 24 }}><Disclaimer /></div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 24, alignItems: 'start' }}>
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Document Header */}
          <div className="card" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
                  {results.detectedSource || 'Unknown Source'}
                </h2>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {results.documentType}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[
                  [results.wordCount?.toLocaleString(), 'words'],
                  [results.estimatedReadMinutes, 'min read'],
                ].map(([val, unit]) => (
                  <div key={unit} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>{val}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{unit}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TL;DR */}
          <div className="card" style={{ padding: '24px', borderLeft: '3px solid var(--accent-mint)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-mint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
              Plain English Summary
            </div>
            <p style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.7 }}>{results.tldrSummary}</p>
          </div>

          {/* Clauses */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 14, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 12 }}>
              Clause Breakdown ({results.clauses?.length || 0} clauses analyzed)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {results.clauses?.map(clause => (
                <ClauseCard key={clause.id} clause={clause} />
              ))}
            </div>
          </div>

          {/* Questions */}
          {results.questionsBeforeAgreeing?.length > 0 && (
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
                Questions to ask before you agree
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {results.questionsBeforeAgreeing.map((q, i) => (
                  <label key={i} style={{ display: 'flex', gap: 12, cursor: 'pointer', alignItems: 'flex-start' }}>
                    <input type="checkbox" checked={!!checkedQuestions[i]} onChange={() => toggleQuestion(i)}
                      style={{ width: 16, height: 16, marginTop: 2, accentColor: 'var(--accent-mint)', flexShrink: 0, cursor: 'pointer' }} />
                    <span style={{ fontSize: 14, color: checkedQuestions[i] ? 'var(--text-muted)' : 'var(--text-secondary)', textDecoration: checkedQuestions[i] ? 'line-through' : 'none', lineHeight: 1.6, transition: 'all 0.2s' }}>{q}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 80 }}>
          {/* Risk Score */}
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>Risk Score</div>
            <RiskGauge score={results.riskScore || 0} level={results.overallRiskLevel || 'moderate'} />
            {/* Category bars */}
            {results.clauses && (
              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(results.clauses.reduce((acc, c) => {
                  acc[c.riskLevel] = (acc[c.riskLevel] || 0) + 1;
                  return acc;
                }, {})).map(([level, count]) => (
                  <div key={level} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', width: 50, textAlign: 'right', flexShrink: 0 }}>{level}</span>
                    <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(count / results.clauses.length) * 100}%`, background: level === 'high' ? 'var(--accent-red)' : level === 'caution' ? 'var(--accent-amber)' : 'var(--accent-mint)', borderRadius: 2, transition: 'width 1s ease' }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', width: 16 }}>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Red Flags */}
          {results.redFlags?.length > 0 && (
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                🚩 Red Flags
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {results.redFlags.map((flag, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--accent-red)', fontSize: 12, marginTop: 2, flexShrink: 0 }}>●</span>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{flag.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mode insights */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
              {mode === 'founder' ? '🏢 Founder Insights' : '🧑 Consumer Insights'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(mode === 'founder' ? results.founderSpecificInsights : results.consumerSpecificInsights)?.map((insight, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: mode === 'founder' ? 'var(--accent-amber)' : 'var(--accent-mint)', fontSize: 10, marginTop: 4, flexShrink: 0 }}>→</span>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Export */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Export</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn btn-outline-mint" style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '10px 16px' }} onClick={copySummary}>
                {copied ? '✓ Copied!' : '📋 Copy Summary'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .results-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Analyze() {
  const { state, dispatch } = useAnalysis();
  const [urlInput, setUrlInput] = useState('');
  const textareaRef = useRef(null);

  const charCount = state.input.length;
  const maxChars = 100000;

  const handleAnalyze = async () => {
    if (!state.input.trim()) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_RESULTS', payload: null });
    try {
      const results = await analyzePolicy(state.input.slice(0, maxChars), state.mode);
      dispatch({ type: 'SET_RESULTS', payload: results });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Analysis failed. Please try again.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '100px 24px 60px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
            Analyze a Policy
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Paste your policy text below and get an instant plain-language breakdown.</p>
        </div>

        {/* Input Panel */}
        {!state.loading && !state.results && (
          <div className="card" style={{ padding: '28px', marginBottom: 32, animation: 'fadeUp 0.5s ease' }}>
            {/* Mode Toggle */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 24, background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 4, width: 'fit-content' }}>
              {['consumer', 'founder'].map(m => (
                <button key={m} onClick={() => dispatch({ type: 'SET_MODE', payload: m })} style={{
                  background: state.mode === m ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  color: state.mode === m ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13,
                  padding: '8px 20px', borderRadius: 6, transition: 'all 0.2s',
                  boxShadow: state.mode === m ? '0 1px 4px rgba(0,0,0,0.4)' : 'none',
                }}>
                  {m === 'consumer' ? '🧑 Consumer' : '🏢 Founder / Business'}
                </button>
              ))}
            </div>

            <textarea
              ref={textareaRef}
              value={state.input}
              onChange={e => dispatch({ type: 'SET_INPUT', payload: e.target.value })}
              placeholder="Paste Terms & Conditions, Privacy Policy, or any legal text here..."
              style={{ width: '100%', minHeight: 220, padding: '16px', fontSize: 14, lineHeight: 1.6, resize: 'vertical', fontFamily: 'var(--font-body)' }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: charCount > maxChars * 0.9 ? 'var(--accent-amber)' : 'var(--text-muted)' }}>
                {charCount.toLocaleString()} / {maxChars.toLocaleString()} characters
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                🔒 Your text is never stored. Analysis happens in real-time.
              </span>
            </div>

            <div style={{ marginTop: 16 }}>
              <Disclaimer />
            </div>

            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-primary"
                style={{ padding: '14px 32px', fontSize: 15, opacity: state.input.trim() ? 1 : 0.5, cursor: state.input.trim() ? 'pointer' : 'not-allowed' }}
                onClick={handleAnalyze}
                disabled={!state.input.trim()}
              >
                Analyze Policy →
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {state.loading && <LoadingState />}

        {/* Error */}
        {state.error && (
          <div className="card" style={{ padding: '24px', borderColor: 'rgba(255,74,74,0.3)', marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20 }}>⚠</span>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginBottom: 8, color: 'var(--accent-red)' }}>Analysis failed</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
                  Something went wrong with the analysis. Please check your policy text and try again. If the issue persists, the document may be too long or in an unsupported format.
                </p>
                <button className="btn btn-ghost" onClick={() => { dispatch({ type: 'RESET' }); }} style={{ fontSize: 13, padding: '8px 16px' }}>
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {state.results && !state.loading && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Analysis Results</h2>
              <button className="btn btn-ghost" style={{ fontSize: 13, padding: '8px 16px' }} onClick={() => dispatch({ type: 'RESET' })}>
                ← Analyze another
              </button>
            </div>
            <ResultsPanel results={state.results} mode={state.mode} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HOW IT WORKS PAGE ────────────────────────────────────────────────────────
function HowItWorks() {
  const { dispatch } = useAnalysis();
  const steps = [
    { title: 'Document ingestion & cleaning', desc: 'The policy text is parsed, whitespace normalized, and structured into processable segments. We strip formatting artifacts and identify the document hierarchy.' },
    { title: 'Clause segmentation using NLP', desc: 'Our AI breaks down the document into discrete legal clauses, identifying paragraph boundaries, numbered sections, and sub-clauses that carry distinct legal meaning.' },
    { title: 'Category classification', desc: 'Each clause is tagged with a category: Data Collection, Intellectual Property, Liability, Termination, Dispute Resolution, Auto-Renewal, AI-Specific Terms, and more.' },
    { title: 'Risk scoring logic', desc: 'Every clause receives a risk level (Low / Caution / High) based on its category, the strength of language used, and its practical impact on the user. Aggregate scores produce an overall document risk rating.' },
    { title: 'Plain-language generation', desc: 'Each clause is summarized in 2–4 plain sentences, followed by a single "what this means for you" statement — the most actionable takeaway.' },
  ];

  const limitations = [
    'Does not constitute legal advice and cannot replace a qualified attorney.',
    'May not catch every nuance in highly complex or jurisdiction-specific legal language.',
    'Does not cover jurisdiction-specific law or regulations beyond what appears in the text.',
    'Cannot predict how a company will actually enforce any given clause.',
    'Accuracy may vary for unusual document formats or highly specialized legal jargon.',
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '100px 24px 80px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-mint)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 20 }}>Methodology</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20, lineHeight: 1.1 }}>
            Clarity, not<br /><span style={{ color: 'var(--accent-mint)' }}>legal advice.</span>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
            LEXIS is an educational tool designed to help people understand what they're agreeing to — not to replace their attorney. Here's exactly how it works.
          </p>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative', marginBottom: 64 }}>
          <div style={{ position: 'absolute', left: 19, top: 32, bottom: 0, width: 1, background: 'var(--border)' }} />
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 28, marginBottom: 40, animation: `fadeUp 0.5s ${i * 0.1}s ease both` }}>
              <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-surface)', border: '1px solid var(--border-active)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-mint)' }}>0{i + 1}</span>
              </div>
              <div style={{ paddingTop: 6 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <hr className="section-rule" style={{ margin: '48px 0' }} />

        {/* Limitations */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>What this tool does NOT do</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {limitations.map((l, i) => (
              <div key={i} className="card" style={{ padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--accent-amber)', fontSize: 14, marginTop: 1, flexShrink: 0 }}>×</span>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="card" style={{ padding: '24px', borderColor: 'rgba(74,255,145,0.2)', marginBottom: 48 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20 }}>🔒</span>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--accent-mint)' }}>Your privacy is protected</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                No policy text is stored or logged beyond your session. All analysis happens in real-time and is discarded immediately after. We never see your data.
              </p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-primary" style={{ padding: '14px 32px', fontSize: 15 }} onClick={() => dispatch({ type: 'SET_PAGE', payload: 'analyze' })}>
            Try it now →
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
function About() {
  const { dispatch } = useAnalysis();
  const personas = [
    { icon: '🧑', title: 'Consumers', desc: 'Everyday people who use apps, platforms, and online services and deserve to understand what they\'re signing up for.' },
    { icon: '🚀', title: 'Founders', desc: 'Startup operators reviewing vendor contracts, SaaS agreements, and API terms that affect their business operations.' },
    { icon: '💼', title: 'Freelancers', desc: 'Independent workers navigating client contracts, platform terms, and IP ownership clauses that affect their livelihood.' },
    { icon: '🏪', title: 'Small Businesses', desc: 'Teams without in-house legal counsel who need to quickly assess risk in vendor and partnership agreements.' },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '100px 24px 80px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Mission */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-mint)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 20 }}>Mission</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 24 }}>
            Legal fine print<br />should be readable<br />by <span style={{ color: 'var(--accent-mint)' }}>everyone.</span>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            LEXIS was built on a simple premise: the gap between what legal documents say and what people understand them to say is a design failure. Every person who clicks "I agree" without understanding deserves better.
          </p>
        </div>

        <hr className="section-rule" style={{ margin: '48px 0' }} />

        {/* Personas */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 32 }}>Built for</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {personas.map(p => (
              <div key={p.title} className="card" style={{ padding: '24px' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{p.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{p.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <hr className="section-rule" style={{ margin: '48px 0' }} />

        {/* Essay */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>The problem with legal fine print</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <p>
              The average Terms of Service for a major platform runs over 10,000 words. Legal teams spend months crafting language specifically designed to protect the company — not inform the user. The result is a system where informed consent is a legal fiction.
            </p>
            <p>
              Most people click Accept within seconds. Not because they're irresponsible, but because the alternative — reading 30 pages of dense legalese — is practically impossible. This isn't a user education problem. It's a structural one.
            </p>
            <p>
              LEXIS doesn't fix the underlying problem (that legal agreements are intentionally opaque). But it does what any good tool should do: it meets people where they are and helps them make slightly better decisions. A five-minute LEXIS analysis won't replace an attorney, but it might stop you from giving away your content rights forever — or alert you to an arbitration clause before it costs you in court.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '32px', background: 'rgba(74,255,145,0.05)', borderRadius: 'var(--radius)', border: '1px solid rgba(74,255,145,0.15)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Ready to read the fine print?</h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>Paste any policy and get clarity in under 60 seconds.</p>
          <button className="btn btn-primary" style={{ padding: '14px 32px', fontSize: 15 }} onClick={() => dispatch({ type: 'SET_PAGE', payload: 'analyze' })}>
            Analyze a Policy →
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ─── SAMPLE POLICY ────────────────────────────────────────────────────────────
const SAMPLE_POLICY = `TERMS OF SERVICE

Last Updated: January 1, 2024

Welcome to GenericApp. By using our services, you agree to these terms.

1. ACCOUNT TERMS
You must be at least 13 years of age to use this service. By agreeing to these Terms, you represent and warrant that you are at least 13 years of age. You are responsible for maintaining the security of your account and password. GenericApp cannot and will not be liable for any loss or damage from your failure to comply with this security obligation. You are responsible for all Content posted and activity that occurs under your account. We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.

2. CONTENT OWNERSHIP AND LICENSE
By submitting, posting, or displaying content on GenericApp, you grant us a worldwide, non-exclusive, royalty-free, sublicensable, transferable, perpetual and irrevocable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, perform, and display such content in any and all media or distribution methods (now known or later developed). This license includes the right to use your content to train our AI models and improve our services. You waive any right to inspect or approve the finished product.

3. DATA COLLECTION AND SHARING
We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. We also collect information automatically, including log data, device information, location information, and usage information. We may share your information with third parties for the purpose of providing our services, complying with legal obligations, enforcing our policies, and for marketing purposes. We do not sell your personal information to third parties, but we may share it with advertising partners for targeted advertising.

4. ARBITRATION AND CLASS ACTION WAIVER
YOU AND GENERICAPP AGREE THAT ANY DISPUTE, CLAIM OR CONTROVERSY ARISING OUT OF OR RELATING TO THESE TERMS OR THE BREACH, TERMINATION, ENFORCEMENT, INTERPRETATION OR VALIDITY THEREOF OR THE USE OF THE SERVICES SHALL BE SETTLED BY BINDING ARBITRATION. YOU ACKNOWLEDGE AND AGREE THAT YOU AND GENERICAPP ARE EACH WAIVING THE RIGHT TO A TRIAL BY JURY OR TO PARTICIPATE AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS ACTION OR REPRESENTATIVE PROCEEDING.

5. LIMITATION OF LIABILITY
TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL GENERICAPP, ITS AFFILIATES, DIRECTORS, EMPLOYEES, AGENTS, PARTNERS, OR SUPPLIERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF (OR INABILITY TO ACCESS OR USE) THE SERVICES.

6. MODIFICATION OF TERMS
We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We may or may not provide notice of any changes. Your continued use of the service after any changes constitutes acceptance of those changes. It is your responsibility to check this page periodically for updates.

7. AUTO-RENEWAL
All paid subscriptions automatically renew for additional periods equal to the expiring subscription term unless canceled at least 24 hours before the end of the current period. You authorize us to charge your payment method for the renewal subscription. Cancellation will take effect on the next billing cycle.`;

// ─── APP ──────────────────────────────────────────────────────────────────────
function AppContent() {
  const { state } = useAnalysis();

  const pages = {
    landing: Landing,
    analyze: Analyze,
    'how-it-works': HowItWorks,
    about: About,
  };

  const Page = pages[state.currentPage] || Landing;

  return (
    <div className="grain">
      <Navbar />
      <main>
        <Page />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <>
      <GlobalStyles />
      <AnalysisProvider>
        <AppContent />
      </AnalysisProvider>
    </>
  );
}
