import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import DomainIcon from '@mui/icons-material/Domain';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

import { departmentAPI } from '../../api/axiosConfig';
import MetricCard from '../../components/common/MetricCard';
import RadarComparisonChart from '../../components/common/RadarComparisonChart';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export const DepartmentAnalytics = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await departmentAPI.getAll();
        if (res.success && res.data && res.data.length > 0) {
          setDepartments(res.data);
          setSelectedDeptId(res.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load departments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepts();
  }, []);

  useEffect(() => {
    if (!selectedDeptId) return;
    setAnalyticsLoading(true);

    departmentAPI.getAnalytics(selectedDeptId).then((res) => {
      if (res.success && res.data) {
        setAnalytics(res.data);
      }
      setAnalyticsLoading(false);
    }).catch(() => setAnalyticsLoading(false));
  }, [selectedDeptId]);

  if (loading) {
    return <SkeletonLoader type="cards" count={3} />;
  }

  const categoryBarData = analytics?.categoryAverages
    ? Object.entries(analytics.categoryAverages).map(([category, score]) => ({ category, score }))
    : [
        { category: 'Stress Resilience', score: 72 },
        { category: 'Sleep Quality', score: 76 },
        { category: 'Academic Ease', score: 68 },
        { category: 'Social Support', score: 82 },
      ];

  const currentDept = departments.find((d) => d.id === selectedDeptId);

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Department Wellness Analytics
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          In-depth psychological health indicators and cohort risk distribution aggregated by academic department
        </Typography>
      </Box>

      {/* Department Tabs */}
      <Tabs
        value={selectedDeptId}
        onChange={(_, val) => setSelectedDeptId(val)}
        sx={{
          mb: 3.5,
          bgcolor: 'background.paper',
          borderRadius: 3,
          p: 0.5,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          '& .MuiTabs-indicator': { display: 'none' },
          '& .MuiTab-root': {
            borderRadius: 2.5,
            fontWeight: 700,
            fontSize: '0.85rem',
            minHeight: 44,
            px: 3,
            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
            },
          },
        }}
      >
        {departments.map((d) => (
          <Tab key={d.id} value={d.id} label={`${d.name} (${d.code})`} />
        ))}
      </Tabs>

      {analyticsLoading ? (
        <SkeletonLoader type="cards" count={3} />
      ) : (
        <>
          {/* Top Metric Cards */}
          <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Average Wellness Score"
                value={analytics?.averageWellnessScore || 75}
                subtitle="Cohort Psychological Index"
                color="#0284C7"
                icon={DomainIcon}
                isScore
                progress={analytics?.averageWellnessScore || 75}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Total Enrolled Students"
                value={analytics?.totalStudents || 8}
                subtitle={`${analytics?.assessmentParticipationRate || 100}% Participation Rate`}
                color="#6366F1"
                icon={DomainIcon}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="High-Risk Cohort"
                value={analytics?.highRiskCount || 2}
                subtitle="Flagged for Active Outreach"
                color="#EF4444"
                icon={DomainIcon}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Low Risk / Resilient"
                value={analytics?.lowRiskCount || 5}
                subtitle="Healthy Baseline"
                color="#10B981"
                icon={DomainIcon}
              />
            </Grid>
          </Grid>

          {/* Dimension Breakdown Bar Chart */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Card sx={{ p: 3, borderRadius: 3.5, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Department Average by Wellness Dimension
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                  Scores out of 100 across key psychological wellness categories
                </Typography>

                <Box sx={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="category" fontSize={10} />
                      <YAxis domain={[0, 100]} fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="score" name="Average Score" fill="#0284C7" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>

            {/* Department Details Card */}
            <Grid item xs={12} md={5}>
              <Card sx={{ p: 3, borderRadius: 3.5, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                  Department Profile: {currentDept?.name}
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5, lineHeight: 1.6 }}>
                  {currentDept?.description || 'Department academic cohort.'}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ p: 2, bgcolor: 'background.subtle', borderRadius: 2.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>HEAD OF DEPARTMENT</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {currentDept?.headOfDepartment || 'Dr. Department Head'}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, bgcolor: 'background.subtle', borderRadius: 2.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>RISK COMPOSITION</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Chip label={`Low: ${analytics?.lowRiskCount || 0}`} size="small" color="success" sx={{ fontWeight: 700 }} />
                      <Chip label={`Mod: ${analytics?.moderateRiskCount || 0}`} size="small" color="warning" sx={{ fontWeight: 700 }} />
                      <Chip label={`High: ${analytics?.highRiskCount || 0}`} size="small" color="error" sx={{ fontWeight: 700 }} />
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};
export default DepartmentAnalytics;
