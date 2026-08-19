import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import RiskBadge from './RiskBadge';

export const WellnessScoreDial = ({
  score = 75,
  riskLevel = 'LOW',
  size = 180,
  strokeWidth = 10,
  showBadge = true,
  subtitle = 'Overall Wellness Index',
}) => {
  const getScoreColor = (val) => {
    if (val >= 75) return '#10B981'; // Emerald
    if (val >= 60) return '#F59E0B'; // Amber
    if (val >= 40) return '#F97316'; // Orange
    return '#EF4444'; // Rose
  };

  const color = getScoreColor(score);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        {/* Background track circle */}
        <CircularProgress
          variant="determinate"
          value={100}
          size={size}
          thickness={strokeWidth / (size / 100)}
          sx={{
            color: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
          }}
        />
        {/* Foreground dynamic progress */}
        <CircularProgress
          variant="determinate"
          value={score}
          size={size}
          thickness={strokeWidth / (size / 100)}
          sx={{
            color: color,
            position: 'absolute',
            left: 0,
            strokeLinecap: 'round',
            transform: 'rotate(-90deg) !important',
            filter: `drop-shadow(0 0 8px ${color}55)`,
            transition: 'all 0.6s ease-in-out',
          }}
        />
        {/* Inner center display */}
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h2"
            component="div"
            sx={{
              fontWeight: 800,
              color: 'text.primary',
              lineHeight: 1,
              fontFamily: '"Outfit", sans-serif',
            }}
          >
            {score}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.2 }}>
            OUT OF 100
          </Typography>
        </Box>
      </Box>

      {showBadge && (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
          <RiskBadge riskLevel={riskLevel} size="medium" />
          {subtitle && (
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};
export default WellnessScoreDial;
