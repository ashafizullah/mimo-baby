'use client';

import { useEffect, useState } from 'react';

/* ------------------------------------------------------------------ */
/* Baby-language strings (EN + ID)                                     */
/* ------------------------------------------------------------------ */
const T = {
  en: {
    eyebrow: 'the training page, in baby words',
    title: 'MiMo v2.6 is learning! 👶',
    subtitle:
      "MiMo v2.6 is a big thinking machine made by Xiaomi. It's learning to write computer programs the way a baby learns to walk: by doing, checking, and trying again. This page shows how it's doing. It refreshes every 10 seconds.",
    updated: 'refreshed {t}',
    big: 'The big one',
    fast: 'The fast one',
    bigNote: '(named mimo-v2.6-pro)',
    fastNote: '(named mimo-v2.6-flash)',
    live: 'learning right now! 🟢',
    done: 'all done 😴',
    rounds: 'did {n} practice rounds',
    current: 'round {n} is {p}% done',
    score: 'it passed {s} out of 100 little tests',
    better: 'last round: a little better 📈',
    worse: 'last round: a little harder (that\u2019s normal!) 📉',
    words: 'it chewed on {t} words so far',
    cost: 'training cost so far: about {c} - that is {cidr}! (1 dollar = 17,800 rupiah)',
    restarts: 'started over {n} times. machines rest sometimes. that\u2019s ok 💤',
    started: 'started learning {d}',
    chart: 'its test score, round by round',
    books: 'the homework books it\u2019s using right now',
    bk_code: 'coding',
    bk_visual: 'pictures',
    bk_general: 'everyday stuff',
    bk_chat: 'chatting',
    bk_cyber: 'cyber safety',
    bk_other: 'other',
    testTitle: 'the big test (named DeepSWE)',
    testBody: '{who} got {score} out of 100, at round {step}',
    testUp: 'both went up since the first round. proud! 🎯',
    testFlat: 'the scores are moving around. still learning! 🌱',
    notes: 'notes from the grown-ups',
    err: 'oh no! the page couldn\u2019t reach the robot just now. it will try again in 10 seconds.',
    errFace: '🙈',
    footerPre: 'This page is a friendly re-skin of the official MiMo v2.6 RL dashboard.',
    footerLink: 'See the original at mimo.xiaomi.com/rl',
    footerPost: 'Data is straight from Xiaomi\u2019s MiMo team. We are not Xiaomi. Not affiliated.',
  },
  id: {
    eyebrow: 'halaman belajarnya, versi kata-kata bayi',
    title: 'MiMo v2.6 lagi belajar! 👶',
    subtitle:
      'MiMo v2.6 itu mesin berpikir raksasa buatan Xiaomi. Dia belajar bikin program komputer, caranya kayak bayi belajar jalan: coba, cek, terus ulangan. Halaman ini nunjukin dia sejauh mana. Auto-refresh tiap 10 detik.',
    updated: 'baru di-refresh {t}',
    big: 'Yang besar',
    fast: 'Yang cepat',
    bigNote: '(nama: mimo-v2.6-pro)',
    fastNote: '(nama: mimo-v2.6-flash)',
    live: 'lagi belajar sekarang! 🟢',
    done: 'udah selesai 😴',
    rounds: 'udah ngerjain {n} ronde latihan',
    current: 'ronde {n} baru {p}% selesai',
    score: 'dia bener {s} dari 100 soal kecil',
    better: 'ronde terakhir: naek dikit 📈',
    worse: 'ronde terakhir: susah dikit (normal kok!) 📉',
    words: 'udah "ngemil" {t} kata',
    cost: 'biaya belajarnya sejauh ini: sekitar {c} - itu {cidr}! (1 dollar = 17.800 rupiah)',
    restarts: 'mulai ulang {n} kali. mesin kadang istirahat. wajar 💤',
    started: 'mulai belajar {d}',
    chart: 'skor soalnya, ronde per ronde',
    books: 'buku latihannya sekarang',
    bk_code: 'koding',
    bk_visual: 'gambar',
    bk_general: 'urusan sehari-hari',
    bk_chat: 'ngobrol',
    bk_cyber: 'keamanan siber',
    bk_other: 'lainnya',
    testTitle: 'tes besar (namanya DeepSWE)',
    testBody: '{who} dapat {score} dari 100, di ronde {step}',
    testUp: 'dua-duanya naik sejak ronde pertama. bangga! 🎯',
    testFlat: 'skornya masih naik-turun. emang lagi belajar! 🌱',
    notes: 'catatan dari orang dewasanya',
    err: 'adaaaaah! halaman tadi nggak bisa nyampe ke robotnya. 10 detik lagi dicoba lagi.',
    errFace: '🙈',
    footerPre: 'Halaman ini versi temen dari dashboard resmi MiMo v2.6 RL.',
    footerLink: 'Lihat yang aslinya di mimo.xiaomi.com/rl',
    footerPost: 'Datanya langsung dari tim MiMo Xiaomi. Kita bukan Xiaomi. Nggak berafiliasi.',
  },
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
async function fetchUpstream(name, run) {
  const qs = run ? `?run=${encodeURIComponent(run)}` : '';
  const r = await fetch(`/api/mimo/api/${name}${qs}`, { cache: 'no-store' });
  if (!r.ok) throw new Error(`${r.status} from /api/mimo/api/${name}`);
  const j = await r.json();
  if (!j.ok) throw new Error(j.error || `upstream ${j.upstream_status}`);
  return j.data;
}

function nf(n, lang, digits = 1) {
  return new Intl.NumberFormat(lang === 'id' ? 'id-ID' : 'en-US', {
    maximumFractionDigits: digits,
  }).format(n);
}

function bigWords(n, lang) {
  const l = lang === 'id' ? 'id-ID' : 'en-US';
  if (n >= 1e9) return `${nf(n / 1e9, lang)} ${lang === 'id' ? 'miliar' : 'billion'}`;
  if (n >= 1e6) return `${nf(n / 1e6, lang)} ${lang === 'id' ? 'juta' : 'million'}`;
  return nf(n, lang, 0);
}

function bigRupiah(n, lang) {
  if (n >= 1e9) return `${nf(n / 1e9, lang)} ${lang === 'id' ? 'miliar' : 'billion'} ${lang === 'id' ? 'rupiah' : 'IDR'}`;
  if (n >= 1e6) return `${nf(n / 1e6, lang)} ${lang === 'id' ? 'juta' : 'million'} ${lang === 'id' ? 'rupiah' : 'IDR'}`;
  return `${nf(n, lang, 0)} ${lang === 'id' ? 'rupiah' : 'IDR'}`;
}

function fmtDate(ts, lang) {
  return new Date(ts * 1000).toLocaleDateString(
    lang === 'id' ? 'id-ID' : 'en-US',
    { day: 'numeric', month: 'short', year: 'numeric' }
  );
}

function fill(tpl, vars) {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
}

const CATEGORY_KEYS = ['code', 'visual', 'general', 'chat', 'cyber'];

function bookCounts(ds, t) {
  const counts = {};
  for (const key of Object.keys(ds || {})) {
    const cat = key.split('/')[0];
    counts[cat] = (counts[cat] || 0) + 1;
  }
  const order = [...CATEGORY_KEYS, ...Object.keys(counts).filter((c) => !CATEGORY_KEYS.includes(c))];
  return order
    .filter((c) => counts[c])
    .map((c) => ({ c, n: counts[c], label: t[`bk_${c}`] || c }));
}

/* ------------------------------------------------------------------ */
/* Small components                                                    */
/* ------------------------------------------------------------------ */
function TrendChart({ events, accent, label }) {
  const pts = (events || []).filter((e) => e.kind === 'step');
  if (pts.length < 2) return <p className="trend-label">{label} (…)</p>;
  const w = 560;
  const h = 170;
  const pad = 26;
  const vals = pts.map((p) => p.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 0.05;
  const x = (i) => pad + (i / (pts.length - 1)) * (w - 2 * pad);
  const y = (v) => h - pad - ((v - min) / span) * (h - 2 * pad);
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const last = pts[pts.length - 1];
  return (
    <>
      <p className="trend-label">{label}</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="trend" role="img" aria-label={label}>
        <path d={path} fill="none" stroke={accent} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={x(i)} cy={y(p.value)} r="4.5" fill={accent} />
        ))}
        <text x={w - pad} y={y(last.value) - 12} textAnchor="end" fill={accent} fontSize="14" fontWeight="700">
          {Math.round(last.value * 100)}%
        </text>
      </svg>
    </>
  );
}

