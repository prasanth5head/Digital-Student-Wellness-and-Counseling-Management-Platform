import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export const SkeletonLoader = ({ type = 'cards', count = 4 }) => {
  if (type === 'cards') {
    return (
      <Grid container spacing={3}>
        {Array.from(new Array(count)).map((_, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ height: 140 }}>
              <CardContent>
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={40} sx={{ my: 1 }} />
                <Skeleton variant="text" width="80%" height={16} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (type === 'table') {
    return (
      <Box sx={{ width: '100%' }}>
        <Skeleton variant="rectangular" height={50} sx={{ mb: 1, borderRadius: 2 }} />
        {Array.from(new Array(5)).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={40} sx={{ mb: 0.5, borderRadius: 1 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Skeleton variant="text" height={40} width="50%" />
      <Skeleton variant="rectangular" height={200} sx={{ my: 2, borderRadius: 3 }} />
      <Skeleton variant="text" height={20} />
      <Skeleton variant="text" height={20} width="80%" />
    </Box>
  );
};

export default SkeletonLoader;
