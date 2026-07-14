// CityMitra Gen-Z redesign — shared theme tokens + motion helpers.
// Pages import this from their DC logic class. Styling stays inline in
// templates; these vars feed the var(--x, fallback) references there.

export function cmVars(opts = {}) {
  const night = opts.theme === 'night';
  const glass = opts.cardStyle === 'glass';
  const acc = opts.accent || '#0891B2';
  const mo = Math.max(0, (opts.motion ?? 7) / 7);
  const ultra = (opts.typeScale ?? 'ultra') === 'ultra';

  const grad = 'linear-gradient(135deg,#FB923C,#EA580C 55%,#2563EB)';
  const v = night ? {
    '--bg': '#0B1020',
    '--bg2': '#0E1428',
    '--sur': '#111832',
    '--ink': '#F8FAFC',
    '--mut': '#94A3B8',
    '--line': 'rgba(251,146,60,.16)',
    '--chip': 'rgba(251,146,60,.10)',
    '--card': glass ? 'rgba(17,24,50,.62)' : '#111832',
    '--cardBd': 'rgba(148,163,184,.18)',
    '--cardSh': '0 1px 2px rgba(0,0,0,.4), 0 14px 40px rgba(0,0,0,.35)',
    '--nav': 'rgba(11,16,32,.82)',
    '--orange': '#FB923C',
    '--blue': '#60A5FA',
    '--glow': '0 18px 60px rgba(249,115,22,.30)',
    '--heroA': 'rgba(249,115,22,.22)',
    '--heroB': 'rgba(96,165,250,.18)',
    '--planeBg': '#0E1428',
    '--planeLine': 'rgba(96,165,250,.10)',
    '--blk': 'linear-gradient(180deg,#1A2244,#111832)',
    '--blkSh': '-14px 18px 26px rgba(0,0,0,.5)',
    '--navCta': grad,
    '--navCtaInk': '#FFFFFF',
  } : {
    '--bg': '#FFF7ED',
    '--bg2': '#FFF3E8',
    '--sur': '#FFFFFF',
    '--ink': '#0F172A',
    '--mut': '#64748B',
    '--line': '#F4DFD2',
    '--chip': '#FFEDD5',
    '--card': glass ? 'rgba(255,255,255,.72)' : '#FFFFFF',
    '--cardBd': '#F4DFD2',
    '--cardSh': glass ? '0 10px 30px rgba(234,88,12,.08)' : '0 1px 2px rgba(15,23,42,.04), 0 10px 28px rgba(234,88,12,.06)',
    '--nav': 'rgba(255,247,237,.85)',
    '--orange': '#EA580C',
    '--blue': '#2563EB',
    '--glow': '0 18px 60px rgba(234,88,12,.20)',
    '--heroA': 'rgba(249,115,22,.18)',
    '--heroB': 'rgba(37,99,235,.16)',
    '--planeBg': '#FFF3E8',
    '--planeLine': 'rgba(234,88,12,.10)',
    '--blk': 'linear-gradient(180deg,#FFFFFF,#FFEDD5)',
    '--blkSh': '-14px 18px 26px rgba(234,88,12,.20)',
    '--navCta': grad,
    '--navCtaInk': '#FFFFFF',
  };

  v['--acc'] = acc;
  v['--navCtaSh'] = '0 12px 30px rgba(234,88,12,.32)';
  v['--blur'] = glass ? 'blur(16px) saturate(1.3)' : 'none';
  v['--rad'] = '24px';
  v['--mo'] = String(mo);
  v['--marq'] = mo > 0 ? 'running' : 'paused';
  v['--h1'] = ultra ? 'clamp(64px, 8.2vw, 122px)' : 'clamp(46px, 5.6vw, 84px)';
  v['--h2'] = ultra ? 'clamp(38px, 4vw, 62px)' : 'clamp(30px, 3.2vw, 46px)';
  return v;
}

export const inr = (n) => '\u20B9' + Math.round(n).toLocaleString('en-IN');

