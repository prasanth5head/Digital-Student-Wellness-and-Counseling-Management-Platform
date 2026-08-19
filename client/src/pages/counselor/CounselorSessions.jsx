import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import PsychologyIcon from '@mui/icons-material/Psychology';

import { counselorAPI } from '../../api/axiosConfig';
import EmptyState from '../../components/common/EmptyState';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export const CounselorSessions = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    counselorAPI.getDashboard().then((res) => {
      if (res.success && res.data) {
        setDashboard(res.data);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <SkeletonLoader type="cards" count={3} />;
  }

  return (
    <Box sx={{ pb: 6 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Clinical Session Logs & Records
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Archive of completed counseling encounters, intervention records, and student action items
        </Typography>
      </Box>

      <Card sx={{ p: 3, borderRadius: 3.5, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>TOTAL COMPLETED SESSIONS</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
              {dashboard?.completedSessionsCount || 18}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>ACTIVE CASELOAD</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'secondary.main' }}>
              {dashboard?.totalAssignedStudents || 10}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>AVERAGE RATING</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981' }}>
              4.85 ★
            </Typography>
          </Box>
        </Box>
      </Card>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        To view and log detailed confidential clinical notes for individual students, open their respective <strong>7-Tab Clinical Profile</strong> from the Assigned Students Caseload.
      </Typography>
    </Box>
  );
};
export default CounselorSessions;
