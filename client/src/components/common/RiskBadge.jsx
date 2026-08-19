import React from 'react';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DangerousIcon from '@mui/icons-material/Dangerous';

export const RiskBadge = ({ riskLevel = 'LOW', size = 'small', showIcon = true }) => {
  const level = (riskLevel || 'LOW').toUpperCase();

  const configs = {
    LOW: {
      label: 'Low Risk',
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.3)',
      icon: CheckCircleOutlineIcon,
    },
    MODERATE: {
      label: 'Moderate Risk',
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.3)',
      icon: WarningAmberIcon,
    },
    HIGH: {
      label: 'High Risk',
      color: '#F97316',
      bg: 'rgba(249, 115, 22, 0.12)',
      border: 'rgba(249, 115, 22, 0.3)',
      icon: ErrorOutlineIcon,
    },
    CRITICAL: {
      label: 'Critical Risk',
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.15)',
      border: 'rgba(239, 68, 68, 0.4)',
      icon: DangerousIcon,
    },
  };

  const cfg = configs[level] || configs.LOW;
  const IconComp = cfg.icon;

  return (
    <Chip
      icon={showIcon ? <IconComp sx={{ fontSize: '14px !important', color: `${cfg.color} !important` }} /> : undefined}
      label={cfg.label}
      size={size}
      sx={{
        backgroundColor: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        fontWeight: 700,
        fontSize: size === 'small' ? '0.725rem' : '0.825rem',
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
      }}
    />
  );
};
export default RiskBadge;
