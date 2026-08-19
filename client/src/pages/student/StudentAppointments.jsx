import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';

import { studentAPI, appointmentAPI } from '../../api/axiosConfig';
import AppointmentCard from '../../components/common/AppointmentCard';
import EmptyState from '../../components/common/EmptyState';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export const StudentAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [tabVal, setTabVal] = useState(0); // 0: Upcoming, 1: Past, 2: Cancelled
  const [loading, setLoading] = useState(true);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  const fetchAppointments = async () => {
    try {
      const res = await studentAPI.getAppointments();
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

  const handleOpenCancel = (appt) => {
    setSelectedAppt(appt);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedAppt) return;
    try {
      await appointmentAPI.cancel(selectedAppt.id, cancelReason);
      setCancelModalOpen(false);
      fetchAppointments();
    } catch (err) {
      console.error('Cancel appointment error:', err);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Counseling Appointments
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Manage scheduled 1-on-1 consultations with licensed campus psychologists
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/student/requests')}
          sx={{
            borderRadius: 2.5,
            px: 2.5,
            background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
          }}
        >
          Request New Appointment
        </Button>
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
        <Tab label={`Completed Sessions (${completedList.length})`} />
        <Tab label={`Cancelled (${cancelledList.length})`} />
      </Tabs>

      {/* List */}
      {currentList.length === 0 ? (
        <EmptyState
          title="No Appointments Found"
          description={
            tabVal === 0
              ? 'You have no upcoming appointments. Submit a request to book a counseling slot.'
              : 'No appointments in this category.'
          }
          icon={CalendarMonthIcon}
          actionLabel={tabVal === 0 ? 'Book a Session' : undefined}
          onAction={tabVal === 0 ? () => navigate('/student/requests') : undefined}
        />
      ) : (
        <Grid container spacing={2.5}>
          {currentList.map((appt) => (
            <Grid item xs={12} md={6} key={appt.id}>
              <AppointmentCard
                appointment={appt}
                isCounselor={false}
                onCancel={handleOpenCancel}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Cancel Modal */}
      <Dialog
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Cancel Appointment</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Are you sure you want to cancel your session on <strong>{selectedAppt?.appointmentDate}</strong> at{' '}
            <strong>{selectedAppt?.startTime}</strong>?
          </Typography>
          <TextField
            fullWidth
            label="Reason for cancellation (optional)"
            multiline
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="e.g., Schedule conflict, resolved issue..."
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setCancelModalOpen(false)} variant="outlined" color="inherit">
            Keep Appointment
          </Button>
          <Button onClick={handleConfirmCancel} variant="contained" color="error">
            Confirm Cancellation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default StudentAppointments;
