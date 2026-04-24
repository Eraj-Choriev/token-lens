// ─── Pricing (per 1M tokens, USD) ───────────────────────────────────────────
export const PRICING = {
  'claude-opus-4-7':    { input: 15,  output: 75,  cacheWrite: 18.75, cacheRead: 1.5  },
  'claude-sonnet-4-6':  { input: 3,   output: 15,  cacheWrite: 3.75,  cacheRead: 0.3  },
  'claude-haiku-4-5':   { input: 0.8, output: 4,   cacheWrite: 1.0,   cacheRead: 0.08 },
};

export const MODEL_META = {
  'claude-opus-4-7':   { label: 'Claude Opus 4',   color: '#FF6B9D', bg: '#FFD6E0', short: 'Opus'   },
  'claude-sonnet-4-6': { label: 'Claude Sonnet 4', color: '#0098FF', bg: '#C3E8FF', short: 'Sonnet' },
  'claude-haiku-4-5':  { label: 'Claude Haiku 4',  color: '#00C48C', bg: '#C6F6E8', short: 'Haiku'  },
};

export const TASK_CATEGORIES = [
  { id: 'coding',    label: 'Coding & Dev',    color: '#7C5CFC', bg: '#E5DCFF' },
  { id: 'writing',   label: 'Writing & Docs',  color: '#0098FF', bg: '#C3E8FF' },
  { id: 'analysis',  label: 'Data Analysis',   color: '#00C48C', bg: '#C6F6E8' },
  { id: 'research',  label: 'Research',        color: '#F5A623', bg: '#FFF0C2' },
  { id: 'creative',  label: 'Creative',        color: '#FF4D7E', bg: '#FFD6E0' },
  { id: 'other',     label: 'Other',           color: '#8B95A8', bg: '#F0F2F7' },
];

export const PLAN_LIMITS = {
  Pro:   { weeklyAll: 44_000_000,  sessionLimit: 200_000, label: 'Pro',   color: '#7C5CFC' },
  Max5:  { weeklyAll: 88_000_000,  sessionLimit: 200_000, label: 'Max 5', color: '#0098FF' },
  Max20: { weeklyAll: 220_000_000, sessionLimit: 200_000, label: 'Max 20',color: '#00C48C' },
};

export const INSTALLED_SKILLS = [
  { id: 'frontend-design', name: 'Frontend Design',   icon: '🎨', tokensUsed: 84200,  calls: 23 },
  { id: 'claude-api',      name: 'Claude API Builder', icon: '🤖', tokensUsed: 61500,  calls: 18 },
  { id: 'pdf',             name: 'PDF Tools',          icon: '📄', tokensUsed: 34800,  calls: 41 },
  { id: 'xlsx',            name: 'Spreadsheet Tools',  icon: '📊', tokensUsed: 29100,  calls: 29 },
  { id: 'pptx',            name: 'PowerPoint Tools',   icon: '📑', tokensUsed: 17600,  calls: 12 },
  { id: 'docx',            name: 'Word Docs',          icon: '📝', tokensUsed: 12300,  calls: 8  },
  { id: 'mcp-builder',     name: 'MCP Builder',        icon: '🔌', tokensUsed: 9800,   calls: 5  },
  { id: 'canvas-design',   name: 'Canvas Design',      icon: '🖼',  tokensUsed: 8200,   calls: 7  },
];

export const PROJECT_TYPES = [
  { id: 'web-app',     label: 'Web App Dev',     color: '#7C5CFC', tokens: 284000, pct: 34 },
  { id: 'data-sci',    label: 'Data Science',    color: '#00C48C', tokens: 183000, pct: 22 },
  { id: 'docs',        label: 'Documentation',   color: '#0098FF', tokens: 124000, pct: 15 },
  { id: 'automation',  label: 'Automation',      color: '#F5A623', tokens: 99000,  pct: 12 },
  { id: 'ml-models',   label: 'AI/ML Projects',  color: '#FF6B9D', tokens: 82000,  pct: 10 },
  { id: 'misc',        label: 'Miscellaneous',   color: '#8B95A8', tokens: 58000,  pct: 7  },
];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randF(min, max, d = 2) { return parseFloat((Math.random() * (max - min) + min).toFixed(d)); }

export function generateWeeklyData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day) => ({
    day,
    input:  rand(8000,  95000),
    output: rand(2000,  40000),
    cost:   randF(0.05, 4.5),
    requests: rand(5, 80),
  }));
}

export function generateMonthlyData() {
  const now = new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (29 - i));
    const label = `${d.getDate()}/${d.getMonth() + 1}`;
    const tokens = rand(15000, 180000);
    return {
      label,
      tokens,
      cost: parseFloat((tokens * 3 / 1_000_000 * randF(0.8, 3.5)).toFixed(3)),
      opus:   Math.round(tokens * randF(0.05, 0.2)),
      sonnet: Math.round(tokens * randF(0.5,  0.7)),
      haiku:  Math.round(tokens * randF(0.1,  0.3)),
    };
  });
}

export function generateHourlyData() {
  return Array.from({ length: 24 }, (_, i) => ({
    hour:     `${String(i).padStart(2,'0')}:00`,
    tokens:   rand(500, 18000),
    requests: rand(0, 20),
  }));
}

export function generateTaskBreakdown() {
  const raw = TASK_CATEGORIES.map(c => ({ ...c, value: rand(5, 35) }));
  const total = raw.reduce((s, c) => s + c.value, 0);
  return raw.map(c => ({ ...c, pct: Math.round(c.value / total * 100) }));
}

