import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import QuizIcon from '@mui/icons-material/Quiz';
import SendTimeExtensionIcon from '@mui/icons-material/SendTimeExtension';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

import { studentAPI } from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import MetricCard from '../../components/common/MetricCard';
import WellnessScoreDial from '../../components/common/WellnessScoreDial';
import ScoreTrendChart from '../../components/common/ScoreTrendChart';
import RadarComparisonChart from '../../components/common/RadarComparisonChart';
import AppointmentCard from '../../components/common/AppointmentCard';
import RiskBadge from '../../components/common/RiskBadge';
import PDFReportModal from '../../components/common/PDFReportModal';
import EmptyState from '../../components/common/EmptyState';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await studentAPI.getDashboard();
        if (res.success && res.data) {
          setDashboardData(res.data);
        }
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <SkeletonLoader type="cards" count={4} />;
  }

  const d = dashboardData || {};
  const isAssessed = d.currentWellnessScore !== null && d.currentWellnessScore !== undefined;

  return (
    <Box sx={{ pb: 6 }}>
      {/* Welcome Banner */}
      <Card
        sx={{
          mb: 3.5,
          borderRadius: 4,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)'
              : 'linear-gradient(135deg, #0284C7 0%, #0369A1 50%, #6366F1 100%)',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 32px rgba(2, 132, 199, 0.25)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            right: '-5%',
            bottom: '-25%',
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            pointerEvents: 'none',
          }}
        />

        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Chip
                  label="Student Wellness Portal"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                  }}
                />
                <Typography variant="caption" sx={{ opacity: 0.85 }}>
                  {d.departmentName || 'Academic Department'} • Year {d.yearOfStudy || 1}
                </Typography>
              </Box>

              <Typography variant="h2" sx={{ fontWeight: 800, mb: 1, color: '#FFFFFF' }}>
                Hello, {d.studentName || user?.name}! 👋
              </Typography>

              <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 620, mb: 3 }}>
                {isAssessed ? (
                  <>
                    Your current emotional health status is evaluated as <strong>{d.wellnessStatus || 'Flourishing & Resilient'}</strong>.
                    Take periodic check-ins to track your progress and receive tailored advice.
                  </>
                ) : (
                  <>
                    You have not taken your first wellness check-in yet. Take a quick 2-minute assessment now to calculate your personal baseline scores and unlock tailored resources.
                  </>
                )}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/student/assessment')}
                  startIcon={<QuizIcon />}
                  sx={{
                    bgcolor: '#FFFFFF',
                    color: '#0284C7',
                    fontWeight: 700,
                    px: 2.5,
                    py: 1,
                    borderRadius: 2.5,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                    '&:hover': { bgcolor: '#F1F5F9' },
                  }}
                >
                  {isAssessed ? 'Take Periodic Assessment' : 'Take Your First Assessment'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/student/requests')}
                  startIcon={<SendTimeExtensionIcon />}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.6)',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    borderRadius: 2.5,
                    '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Request Counseling
                </Button>
                {d.recentAssessment && (
                  <Button
                    variant="text"
                    onClick={() => setPdfModalOpen(true)}
                    startIcon={<PictureAsPdfIcon />}
                    sx={{ color: '#FFFFFF', opacity: 0.9 }}
                  >
                    View Report
                  </Button>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'center' } }}>
              <Box
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 3.5,
                  p: 2.5,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2.5,
                }}
              >
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'uppercase', fontWeight: 700 }}>
                    Wellness Index
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#FFFFFF', lineHeight: 1, mt: 0.5 }}>
                    {isAssessed ? d.currentWellnessScore : '--'}
                    <span style={{ fontSize: '1rem', opacity: 0.7 }}>/100</span>
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {isAssessed && d.riskLevel ? (
                      <RiskBadge riskLevel={d.riskLevel} />
                    ) : (
                      <Chip
                        label="NOT ASSESSED YET"
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#FFFFFF', fontWeight: 700, fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Daily Wellness Tip Banner */}
      {d.dailyTip && (
        <Card
          sx={{
            mb: 3.5,
            borderRadius: 3,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.1)' : '#FEF3C7'),
            border: '1px solid',
            borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.3)' : '#FDE68A'),
          }}
        >
          <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                bgcolor: '#F59E0B',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <LightbulbIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#B45309', textTransform: 'uppercase' }}>
                Daily Mindful Insight
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                {d.dailyTip}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* 4 Core Dimensions Metric Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Wellness Score"
            value={isAssessed ? d.currentWellnessScore : '--'}
            subtitle={isAssessed ? 'Calculated Resilience' : 'Pending First Test'}
            color="#0284C7"
            icon={FavoriteIcon}
            isScore={isAssessed}
            progress={isAssessed ? d.currentWellnessScore : 0}
            trend={isAssessed ? 'up' : null}
            trendValue={isAssessed ? '+6 pts this month' : 'Not Assessed'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Stress Index"
            value={isAssessed ? d.stressScore : '--'}
            subtitle={isAssessed ? 'Manageable Pressure' : 'Pending First Test'}
            color="#EF4444"
            icon={MoodBadIcon}
            isScore={isAssessed}
            progress={isAssessed ? d.stressScore : 0}
            trend={isAssessed ? 'down' : null}
            trendValue={isAssessed ? '-8% stress' : 'Not Assessed'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Anxiety Level"
            value={isAssessed ? d.anxietyScore : '--'}
            subtitle={isAssessed ? 'Calm & Regulated' : 'Pending First Test'}
            color="#F59E0B"
            icon={SentimentVeryDissatisfiedIcon}
            isScore={isAssessed}
            progress={isAssessed ? d.anxietyScore : 0}
            trend={isAssessed ? 'down' : null}
            trendValue={isAssessed ? '-5% anxiety' : 'Not Assessed'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Sleep Quality"
            value={isAssessed ? d.sleepScore : '--'}
            subtitle={isAssessed ? 'Restorative average' : 'Pending First Test'}
            color="#10B981"
            icon={BedtimeIcon}
            isScore={isAssessed}
            progress={isAssessed ? d.sleepScore : 0}
            trend={isAssessed ? 'up' : null}
            trendValue={isAssessed ? '+12% sleep' : 'Not Assessed'}
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 3.5 }}>
        {/* Score Trend Area Chart */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 2.5, height: '100%', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Wellness Score Trajectory
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Progressive tracking across weekly assessment cycles
                </Typography>
              </Box>
              {isAssessed && (
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/student/assessment/history')}
                  sx={{ fontWeight: 600 }}
                >
                  View History
                </Button>
              )}
            </Box>

            {d.scoreTrend && d.scoreTrend.length > 0 ? (
              <ScoreTrendChart data={d.scoreTrend} />
            ) : (
              <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <AutoGraphIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1.5 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  No Assessment History Yet
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 380, mb: 2 }}>
                  Complete your first wellness assessment to start visualizing your longitudinal health trends.
                </Typography>
                <Button variant="outlined" size="small" onClick={() => navigate('/student/assessment')}>
                  Start First Assessment
                </Button>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Radar Dimension Chart */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 2.5, height: '100%', borderRadius: 3 }}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Wellness Dimension Breakdown
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Your scores compared with campus average benchmark
              </Typography>
            </Box>

            {d.latestCategoryScores && d.latestCategoryScores.length > 0 ? (
              <RadarComparisonChart studentCategories={d.latestCategoryScores} />
            ) : (
              <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <FavoriteIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1.5 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Dimension Breakdown Pending
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 320, mb: 2 }}>
                  Your multi-dimensional radar comparison will unlock after taking your first assessment.
                </Typography>
                <Button variant="outlined" size="small" onClick={() => navigate('/student/assessment')}>
                  Take Assessment
                </Button>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Appointments & Counseling Section */}
      <Grid container spacing={3} sx={{ mb: 3.5 }}>
        {/* Next Appointment */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2.5, height: '100%', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Next Counseling Appointment
              </Typography>
              <Button size="small" onClick={() => navigate('/student/appointments')}>
                View All
              </Button>
            </Box>

            {d.nextAppointment ? (
              <AppointmentCard appointment={d.nextAppointment} />
            ) : (
              <EmptyState
                title="No Upcoming Appointments"
                description="You don't have any scheduled sessions right now. Request a meeting whenever you'd like support."
                actionLabel="Book a Session"
                onAction={() => navigate('/student/requests')}
                icon={CalendarMonthIcon}
              />
            )}
          </Card>
        </Grid>

        {/* Active Counseling Requests */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2.5, height: '100%', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Pending Intake Requests
              </Typography>
              <Button size="small" onClick={() => navigate('/student/requests')}>
                New Request
              </Button>
            </Box>

            {d.pendingRequests && d.pendingRequests.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {d.pendingRequests.map((req) => (
                  <Box
                    key={req.id}
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      bgcolor: 'background.subtle',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {req.counselorName ? `With ${req.counselorName}` : 'Counseling Request'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        Requested on {new Date(req.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Chip
                      label={req.status}
                      size="small"
                      color={req.status === 'ACCEPTED' ? 'success' : 'warning'}
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <EmptyState
                title="No Pending Requests"
                description="You currently have no pending counseling requests."
                actionLabel="Request Consultation"
                onAction={() => navigate('/student/requests')}
              />
            )}
          </Card>
        </Grid>
      </Grid>

      {/* PDF Modal */}
      {d.recentAssessment && (
        <PDFReportModal
          open={pdfModalOpen}
          onClose={() => setPdfModalOpen(false)}
          studentName={d.studentName}
          registerNumber={d.registerNumber}
          departmentName={d.departmentName}
          assessment={d.recentAssessment}
        />
      )}
    </Box>
  );
};
export default StudentDashboard;
