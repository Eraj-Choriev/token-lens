import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TASK_CATEGORIES } from '../data/mockData';

const GRID_COLOR = '#E4E8F0';
const AXIS_COLOR = '#8B95A8';

function ChartTooltip({ active, payload, label, prefix = '', suffix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[rgba(13,15,20,0.92)] border border-white/10 rounded-xl px-3 py-2 shadow-xl">
      <p className="text-[#9CABC4] text-xs mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-white text-sm font-medium" style={{ color: p.color }}>
          {p.name}: {prefix}{typeof p.value === 'number' && p.value >= 1000
            ? p.value >= 1_000_000
              ? (p.value / 1_000_000).toFixed(2) + 'M'
              : (p.value / 1000).toFixed(1) + 'K'
            : p.value}{suffix}
        </p>
      ))}
    </div>
  );
}

export function WeeklyUsageChart({ data, loading }) {
  if (loading) return <div className="shimmer-bg rounded-2xl h-full min-h-[200px]" />;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gradInput" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#7C5CFC" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#7C5CFC" stopOpacity={0}    />
          </linearGradient>
          <linearGradient id="gradOutput" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#00C48C" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#00C48C" stopOpacity={0}    />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="day" tick={{ fill: AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={false} tickLine={false}
               tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
        <Tooltip content={<ChartTooltip suffix=" tok" />} />
        <Legend formatter={v => <span style={{ color: AXIS_COLOR, fontSize: 12 }}>{v}</span>} />
        <Area type="monotone" dataKey="input"  name="Input"  stroke="#7C5CFC" strokeWidth={2.5}
              fill="url(#gradInput)"  dot={false} activeDot={{ r: 4, fill: '#7C5CFC' }} />
        <Area type="monotone" dataKey="output" name="Output" stroke="#00C48C" strokeWidth={2.5}
              fill="url(#gradOutput)" dot={false} activeDot={{ r: 4, fill: '#00C48C' }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function HourlyChart({ data, loading }) {
  if (loading) return <div className="shimmer-bg rounded-2xl h-full min-h-[200px]" />;
  const slice = data?.slice(6, 22) || [];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={slice} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7C5CFC" stopOpacity={1}   />
            <stop offset="100%" stopColor="#0098FF" stopOpacity={0.7} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="hour" tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={false} tickLine={false}
               tickFormatter={v => v.slice(0,2)} />
        <YAxis tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={false} tickLine={false}
               tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
        <Tooltip content={<ChartTooltip suffix=" tok" />} />
        <Bar dataKey="tokens" name="Tokens" fill="url(#barGrad)" radius={[6,6,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TaskPieChart({ data, loading }) {
  if (loading) return <div className="shimmer-bg rounded-2xl h-full min-h-[200px]" />;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data} cx="50%" cy="50%"
          innerRadius="55%" outerRadius="80%"
          paddingAngle={3} dataKey="value"
          animationBegin={0} animationDuration={800}
        >
          {data?.map((entry, i) => (
            <Cell key={i} fill={entry.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return (
              <div className="bg-[rgba(13,15,20,0.92)] border border-white/10 rounded-xl px-3 py-2 shadow-xl">
                <p className="text-white text-sm font-medium">{d.label}</p>
                <p style={{ color: d.color }} className="text-sm">{d.pct}% · {(d.value).toFixed(0)} tasks</p>
              </div>
            );
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function CostBarChart({ data, loading }) {
  if (loading) return <div className="shimmer-bg rounded-2xl h-full min-h-[200px]" />;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barSize={20}>
        <defs>
          <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#FF6B9D" />
            <stop offset="100%" stopColor="#FF4D7E" stopOpacity={0.7} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="day" tick={{ fill: AXIS_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={false} tickLine={false}
               tickFormatter={v => `$${v.toFixed(1)}`} />
        <Tooltip content={<ChartTooltip prefix="$" />} />
        <Bar dataKey="cost" name="Cost" fill="url(#costGrad)" radius={[8,8,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
