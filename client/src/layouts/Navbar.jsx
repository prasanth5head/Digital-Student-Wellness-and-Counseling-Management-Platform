import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import NotificationMenu from './NotificationMenu';
import { useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 260;

export const Navbar = ({ handleDrawerToggle }) => {
  const { user, logout, isStudent, isCounselor } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleGoProfile = () => {
    handleProfileMenuClose();
    if (isStudent) navigate('/student/profile');
    else if (isCounselor) navigate('/counselor/profile');
    else navigate('/admin/profile');
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { sm: `${DRAWER_WIDTH}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: 1,
        borderColor: 'divider',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
        {/* Left Side: Mobile toggle & Welcome text */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              Welcome back, <strong style={{ color: 'var(--mui-palette-text-primary)' }}>{user?.name}</strong>
            </Typography>
          </Box>
        </Box>

        {/* Right Side Tools */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
          {/* Dark / Light Toggle */}
          <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              sx={{
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'),
              }}
            >
              {mode === 'dark' ? <LightModeIcon sx={{ color: '#FBBF24' }} /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Real-time Notifications Bell */}
          <NotificationMenu />

          {/* Avatar Menu */}
          <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0.5, ml: 0.5 }}>
            <Avatar
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
              sx={{ width: 36, height: 36, border: '2px solid', borderColor: 'primary.main' }}
            />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              sx: {
                minWidth: 200,
                borderRadius: 3,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                mt: 1.5,
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                {user?.email}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'inline-block',
                  mt: 0.5,
                  px: 1,
                  py: 0.2,
                  borderRadius: 1,
                  bgcolor: 'primary.main',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                }}
              >
                {user?.role?.replace('ROLE_', '')}
              </Typography>
            </Box>

            <MenuItem onClick={handleGoProfile} sx={{ py: 1.2 }}>
              <PersonIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                My Profile
              </Typography>
            </MenuItem>

            <MenuItem onClick={handleLogout} sx={{ py: 1.2, color: 'error.main' }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Sign Out
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
