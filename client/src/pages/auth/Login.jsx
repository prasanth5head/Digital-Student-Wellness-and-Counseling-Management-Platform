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
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import SpaIcon from '@mui/icons-material/Spa';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';

export const Login = () => {
  const { login, googleLogin, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('student.alex@wellness.edu');
  const [password, setPassword] = useState('Student@123');
  const [error, setError] = useState('');

  const handleAuthSuccess = (res) => {
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

  const fillCredentials = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
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
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Decorative Gradient Blobs */}
      <Box
        sx={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '45vw',
          height: '45vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(2, 132, 199, 0.18) 0%, rgba(2, 132, 199, 0) 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(99, 102, 241, 0) 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />

      <Card
        sx={{
          maxWidth: 480,
          width: '100%',
          borderRadius: 4,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
          position: 'relative',
          zIndex: 1,
          backdropFilter: 'blur(16px)',
          bgcolor: 'background.paper',
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 3.5,
                background: 'linear-gradient(135deg, #0284C7 0%, #6366F1 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                mb: 1.5,
                boxShadow: '0 8px 20px rgba(2, 132, 199, 0.35)',
              }}
            >
              <SpaIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif' }}>
              Welcome to AuraWell
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Digital Student Wellness & Counseling Management Platform
            </Typography>
          </Box>

          {/* Google Sign-In Button */}
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
                OR SIGN IN WITH EMAIL
              </Typography>
            </Divider>
          </Box>

          {/* Quick 1-Click Demo Login Selector */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 1 }}>
              Quick Demo Personas (1-Click Fill)
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
              {DEMO_ACCOUNTS.map((acc) => {
                const isSelected = email === acc.email;
                return (
                  <Button
                    key={acc.email}
                    variant={isSelected ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => fillCredentials(acc)}
                    sx={{
                      py: 1,
                      px: 0.5,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.5,
                      borderRadius: 2.5,
                      borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                      bgcolor: isSelected ? 'primary.main' : 'background.subtle',
                      color: isSelected ? '#FFFFFF' : 'text.primary',
                    }}
                  >
                    <Avatar src={acc.avatar} sx={{ width: 26, height: 26 }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.7rem' }}>
                      {acc.roleName}
                    </Typography>
                  </Button>
                );
              })}
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2.5 }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
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
              color="primary"
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
                background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#0284C7', fontWeight: 700, textDecoration: 'none' }}>
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
