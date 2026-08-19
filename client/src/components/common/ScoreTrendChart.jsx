import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

export const ScoreTrendChart = ({
  data = [],
  title = 'Wellness & Mental Health Trajectory',
  height = 280,
  showAllMetrics = true,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const defaultData = [
    { date: 'Wk 1', score: 68, stress: 45, sleep: 60, anxiety: 40 },
    { date: 'Wk 2', score: 72, stress: 38, sleep: 65, anxiety: 35 },
    { date: 'Wk 3', score: 70, stress: 42, sleep: 62, anxiety: 38 },
    { date: 'Wk 4', score: 79, stress: 28, sleep: 74, anxiety: 25 },
    { date: 'Wk 5', score: 84, stress: 22, sleep: 82, anxiety: 18 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: 2,
            p: 1.5,
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box key={`item-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 0.2 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: entry.color }} />
              <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 600 }}>
                {entry.name}:
              </Typography>
              <Typography variant="caption" sx={{ color: entry.color, fontWeight: 700 }}>
                {entry.value}/100
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: '100%', height: height }}>
      {title && (
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          {title}
        </Typography>
      )}
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0284C7" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
          <XAxis
            dataKey="date"
            stroke={isDark ? '#9CA3AF' : '#64748B'}
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
          />
          <YAxis
            domain={[0, 100]}
            stroke={isDark ? '#9CA3AF' : '#64748B'}
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
          <Area
            type="monotone"
            dataKey="score"
            name="Wellness Score"
            stroke="#0284C7"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorScore)"
          />
          {showAllMetrics && (
            <Area
              type="monotone"
              dataKey="sleep"
              name="Sleep Score"
              stroke="#10B981"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#colorSleep)"
            />
          )}
          {showAllMetrics && (
            <Area
              type="monotone"
              dataKey="stress"
              name="Stress Index"
              stroke="#EF4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorStress)"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};
export default ScoreTrendChart;