// Apply a cmVars() object as CSS custom properties on an element (used via
// ref so templates stay hole-free and paint instantly from var() fallbacks).
export function applyVars(el, vars) {
  if (!el || !vars) return;
  for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v);
}

export const motionOK = () =>
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function fmtNum(v, fmt) {
  if (fmt === 'inr') return inr(v);
  if (fmt === 'plus') return Math.round(v) + '+';
  if (fmt === 'pct') return Math.round(v) + '%';
  return String(Math.round(v));
}

// Animate [data-count] elements from 0 to their data-count value when they
// scroll into view. Base text in markup is the final value (no-JS safe).
export function countUps() {
  const els = Array.from(document.querySelectorAll('[data-count]'));
  const ok = motionOK();
  els.forEach((el) => {
    if (el._cmDone) return;
    const target = parseFloat(el.getAttribute('data-count'));
    const fmt = el.getAttribute('data-fmt') || '';
    if (isNaN(target)) { el._cmDone = true; return; }
    if (!ok) { el._cmDone = true; el.textContent = fmtNum(target, fmt); return; }
    el._cmDone = true;
    const io = new IntersectionObserver((es) => {
      es.forEach((en) => {
        if (!en.isIntersecting || el._cmRan) return;
        el._cmRan = true;
        io.disconnect();
        const t0 = performance.now(), D = 1400;
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / D);
          const e = 1 - Math.pow(1 - p, 3);
          el.textContent = fmtNum(target * e, fmt);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    io.observe(el);
  });
}

// Soft scroll-reveal for [data-reveal] elements. Base state is fully
// visible — we only hide+slide when motion is allowed.
export function reveals(mo = 1) {
  if (!motionOK() || mo <= 0) return;
  const els = Array.from(document.querySelectorAll('[data-reveal]')).filter((e) => !e._cmR);
  const io = new IntersectionObserver((es) => {
    es.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      io.unobserve(el);
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    });
  }, { threshold: 0.1 });
  els.forEach((el) => {
    el._cmR = 1;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.85) return; // already on screen
    el.style.opacity = '0';
    el.style.transform = 'translateY(' + Math.round(26 * mo) + 'px)';
    el.style.transition = 'opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)';
    io.observe(el);
  });
}

// Springy mouse-tilt for the 3D hero scene. Returns a cleanup fn.
export function tilt(el, { baseX = 52, baseZ = -38, amp = 6 } = {}) {
  if (!el || !motionOK() || amp <= 0) return () => {};
  const zone = el.closest('[data-tilt-zone]') || el.parentElement;
  let tx = 0, tz = 0, cx = 0, cz = 0, raf = null;
  const loop = () => {
    raf = requestAnimationFrame(() => {
      cx += (tx - cx) * 0.08;
      cz += (tz - cz) * 0.08;
      el.style.transform = 'rotateX(' + (baseX + cx) + 'deg) rotateZ(' + (baseZ + cz) + 'deg)';
      if (Math.abs(tx - cx) + Math.abs(tz - cz) > 0.01) loop();
      else raf = null;
    });
  };
  const mm = (e) => {
    const r = zone.getBoundingClientRect();
    tx = ((e.clientY - r.top) / r.height - 0.5) * -2 * amp;
    tz = ((e.clientX - r.left) / r.width - 0.5) * 2 * amp;
    if (!raf) loop();
  };
  const leave = () => { tx = 0; tz = 0; if (!raf) loop(); };
  zone.addEventListener('mousemove', mm);
  zone.addEventListener('mouseleave', leave);
  return () => {
    zone.removeEventListener('mousemove', mm);
    zone.removeEventListener('mouseleave', leave);
    if (raf) cancelAnimationFrame(raf);
  };
}

// Theme boot shared by every page: resolves saved theme, listens for the
// nav's toggle event, keeps body background in sync.
export function themeOf(comp) {
  return comp.state.theme || comp.props.theme || 'light';
}
export function syncBody(theme) {
  document.body.style.background = theme === 'night' ? '#0B1020' : '#FFF7ED';
}
