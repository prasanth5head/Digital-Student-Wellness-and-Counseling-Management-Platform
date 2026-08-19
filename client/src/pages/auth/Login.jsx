import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SpaIcon from '@mui/icons-material/Spa';
import SchoolIcon from '@mui/icons-material/School';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
  const { login, googleLogin, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('ROLE_STUDENT'); // 'ROLE_STUDENT', 'ROLE_COUNSELOR', 'ROLE_ADMIN'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRoleChange = (_, newRole) => {
    if (newRole) {
      setSelectedRole(newRole);
      setError('');
    }
  };

  const handleAuthSuccess = (res) => {
    // Strict Role Validation
    if (res.user.role !== selectedRole) {
      const actualRoleName = res.user.role === 'ROLE_STUDENT' ? 'Student' : res.user.role === 'ROLE_COUNSELOR' ? 'Counselor' : 'Admin';
      const attemptedRoleName = selectedRole === 'ROLE_STUDENT' ? 'Student' : selectedRole === 'ROLE_COUNSELOR' ? 'Counselor' : 'Admin';
      setError(`Access Restricted: This account is registered as a ${actualRoleName}. You cannot access the ${attemptedRoleName} portal. Please select the "${actualRoleName}" tab above.`);
      return;
    }

    if (res.user.role === 'ROLE_STUDENT') navigate('/student/dashboard');
    else if (res.user.role === 'ROLE_COUNSELOR') navigate('/counselor/dashboard');
    else if (res.user.role === 'ROLE_ADMIN') navigate('/admin/dashboard');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');

    const res = await login(email, password);
    if (res.success) {
      handleAuthSuccess(res);
    } else {
      setError(res.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    if (!credentialResponse?.credential) {
      setError('Google authentication failed: no credential received');
      return;
    }
    const res = await googleLogin(credentialResponse.credential);
    if (res.success) {
      handleAuthSuccess(res);
    } else {
      setError(res.message);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In was cancelled or encountered an error.');
  };

  const getRoleTheme = () => {
    switch (selectedRole) {
      case 'ROLE_COUNSELOR':
        return {
          title: 'Counselor Portal',
          subtitle: 'Clinical counseling management & appointment hub',
          color: '#6366F1',
          gradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
        };
      case 'ROLE_ADMIN':
        return {
          title: 'Administrator Portal',
          subtitle: 'Institutional wellness oversight & analytics',
          color: '#8B5CF6',
          gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
        };
      default:
        return {
          title: 'Student Wellness Portal',
          subtitle: 'Confidential mental health assessments & counseling',
          color: '#0284C7',
          gradient: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
        };
    }
  };

  const currentTheme = getRoleTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2.5,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Gradient Blobs */}
      <Box
        sx={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '45vw',
          height: '45vw',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${currentTheme.color}25 0%, transparent 70%)`,
          filter: 'blur(50px)',
          zIndex: 0,
          transition: 'all 0.5s ease',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '45vw',
          height: '45vw',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${currentTheme.color}20 0%, transparent 70%)`,
          filter: 'blur(50px)',
          zIndex: 0,
          transition: 'all 0.5s ease',
        }}
      />

      <Card
        sx={{
          maxWidth: 500,
          width: '100%',
          borderRadius: 4,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
          border: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(16px)',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.98)'),
          zIndex: 1,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
          {/* Header Brand */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar
              sx={{
                bgcolor: currentTheme.color,
                width: 54,
                height: 54,
                mx: 'auto',
                mb: 1.5,
                boxShadow: `0 8px 20px -4px ${currentTheme.color}60`,
                transition: 'all 0.3s ease',
              }}
            >
              <SpaIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
              {currentTheme.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {currentTheme.subtitle}
            </Typography>
          </Box>

          {/* Role Selector Tabs */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 1, textAlign: 'center' }}>
              Select Your Role to Sign In
            </Typography>
            <Tabs
              value={selectedRole}
              onChange={handleRoleChange}
              variant="fullWidth"
              sx={{
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'),
                borderRadius: 3,
                p: 0.5,
                '& .MuiTabs-indicator': {
                  borderRadius: 2.5,
                  height: '100%',
                  bgcolor: currentTheme.color,
                  zIndex: 0,
                },
              }}
            >
              <Tab
                value="ROLE_STUDENT"
                icon={<SchoolIcon fontSize="small" />}
                iconPosition="start"
                label="Student"
                sx={{
                  zIndex: 1,
                  borderRadius: 2.5,
                  minHeight: 44,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textTransform: 'none',
                  color: selectedRole === 'ROLE_STUDENT' ? '#FFFFFF !important' : 'text.secondary',
                  transition: 'color 0.2s ease',
                }}
              />
              <Tab
                value="ROLE_COUNSELOR"
                icon={<PsychologyIcon fontSize="small" />}
                iconPosition="start"
                label="Counselor"
                sx={{
                  zIndex: 1,
                  borderRadius: 2.5,
                  minHeight: 44,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textTransform: 'none',
                  color: selectedRole === 'ROLE_COUNSELOR' ? '#FFFFFF !important' : 'text.secondary',
                  transition: 'color 0.2s ease',
                }}
              />
              <Tab
                value="ROLE_ADMIN"
                icon={<AdminPanelSettingsIcon fontSize="small" />}
                iconPosition="start"
                label="Admin"
                sx={{
                  zIndex: 1,
                  borderRadius: 2.5,
                  minHeight: 44,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textTransform: 'none',
                  color: selectedRole === 'ROLE_ADMIN' ? '#FFFFFF !important' : 'text.secondary',
                  transition: 'color 0.2s ease',
                }}
              />
            </Tabs>
          </Box>

          {/* Google Sign-In (Available for Student & Counselor) */}
          <Box sx={{ mb: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_blue"
                size="large"
                shape="rectangular"
                text="signin_with"
                width="100%"
              />
            </Box>
            <Divider sx={{ width: '100%', my: 2.5 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, px: 1 }}>
                OR SIGN IN WITH EMAIL & PASSWORD
              </Typography>
            </Divider>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2.5, fontWeight: 600 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              placeholder={selectedRole === 'ROLE_STUDENT' ? 'student@university.edu' : selectedRole === 'ROLE_COUNSELOR' ? 'counselor@wellness.edu' : 'admin@wellness.edu'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="normal"
              InputProps={{
                startAdornment: <EmailOutlinedIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="normal"
              InputProps={{
                startAdornment: <LockOutlinedIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.4,
                borderRadius: 2.5,
                fontWeight: 700,
                fontSize: '1rem',
                background: currentTheme.gradient,
                boxShadow: `0 8px 20px -4px ${currentTheme.color}50`,
                textTransform: 'none',
              }}
            >
              {loading ? 'Authenticating...' : `Sign In as ${selectedRole === 'ROLE_STUDENT' ? 'Student' : selectedRole === 'ROLE_COUNSELOR' ? 'Counselor' : 'Admin'}`}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Don't have an account yet?{' '}
              <Link to="/register" style={{ color: currentTheme.color, fontWeight: 700, textDecoration: 'none' }}>
                Register here
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