export function generateRecentRequests() {
  const models = Object.keys(MODEL_META);
  const tasks  = TASK_CATEGORIES;
  return Array.from({ length: 12 }, (_, i) => {
    const model   = models[rand(0, models.length - 1)];
    const task    = tasks[rand(0, tasks.length - 1)];
    const input   = rand(200, 8000);
    const output  = rand(100, 4000);
    const price   = PRICING[model];
    const cost    = ((input * price.input + output * price.output) / 1_000_000);
    const minsAgo = i * rand(2, 12);
    return { id: i, model, task, input, output, total: input + output, cost, minsAgo };
  });
}

export function generateSessionData() {
  const start = new Date();
  start.setHours(start.getHours() - rand(1, 5));
  const inputTokens  = rand(12000, 85000);
  const outputTokens = rand(4000,  30000);
  const model        = 'claude-sonnet-4-6';
  const price        = PRICING[model];
  const cost         = ((inputTokens * price.input + outputTokens * price.output) / 1_000_000);
  return {
    startTime:     start.toISOString(),
    model,
    inputTokens,
    outputTokens,
    totalTokens:   inputTokens + outputTokens,
    cost,
    requests:      rand(8, 60),
    avgTokensPerRequest: Math.round((inputTokens + outputTokens) / rand(8, 60)),
  };
}

export function generatePlanUsage() {
  const plan = 'Pro';
  const limits = PLAN_LIMITS[plan];
  const weeklyUsed   = rand(6_000_000, 38_000_000);
  const sessionUsed  = rand(20_000, 160_000);
  const opusUsed     = rand(500_000, 4_000_000);
  const now = new Date();
  const nextSunday   = new Date(now);
  nextSunday.setDate(now.getDate() + (7 - now.getDay()));
  nextSunday.setHours(4, 0, 0, 0);
  const resetMins    = Math.floor((nextSunday - now) / 60000);

  return {
    plan,
    limits,
    weeklyUsed,
    weeklyPct:   Math.round(weeklyUsed / limits.weeklyAll * 100),
    sessionUsed,
    sessionPct:  Math.round(sessionUsed / limits.sessionLimit * 100),
    opusUsed,
    opusPct:     Math.round(opusUsed / (limits.weeklyAll * 0.1) * 100),
    resetMins,
    resetLabel: resetMins > 60 ? `${Math.floor(resetMins/60)}h ${resetMins%60}m` : `${resetMins}m`,
  };
}

export function generateStats() {
  const weekTokens  = rand(280000, 1200000);
  const weekCost    = randF(8, 85);
  const todayTokens = Math.round(weekTokens * randF(0.08, 0.22));
  const todayCost   = parseFloat((weekCost * randF(0.08, 0.22)).toFixed(2));
  const allTimeTokens = weekTokens * rand(4, 18);
  const allTimeCost   = parseFloat((weekCost * rand(4, 18)).toFixed(2));
  const monthTokens   = rand(2_800_000, 12_000_000);
  const monthCost     = parseFloat((monthTokens * 3 / 1_000_000 * randF(1.5, 4.0)).toFixed(2));

  return {
    today:   { tokens: todayTokens,   cost: todayCost,   requests: rand(10, 120) },
    week:    { tokens: weekTokens,    cost: weekCost,    requests: rand(80, 800) },
    month:   { tokens: monthTokens,   cost: monthCost,   requests: rand(500, 3000) },
    allTime: { tokens: allTimeTokens, cost: allTimeCost, requests: rand(400, 5000) },
    avgTokensPerRequest: rand(800, 6000),
    avgCostPerRequest:   randF(0.01, 0.12),
    topModel: 'claude-sonnet-4-6',
    efficiency: rand(72, 97),
  };
}

export function generateEfficiencyTips(stats, planUsage) {
  const tips = [];
  const weekPct = planUsage?.weeklyPct ?? 50;
  const topTask = 'Coding & Dev';

  if (weekPct > 70) {
    tips.push({
      id: 'high-usage',
      type: 'warning',
      icon: '⚡',
      title: 'High weekly usage',
      body: `You've used ${weekPct}% of your weekly limit. Switch to Claude Haiku for simple tasks — it's 15× cheaper than Opus.`,
      impact: 'High',
    });
  }
  tips.push({
    id: 'cache',
    type: 'tip',
    icon: '🗂',
    title: 'Enable prompt caching',
    body: 'Your coding sessions repeat large system prompts. Enabling cache writes could cut input costs by up to 50% on repeated context.',
    impact: 'High',
  });
  tips.push({
    id: 'model-routing',
    type: 'tip',
    icon: '🔀',
    title: 'Smarter model routing',
    body: `${topTask} is your top category (34%). Use Haiku for code completions & linting, reserve Sonnet/Opus for architecture decisions.`,
    impact: 'Medium',
  });
  tips.push({
    id: 'batch',
    type: 'tip',
    icon: '📦',
    title: 'Batch similar requests',
    body: 'You make 20+ small requests per session. Batching code review or doc generation saves ~30% on per-request overhead.',
    impact: 'Medium',
  });
  tips.push({
    id: 'output',
    type: 'tip',
    icon: '✂️',
    title: 'Trim output verbosity',
    body: 'Output tokens cost 5× more than input on Sonnet. Add "be concise" to system prompts — can reduce output by 25–40% without quality loss.',
    impact: 'Medium',
  });
  tips.push({
    id: 'haiku-draft',
    type: 'tip',
    icon: '🐣',
    title: 'Draft with Haiku, refine with Sonnet',
    body: 'Use a 2-pass approach: generate first drafts with Haiku, then refine only the sections that need it with Sonnet.',
    impact: 'Low',
  });

  return tips;
}
