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

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randF(min, max, d = 2) { return parseFloat((Math.random() * (max - min) + min).toFixed(d)); }

export function generateWeeklyData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, i) => ({
    day,
    input:  rand(8000,  95000),
    output: rand(2000,  40000),
    cost:   randF(0.05, 4.5),
    requests: rand(5, 80),
  }));
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

export function generateStats() {
  const weekTokens  = rand(280000, 1200000);
  const weekCost    = randF(8, 85);
  const todayTokens = Math.round(weekTokens * randF(0.08, 0.22));
  const todayCost   = parseFloat((weekCost * randF(0.08, 0.22)).toFixed(2));
  const allTimeTokens = weekTokens * rand(4, 18);
  const allTimeCost   = parseFloat((weekCost * rand(4, 18)).toFixed(2));

  return {
    today:   { tokens: todayTokens,   cost: todayCost,   requests: rand(10, 120) },
    week:    { tokens: weekTokens,    cost: weekCost,    requests: rand(80, 800) },
    allTime: { tokens: allTimeTokens, cost: allTimeCost, requests: rand(400, 5000) },
    avgTokensPerRequest: rand(800, 6000),
    avgCostPerRequest:   randF(0.01, 0.12),
    topModel: 'claude-sonnet-4-6',
    efficiency: rand(72, 97),
  };
}
