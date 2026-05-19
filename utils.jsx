// Shared utility components & hooks
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// --- Format helpers ---
function fmtUSD(n) {
  if (n == null) return "—";
  if (n >= 1e9) return "$" + (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(0) + "K";
  return "$" + n;
}
function fmtNum(n) {
  if (n == null) return "—";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return n.toLocaleString();
  return String(n);
}
function fmtPct(n, digits = 1) {
  return n.toFixed(digits) + "%";
}

// --- Count up hook ---
function useCountUp(target, duration = 1400, deps = []) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start;
    let raf;
    // cubic-bezier(0.16, 1, 0.3, 1) approximation via parametric easeOutExpo blend
    // (Bezier curve in JS is heavy; this curve is visually indistinguishable.)
    const ease = (t) => 1 - Math.pow(1 - t, 4.2);
    const step = (now) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / duration, 1);
      setValue(target * ease(progress));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, ...deps]);
  return value;
}

// --- Theme manager ---
function useThemeMode() {
  const [mode, setMode] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("scaleme-theme") || "light";
  });
  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    localStorage.setItem("scaleme-theme", mode);
  }, [mode]);
  return [mode, setMode];
}

// --- Apply accent ---
function applyAccent(name) {
  const t = window.SCALEME_THEME.accents[name] || window.SCALEME_THEME.accents.teal;
  const r = document.documentElement.style;
  r.setProperty("--accent", t.primary);
  r.setProperty("--accent-soft", t.soft);
  r.setProperty("--accent-line", t.line);
  r.setProperty("--accent-glow", t.glow);
}

// --- Hero canvas: connected-node graph ---
function HeroCanvas({ mode = "particles" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (mode === "off") return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let nodes = [];
    let scanY = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setSize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // re-seed nodes
      const count = mode === "scan" ? 0 : Math.min(70, Math.round((w * h) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: 0.8 + Math.random() * 1.6,
      }));
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(canvas);
    setSize();

    const accent = () => getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#14b8a6";
    const fg = () => getComputedStyle(document.documentElement).getPropertyValue("--fg-muted").trim();

    const tick = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      if (mode === "particles" || mode === "scan") {
        // dot grid
        const spacing = 28;
        ctx.fillStyle = fg() + "30";
        for (let x = spacing; x < w; x += spacing) {
          for (let y = spacing; y < h; y += spacing) {
            const dx = x - w / 2;
            const dy = y - h / 3;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const a = Math.max(0, 1 - dist / 600);
            ctx.globalAlpha = a * 0.7;
            ctx.fillRect(x, y, 1, 1);
          }
        }
        ctx.globalAlpha = 1;
      }

      if (mode === "particles") {
        // edges
        ctx.lineWidth = 1;
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d = Math.sqrt(dx*dx + dy*dy);
            if (d < 130) {
              const alpha = (1 - d / 130) * 0.35;
              ctx.strokeStyle = accent();
              ctx.globalAlpha = alpha;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
        ctx.globalAlpha = 1;
        // nodes
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
          ctx.fillStyle = accent();
          ctx.globalAlpha = 0.6;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      if (mode === "scan") {
        scanY = (scanY + 0.6) % (h + 200);
        const grad = ctx.createLinearGradient(0, scanY - 200, 0, scanY);
        grad.addColorStop(0, accent() + "00");
        grad.addColorStop(0.7, accent() + "15");
        grad.addColorStop(1, accent() + "00");
        ctx.fillStyle = grad;
        ctx.fillRect(0, scanY - 200, w, 200);
      }

      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [mode]);

  if (mode === "off") return null;
  return <canvas ref={ref} aria-hidden="true" />;
}

// --- Sparkline ---
function Sparkline({ data, width = 80, height = 24, stroke = "currentColor" }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${height - ((v - min) / range) * height}`).join(" ");
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <polyline fill="none" stroke={stroke} strokeWidth="1.5" points={points} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// Expose globally for other Babel scripts
Object.assign(window, {
  fmtUSD, fmtNum, fmtPct, useCountUp, useThemeMode, applyAccent, HeroCanvas, Sparkline,
  useState, useEffect, useRef, useMemo, useCallback,
});

// --- URL state sync (shareable views) ---
function useUrlState(initial) {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return initial;
    const p = new URLSearchParams(window.location.search);
    const merged = { ...initial };
    for (const k of Object.keys(initial)) {
      if (p.has(k)) {
        const v = p.get(k);
        merged[k] = v === "" ? null : v;
      }
    }
    return merged;
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(state)) {
      if (v != null && v !== "" && v !== false) p.set(k, String(v));
    }
    const qs = p.toString();
    const url = window.location.pathname + (qs ? "?" + qs : "") + window.location.hash;
    window.history.replaceState(null, "", url);
  }, [state]);
  return [state, setState];
}

// --- Year-range filtering helpers ---
// Given a by_year object and {start, end} (inclusive), return summed totals.
function sumYearRange(byYear, range) {
  if (!range) return null;
  let total = 0, funded = 0, active = 0;
  for (let y = range.start; y <= range.end; y++) {
    const v = byYear[String(y)];
    if (!v) continue;
    total += v.total; funded += v.funded; active += v.active;
  }
  return { total, funded, active };
}

Object.assign(window, { useUrlState, sumYearRange });
