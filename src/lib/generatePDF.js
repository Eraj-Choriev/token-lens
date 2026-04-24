import { jsPDF } from 'jspdf';
import autoTableImport from 'jspdf-autotable';
const autoTable = typeof autoTableImport === 'function'
  ? autoTableImport
  : (autoTableImport.default || autoTableImport.autoTable);

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  dark:     [13,  15,  20],
  dark2:    [22,  27,  36],
  dark3:    [30,  37,  55],
  purple:   [124, 92,  252],
  purpleL:  [167, 139, 250],
  mint:     [0,   196, 140],
  sky:      [0,   152, 255],
  peach:    [255, 122, 64],
  rose:     [255, 77,  126],
  yellow:   [245, 166, 35],
  white:    [255, 255, 255],
  offwhite: [245, 247, 252],
  muted:    [139, 149, 168],
  border:   [228, 232, 240],
  text:     [26,  30,  46],
};

function hex(arr) { return `#${arr.map(v=>v.toString(16).padStart(2,'0')).join('')}`; }
function fmtN(n)  { return n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n/1_000).toFixed(1)}K` : String(Math.round(n)); }
function fmtD(n)  { return `$${Number(n).toFixed(2)}`; }
function today()  { return new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}); }

// ── Low-level helpers ─────────────────────────────────────────────────────────
function fill(doc, x, y, w, h, color, r = 0) {
  doc.setFillColor(...color);
  if (r > 0) doc.roundedRect(x, y, w, h, r, r, 'F');
  else       doc.rect(x, y, w, h, 'F');
}

function txt(doc, str, x, y, opts = {}) {
  const { size = 10, color = C.text, bold = false, align = 'left', italic = false } = opts;
  doc.setFontSize(size);
  doc.setTextColor(...color);
  doc.setFont('helvetica', bold ? (italic ? 'bolditalic' : 'bold') : italic ? 'italic' : 'normal');
  doc.text(String(str), x, y, { align });
}

function hline(doc, x, y, w, color = C.border) {
  doc.setDrawColor(...color);
  doc.setLineWidth(0.4);
  doc.line(x, y, x + w, y);
}

function addPage(doc) {
  doc.addPage();
  fill(doc, 0, 0, 210, 297, C.offwhite);
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function statCard(doc, x, y, w, h, label, value, sub, accentColor) {
  fill(doc, x, y, w, h, C.white, 4);
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, w, h, 4, 4, 'S');
  // accent stripe on left
  fill(doc, x, y + 4, 2.5, h - 8, accentColor, 1);

  txt(doc, label, x + 7, y + 9,  { size: 7.5, color: C.muted });
  txt(doc, value, x + 7, y + 17, { size: 13, bold: true, color: C.text });
  if (sub) txt(doc, sub, x + 7, y + 22, { size: 7, color: C.muted, italic: true });
}

// ── Horizontal bar ────────────────────────────────────────────────────────────
function bar(doc, x, y, w, h, pct, color) {
  fill(doc, x, y, w, h, C.border, 2);
  fill(doc, x, y, Math.max(2, w * Math.min(pct, 100) / 100), h, color, 2);
}

// ═════════════════════════════════════════════════════════════════════════════
export function generatePDF(data) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210, M = 16;

  // ── COVER PAGE ──────────────────────────────────────────────────────────────
  // Dark background
  fill(doc, 0, 0, W, 297, C.dark);

  // Decorative circles
  doc.setFillColor(40, 30, 80);   doc.circle(170, 60,  55, 'F');
  doc.setFillColor(10, 50, 60);   doc.circle(30,  230, 45, 'F');
  doc.setFillColor(20, 40, 70);   doc.circle(190, 220, 30, 'F');

  // Purple + mint gradient strip at top
  fill(doc, 0, 0, W, 3, C.purple);
  for (let i = 0; i < W; i++) {
    const t  = i / W;
    const r  = Math.round(C.purple[0] * (1-t) + C.mint[0] * t);
    const g  = Math.round(C.purple[1] * (1-t) + C.mint[1] * t);
    const b  = Math.round(C.purple[2] * (1-t) + C.mint[2] * t);
    doc.setFillColor(r, g, b);
    doc.rect(i, 0, 1, 3, 'F');
  }

  // Logo badge
  fill(doc, M, 18, 10, 10, C.purple, 3);
  txt(doc, '⚡', M + 2.5, 25.5, { size: 8, color: C.white });

  // Title block
  txt(doc, 'TokenLens', M + 14, 25, { size: 14, bold: true, color: C.white });

  txt(doc, 'Analytics Report', M, 60,   { size: 32, bold: true, color: C.white });
  txt(doc, 'AI Token Usage & Spend Intelligence', M, 72, { size: 13, color: C.purpleL });

  // Divider
  fill(doc, M, 80, 60, 1.5, C.purple, 1);

  txt(doc, `Generated ${today()}`,             M, 93,  { size: 10, color: C.muted });
  txt(doc, `Plan: ${data.planUsage?.plan ?? 'Pro'}`, M, 101, { size: 10, color: C.muted });

  // Big hero stats
  const heroStats = [
    { label: 'Month Tokens',  val: fmtN(data.stats?.month?.tokens ?? 0),   color: C.purple },
    { label: 'Month Spend',   val: fmtD(data.stats?.month?.cost   ?? 0),   color: C.mint   },
    { label: 'All-Time',      val: fmtN(data.stats?.allTime?.tokens ?? 0), color: C.sky    },
    { label: 'Total Requests',val: fmtN(data.stats?.allTime?.requests ?? 0),color: C.yellow },
  ];
  heroStats.forEach((s, i) => {
    const cx = M + i * 44;
    fill(doc, cx, 115, 40, 28, C.dark2, 4);
    doc.setDrawColor(...s.color);
    doc.setLineWidth(0.4);
    doc.roundedRect(cx, 115, 40, 28, 4, 4, 'S');
    txt(doc, s.val,   cx + 20, 128, { size: 14, bold: true, color: C.white, align: 'center' });
    txt(doc, s.label, cx + 20, 135, { size: 7.5, color: s.color, align: 'center' });
  });

  // Decorative quote
  txt(doc, '"Your AI usage, beautifully understood."', W / 2, 220, { size: 11, italic: true, color: C.dark3, align: 'center' });
  fill(doc, 80, 222, 50, 0.5, C.dark3);

  txt(doc, `Confidential — TokenLens v2.0`, W / 2, 285, { size: 8, color: C.dark3, align: 'center' });

  // ── PAGE 2: SUMMARY STATS ─────────────────────────────────────────────────
  addPage(doc);

  // Header bar
  fill(doc, 0, 0, W, 18, C.dark);
  txt(doc, 'Summary Statistics', M, 12, { size: 11, bold: true, color: C.white });
  txt(doc, today(), W - M, 12, { size: 8, color: C.muted, align: 'right' });

  const s = data.stats ?? {};

  // 4×2 grid of stat cards
  const cards = [
    { label:'Tokens Today',      val: fmtN(s.today?.tokens  ?? 0), sub: `${s.today?.requests ?? 0} requests`,  color: C.purple },
    { label:'Today Spend',       val: fmtD(s.today?.cost    ?? 0), sub: 'vs yesterday',                        color: C.rose   },
    { label:'Weekly Tokens',     val: fmtN(s.week?.tokens   ?? 0), sub: `${s.week?.requests ?? 0} requests`,   color: C.sky    },
    { label:'Weekly Spend',      val: fmtD(s.week?.cost     ?? 0), sub: '7-day total',                         color: C.peach  },
    { label:'Monthly Tokens',    val: fmtN(s.month?.tokens  ?? 0), sub: `${s.month?.requests ?? 0} requests`,  color: C.mint   },
    { label:'Monthly Spend',     val: fmtD(s.month?.cost    ?? 0), sub: '30-day total',                        color: C.yellow },
    { label:'All-Time Tokens',   val: fmtN(s.allTime?.tokens ?? 0),sub: 'lifetime total',                      color: C.purple },
    { label:'Avg Tokens/Request',val: fmtN(s.avgTokensPerRequest ?? 0), sub: 'per API call',                   color: C.sky    },
  ];

  const cW = (W - M * 2 - 8) / 4;
  const cH = 28;
  cards.forEach((c, i) => {
    const col = i % 4, row = Math.floor(i / 4);
    statCard(doc, M + col * (cW + 2.7), 24 + row * (cH + 4), cW, cH, c.label, c.val, c.sub, c.color);
  });

  // Plan limits section
  const pu = data.planUsage;
  if (pu) {
    const py = 95;
    txt(doc, 'Plan Usage Limits', M, py, { size: 11, bold: true, color: C.text });
    hline(doc, M, py + 3, W - M * 2, C.border);

    const rows = [
      { label: 'Weekly All-Models', pct: pu.weeklyPct,  color: pu.weeklyPct  >= 90 ? C.rose : pu.weeklyPct  >= 75 ? C.yellow : C.purple, note: `Resets in ${pu.resetLabel}` },
      { label: 'Session Context',   pct: pu.sessionPct, color: pu.sessionPct >= 90 ? C.rose : C.mint,                                     note: 'Resets each session' },
      { label: 'Opus Sub-limit',    pct: pu.opusPct,    color: pu.opusPct    >= 90 ? C.rose : C.rose.map(v=>Math.round(v*0.7)),           note: 'Premium model' },
    ];
    rows.forEach((r, i) => {
      const ry = py + 10 + i * 16;
      txt(doc, r.label, M, ry + 4,    { size: 8.5, color: C.text });
      txt(doc, `${r.pct}%`, 100, ry + 4, { size: 8.5, bold: true, color: r.color, align: 'right' });
      bar(doc, 105, ry, 70, 5, r.pct, r.color);
      txt(doc, r.note, W - M, ry + 4, { size: 7, color: C.muted, align: 'right' });
    });
  }

  // Weekly usage table
  txt(doc, 'Weekly Usage Breakdown', M, 155, { size: 11, bold: true, color: C.text });
  hline(doc, M, 158, W - M * 2, C.border);

  autoTable(doc, {
    startY: 161,
    head: [['Day', 'Input Tokens', 'Output Tokens', 'Total Tokens', 'Cost ($)', 'Requests']],
    body: (data.weekly ?? []).map(d => [
      d.day,
      fmtN(d.input),
      fmtN(d.output),
      fmtN(d.input + d.output),
      d.cost.toFixed(3),
      d.requests,
    ]),
    styles:     { fontSize: 8.5, cellPadding: 3, font: 'helvetica' },
    headStyles: { fillColor: C.dark, textColor: C.white, fontStyle: 'bold', fontSize: 8 },
    alternateRowStyles: { fillColor: [248, 249, 252] },
    columnStyles: { 0: { fontStyle: 'bold' }, 4: { textColor: hex(C.mint) }, 5: { textColor: hex(C.sky) } },
    margin: { left: M, right: M },
    tableLineColor: C.border,
    tableLineWidth: 0.2,
  });

  // ── PAGE 3: TASK BREAKDOWN + MODEL USAGE ─────────────────────────────────
  addPage(doc);
  fill(doc, 0, 0, W, 18, C.dark);
  txt(doc, 'Task Breakdown & Model Intelligence', M, 12, { size: 11, bold: true, color: C.white });

  // Task breakdown with bars
  txt(doc, 'Token Usage by Task Category', M, 26, { size: 11, bold: true, color: C.text });
  hline(doc, M, 29, W - M * 2);

  const tasks = data.taskBreakdown ?? [];
  tasks.sort((a,b) => b.pct - a.pct).forEach((t, i) => {
    const ty = 34 + i * 16;
    fill(doc, M, ty, 4, 10, t.color.startsWith('#') ? [
      parseInt(t.color.slice(1,3),16),
      parseInt(t.color.slice(3,5),16),
      parseInt(t.color.slice(5,7),16),
    ] : C.purple, 1);
    txt(doc, t.label, M + 8, ty + 7.5, { size: 9, color: C.text });
    txt(doc, `${t.pct}%`, 98, ty + 7.5, { size: 9, bold: true, color: C.text, align: 'right' });
    bar(doc, 103, ty + 2.5, 72, 5, t.pct,
        t.color.startsWith('#') ? [
          parseInt(t.color.slice(1,3),16),
          parseInt(t.color.slice(3,5),16),
          parseInt(t.color.slice(5,7),16),
        ] : C.purple);
    txt(doc, `${(tasks.reduce((s,x)=>s+x.value,0)*t.pct/100).toFixed(0)} tasks`, W - M, ty + 7.5, { size: 7.5, color: C.muted, align: 'right' });
  });

  // Project type breakdown
  const projY = 34 + tasks.length * 16 + 10;
  txt(doc, 'Tokens by Project Type', M, projY, { size: 11, bold: true, color: C.text });
  hline(doc, M, projY + 3, W - M * 2);

  autoTable(doc, {
    startY: projY + 7,
    head: [['Project Type', 'Tokens Used', 'Share', 'Trend']],
    body: (data.projects ?? []).map(p => [
      p.label,
      fmtN(p.tokens),
      `${p.pct}%`,
      p.pct >= 25 ? '▲ Primary' : p.pct >= 15 ? '→ Active' : '▽ Minor',
    ]),
    styles:     { fontSize: 8.5, cellPadding: 3 },
    headStyles: { fillColor: C.dark, textColor: C.white, fontStyle: 'bold', fontSize: 8 },
    alternateRowStyles: { fillColor: [248,249,252] },
    columnStyles: {
      0: { fontStyle: 'bold' },
      2: { textColor: hex(C.purple), fontStyle: 'bold' },
      3: { textColor: hex(C.mint) },
    },
    margin: { left: M, right: M },
    tableLineColor: C.border,
    tableLineWidth: 0.2,
  });

  // ── PAGE 4: MODEL INSIGHTS + SKILLS ──────────────────────────────────────
  addPage(doc);
  fill(doc, 0, 0, W, 18, C.dark);
  txt(doc, 'Model Insights & Installed Skills', M, 12, { size: 11, bold: true, color: C.white });

  txt(doc, 'Model Usage Breakdown', M, 26, { size: 11, bold: true, color: C.text });
  hline(doc, M, 29, W - M * 2);

  const modelRows = [
    { model: 'Claude Sonnet 4', tokens: '4.2M', pct: 58, calls: 312, cost: '$12.60', color: C.sky,    note: 'Primary — best value' },
    { model: 'Claude Opus 4',   tokens: '2.0M', pct: 28, calls: 89,  cost: '$30.00', color: C.rose,   note: 'Complex tasks & architecture' },
    { model: 'Claude Haiku 4',  tokens: '1.0M', pct: 14, calls: 201, cost: '$0.80',  color: C.mint,   note: 'Fast completions & triage' },
  ];

  modelRows.forEach((m, i) => {
    const my = 34 + i * 32;
    fill(doc, M, my, W - M * 2, 28, C.white, 4);
    doc.setDrawColor(...C.border); doc.setLineWidth(0.3);
    doc.roundedRect(M, my, W - M * 2, 28, 4, 4, 'S');
    fill(doc, M, my + 4, 3, 20, m.color, 1);

    txt(doc, m.model, M + 7, my + 9, { size: 10, bold: true, color: C.text });
    txt(doc, m.note,  M + 7, my + 15, { size: 7.5, color: C.muted, italic: true });
    txt(doc, m.tokens, M + 7, my + 22, { size: 8, color: C.text });

    bar(doc, 75, my + 18, 65, 4, m.pct, m.color);
    txt(doc, `${m.pct}%`, 143, my + 22, { size: 9, bold: true, color: m.color });
    txt(doc, `${m.calls} calls`, 158, my + 11, { size: 8, color: C.muted, align: 'right' });
    txt(doc, m.cost, 158, my + 19, { size: 8.5, bold: true, color: C.text, align: 'right' });
  });

  // Skills table
  const skillY = 34 + modelRows.length * 32 + 8;
  txt(doc, `Installed Skills (${(data.skills ?? []).length})`, M, skillY, { size: 11, bold: true, color: C.text });
  hline(doc, M, skillY + 3, W - M * 2);

  autoTable(doc, {
    startY: skillY + 7,
    head: [['Skill', 'Tokens Used', 'API Calls', 'Share of Skill Usage']],
    body: [...(data.skills ?? [])].sort((a,b)=>b.tokensUsed-a.tokensUsed).map(sk => {
      const total = (data.skills ?? []).reduce((s,x)=>s+x.tokensUsed,0);
      return [sk.name, fmtN(sk.tokensUsed), sk.calls, `${Math.round(sk.tokensUsed/total*100)}%`];
    }),
    styles:     { fontSize: 8.5, cellPadding: 3 },
    headStyles: { fillColor: C.dark, textColor: C.white, fontStyle: 'bold', fontSize: 8 },
    alternateRowStyles: { fillColor: [248,249,252] },
    columnStyles: {
      1: { textColor: hex(C.purple), fontStyle: 'bold' },
      2: { textColor: hex(C.sky) },
      3: { textColor: hex(C.mint), fontStyle: 'bold' },
    },
    margin: { left: M, right: M },
    tableLineColor: C.border,
    tableLineWidth: 0.2,
  });

  // ── PAGE 5: MONTHLY CHART + EFFICIENCY ───────────────────────────────────
  addPage(doc);
  fill(doc, 0, 0, W, 18, C.dark);
  txt(doc, 'Monthly Overview & Efficiency Recommendations', M, 12, { size: 11, bold: true, color: C.white });

  // Mini bar chart of monthly data
  txt(doc, '30-Day Token Activity', M, 26, { size: 11, bold: true, color: C.text });
  hline(doc, M, 29, W - M * 2);

  const monthly = data.monthly ?? [];
  const chartX = M, chartY = 33, chartW = W - M * 2, chartH = 45;
  fill(doc, chartX, chartY, chartW, chartH, C.white, 4);
  doc.setDrawColor(...C.border); doc.setLineWidth(0.3);
  doc.roundedRect(chartX, chartY, chartW, chartH, 4, 4, 'S');

  const maxTok = Math.max(...monthly.map(d => d.tokens), 1);
  const barW   = (chartW - 8) / monthly.length;
  monthly.forEach((d, i) => {
    const bh  = ((d.tokens / maxTok) * (chartH - 14));
    const bx  = chartX + 4 + i * barW;
    const by  = chartY + chartH - 5 - bh;
    const t   = i / monthly.length;
    const r   = Math.round(C.purple[0] * (1-t) + C.sky[0] * t);
    const g   = Math.round(C.purple[1] * (1-t) + C.sky[1] * t);
    const b   = Math.round(C.purple[2] * (1-t) + C.sky[2] * t);
    doc.setFillColor(r, g, b);
    doc.roundedRect(bx, by, Math.max(barW - 1, 1), bh, 0.5, 0.5, 'F');
    // label every 5 days
    if (i % 5 === 0) txt(doc, d.label, bx + barW/2, chartY + chartH - 1, { size: 5.5, color: C.muted, align: 'center' });
  });

  // Monthly summary stats row
  const mSumY = chartY + chartH + 8;
  const mTotal = monthly.reduce((s,d)=>s+d.tokens,0);
  const mCost  = monthly.reduce((s,d)=>s+d.cost,0);
  const mPeak  = Math.max(...monthly.map(d=>d.tokens));
  const mAvg   = mTotal / monthly.length;
  [
    { label:'30-day total', val: fmtN(mTotal) },
    { label:'Total cost',   val: `$${mCost.toFixed(2)}` },
    { label:'Peak day',     val: fmtN(mPeak) },
    { label:'Daily average',val: fmtN(mAvg) },
  ].forEach((c, i) => {
    const cx = M + i * 44;
    fill(doc, cx, mSumY, 42, 22, C.white, 3);
    doc.setDrawColor(...C.border); doc.setLineWidth(0.2);
    doc.roundedRect(cx, mSumY, 42, 22, 3, 3, 'S');
    txt(doc, c.val,   cx + 21, mSumY + 10, { size: 11, bold: true, color: C.text,  align: 'center' });
    txt(doc, c.label, cx + 21, mSumY + 17, { size: 7,  color: C.muted,             align: 'center' });
  });

  // Efficiency tips
  const tipY = mSumY + 30;
  txt(doc, 'AI Efficiency Recommendations', M, tipY, { size: 11, bold: true, color: C.text });
  hline(doc, M, tipY + 3, W - M * 2);

  const tips = data.efficiencyTips ?? [];
  const impactColor = { High: C.rose, Medium: C.yellow, Low: C.mint };

  tips.slice(0, 5).forEach((tip, i) => {
    const ty = tipY + 9 + i * 22;
    const ic = impactColor[tip.impact] || C.muted;
    // card bg
    fill(doc, M, ty, W - M * 2, 18, C.white, 3);
    doc.setDrawColor(...ic); doc.setLineWidth(0.4);
    doc.roundedRect(M, ty, W - M * 2, 18, 3, 3, 'S');
    fill(doc, M, ty + 3, 2.5, 12, ic, 1);

    txt(doc, tip.title, M + 7, ty + 7.5, { size: 8.5, bold: true, color: C.text });
    txt(doc, `[${tip.impact} impact]`, W - M - 2, ty + 7.5, { size: 7, bold: true, color: ic, align: 'right' });

    const bodyLines = doc.splitTextToSize(tip.body, W - M * 2 - 10);
    txt(doc, bodyLines[0] ?? '', M + 7, ty + 13.5, { size: 7.5, color: C.muted });
  });

  // ── PAGE 6: RECENT REQUESTS TABLE ────────────────────────────────────────
  addPage(doc);
  fill(doc, 0, 0, W, 18, C.dark);
  txt(doc, 'Recent API Request Log', M, 12, { size: 11, bold: true, color: C.white });

  txt(doc, 'Last 12 Requests', M, 26, { size: 11, bold: true, color: C.text });
  hline(doc, M, 29, W - M * 2);

  autoTable(doc, {
    startY: 33,
    head: [['#', 'Task Category', 'Model', 'Input', 'Output', 'Total', 'Cost', 'Time']],
    body: (data.recentRequests ?? []).map((r, i) => [
      i + 1,
      r.task?.label ?? '—',
      r.model?.includes('opus')   ? 'Opus'   :
      r.model?.includes('sonnet') ? 'Sonnet' :
      r.model?.includes('haiku')  ? 'Haiku'  : r.model ?? '—',
      fmtN(r.input),
      fmtN(r.output),
      fmtN(r.total),
      `$${r.cost.toFixed(4)}`,
      r.minsAgo < 1 ? 'now' : `${r.minsAgo}m ago`,
    ]),
    styles:     { fontSize: 8.5, cellPadding: 3 },
    headStyles: { fillColor: C.dark, textColor: C.white, fontStyle: 'bold', fontSize: 8 },
    alternateRowStyles: { fillColor: [248,249,252] },
    columnStyles: {
      0: { textColor: hex(C.muted), cellWidth: 8 },
      1: { fontStyle: 'bold' },
      2: { textColor: hex(C.sky) },
      6: { textColor: hex(C.mint), fontStyle: 'bold' },
      7: { textColor: hex(C.muted) },
    },
    margin: { left: M, right: M },
    tableLineColor: C.border,
    tableLineWidth: 0.2,
  });

  // ── FOOTER on every page ──────────────────────────────────────────────────
  const pages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    fill(doc, 0, 289, W, 8, C.dark);
    txt(doc, 'TokenLens · AI Usage Analytics', M, 294.5, { size: 7, color: C.dark3 });
    txt(doc, `Page ${p} of ${pages}`, W / 2, 294.5, { size: 7, color: C.dark3, align: 'center' });
    txt(doc, `Generated ${today()}`, W - M, 294.5, { size: 7, color: C.dark3, align: 'right' });
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  const filename = `tokenlens-report-${new Date().toISOString().slice(0,10)}.pdf`;
  doc.save(filename);
}
