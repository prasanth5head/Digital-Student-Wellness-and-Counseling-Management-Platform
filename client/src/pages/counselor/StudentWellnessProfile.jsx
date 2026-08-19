import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LockIcon from '@mui/icons-material/Lock';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { counselorAPI, appointmentAPI } from '../../api/axiosConfig';
import WellnessScoreDial from '../../components/common/WellnessScoreDial';
import RiskBadge from '../../components/common/RiskBadge';
import ScoreTrendChart from '../../components/common/ScoreTrendChart';
import RadarComparisonChart from '../../components/common/RadarComparisonChart';
import AppointmentCard from '../../components/common/AppointmentCard';
import PDFReportModal from '../../components/common/PDFReportModal';
import EmptyState from '../../components/common/EmptyState';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export const StudentWellnessProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modals
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  // Session Logging Modal
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    sessionDate: new Date().toISOString().slice(0, 10),
    durationMinutes: 50,
    sessionType: 'Individual Psychotherapy',
    sessionSummary: '',
    keyTakeaways: '',
    studentActionItems: '',
    privateNotes: '',
    clinicalRiskRating: 'LOW',
    mentalStatusObservations: '',
    interventionPlan: '',
  });

  // Clinical Note Modal
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteForm, setNoteForm] = useState({
    title: '',
    privateNotes: '',
    clinicalRiskRating: 'LOW',
    mentalStatusObservations: '',
    interventionPlan: '',
  });

  const fetchProfile = async () => {
    try {
      const res = await counselorAPI.getStudentWellnessProfile(studentId);
      if (res.success && res.data) {
        setProfileData(res.data);
      }
    } catch (err) {
      console.error('Failed to load student wellness profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [studentId]);

  const handleSaveSession = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...sessionForm,
        studentId: studentId,
        studentActionItems: sessionForm.studentActionItems
          ? sessionForm.studentActionItems.split('\n').filter(Boolean)
          : [],
      };
      const res = await counselorAPI.createSession(payload);
      if (res.success) {
        setSessionModalOpen(false);
        fetchProfile();
      }
    } catch (err) {
      console.error('Failed to create session:', err);
    }
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...noteForm,
        studentId: studentId,
      };
      const res = await counselorAPI.saveClinicalNote(payload);
      if (res.success) {
        setNoteModalOpen(false);
        fetchProfile();
      }
    } catch (err) {
      console.error('Failed to save clinical note:', err);
    }
  };

  if (loading) {
    return <SkeletonLoader type="cards" count={3} />;
  }

  const { student, assessments = [], appointments = [], sessions = [], privateNotes = [], recommendedResources = [] } = profileData || {};

  if (!student) {
    return (
      <EmptyState
        title="Student Profile Not Found"
        description="Unable to locate the clinical record for this student identifier."
        actionLabel="Back to Caseload"
        onAction={() => navigate('/counselor/students')}
      />
    );
  }

  const trendData = [...assessments].reverse().map((item, idx) => ({
    date: `Eval #${idx + 1} (${new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })})`,
    score: item.overallScore,
    stress: item.categoryScores?.find((c) => c.category === 'Stress')?.percentage || 30,
    sleep: item.categoryScores?.find((c) => c.category === 'Sleep')?.percentage || 70,
  }));

  const latestAssessment = assessments[0];

  return (
    <Box sx={{ pb: 6 }}>
      {/* Top Breadcrumb & Action Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/counselor/students')}
          variant="outlined"
          color="inherit"
          size="small"
        >
          Back to Caseload
        </Button>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<LockIcon />}
            onClick={() => setNoteModalOpen(true)}
            sx={{ borderRadius: 2.5 }}
          >
            Add Confidential Note
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PsychologyIcon />}
            onClick={() => setSessionModalOpen(true)}
            sx={{
              borderRadius: 2.5,
              background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
            }}
          >
            Log Clinical Session
          </Button>
        </Box>
      </Box>

      {/* Student Banner Header */}
      <Card sx={{ p: 3, mb: 3.5, borderRadius: 3.5 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Avatar
                src={student.avatar}
                sx={{ width: 72, height: 72, border: '3px solid', borderColor: 'primary.main' }}
              />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    {student.name}
                  </Typography>
                  <RiskBadge riskLevel={student.riskLevel} />
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {student.registerNumber} • {student.departmentName} (Year {student.yearOfStudy}) • {student.email}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled', mt: 0.5, display: 'block' }}>
                  Emergency Contact: {student.emergencyContact || 'Not specified'} • Phone: {student.contactNumber || 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 2 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                Current Wellness Index
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: student.currentWellnessScore < 60 ? 'error.main' : 'primary.main', lineHeight: 1 }}>
                {student.currentWellnessScore}
                <span style={{ fontSize: '1rem', color: 'text.secondary' }}>/100</span>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* 7-Tab Navigation */}
      <Tabs
        value={currentTab}
        onChange={(_, val) => setCurrentTab(val)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 3,
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
            px: 2.5,
            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
            },
          },
        }}
      >
        <Tab label="1. Overview" />
        <Tab label={`2. Assessments (${assessments.length})`} />
        <Tab label="3. Score Trends" />
        <Tab label="4. Counseling & Intake" />
        <Tab label={`5. Appointments (${appointments.length})`} />
        <Tab label={`6. Confidential Notes (${privateNotes.length})`} />
        <Tab label={`7. Recommended Resources (${recommendedResources.length})`} />
      </Tabs>

      {/* Tab 1: Overview */}
      {currentTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, textAlign: 'center', height: '100%', borderRadius: 3.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Psychological Score Index
              </Typography>
              <WellnessScoreDial
                score={student.currentWellnessScore}
                riskLevel={student.riskLevel}
                size={180}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3, height: '100%', borderRadius: 3.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Clinical Dimension Diagnostics
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2.5 }}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 2, bgcolor: 'background.subtle', borderRadius: 2.5, textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>STRESS</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#EF4444' }}>{student.stressScore}%</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 2, bgcolor: 'background.subtle', borderRadius: 2.5, textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>ANXIETY</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#F59E0B' }}>{student.anxietyScore}%</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 2, bgcolor: 'background.subtle', borderRadius: 2.5, textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>SLEEP</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#10B981' }}>{student.sleepScore}%</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 2, bgcolor: 'background.subtle', borderRadius: 2.5, textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>SESSIONS</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>{sessions.length}</Typography>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                Student Bio & Background:
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, mb: 2 }}>
                {student.bio || 'Student is actively participating in campus wellness consultations.'}
              </Typography>

              {latestAssessment && (
                <Box sx={{ p: 2, bgcolor: 'background.subtle', borderRadius: 2.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', display: 'block' }}>
                    Latest Evaluation Clinical Summary ({new Date(latestAssessment.createdAt).toLocaleDateString()}):
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', mt: 0.5 }}>
                    {latestAssessment.summary}
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tab 2: Assessments */}
      {currentTab === 1 && (
        <Card sx={{ borderRadius: 3.5, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'background.subtle' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Evaluation Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Score</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Risk Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category Breakdown</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Export</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assessments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <EmptyState title="No Assessments Recorded" description="Student has not submitted any evaluations yet." />
                    </TableCell>
                  </TableRow>
                ) : (
                  assessments.map((a) => (
                    <TableRow key={a.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {new Date(a.createdAt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                          {a.overallScore}/100
                        </Typography>
                      </TableCell>
                      <TableCell><RiskBadge riskLevel={a.riskLevel} /></TableCell>
                      <TableCell sx={{ maxWidth: 300 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(a.categoryScores || []).map((cs) => (
                            <Chip
                              key={cs.category}
                              label={`${cs.category}: ${cs.percentage}%`}
                              size="small"
                              sx={{ fontSize: '0.65rem' }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<PictureAsPdfIcon />}
                          onClick={() => {
                            setSelectedAssessment(a);
                            setPdfModalOpen(true);
                          }}
                        >
                          PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Tab 3: Trends */}
      {currentTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Card sx={{ p: 3, borderRadius: 3.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Longitudinal Score Trajectory
              </Typography>
              <ScoreTrendChart data={trendData} height={300} />
            </Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 3, borderRadius: 3.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Dimension Benchmark
              </Typography>
              <RadarComparisonChart studentData={latestAssessment?.categoryScores} height={300} />
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tab 4: Counseling & Intake */}
      {currentTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: 3.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Completed Clinical Counseling Sessions ({sessions.length})
              </Typography>
              {sessions.length === 0 ? (
                <EmptyState
                  title="No Counseling Sessions Logged"
                  description="Log a session to record takeaways and action items."
                  actionLabel="Log Session Now"
                  onAction={() => setSessionModalOpen(true)}
                />
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {sessions.map((s) => (
                    <Box key={s.id} sx={{ p: 2.5, borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}`, bgcolor: 'background.subtle' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {s.sessionType} • {s.sessionDate}
                        </Typography>
                        <Chip label={`${s.durationMinutes} minutes`} size="small" color="primary" sx={{ fontWeight: 600 }} />
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.primary', mb: 1.5 }}>
                        <strong>Summary:</strong> {s.sessionSummary}
                      </Typography>
                      {s.keyTakeaways && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                          <strong>Key Takeaways:</strong> {s.keyTakeaways}
                        </Typography>
                      )}
                      {(s.studentActionItems || []).length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', display: 'block' }}>
                            Agreed Student Action Items:
                          </Typography>
                          {s.studentActionItems.map((item, i) => (
                            <Typography key={i} variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                              • {item}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tab 5: Appointments */}
      {currentTab === 4 && (
        <Box>
          {appointments.length === 0 ? (
            <EmptyState title="No Appointments on Record" description="There are no appointments linked to this student." />
          ) : (
            <Grid container spacing={2.5}>
              {appointments.map((appt) => (
                <Grid item xs={12} md={6} key={appt.id}>
                  <AppointmentCard appointment={appt} isCounselor={true} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Tab 6: Confidential Clinical Notes (FERPA / HIPAA Restricted) */}
      {currentTab === 5 && (
        <Card sx={{ p: 3, borderRadius: 3.5, border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LockIcon color="secondary" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Confidential Counselor Notes (Restricted Clinical Access)
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<NoteAddIcon />}
              onClick={() => setNoteModalOpen(true)}
              sx={{ borderRadius: 2.5 }}
            >
              Add Note
            </Button>
          </Box>

          {privateNotes.length === 0 ? (
            <EmptyState
              title="No Confidential Notes"
              description="Record private observations, mental status findings, or intervention plans."
              icon={LockIcon}
              actionLabel="Create Note"
              onAction={() => setNoteModalOpen(true)}
            />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {privateNotes.map((note) => (
                <Box
                  key={note.id}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.06)' : '#F5F3FF'),
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'secondary.main' }}>
                      {note.title}
                    </Typography>
                    <Chip label={`Risk Rating: ${note.clinicalRiskRating || 'LOW'}`} size="small" sx={{ fontWeight: 700 }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.primary', mb: 1.5, whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                    {note.privateNotes}
                  </Typography>
                  {note.mentalStatusObservations && (
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                      <strong>Mental Status:</strong> {note.mentalStatusObservations}
                    </Typography>
                  )}
                  {note.interventionPlan && (
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      <strong>Intervention Plan:</strong> {note.interventionPlan}
                    </Typography>
                  )}
                  <Typography variant="caption" sx={{ color: 'text.disabled', mt: 1, display: 'block' }}>
                    Logged by {note.counselorName} on {new Date(note.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Card>
      )}

      {/* Tab 7: Recommended Resources */}
      {currentTab === 6 && (
        <Grid container spacing={2.5}>
          {recommendedResources.map((res) => (
            <Grid item xs={12} sm={6} md={4} key={res.id}>
              <Card sx={{ p: 2.5, height: '100%', borderRadius: 3.5 }}>
                <Chip label={res.category} size="small" color="primary" sx={{ mb: 1, fontWeight: 700 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                  {res.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.825rem', mb: 2 }}>
                  {res.description}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  {res.author} • {res.readTime}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Log Session Modal */}
      <Dialog
        open={sessionModalOpen}
        onClose={() => setSessionModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Log Clinical Counseling Session</DialogTitle>
        <DialogContent dividers>
          <Box component="form" id="session-form" onSubmit={handleSaveSession}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Session Date"
                  type="date"
                  value={sessionForm.sessionDate}
                  onChange={(e) => setSessionForm({ ...sessionForm, sessionDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  margin="dense"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Duration (Minutes)"
                  type="number"
                  value={sessionForm.durationMinutes}
                  onChange={(e) => setSessionForm({ ...sessionForm, durationMinutes: parseInt(e.target.value) })}
                  margin="dense"
                  required
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Session Type"
              value={sessionForm.sessionType}
              onChange={(e) => setSessionForm({ ...sessionForm, sessionType: e.target.value })}
              margin="dense"
              required
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Session Summary & Clinical Discussion (Visible to Student)"
              value={sessionForm.sessionSummary}
              onChange={(e) => setSessionForm({ ...sessionForm, sessionSummary: e.target.value })}
              margin="dense"
              required
            />

            <TextField
              fullWidth
              label="Key Takeaways"
              value={sessionForm.keyTakeaways}
              onChange={(e) => setSessionForm({ ...sessionForm, keyTakeaways: e.target.value })}
              margin="dense"
            />

            <TextField
              fullWidth
              multiline
              rows={2}
              label="Student Action Items (1 per line)"
              value={sessionForm.studentActionItems}
              onChange={(e) => setSessionForm({ ...sessionForm, studentActionItems: e.target.value })}
              margin="dense"
              placeholder="1. Practice 4-7-8 breathing&#10;2. Keep sleep log"
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.main', mb: 1 }}>
              Private Clinical Notes (Confidential - Restricted to Counselors Only)
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Confidential Clinical Impression & Observations"
              value={sessionForm.privateNotes}
              onChange={(e) => setSessionForm({ ...sessionForm, privateNotes: e.target.value })}
              margin="dense"
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Clinical Risk Rating"
                  value={sessionForm.clinicalRiskRating}
                  onChange={(e) => setSessionForm({ ...sessionForm, clinicalRiskRating: e.target.value })}
                  margin="dense"
                >
                  <MenuItem value="LOW">Low Risk</MenuItem>
                  <MenuItem value="MODERATE">Moderate Risk</MenuItem>
                  <MenuItem value="HIGH">High Risk</MenuItem>
                  <MenuItem value="CRITICAL">Critical Risk</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Mental Status Observations"
                  value={sessionForm.mentalStatusObservations}
                  onChange={(e) => setSessionForm({ ...sessionForm, mentalStatusObservations: e.target.value })}
                  margin="dense"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setSessionModalOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" form="session-form" variant="contained" color="primary">
            Save Session & Publish Summary
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confidential Note Modal */}
      <Dialog
        open={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
          <LockIcon color="secondary" />
          Add Confidential Clinical Note
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" id="note-form" onSubmit={handleSaveNote}>
            <TextField
              fullWidth
              label="Note Title"
              value={noteForm.title}
              onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
              required
              margin="dense"
              placeholder="e.g. Crisis Triage / Follow-up Assessment"
            />

            <TextField
              fullWidth
              select
              label="Clinical Risk Rating"
              value={noteForm.clinicalRiskRating}
              onChange={(e) => setNoteForm({ ...noteForm, clinicalRiskRating: e.target.value })}
              margin="dense"
            >
              <MenuItem value="LOW">Low Risk</MenuItem>
              <MenuItem value="MODERATE">Moderate Risk</MenuItem>
              <MenuItem value="HIGH">High Risk</MenuItem>
              <MenuItem value="CRITICAL">Critical Risk</MenuItem>
            </TextField>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Private Clinical Notes"
              value={noteForm.privateNotes}
              onChange={(e) => setNoteForm({ ...noteForm, privateNotes: e.target.value })}
              required
              margin="dense"
            />

            <TextField
              fullWidth
              label="Mental Status Observations"
              value={noteForm.mentalStatusObservations}
              onChange={(e) => setNoteForm({ ...noteForm, mentalStatusObservations: e.target.value })}
              margin="dense"
            />

            <TextField
              fullWidth
              label="Intervention Plan / Next Steps"
              value={noteForm.interventionPlan}
              onChange={(e) => setNoteForm({ ...noteForm, interventionPlan: e.target.value })}
              margin="dense"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setNoteModalOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" form="note-form" variant="contained" color="secondary">
            Save Confidential Note
          </Button>
        </DialogActions>
      </Dialog>

      {/* PDF Modal */}
      {selectedAssessment && (
        <PDFReportModal
          open={pdfModalOpen}
          onClose={() => setPdfModalOpen(false)}
          assessment={selectedAssessment}
          student={student}
        />
      )}
    </Box>
  );
};
export default StudentWellnessProfile;
