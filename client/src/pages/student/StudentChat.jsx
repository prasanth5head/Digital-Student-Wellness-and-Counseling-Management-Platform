import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import ForumIcon from '@mui/icons-material/Forum';

import { counselorAPI, studentAPI } from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import ChatBox from '../../components/common/ChatBox';
import EmptyState from '../../components/common/EmptyState';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export const StudentChat = () => {
  const { user } = useAuth();
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const res = await counselorAPI.getAllCounselors();
        if (res.success && res.data && res.data.length > 0) {
          setCounselors(res.data);
          // Default to assigned counselor if possible, else first
          setSelectedCounselor(res.data[0]);
        }
      } catch (err) {
        console.error('Failed to load counselors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounselors();
  }, []);

  if (loading) {
    return <SkeletonLoader type="cards" count={2} />;
  }

  if (counselors.length === 0) {
    return (
      <EmptyState
        title="No Counselors Available"
        description="There are currently no active counselors in the directory."
        icon={ForumIcon}
      />
    );
  }

  const conversationId = selectedCounselor && user
    ? [user.id, selectedCounselor.userId].sort().join('_')
    : null;

  return (
    <Box sx={{ pb: 6 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Direct Counselor Messaging
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Real-time, end-to-end encrypted counseling consultation and follow-up support
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Counselors Directory Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3.5, p: 2, height: 560, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, px: 1, mb: 1 }}>
              Available Counselors
            </Typography>
            <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
              {counselors.map((c) => {
                const isSelected = selectedCounselor?.id === c.id;
                return (
                  <ListItem key={c.id} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => setSelectedCounselor(c)}
                      sx={{
                        borderRadius: 2.5,
                        p: 1.5,
                        bgcolor: isSelected
                          ? (theme) => (theme.palette.mode === 'dark' ? 'rgba(2, 132, 199, 0.18)' : 'rgba(2, 132, 199, 0.08)')
                          : 'transparent',
                        border: isSelected ? '1px solid rgba(2, 132, 199, 0.4)' : '1px solid transparent',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={c.avatar} sx={{ width: 44, height: 44 }} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={c.name}
                        secondary={c.specialization}
                        primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }}
                        secondaryTypographyProps={{
                          fontSize: '0.75rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Card>
        </Grid>

        {/* Chat Area */}
        <Grid item xs={12} md={8}>
          {selectedCounselor && (
            <ChatBox
              recipientUser={{
                id: selectedCounselor.userId,
                name: selectedCounselor.name,
                avatar: selectedCounselor.avatar,
              }}
              conversationId={conversationId}
              height={560}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
export default StudentChat;
