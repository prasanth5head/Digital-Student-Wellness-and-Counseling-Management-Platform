import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SendTimeExtensionIcon from '@mui/icons-material/SendTimeExtension';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LaunchIcon from '@mui/icons-material/Launch';

import { counselorAPI } from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import MetricCard from '../../components/common/MetricCard';
import RiskBadge from '../../components/common/RiskBadge';
import AppointmentCard from '../../components/common/AppointmentCard';
import EmptyState from '../../components/common/EmptyState';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export const CounselorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await counselorAPI.getDashboard();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load counselor dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <SkeletonLoader type="cards" count={4} />;
  }

  const d = data || {};

  return (
    <Box sx={{ pb: 6 }}>
      {/* Welcome Banner */}
      <Card
        sx={{
          mb: 3.5,
          borderRadius: 4,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1A1C29 0%, #282C3F 100%)'
              : 'linear-gradient(135deg, #4338CA 0%, #6366F1 50%, #818CF8 100%)',
          color: '#FFFFFF',
          p: { xs: 3, sm: 4 },
          boxShadow: '0 12px 32px rgba(99, 102, 241, 0.25)',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Chip
              label="Licensed Clinical Counselor Workspace"
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#FFFFFF', fontWeight: 700, mb: 1 }}
            />
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 1, color: '#FFFFFF' }}>
              Welcome, {d.counselorName || user?.name}! 🩺
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 640, mb: 3 }}>
              Specialization: <strong>{d.specialization || 'Cognitive Behavioral Therapy & Student Wellness'}</strong>.
              You have <strong>{d.pendingRequestsCount || 0} pending intake requests</strong> and <strong>{d.todayAppointmentsCount || 0} sessions scheduled today</strong>.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={() => navigate('/counselor/students')}
                startIcon={<PeopleAltIcon />}
                sx={{
                  bgcolor: '#FFFFFF',
                  color: '#4338CA',
                  fontWeight: 700,
                  borderRadius: 2.5,
                  '&:hover': { bgcolor: '#F1F5F9' },
                }}
              >
                View Caseload ({d.totalAssignedStudents || 0} Students)
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/counselor/requests')}
                startIcon={<SendTimeExtensionIcon />}
                sx={{
                  borderColor: 'rgba(255,255,255,0.6)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  borderRadius: 2.5,
                  '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                Review Requests ({d.pendingRequestsCount || 0})
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* KPI Metrics */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Assigned Students"
            value={d.totalAssignedStudents || 10}
            subtitle="Active Caseload"
            color="#6366F1"
            icon={PeopleAltIcon}
            trend="up"
            trendValue="Active monitoring"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="High-Risk Alerts"
            value={d.highRiskStudentsCount || 0}
            subtitle="Elevated Psychological Distress"
            color="#EF4444"
            icon={WarningAmberIcon}
            trend={d.highRiskStudentsCount > 0 ? 'up' : 'down'}
            trendValue="Immediate Attention"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Pending Requests"
            value={d.pendingRequestsCount || 0}
            subtitle="Awaiting Review / Triage"
            color="#F59E0B"
            icon={SendTimeExtensionIcon}
            trend="up"
            trendValue="New Inquiries"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Completed Sessions"
            value={d.completedSessionsCount || 18}
            subtitle="Total Clinical Consultations"
            color="#10B981"
            icon={PsychologyIcon}
            trend="up"
            trendValue="4.85 ★ Rating"
          />
        </Grid>
      </Grid>

      {/* High-Risk Alerts Table */}
      {(d.highRiskStudents || []).length > 0 && (
        <Card
          sx={{
            mb: 3.5,
            borderRadius: 3.5,
            border: '1px solid rgba(239, 68, 68, 0.3)',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(254, 242, 242, 0.6)'),
            p: 3,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningAmberIcon color="error" />
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'error.main' }}>
                High-Risk Student Alerts (Immediate Clinical Follow-up Recommended)
              </Typography>
            </Box>
            <Chip
              label={`${d.highRiskStudents.length} Students Requiring Attention`}
              color="error"
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </Box>

          <TableContainer component={Box}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Wellness Score</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Risk Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Stress / Anxiety</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {d.highRiskStudents.map((s) => (
                  <TableRow key={s.id} hover sx={{ bgcolor: 'background.paper' }}>
                    <TableCell sx={{ fontWeight: 700 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar src={s.avatar} sx={{ width: 30, height: 30 }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{s.name}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{s.registerNumber}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{s.departmentName}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: 'error.main' }}>
                        {s.currentWellnessScore}/100
                      </Typography>
                    </TableCell>
                    <TableCell><RiskBadge riskLevel={s.riskLevel} /></TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Stress: {s.stressScore}% • Anxiety: {s.anxietyScore}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate(`/counselor/students/${s.id}`)}
                        sx={{ borderRadius: 2 }}
                      >
                        Open 7-Tab Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Today's Appointments & Pending Inquiries Grid */}
      <Grid container spacing={3}>
        {/* Today Appointments */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 3.5, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarMonthIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Today's Counseling Appointments
                </Typography>
              </Box>
              <Button size="small" onClick={() => navigate('/counselor/appointments')}>
                Schedule Calendar
              </Button>
            </Box>

            {(d.todayAppointments || []).length === 0 ? (
              <EmptyState
                title="No Sessions Scheduled Today"
                description="Your calendar is open for intakes and review."
                icon={CalendarMonthIcon}
              />
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {d.todayAppointments.map((appt) => (
                  <AppointmentCard
                    key={appt.id}
                    appointment={appt}
                    isCounselor={true}
                  />
                ))}
              </Box>
            )}
          </Card>
        </Grid>

        {/* Pending Requests Queue */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 3.5, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SendTimeExtensionIcon color="warning" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Incoming Requests Queue
                </Typography>
              </Box>
              <Button size="small" onClick={() => navigate('/counselor/requests')}>
                Manage Queue
              </Button>
            </Box>

            {(d.pendingRequests || []).length === 0 ? (
              <EmptyState
                title="No Pending Requests"
                description="All student counseling requests have been processed."
                icon={SendTimeExtensionIcon}
              />
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {d.pendingRequests.slice(0, 4).map((r) => (
                  <Box
                    key={r.id}
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      bgcolor: 'background.subtle',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {r.studentName} ({r.departmentName})
                      </Typography>
                      <Chip label={r.urgency} color={r.urgency === 'EMERGENCY' || r.urgency === 'HIGH' ? 'error' : 'warning'} size="small" sx={{ fontWeight: 700 }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.825rem', mb: 1.5 }}>
                      Type: {r.requestType} • "{r.reason}"
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate('/counselor/requests')}
                      sx={{ borderRadius: 2 }}
                    >
                      Process Request
                    </Button>
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
export default CounselorDashboard;
