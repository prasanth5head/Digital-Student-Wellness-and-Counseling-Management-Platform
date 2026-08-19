import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = '#0284C7',
  trend,
  trendValue,
  progress,
  isScore,
}) => {
  const getTrendColor = () => {
    if (trend === 'up') return '#10B981';
    if (trend === 'down') return '#EF4444';
    return '#6B7280';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUpIcon sx={{ fontSize: 16 }} />;
    if (trend === 'down') return <TrendingDownIcon sx={{ fontSize: 16 }} />;
    return <TrendingFlatIcon sx={{ fontSize: 16 }} />;
  };

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: `0 12px 24px -6px ${color}25`,
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
        }}
      />
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 0.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {value}
              </Typography>
              {isScore && (
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  /100
                </Typography>
              )}
            </Box>
          </Box>
          {Icon && (
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `${color}15`,
                color: color,
              }}
            >
              <Icon sx={{ fontSize: 24 }} />
            </Box>
          )}
        </Box>

        {progress !== undefined && (
          <Box sx={{ my: 1.5 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: `${color}20`,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  backgroundColor: color,
                },
              }}
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {subtitle}
          </Typography>
          {trendValue && (
            <Chip
              icon={getTrendIcon()}
              label={trendValue}
              size="small"
              sx={{
                height: 22,
                fontSize: '0.7rem',
                fontWeight: 600,
                backgroundColor: `${getTrendColor()}15`,
                color: getTrendColor(),
                '& .MuiChip-icon': {
                  color: getTrendColor(),
                  ml: 0.5,
                },
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
export default MetricCard;
