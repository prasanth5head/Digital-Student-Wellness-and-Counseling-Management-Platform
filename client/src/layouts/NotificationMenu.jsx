import React, { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CircleIcon from '@mui/icons-material/Circle';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

export const NotificationMenu = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (n) => {
    if (!n.read) markAsRead(n.id);
    handleClose();
    if (n.link) navigate(n.link);
  };

  return (
    <Box>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'),
          '&:hover': {
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'),
          },
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          {unreadCount > 0 ? (
            <NotificationsActiveIcon sx={{ color: 'primary.main' }} />
          ) : (
            <NotificationsIcon />
          )}
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 480,
            borderRadius: 3.5,
            p: 0,
            boxShadow: '0 12px 36px rgba(0,0,0,0.18)',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Badge
                badgeContent={unreadCount}
                color="primary"
                sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem', height: 18, minWidth: 18 } }}
              />
            )}
          </Box>
          {unreadCount > 0 && (
            <Button size="small" onClick={markAllAsRead} sx={{ fontSize: '0.75rem' }}>
              Mark all read
            </Button>
          )}
        </Box>

        <Box sx={{ maxHeight: 360, overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
              <Typography variant="body2">No notifications yet</Typography>
            </Box>
          ) : (
            notifications.slice(0, 15).map((n) => (
              <MenuItem
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                sx={{
                  p: 1.8,
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                  bgcolor: n.read ? 'transparent' : (theme) => (theme.palette.mode === 'dark' ? 'rgba(2, 132, 199, 0.08)' : 'rgba(2, 132, 199, 0.04)'),
                  whiteSpace: 'normal',
                  display: 'flex',
                  gap: 1.5,
                  alignItems: 'flex-start',
                }}
              >
                {!n.read && (
                  <CircleIcon
                    sx={{ fontSize: 8, color: 'primary.main', mt: 0.8, flexShrink: 0 }}
                  />
                )}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: n.read ? 600 : 800, fontSize: '0.85rem' }}>
                    {n.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem', mt: 0.2 }}>
                    {n.message}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem', mt: 0.5, display: 'block' }}>
                    {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          )}
        </Box>
      </Menu>
    </Box>
  );
};
export default NotificationMenu;
