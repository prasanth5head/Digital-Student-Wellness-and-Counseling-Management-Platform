import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

export const RadarComparisonChart = ({
  studentData = [],
  campusData = [],
  title = 'Wellness Dimension Breakdown',
  height = 300,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const defaultCategories = [
    { dimension: 'Stress Resilience', student: 78, campus: 68 },
    { dimension: 'Emotional Balance', student: 82, campus: 72 },
    { dimension: 'Sleep Quality', student: 85, campus: 65 },
    { dimension: 'Academic Ease', student: 75, campus: 70 },
    { dimension: 'Social Support', student: 90, campus: 74 },
    { dimension: 'Physical Energy', student: 80, campus: 69 },
  ];

  let chartData = defaultCategories;
  if (studentData && studentData.length > 0) {
    chartData = studentData.map((s, idx) => {
      const camp = campusData.find((c) => c.dimension === s.dimension) || campusData[idx];
      return {
        dimension: s.dimension || s.category,
        student: s.score || s.percentage || 75,
        campus: camp ? camp.score || camp.percentage : 70,
      };
    });
  }

  return (
    <Box sx={{ width: '100%', height: height }}>
      {title && (
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
          {title}
        </Typography>
      )}
      <ResponsiveContainer width="100%" height="90%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
          <PolarAngleAxis
            dataKey="dimension"
            stroke={isDark ? '#9CA3AF' : '#64748B'}
            tick={{ fontSize: 10, fontWeight: 600 }}
          />
          <PolarRadiusAxis domain={[0, 100]} stroke={isDark ? '#6B7280' : '#94A3B8'} fontSize={9} />
          <Radar
            name="Your Scores"
            dataKey="student"
            stroke="#0284C7"
            fill="#0284C7"
            fillOpacity={0.4}
            strokeWidth={2}
          />
          <Radar
            name="Campus Benchmark"
            dataKey="campus"
            stroke="#6366F1"
            fill="#6366F1"
            fillOpacity={0.2}
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#111827' : '#FFFFFF',
              borderColor: isDark ? '#374151' : '#E5E7EB',
              borderRadius: '8px',
              fontSize: '11px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
        </RadarChart>
      </ResponsiveContainer>
    </Box>
  );
};
export default RadarComparisonChart;
