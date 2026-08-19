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
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

import { counselorAPI } from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import ChatBox from '../../components/common/ChatBox';
import RiskBadge from '../../components/common/RiskBadge';
import EmptyState from '../../components/common/EmptyState';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export const CounselorChat = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await counselorAPI.getDashboard();
        if (res.success && res.data && res.data.assignedStudents) {
          setStudents(res.data.assignedStudents);
          if (res.data.assignedStudents.length > 0) {
            setSelectedStudent(res.data.assignedStudents[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load students for chat:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) {
    return <SkeletonLoader type="cards" count={2} />;
  }

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.registerNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const conversationId = selectedStudent && user
    ? [user.id, selectedStudent.userId].sort().join('_')
    : null;

  return (
    <Box sx={{ pb: 6 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Student Consultation Messages
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Real-time, HIPAA/FERPA compliant direct communication with assigned students
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Students Caseload List */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3.5, p: 2, height: 560, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, px: 1, mb: 1.5 }}>
              Active Students ({students.length})
            </Typography>

            <TextField
              size="small"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
              {filteredStudents.map((s) => {
                const isSelected = selectedStudent?.id === s.id;
                return (
                  <ListItem key={s.id} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => setSelectedStudent(s)}
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
                        <Avatar src={s.avatar} sx={{ width: 42, height: 42 }} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={s.name}
                        secondary={`${s.departmentName} • ${s.registerNumber}`}
                        primaryTypographyProps={{ fontWeight: 700, fontSize: '0.875rem' }}
                        secondaryTypographyProps={{ fontSize: '0.725rem' }}
                      />
                      <RiskBadge riskLevel={s.riskLevel} showIcon={false} size="small" />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Card>
        </Grid>

        {/* Chat Area */}
        <Grid item xs={12} md={8}>
          {selectedStudent ? (
            <ChatBox
              recipientUser={{
                id: selectedStudent.userId,
                name: selectedStudent.name,
                avatar: selectedStudent.avatar,
              }}
              conversationId={conversationId}
              height={560}
            />
          ) : (
            <EmptyState title="Select a student" description="Choose a student from the sidebar to open the chat channel." />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
export default CounselorChat;
