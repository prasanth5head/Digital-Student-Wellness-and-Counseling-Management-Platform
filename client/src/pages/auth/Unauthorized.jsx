import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SecurityIcon from '@mui/icons-material/Security';
import { useAuth } from '../../context/AuthContext';

export const Unauthorized = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleGoHome = () => {
    if (role === 'ROLE_STUDENT') navigate('/student/dashboard');
    else if (role === 'ROLE_COUNSELOR') navigate('/counselor/dashboard');
    else if (role === 'ROLE_ADMIN') navigate('/admin/dashboard');
    else navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'error.light',
          color: 'error.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2.5,
        }}
      >
        <SecurityIcon sx={{ fontSize: 44 }} />
      </Box>
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
        Access Restricted
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 460, mb: 3 }}>
        You do not have the required role permissions to view this administrative or clinical portal page.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleGoHome} sx={{ borderRadius: 2.5, px: 3 }}>
        Return to My Dashboard
      </Button>
    </Box>
  );
};
export default Unauthorized;
