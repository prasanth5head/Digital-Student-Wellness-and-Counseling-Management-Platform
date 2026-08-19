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
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CampaignIcon from '@mui/icons-material/Campaign';

import { adminAPI } from '../../api/axiosConfig';
import EmptyState from '../../components/common/EmptyState';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    priority: 'HIGH',
    targetAudience: 'ALL',
    active: true,
  });

  const fetchAnnouncements = async () => {
    try {
      const res = await adminAPI.getAnnouncements();
      if (res.success && res.data) {
        setAnnouncements(res.data);
      }
    } catch (err) {
      console.error('Failed to load announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteAnnouncement(id);
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createAnnouncement(form);
      setModalOpen(false);
      setForm({
        title: '',
        content: '',
        priority: 'HIGH',
        targetAudience: 'ALL',
        active: true,
      });
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <SkeletonLoader type="cards" count={3} />;
  }

  const getPriorityColor = (p) => {
    if (p === 'URGENT') return 'error';
    if (p === 'HIGH') return 'warning';
    return 'primary';
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Campus Wellness Broadcasts
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Publish campus-wide health alerts, mental health awareness campaigns, and wellness workshop notices
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
          sx={{ borderRadius: 2.5 }}
        >
          New Campus Announcement
        </Button>
      </Box>

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <EmptyState
          title="No Active Broadcasts"
          description="There are currently no active announcements published on the platform."
          icon={CampaignIcon}
        />
      ) : (
        <Grid container spacing={2.5}>
          {announcements.map((a) => (
            <Grid item xs={12} md={6} key={a.id}>
              <Card sx={{ p: 3, borderRadius: 3.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CampaignIcon color={getPriorityColor(a.priority)} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      {a.title}
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={() => handleDelete(a.id)} color="error">
                    <DeleteIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>

                <Typography variant="body2" sx={{ color: 'text.primary', mb: 2, flexGrow: 1, lineHeight: 1.6 }}>
                  {a.content}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1.5, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label={`Priority: ${a.priority}`} color={getPriorityColor(a.priority)} size="small" sx={{ fontWeight: 700 }} />
                    <Chip label={`Audience: ${a.targetAudience}`} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'Active'}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Create Campus Wellness Announcement</DialogTitle>
        <DialogContent dividers>
          <Box component="form" id="announcement-form" onSubmit={handleSave}>
            <TextField
              fullWidth
              label="Announcement Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              margin="dense"
              required
              placeholder="e.g. Midterm Wellness De-Stress Week Workshops"
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Announcement Message Content"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              margin="dense"
              required
              placeholder="Enter details, dates, zoom links, or campus locations..."
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Priority Tag"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  margin="dense"
                >
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="URGENT">Urgent Alert</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Target Audience"
                  value={form.targetAudience}
                  onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                  margin="dense"
                >
                  <MenuItem value="ALL">All Campus Users</MenuItem>
                  <MenuItem value="STUDENTS">Students Only</MenuItem>
                  <MenuItem value="COUNSELORS">Counselors Only</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setModalOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" form="announcement-form" variant="contained" color="primary">
            Broadcast Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default Announcements;
