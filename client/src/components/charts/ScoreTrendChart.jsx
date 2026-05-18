import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';

const axisTick = { fill: '#94a3b8', fontSize: 11 };

const tooltipStyle = {
  background: '#111827',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '16px',
  color: '#e2e8f0'
};

export function ScoreTrendChart({ data, height = 240 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
        <XAxis dataKey="day" stroke="#94a3b8" tick={axisTick} interval="preserveStartEnd" minTickGap={12} />
        <YAxis stroke="#94a3b8" tick={axisTick} width={30} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey="score" stroke="#22D3EE" fill="url(#scoreFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function WaterTrendChart({ data, height = 240 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
        <XAxis dataKey="day" stroke="#94a3b8" tick={axisTick} interval="preserveStartEnd" minTickGap={12} />
        <YAxis stroke="#94a3b8" tick={axisTick} width={30} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="water" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function XpTrendChart({ data, height = 240 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
        <XAxis dataKey="day" stroke="#94a3b8" tick={axisTick} interval="preserveStartEnd" minTickGap={12} />
        <YAxis stroke="#94a3b8" tick={axisTick} width={30} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="xp" stroke="#22C55E" strokeWidth={3} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
