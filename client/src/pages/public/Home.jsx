import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const Home = () => {
  return (
    <Box component="main" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="md">
        <Typography component="h1" variant="h2" gutterBottom>
          AuraWell
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Digital Student Wellness & Counseling Platform
        </Typography>
        <Typography color="text.secondary" paragraph>
          Access wellness assessments, counseling support, appointments, and personalized wellbeing guidance.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button component={Link} to="/login" variant="contained">
            Sign in
          </Button>
          <Button component={Link} to="/register" variant="outlined">
            Create an account
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
