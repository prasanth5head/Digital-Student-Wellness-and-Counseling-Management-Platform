import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import SaveIcon from '@mui/icons-material/Save';

import { studentAPI } from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import RiskBadge from '../../components/common/RiskBadge';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export const StudentProfile = () => {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    contactNumber: '',
    emergencyContact: '',
    bio: '',
    yearOfStudy: 3,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await studentAPI.getProfile();
        if (res.success && res.data) {
          setProfile(res.data);
          setFormData({
            contactNumber: res.data.contactNumber || '',
            emergencyContact: res.data.emergencyContact || '',
            bio: res.data.bio || '',
            yearOfStudy: res.data.yearOfStudy || 3,
          });
        }
      } catch (err) {
        console.error('Failed to load student profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await studentAPI.updateProfile(formData);
      if (res.success && res.data) {
        setSuccessMsg('Profile information updated successfully!');
        setProfile(res.data);
        refreshProfile(res.data, null);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <SkeletonLoader type="cards" count={2} />;
  }

  return (
    <Box sx={{ maxWidth: 850, mx: 'auto', pb: 6 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Student Profile & Emergency Settings
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Manage your personal university counseling records and crisis contact points
        </Typography>
      </Box>

      {successMsg && <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2.5 }}>{successMsg}</Alert>}
      {errorMsg && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2.5 }}>{errorMsg}</Alert>}

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: 'center', borderRadius: 3.5 }}>
            <Avatar
              src={profile?.avatar || user?.avatar}
              sx={{ width: 90, height: 90, mx: 'auto', mb: 2, border: '3px solid', borderColor: 'primary.main' }}
            />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {profile?.name || user?.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
              {profile?.email || user?.email}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
              <Chip label={profile?.registerNumber} size="small" sx={{ fontWeight: 700 }} />
              <RiskBadge riskLevel={profile?.riskLevel} />
            </Box>

            <Box sx={{ p: 2, bgcolor: 'background.subtle', borderRadius: 2.5, textAlign: 'left' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block' }}>
                Department
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                {profile?.departmentName}
              </Typography>

              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block' }}>
                Assigned Counselor
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {profile?.assignedCounselorName || 'Dr. Sarah Jenkins'}
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Edit Form */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3.5, borderRadius: 3.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Contact & Personal Details
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Contact Phone Number"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                margin="normal"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              <TextField
                fullWidth
                label="Emergency Contact (Parent / Guardian / Trusted Peer)"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                margin="normal"
                helperText="Used strictly by campus wellness staff in high-urgency or crisis protocols."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Personal Wellness Bio / Goals"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                margin="normal"
                placeholder="Share your hobbies, study goals, or personal wellness journey..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{
                  mt: 3,
                  px: 4,
                  py: 1.2,
                  borderRadius: 2.5,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                }}
              >
                {saving ? 'Saving Updates...' : 'Save Profile Changes'}
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default StudentProfile;
