import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CheckIcon from '@mui/icons-material/Check';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const RoleSwitcher = () => {
  const { user, switchDemoAccount } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectAccount = async (account) => {
    handleClose();
    if (user?.email === account.email) return;

    const res = await switchDemoAccount(account);
    if (res.success) {
      if (account.role === 'ROLE_STUDENT') navigate('/student/dashboard');
      else if (account.role === 'ROLE_COUNSELOR') navigate('/counselor/dashboard');
      else if (account.role === 'ROLE_ADMIN') navigate('/admin/dashboard');
    }
  };

  const getRoleLabel = () => {
    if (user?.role === 'ROLE_STUDENT') return 'Student View';
    if (user?.role === 'ROLE_COUNSELOR') return 'Counselor View';
    if (user?.role === 'ROLE_ADMIN') return 'Admin View';
    return 'Demo Switcher';
  };

  return (
    <Box>
      <Button
        variant="outlined"
        size="small"
        onClick={handleClick}
        startIcon={<SwapHorizIcon />}
        sx={{
          borderRadius: 20,
          px: 1.5,
          py: 0.5,
          textTransform: 'none',
          borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(2, 132, 199, 0.4)'),
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(2, 132, 199, 0.15)' : 'rgba(2, 132, 199, 0.08)'),
          color: 'primary.main',
          fontWeight: 700,
          fontSize: '0.8rem',
          '&:hover': {
            bgcolor: 'primary.main',
            color: '#FFFFFF',
          },
        }}
      >
        {getRoleLabel()}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 260,
            p: 1,
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 1.5, py: 1, borderBottom: (theme) => `1px solid ${theme.palette.divider}`, mb: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Instant Demo Persona Switcher
          </Typography>
        </Box>

        {DEMO_ACCOUNTS.map((acc) => {
          const isSelected = user?.email === acc.email;
          return (
            <MenuItem
              key={acc.email}
              onClick={() => handleSelectAccount(acc)}
              sx={{
                borderRadius: 2,
                p: 1.2,
                mb: 0.5,
                bgcolor: isSelected ? 'action.selected' : 'transparent',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar src={acc.avatar} sx={{ width: 32, height: 32 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    {acc.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {acc.badge}
                  </Typography>
                </Box>
              </Box>
              {isSelected && <CheckIcon sx={{ fontSize: 18, color: 'primary.main' }} />}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};
export default RoleSwitcher;
