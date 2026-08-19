import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { counselorAPI, appointmentAPI } from '../../api/axiosConfig';
import AppointmentCard from '../../components/common/AppointmentCard';
import EmptyState from '../../components/common/EmptyState';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export const CounselorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [tabVal, setTabVal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Complete Session Modal
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [sessionData, setSessionData] = useState({
    sessionSummary: '',
    keyTakeaways: '',
    durationMinutes: 50,
  });

  const fetchAppointments = async () => {
    try {
      const res = await counselorAPI.getAppointments();
      if (res.success && res.data) {
        setAppointments(res.data);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleOpenComplete = (appt) => {
    setSelectedAppt(appt);
    setSessionData({
      sessionSummary: 'Conducted regular counseling consultation regarding academic stress.',
      keyTakeaways: 'Student is adopting relaxation routines and setting healthy study limits.',
      durationMinutes: 50,
    });
    setCompleteModalOpen(true);
  };

  const handleConfirmComplete = async (e) => {
    e.preventDefault();
    if (!selectedAppt) return;
    try {
      await counselorAPI.createSession({
        appointmentId: selectedAppt.id,
        studentId: selectedAppt.studentId,
        sessionDate: selectedAppt.appointmentDate,
        durationMinutes: sessionData.durationMinutes,
        sessionType: 'Individual Counseling',
        sessionSummary: sessionData.sessionSummary,
        keyTakeaways: sessionData.keyTakeaways,
      });
      setCompleteModalOpen(false);
      fetchAppointments();
    } catch (err) {
      console.error('Failed to log session:', err);
    }
  };

  if (loading) {
    return <SkeletonLoader type="cards" count={3} />;
  }

  const upcomingList = appointments.filter(
    (a) => a.status === 'UPCOMING' || a.status === 'CONFIRMED'
  );
  const completedList = appointments.filter((a) => a.status === 'COMPLETED');
  const cancelledList = appointments.filter((a) => a.status === 'CANCELLED');

  const getFilteredList = () => {
    if (tabVal === 0) return upcomingList;
    if (tabVal === 1) return completedList;
    return cancelledList;
  };

  const currentList = getFilteredList();

  return (
    <Box sx={{ pb: 6 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Clinical Appointments & Schedule
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Manage your daily counseling calendar, launch online sessions, and complete clinical intake logs
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tabVal}
        onChange={(_, val) => setTabVal(val)}
        sx={{
          mb: 3,
          bgcolor: 'background.subtle',
          borderRadius: 3,
          p: 0.5,
          '& .MuiTabs-indicator': { display: 'none' },
          '& .MuiTab-root': {
            borderRadius: 2.5,
            fontWeight: 700,
            fontSize: '0.85rem',
            minHeight: 40,
            '&.Mui-selected': {
              bgcolor: 'background.paper',
              color: 'primary.main',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            },
          },
        }}
      >
        <Tab label={`Upcoming & Confirmed (${upcomingList.length})`} />
        <Tab label={`Completed Consultations (${completedList.length})`} />
        <Tab label={`Cancelled (${cancelledList.length})`} />
      </Tabs>

      {currentList.length === 0 ? (
        <EmptyState
          title="No Appointments Found"
          description="There are no appointments currently in this category."
          icon={CalendarMonthIcon}
        />
      ) : (
        <Grid container spacing={2.5}>
          {currentList.map((appt) => (
            <Grid item xs={12} md={6} key={appt.id}>
              <AppointmentCard
                appointment={appt}
                isCounselor={true}
                onComplete={handleOpenComplete}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Complete Session Modal */}
      <Dialog
        open={completeModalOpen}
        onClose={() => setCompleteModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          Log Session Completion: {selectedAppt?.studentName}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" id="complete-form" onSubmit={handleConfirmComplete}>
            <TextField
              fullWidth
              label="Session Duration (Minutes)"
              type="number"
              value={sessionData.durationMinutes}
              onChange={(e) => setSessionData({ ...sessionData, durationMinutes: parseInt(e.target.value) })}
              margin="dense"
              required
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Session Summary (Visible to Student)"
              value={sessionData.sessionSummary}
              onChange={(e) => setSessionData({ ...sessionData, sessionSummary: e.target.value })}
              margin="dense"
              required
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Key Clinical Takeaways"
              value={sessionData.keyTakeaways}
              onChange={(e) => setSessionData({ ...sessionData, keyTakeaways: e.target.value })}
              margin="dense"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setCompleteModalOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" form="complete-form" variant="contained" color="success">
            Complete & Save Session
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default CounselorAppointments;
