import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

// Student Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import QuizIcon from '@mui/icons-material/Quiz';
import HistoryIcon from '@mui/icons-material/History';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SendTimeExtensionIcon from '@mui/icons-material/SendTimeExtension';
import ForumIcon from '@mui/icons-material/Forum';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';

// Counselor Icons
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PsychologyIcon from '@mui/icons-material/Psychology';

// Admin Icons
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DomainIcon from '@mui/icons-material/Domain';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CampaignIcon from '@mui/icons-material/Campaign';
import ShieldIcon from '@mui/icons-material/Shield';
import SpaIcon from '@mui/icons-material/Spa';

import { useAuth } from '../context/AuthContext';

const DRAWER_WIDTH = 260;

export const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const { user, isStudent, isCounselor, isAdmin } = useAuth();
  const location = useLocation();

  const getNavItems = () => {
    if (isStudent) {
      return [
        { label: 'Wellness Overview', path: '/student/dashboard', icon: DashboardIcon },
        { label: 'Wellness Assessment', path: '/student/assessment', icon: QuizIcon, highlight: true },
        { label: 'Score History', path: '/student/assessment/history', icon: HistoryIcon },
        { label: 'Appointments', path: '/student/appointments', icon: CalendarMonthIcon },
        { label: 'Counseling Requests', path: '/student/requests', icon: SendTimeExtensionIcon },
        { label: 'Chat with Counselor', path: '/student/chat', icon: ForumIcon },
        { label: 'Resource Library', path: '/student/resources', icon: MenuBookIcon },
        { label: 'My Profile', path: '/student/profile', icon: PersonIcon },
      ];
    }
    if (isCounselor) {
      return [
        { label: 'Counselor Dashboard', path: '/counselor/dashboard', icon: DashboardIcon },
        { label: 'Assigned Students', path: '/counselor/students', icon: PeopleAltIcon, highlight: true },
        { label: 'Appointments', path: '/counselor/appointments', icon: CalendarMonthIcon },
        { label: 'Incoming Requests', path: '/counselor/requests', icon: SendTimeExtensionIcon },
        { label: 'Student Messages', path: '/counselor/chat', icon: ForumIcon },
        { label: 'Clinical Sessions', path: '/counselor/sessions', icon: PsychologyIcon },
        { label: 'Resource Library', path: '/counselor/resources', icon: MenuBookIcon },
        { label: 'Counselor Profile', path: '/counselor/profile', icon: PersonIcon },
      ];
    }
    if (isAdmin) {
      return [
        { label: 'Campus Analytics', path: '/admin/dashboard', icon: AnalyticsIcon },
        { label: 'Department Health', path: '/admin/departments', icon: DomainIcon, highlight: true },
        { label: 'User Directory', path: '/admin/users', icon: ManageAccountsIcon },
        { label: 'Question Bank', path: '/admin/questions', icon: HelpOutlineIcon },
        { label: 'Wellness Resources', path: '/admin/resources', icon: MenuBookIcon },
        { label: 'Campus Broadcasts', path: '/admin/announcements', icon: CampaignIcon },
        { label: 'Security & Audit Logs', path: '/admin/audit-logs', icon: ShieldIcon },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      {/* Brand Header */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2.5,
            background: 'linear-gradient(135deg, #0284C7 0%, #6366F1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
          }}
        >
          <SpaIcon sx={{ fontSize: 24 }} />
        </Box>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              fontFamily: '"Outfit", sans-serif',
              background: 'linear-gradient(135deg, #0284C7 0%, #6366F1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            AuraWell
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem' }}>
            Campus Wellness & Counseling
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mx: 2 }} />

      {/* Nav List */}
      <Box sx={{ flexGrow: 1, py: 1.5, px: 1.5, overflowY: 'auto' }}>
        <List sx={{ p: 0 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.6 }}>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  sx={{
                    borderRadius: 2.5,
                    py: 1,
                    px: 1.5,
                    color: isActive ? 'primary.main' : 'text.secondary',
                    bgcolor: isActive
                      ? (theme) => (theme.palette.mode === 'dark' ? 'rgba(2, 132, 199, 0.15)' : 'rgba(2, 132, 199, 0.08)')
                      : 'transparent',
                    fontWeight: isActive ? 700 : 500,
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                      color: 'primary.main',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isActive ? 'primary.main' : 'text.disabled',
                    }}
                  >
                    <Icon sx={{ fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 700 : 500,
                    }}
                  />
                  {item.highlight && (
                    <Chip
                      label="Active"
                      size="small"
                      color="primary"
                      sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ mx: 2 }} />

      {/* User Profile Footer */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: 'background.subtle', m: 1.5, borderRadius: 3 }}>
        <Avatar
          src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
          sx={{ width: 38, height: 38 }}
        />
        <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {user?.name || 'User'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.7rem' }}>
            {user?.email}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Permanent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};
export default Sidebar;
