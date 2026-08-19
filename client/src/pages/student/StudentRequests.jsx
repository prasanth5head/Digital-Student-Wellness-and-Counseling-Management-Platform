import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import SendIcon from '@mui/icons-material/Send';
import SendTimeExtensionIcon from '@mui/icons-material/SendTimeExtension';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { counselingRequestAPI, counselorAPI, studentAPI } from '../../api/axiosConfig';
import EmptyState from '../../components/common/EmptyState';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const REQUEST_TYPES = [
  'General Wellness & Stress Management',
  'Academic Anxiety & Exam Pressure',
  'Depression & Emotional Support',
  'Sleep Disturbances & Fatigue',
  'Social & Interpersonal Relationships',
  'Career & Future Planning Anxiety',
  'Crisis / Immediate De-escalation',
];

const TIME_SLOTS = [
  '09:00 - 10:00 AM',
  '10:30 - 11:30 AM',
  '01:30 - 02:30 PM',
  '03:00 - 04:00 PM',
  '04:30 - 05:30 PM',
];

export const StudentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    preferredCounselorId: '',
    requestType: REQUEST_TYPES[0],
    preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    preferredTimeSlot: TIME_SLOTS[1],
    reason: '',
    urgency: 'MODERATE',
    additionalNotes: '',
  });

  const fetchData = async () => {
    try {
      const [reqRes, counsRes] = await Promise.all([
        studentAPI.getRequests(),
        counselorAPI.getAllCounselors(),
      ]);
      if (reqRes.success && reqRes.data) setRequests(reqRes.data);
      if (counsRes.success && counsRes.data) setCounselors(counsRes.data);
    } catch (err) {
      console.error('Failed to load request data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await counselingRequestAPI.create(formData);
      if (res.success) {
        setSuccessMsg('Counseling request submitted successfully! A counselor will review and confirm your slot.');
        setFormData({
          preferredCounselorId: '',
          requestType: REQUEST_TYPES[0],
          preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
          preferredTimeSlot: TIME_SLOTS[1],
          reason: '',
          urgency: 'MODERATE',
          additionalNotes: '',
        });
        fetchData();
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
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
    return <Chip label="Pending Review" color="warning" size="small" variant="filled" />;
  };

  return (
    <Box sx={{ pb: 6 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Counseling Intake Requests
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Submit a confidential request to meet with a counselor or track status of existing submissions
        </Typography>
      </Box>

      <Grid container spacing={3.5}>
        {/* Form Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 3.5, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              Submit Counseling Request
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
              All counseling inquiries are strictly confidential and encrypted under FERPA/HIPAA guidelines.
            </Typography>

            {successMsg && <Alert severity="success" sx={{ mb: 2, borderRadius: 2.5 }}>{successMsg}</Alert>}
            {errorMsg && <Alert severity="error" sx={{ mb: 2, borderRadius: 2.5 }}>{errorMsg}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                select
                label="Nature of Consultation"
                value={formData.requestType}
                onChange={(e) => handleChange('requestType', e.target.value)}
                margin="dense"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                {REQUEST_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                select
                label="Preferred Counselor (Optional)"
                value={formData.preferredCounselorId}
                onChange={(e) => handleChange('preferredCounselorId', e.target.value)}
                margin="dense"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                <MenuItem value="">Any Available University Counselor</MenuItem>
                {counselors.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name} — {c.specialization}
                  </MenuItem>
                ))}
              </TextField>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, my: 0.5 }}>
                <TextField
                  label="Preferred Date"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => handleChange('preferredDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  margin="dense"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                <TextField
                  select
                  label="Preferred Time Window"
                  value={formData.preferredTimeSlot}
                  onChange={(e) => handleChange('preferredTimeSlot', e.target.value)}
                  margin="dense"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {TIME_SLOTS.map((slot) => (
                    <MenuItem key={slot} value={slot}>{slot}</MenuItem>
                  ))}
                </TextField>
              </Box>

              <TextField
                fullWidth
                select
                label="Urgency Level"
                value={formData.urgency}
                onChange={(e) => handleChange('urgency', e.target.value)}
                margin="dense"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                <MenuItem value="LOW">Low (Routine Check-in, 3-5 days)</MenuItem>
                <MenuItem value="MODERATE">Moderate (Mild Stress / Symptoms, 1-2 days)</MenuItem>
                <MenuItem value="HIGH">High (Elevated Distress / Urgent, within 24h)</MenuItem>
                <MenuItem value="EMERGENCY">Emergency (Crisis Intervention / Immediate)</MenuItem>
              </TextField>

              <TextField
                fullWidth
                required
                multiline
                rows={3}
                label="What would you like to discuss?"
                placeholder="Briefly describe what you are experiencing so we can best match your needs..."
                value={formData.reason}
                onChange={(e) => handleChange('reason', e.target.value)}
                margin="dense"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              <TextField
                fullWidth
                multiline
                rows={2}
                label="Additional Notes / Meeting Mode Preferences"
                placeholder="e.g. Prefer video consultation via Google Meet or in-person..."
                value={formData.additionalNotes}
                onChange={(e) => handleChange('additionalNotes', e.target.value)}
                margin="dense"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={submitting}
                endIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                sx={{
                  mt: 2.5,
                  py: 1.3,
                  borderRadius: 2.5,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                }}
              >
                {submitting ? 'Submitting Request...' : 'Send Counseling Request'}
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Existing Requests List */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 3.5, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              Submitted Requests Tracker
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
              Status and responses from the campus wellness counseling office
            </Typography>

            {requests.length === 0 ? (
              <EmptyState
                title="No Requests Submitted"
                description="You haven't submitted any counseling intake requests yet."
                icon={SendTimeExtensionIcon}
              />
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {requests.map((r) => (
                  <Box
                    key={r.id}
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      bgcolor: 'background.subtle',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {r.requestType}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Target: {r.preferredCounselorName || 'Any Counselor'} • {r.preferredDate || 'Flexible Date'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center' }}>
                        {getUrgencyChip(r.urgency)}
                        {getStatusChip(r.status)}
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ color: 'text.primary', mb: 1.5, fontStyle: 'italic' }}>
                      "{r.reason}"
                    </Typography>

                    {r.counselorResponseNotes && (
                      <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(2, 132, 199, 0.15)' : 'rgba(2, 132, 199, 0.08)'), borderLeft: '3px solid #0284C7' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', display: 'block' }}>
                          Counselor Response:
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.primary' }}>
                          {r.counselorResponseNotes}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default StudentRequests;
