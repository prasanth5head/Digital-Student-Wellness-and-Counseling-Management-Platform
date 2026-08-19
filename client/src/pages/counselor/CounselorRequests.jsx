import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import SendTimeExtensionIcon from '@mui/icons-material/SendTimeExtension';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { counselorAPI, appointmentAPI } from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import EmptyState from '../../components/common/EmptyState';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export const CounselorRequests = () => {
  const { counselor } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scheduling Modal
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    appointmentDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    startTime: '10:30 AM',
    endTime: '11:30 AM',
    mode: 'ONLINE',
    meetingLink: '',
    purpose: 'Counseling Intake Consultation',
  });

  const fetchRequests = async () => {
    try {
      const res = await counselorAPI.getRequests();
      if (res.success && res.data) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error('Failed to load counseling requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, status, notes) => {
    try {
      await counselorAPI.updateRequestStatus(id, status, notes);
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenSchedule = (req) => {
    setSelectedReq(req);
    setScheduleData({
      appointmentDate: req.preferredDate || new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      startTime: req.preferredTimeSlot?.split(' - ')[0] || '10:30 AM',
      endTime: req.preferredTimeSlot?.split(' - ')[1] || '11:30 AM',
      mode: 'ONLINE',
      meetingLink: 'https://meet.aurawell.edu/session-' + Math.random().toString(36).substring(2, 9),
      purpose: req.requestType || 'Counseling Session',
    });
    setScheduleModalOpen(true);
  };

  const handleConfirmSchedule = async (e) => {
    e.preventDefault();
    if (!selectedReq || !counselor) return;
    try {
      await appointmentAPI.create({
        studentId: selectedReq.studentId,
        counselorId: counselor.id,
        requestId: selectedReq.id,
        appointmentDate: scheduleData.appointmentDate,
        startTime: scheduleData.startTime,
        endTime: scheduleData.endTime,
        mode: scheduleData.mode,
        meetingLink: scheduleData.meetingLink,
        purpose: scheduleData.purpose,
      });

      setScheduleModalOpen(false);
      fetchRequests();
    } catch (err) {
      console.error('Failed to schedule appointment:', err);
    }
  };

  if (loading) {
    return <SkeletonLoader type="cards" count={3} />;
  }

  const getUrgencyChip = (u) => {
    if (u === 'EMERGENCY') return <Chip label="Emergency" color="error" size="small" sx={{ fontWeight: 700 }} />;
    if (u === 'HIGH') return <Chip label="High Urgency" sx={{ bgcolor: 'rgba(249, 115, 22, 0.15)', color: '#F97316', fontWeight: 700 }} size="small" />;
    if (u === 'MODERATE') return <Chip label="Moderate" sx={{ bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', fontWeight: 700 }} size="small" />;
    return <Chip label="Routine / Low" sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontWeight: 700 }} size="small" />;
  };

  const getStatusChip = (s) => {
    if (s === 'SCHEDULED') return <Chip label="Scheduled" color="success" size="small" variant="filled" />;
    if (s === 'ACCEPTED') return <Chip label="Accepted" color="primary" size="small" variant="filled" />;
    if (s === 'REJECTED') return <Chip label="Declined" color="error" size="small" variant="outlined" />;
    return <Chip label="Pending Action" color="warning" size="small" variant="filled" />;
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Student Counseling Intake Requests
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Review intake requests, triage clinical priority, and schedule appointments
        </Typography>
      </Box>

      {requests.length === 0 ? (
        <EmptyState
          title="No Requests in Queue"
          description="There are currently no incoming counseling intake requests."
          icon={SendTimeExtensionIcon}
        />
      ) : (
        <Grid container spacing={3}>
          {requests.map((r) => {
            const isPending = r.status === 'PENDING';
            return (
              <Grid item xs={12} md={6} key={r.id}>
                <Card sx={{ p: 3, borderRadius: 3.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        {r.studentName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        {r.departmentName} • {r.studentRegisterNo} • {r.studentEmail}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      {getUrgencyChip(r.urgency)}
                      {getStatusChip(r.status)}
                    </Box>
                  </Box>

                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                    {r.requestType}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'text.primary', mb: 2, flexGrow: 1, fontStyle: 'italic' }}>
                    "{r.reason}"
                  </Typography>

                  <Box sx={{ p: 1.5, bgcolor: 'background.subtle', borderRadius: 2, mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      <strong>Preferred Date:</strong> {r.preferredDate || 'Flexible'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      <strong>Preferred Window:</strong> {r.preferredTimeSlot || 'Flexible'}
                    </Typography>
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 1, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
                    {isPending && (
                      <>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleUpdateStatus(r.id, 'REJECTED', 'Counselor schedule currently full. Re-routed to peer tutoring.')}
                        >
                          Decline
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => handleUpdateStatus(r.id, 'ACCEPTED', 'Intake approved. Preparing appointment.')}
                        >
                          Accept
                        </Button>
                      </>
                    )}
                    {(isPending || r.status === 'ACCEPTED') && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CalendarMonthIcon />}
                        onClick={() => handleOpenSchedule(r)}
                        sx={{ borderRadius: 2 }}
                      >
                        Schedule Slot
                      </Button>
                    )}
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Schedule Modal */}
      <Dialog
        open={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          Confirm Counseling Slot: {selectedReq?.studentName}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" id="schedule-form" onSubmit={handleConfirmSchedule}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Appointment Date"
                  type="date"
                  value={scheduleData.appointmentDate}
                  onChange={(e) => setScheduleData({ ...scheduleData, appointmentDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  margin="dense"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Appointment Mode"
                  value={scheduleData.mode}
                  onChange={(e) => setScheduleData({ ...scheduleData, mode: e.target.value })}
                  margin="dense"
                >
                  <MenuItem value="ONLINE">Online Video Call</MenuItem>
                  <MenuItem value="IN_PERSON">In-Person Consultation</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Start Time"
                  value={scheduleData.startTime}
                  onChange={(e) => setScheduleData({ ...scheduleData, startTime: e.target.value })}
                  margin="dense"
                  required
                  placeholder="e.g. 10:30 AM"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="End Time"
                  value={scheduleData.endTime}
                  onChange={(e) => setScheduleData({ ...scheduleData, endTime: e.target.value })}
                  margin="dense"
                  required
                  placeholder="e.g. 11:30 AM"
                />
              </Grid>
            </Grid>

            {scheduleData.mode === 'ONLINE' && (
              <TextField
                fullWidth
                label="Meeting Video URL"
                value={scheduleData.meetingLink}
                onChange={(e) => setScheduleData({ ...scheduleData, meetingLink: e.target.value })}
                margin="dense"
                helperText="Auto-generated secure meeting link"
              />
            )}

            <TextField
              fullWidth
              label="Purpose / Session Notes"
              value={scheduleData.purpose}
              onChange={(e) => setScheduleData({ ...scheduleData, purpose: e.target.value })}
              margin="dense"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setScheduleModalOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" form="schedule-form" variant="contained" color="primary">
            Confirm & Notify Student
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default CounselorRequests;
