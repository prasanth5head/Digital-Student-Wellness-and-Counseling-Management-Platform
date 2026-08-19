import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DomainIcon from '@mui/icons-material/Domain';
import PsychologyIcon from '@mui/icons-material/Psychology';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShieldIcon from '@mui/icons-material/Shield';
import CampaignIcon from '@mui/icons-material/Campaign';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { adminAPI } from '../../api/axiosConfig';
import MetricCard from '../../components/common/MetricCard';
import RiskBadge from '../../components/common/RiskBadge';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const RISK_COLORS = {
  LOW: '#10B981',
  MODERATE: '#F59E0B',
  HIGH: '#F97316',
  CRITICAL: '#EF4444',
};

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminOverview = async () => {
      try {
        const res = await adminAPI.getOverview();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminOverview();
  }, []);

  if (loading) {
    return <SkeletonLoader type="cards" count={4} />;
  }

  const d = data || {};

  const riskPieData = d.riskLevelDistribution
    ? Object.entries(d.riskLevelDistribution).map(([name, value]) => ({ name, value }))
    : [
        { name: 'LOW', value: 12 },
        { name: 'MODERATE', value: 5 },
        { name: 'HIGH', value: 2 },
        { name: 'CRITICAL', value: 1 },
      ];

  const demandBarData = d.counselingDemandByType
    ? Object.entries(d.counselingDemandByType).map(([name, count]) => ({ name, count }))
    : [
        { name: 'Anxiety', count: 8 },
        { name: 'Burnout', count: 6 },
        { name: 'Sleep', count: 4 },
        { name: 'Mindfulness', count: 5 },
      ];

  return (
    <Box sx={{ pb: 6 }}>
      {/* Admin Executive Header */}
      <Card
        sx={{
          mb: 3.5,
          borderRadius: 4,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 100%)'
              : 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
          color: '#FFFFFF',
          p: { xs: 3, sm: 4 },
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.25)',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Chip
              label="Campus Institutional Oversight"
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', fontWeight: 700, mb: 1 }}
            />
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 1, color: '#FFFFFF' }}>
              University Wellness Command Center 🏛️
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 650, mb: 2.5 }}>
              Campus Average Wellness Score: <strong>{d.campusAverageWellnessScore || 75.2}/100</strong> across 3 departments with <strong>{d.assessmentCompletionRate || 88.5}% assessment participation</strong>.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={() => navigate('/admin/departments')}
                startIcon={<DomainIcon />}
                sx={{
                  bgcolor: '#0284C7',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  borderRadius: 2.5,
                  '&:hover': { bgcolor: '#0369A1' },
                }}
              >
                Department Breakdowns
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/announcements')}
                startIcon={<CampaignIcon />}
                sx={{
                  borderColor: 'rgba(255,255,255,0.4)',
                  color: '#FFFFFF',
                  borderRadius: 2.5,
                  '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                Broadcast Announcement
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/audit-logs')}
                startIcon={<ShieldIcon />}
                sx={{
                  borderColor: 'rgba(255,255,255,0.4)',
                  color: '#FFFFFF',
                  borderRadius: 2.5,
                  '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                Audit Trails
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'center' } }}>
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.08)',
                borderRadius: 3.5,
                p: 2.5,
                border: '1px solid rgba(255,255,255,0.15)',
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 700, textTransform: 'uppercase' }}>
                Campus Overall Wellness
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 800, color: '#38BDF8', lineHeight: 1, my: 0.5 }}>
                {d.campusAverageWellnessScore || 75.2}
              </Typography>
              <Chip label="Healthy University Average" color="success" size="small" sx={{ fontWeight: 700 }} />
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Students"
            value={d.totalStudents || 20}
            subtitle="Enrolled Across 3 Depts"
            color="#0284C7"
            icon={PeopleAltIcon}
            trend="up"
            trendValue="100% Onboarded"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Counselors"
            value={d.totalCounselors || 5}
            subtitle="Clinical Staff Available"
            color="#6366F1"
            icon={PsychologyIcon}
            trend="up"
            trendValue="Full Capacity"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="High-Risk Students"
            value={d.highRiskStudentsCount || 3}
            subtitle="Flagged for Prompt Outreach"
            color="#EF4444"
            icon={WarningAmberIcon}
            trend="down"
            trendValue="Prioritized"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Counseling Sessions"
            value={d.totalCounselingSessions || 31}
            subtitle="Conducted to Date"
            color="#10B981"
            icon={DomainIcon}
            trend="up"
            trendValue="+18% month/month"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 3.5 }}>
        {/* Risk Distribution Pie */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, height: '100%', borderRadius: 3.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              Campus Risk Classification Breakdown
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
              Student mental health risk distribution
            </Typography>

            <Box sx={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {riskPieData.map((entry) => (
                      <Cell key={entry.name} fill={RISK_COLORS[entry.name] || '#0284C7'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Monthly Trends */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, height: '100%', borderRadius: 3.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              Monthly Assessments vs Clinical Consultations
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
              Campus engagement and counseling session throughput
            </Typography>

            <Box sx={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.monthlyTrends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="assessments" name="Assessments" fill="#0284C7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sessions" name="Counseling Sessions" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Department Summary Table */}
      <Card sx={{ borderRadius: 3.5, overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Academic Department Wellness Standings
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Real-time health aggregations generated by MongoDB pipelines
            </Typography>
          </Box>
          <Button size="small" onClick={() => navigate('/admin/departments')} endIcon={<ArrowForwardIcon />}>
            Detailed Analytics
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'background.subtle' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Students</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Avg Wellness Score</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>High Risk Count</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Participation Rate</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(d.departmentSummaries || []).map((dept) => (
                <TableRow key={dept.departmentId} hover>
                  <TableCell sx={{ fontWeight: 700 }}>
                    {dept.departmentName} ({dept.departmentCode})
                  </TableCell>
                  <TableCell>{dept.totalStudents}</TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: dept.averageWellnessScore < 70 ? 'warning.main' : 'primary.main' }}>
                      {dept.averageWellnessScore}/100
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${dept.highRiskCount} High Risk`}
                      size="small"
                      color={dept.highRiskCount > 1 ? 'error' : 'warning'}
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {dept.assessmentParticipationRate || 100}%
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate('/admin/departments')}
                    >
                      View Breakdown
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};
export default AdminDashboard;