function RunCard({ t, st, live, kind, lang }) {
  const accent = kind === 'pro' ? '#a78bfa' : '#38bdf8';
  const face = kind === 'pro' ? '🐘' : '⚡';
  const step = st?.step;
  const events = st?.events || [];
  const lastStep = events.filter((e) => e.kind === 'step').slice(-1)[0];
  const pass = live?.latest?.passrate;
  const improved = lastStep && lastStep.delta >= 0;
  const books = bookCounts(live?.latest?.ds, t);
  const isLive = st?.run?.mode === 'live';
  const rows = [];
  if (step) rows.push([fill(t.rounds, { n: step.last }), fill(t.current, { n: step.last + 1, p: Math.round((step.progress || 0) * 100) })]);
  if (pass != null) rows.push([fill(t.score, { s: nf(pass * 100, lang, 0) }), lastStep ? (improved ? t.better : t.worse) : '']);
  if (st?.totals?.tokens_cum) rows.push([fill(t.words, { t: bigWords(st.totals.tokens_cum, lang) }), '']);
  if (st?.cost?.so_far) {
    const usd = Math.round(st.cost.so_far / 1000) * 1000;
    const cidr = usd * 17800; // fixed rate: 1 USD = 17,800 IDR
    const usdLabel = `US$ ${nf(usd, lang, 0)}`;
    rows.push([fill(t.cost, { c: usdLabel, cidr: bigRupiah(cidr, lang) }), '']);
  }
  if (st?.totals?.restarts) rows.push([fill(t.restarts, { n: st.totals.restarts }), '']);
  if (st?.run?.start) rows.push([fill(t.started, { d: fmtDate(st.run.start, lang) }), '']);

  return (
    <div className="card">
      <h2>
        <span>{face}</span>
        {kind === 'pro' ? t.big : t.fast} <span className="note">{kind === 'pro' ? t.bigNote : t.fastNote}</span>
      </h2>
      <span className={`chip ${isLive ? 'live' : 'done'}`}>{isLive ? t.live : t.done}</span>
      <div>
        {rows.map(([k, v], i) => (
          <div className="line" key={i}>
            <span className="k">{k}</span>
            {v ? <span className="v">{v}</span> : <span />}
          </div>
        ))}
      </div>
      <TrendChart events={events} accent={accent} label={t.chart} />
      {books.length > 0 && (
        <div className="books">
          <span className="book" style={{ opacity: 0.7 }}>{t.books}</span>
          {books.map((b) => (
            <span className="book" key={b.c}>
              {b.label} × {b.n}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Benchmark({ t, b, lang }) {
  const r = b?.benchmarks?.[0];
  if (!r) return null;
  const pick = (key) => {
    const m = r.results?.[key];
    if (!m) return null;
    const steps = Object.keys(m).map(Number);
    const lastStep = Math.max(...steps);
    const firstStep = Math.min(...steps);
    return { who: key, score: m[lastStep], step: lastStep, up: m[lastStep] >= m[firstStep] };
  };
  const pro = pick('pro');
  const flash = pick('flash');
  const bothUp = pro && flash && pro.up && flash.up;
  return (
    <div className="card">
      <h3 style={{ margin: '0 0 14px', fontSize: 20 }}>
        🎯 {t.testTitle}
      </h3>
      <div className="scorecards">
        {[pro, flash].filter(Boolean).map((s) => (
          <div className="scorecard" key={s.who}>
            <div className="who">{s.who === 'pro' ? t.big : t.fast}</div>
            <div className="big" style={{ color: s.who === 'pro' ? '#a78bfa' : '#38bdf8' }}>
              {nf(s.score, lang, 1)}
            </div>
            <div className="hint">{fill(t.testBody, { who: s.who === 'pro' ? t.big : t.fast, score: nf(s.score, lang, 1), step: s.step })}</div>
          </div>
        ))}
      </div>
      <p className="trend-label" style={{ marginTop: 12 }}>
        {bothUp ? t.testUp : t.testFlat}
      </p>
    </div>
  );
}

function Notices({ t, notices, lang }) {
  const list = notices?.notices || [];
  if (list.length === 0) return null;
  return (
    <div className="card">
      <h3 style={{ margin: '0 0 8px', fontSize: 20 }}>🧑‍🏫 {t.notes}</h3>
      {list.slice(0, 3).map((n) => (
        <div className="notice" key={n.id}>
          <p>“{n.text}”</p>
          <span className="when">{fmtDate(n.t, lang)}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function Page() {
  const [lang, setLang] = useState('id');
  const [d, setD] = useState(null);
  const [err, setErr] = useState(null);
  const [refreshed, setRefreshed] = useState(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const [sp, sf, lp, lf, bench, notices] = await Promise.all([
          fetchUpstream('status', 'pro'),
          fetchUpstream('status', 'flash'),
          fetchUpstream('live', 'pro'),
          fetchUpstream('live', 'flash'),
          fetchUpstream('benchmarks'),
          fetchUpstream('notices'),
        ]);
        if (!alive) return;
        setD({ sp, sf, lp, lf, bench, notices });
        setErr(null);
        setRefreshed(new Date());
      } catch (e) {
        if (alive) setErr(e);
      }
    }
    load();
    const t = setInterval(load, 10000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const t = T[lang];

  return (
    <div className="wrap">
      <div className="top">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="sub">{t.subtitle}</p>
          {refreshed && (
            <p className="updated">
              {fill(t.updated, {
                t: refreshed.toLocaleTimeString(lang === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              })}
            </p>
          )}
        </div>
        <div className="langbar">
          <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>
            EN 🇬🇧
          </button>
          <button className={lang === 'id' ? 'on' : ''} onClick={() => setLang('id')}>
            ID 🇮🇩
          </button>
        </div>
      </div>

      {err && !d ? (
        <div className="card errcard" style={{ marginTop: 26 }}>
          <div className="face">{t.errFace}</div>
          <p>{t.err}</p>
        </div>
      ) : (
        <>
          <div className="grid">
            <RunCard t={t} st={d?.sp} live={d?.lp} kind="pro" lang={lang} />
            <RunCard t={t} st={d?.sf} live={d?.lf} kind="flash" lang={lang} />
          </div>
          <div className="section">
            <Benchmark t={t} b={d?.bench} lang={lang} />
          </div>
          <div className="section">
            <Notices t={t} notices={d?.notices} lang={lang} />
          </div>
        </>
      )}

      <footer>
        {t.footerPre}{' '}
        <a href="https://mimo.xiaomi.com/rl/" target="_blank" rel="noopener noreferrer">
          {t.footerLink} ↗
        </a>
        . {t.footerPost}
      </footer>
    </div>
  );
}
