import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import SpaIcon from '@mui/icons-material/Spa';
import SchoolIcon from '@mui/icons-material/School';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { departmentAPI } from '../../api/axiosConfig';

export const Register = () => {
  const { register, googleLogin, loading } = useAuth();
  const navigate = useNavigate();
  const [roleTab, setRoleTab] = useState(0); // 0: Student, 1: Counselor
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ROLE_STUDENT',
    // Student specific
    registerNumber: '',
    departmentId: '',
    departmentName: '',
    yearOfStudy: 1,
    emergencyContact: '',
    // Counselor specific
    specialization: '',
    qualifications: '',
    experienceYears: 3,
    officeLocation: '',
  });

  useEffect(() => {
    departmentAPI.getAll().then((res) => {
      if (res.success && res.data) {
        setDepartments(res.data);
        if (res.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            departmentId: res.data[0].id,
            departmentName: res.data[0].name,
          }));
        }
      }
    }).catch(() => {});
  }, []);

  const handleTabChange = (_, val) => {
    setRoleTab(val);
    setFormData((prev) => ({
      ...prev,
      role: val === 0 ? 'ROLE_STUDENT' : 'ROLE_COUNSELOR',
    }));
  };

  const handleChange = (field, value) => {
    if (field === 'departmentId') {
      const selectedDept = departments.find((d) => d.id === value);
      setFormData((prev) => ({
        ...prev,
        departmentId: value,
        departmentName: selectedDept ? selectedDept.name : '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAuthSuccess = (res) => {
    if (res.user.role === 'ROLE_STUDENT') navigate('/student/dashboard');
    else if (res.user.role === 'ROLE_COUNSELOR') navigate('/counselor/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await register(formData);
    if (res.success) {
      handleAuthSuccess(res);
    } else {
      setError(res.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    if (!credentialResponse?.credential) {
      setError('Google sign-up failed: no credential received');
      return;
    }

    const extraData = {
      role: roleTab === 0 ? 'ROLE_STUDENT' : 'ROLE_COUNSELOR',
      departmentId: formData.departmentId,
      departmentName: formData.departmentName,
      registerNumber: formData.registerNumber,
      yearOfStudy: formData.yearOfStudy,
      emergencyContact: formData.emergencyContact,
      specialization: formData.specialization,
      qualifications: formData.qualifications,
    };

    const res = await googleLogin(credentialResponse.credential, extraData);
    if (res.success) {
      handleAuthSuccess(res);
    } else {
      setError(res.message);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-Up was cancelled or encountered an error.');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2.5,
        py: 6,
      }}
    >
      <Card
        sx={{
          maxWidth: 540,
          width: '100%',
          borderRadius: 4,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
          bgcolor: 'background.paper',
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #0284C7 0%, #6366F1 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                mb: 1.5,
              }}
            >
              <SpaIcon sx={{ fontSize: 28 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Create an Account
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Join the AuraWell campus support community
            </Typography>
          </Box>

          <Tabs
            value={roleTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              mb: 3,
              bgcolor: 'background.subtle',
              borderRadius: 2.5,
              p: 0.5,
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTab-root': {
                borderRadius: 2,
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
            <Tab icon={<SchoolIcon sx={{ fontSize: 18, mr: 0.8 }} />} iconPosition="start" label="Student Registration" />
            <Tab icon={<PsychologyIcon sx={{ fontSize: 18, mr: 0.8 }} />} iconPosition="start" label="Counselor Registration" />
          </Tabs>

          {/* Google Sign-Up Quick Button */}
          <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_blue"
                size="large"
                shape="rectangular"
                text="signup_with"
                width="100%"
              />
            </Box>
            <Divider sx={{ width: '100%', my: 2.5 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, px: 1 }}>
                OR REGISTER WITH EMAIL
              </Typography>
            </Divider>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2.5 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              margin="dense"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <TextField
              fullWidth
              label="University Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              margin="dense"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <TextField
              fullWidth
              label="Password (min. 6 characters)"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
              margin="dense"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            {roleTab === 0 ? (
              // Student Fields
              <>
                <TextField
                  fullWidth
                  label="Student Register / Roll Number"
                  value={formData.registerNumber}
                  onChange={(e) => handleChange('registerNumber', e.target.value)}
                  required
                  margin="dense"
                  placeholder="e.g. REG2024099"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                <TextField
                  fullWidth
                  select
                  label="Academic Department"
                  value={formData.departmentId}
                  onChange={(e) => handleChange('departmentId', e.target.value)}
                  required
                  margin="dense"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {departments.map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </MenuItem>
                  ))}
                </TextField>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, my: 0.5 }}>
                  <TextField
                    select
                    label="Year of Study"
                    value={formData.yearOfStudy}
                    onChange={(e) => handleChange('yearOfStudy', parseInt(e.target.value))}
                    margin="dense"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  >
                    <MenuItem value={1}>1st Year (Freshman)</MenuItem>
                    <MenuItem value={2}>2nd Year (Sophomore)</MenuItem>
                    <MenuItem value={3}>3rd Year (Junior)</MenuItem>
                    <MenuItem value={4}>4th Year (Senior)</MenuItem>
                    <MenuItem value={5}>Postgraduate / Masters</MenuItem>
                  </TextField>

                  <TextField
                    label="Emergency Contact Phone"
                    value={formData.emergencyContact}
                    onChange={(e) => handleChange('emergencyContact', e.target.value)}
                    margin="dense"
                    placeholder="+1 (555) 000-0000"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Box>
              </>
            ) : (
              // Counselor Fields
              <>
                <TextField
                  fullWidth
                  label="Clinical Specialization"
                  value={formData.specialization}
                  onChange={(e) => handleChange('specialization', e.target.value)}
                  required
                  margin="dense"
                  placeholder="e.g. Cognitive Behavioral Therapy, Crisis Intervention"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                <TextField
                  fullWidth
                  label="Qualifications & Degrees"
                  value={formData.qualifications}
                  onChange={(e) => handleChange('qualifications', e.target.value)}
                  required
                  margin="dense"
                  placeholder="e.g. Ph.D. Clinical Psychology, Licensed Counselor"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, my: 0.5 }}>
                  <TextField
                    label="Years of Experience"
                    type="number"
                    value={formData.experienceYears}
                    onChange={(e) => handleChange('experienceYears', parseInt(e.target.value))}
                    margin="dense"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                  <TextField
                    label="Campus Office Location"
                    value={formData.officeLocation}
                    onChange={(e) => handleChange('officeLocation', e.target.value)}
                    margin="dense"
                    placeholder="e.g. Wellness Hub Rm 204"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Box>
              </>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.4,
                borderRadius: 2.5,
                fontWeight: 700,
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              }}
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Already registered?{' '}
              <Link to="/login" style={{ color: '#0284C7', fontWeight: 700, textDecoration: 'none' }}>
                Sign in here
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
export default Register;
