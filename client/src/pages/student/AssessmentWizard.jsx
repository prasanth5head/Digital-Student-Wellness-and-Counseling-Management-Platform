import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { assessmentAPI } from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import WellnessScoreDial from '../../components/common/WellnessScoreDial';
import PDFReportModal from '../../components/common/PDFReportModal';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export const AssessmentWizard = () => {
  const navigate = useNavigate();
  const { student, refreshProfile } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategoryIdx, setCurrentCategoryIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await assessmentAPI.getQuestions();
        if (res.success && res.data) {
          setQuestions(res.data);
          const distinctCategories = Array.from(new Set(res.data.map((q) => q.category)));
          setCategories(distinctCategories);
          setAnswers({});
        }
      } catch (err) {
        console.error('Failed to load questions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionId, value) => {
    setValidationError('');
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const currentCategory = categories[currentCategoryIdx] || 'General';
  const categoryQuestions = questions.filter((q) => q.category === currentCategory);

  const validateCurrentSection = () => {
    const unanswered = categoryQuestions.filter(
      (q) => answers[q.id] === undefined || answers[q.id] === null || answers[q.id] === ''
    );
    if (unanswered.length > 0) {
      setValidationError(`Please answer all ${categoryQuestions.length} questions in this section to proceed.`);
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleNextCategory = () => {
    if (!validateCurrentSection()) return;
    if (currentCategoryIdx < categories.length - 1) {
      setCurrentCategoryIdx((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevCategory = () => {
    setValidationError('');
    if (currentCategoryIdx > 0) {
      setCurrentCategoryIdx((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentSection()) return;

    const allUnanswered = questions.filter(
      (q) => answers[q.id] === undefined || answers[q.id] === null || answers[q.id] === ''
    );
    if (allUnanswered.length > 0) {
      setValidationError(`You still have ${allUnanswered.length} unanswered questions. Please complete all sections.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await assessmentAPI.submitAssessment(answers);
      if (res.success && res.data) {
        setAssessmentResult(res.data);
        setResultModalOpen(true);
        if (student) {
          refreshProfile({
            ...student,
            currentWellnessScore: res.data.overallScore,
            riskLevel: res.data.riskLevel,
          });
        }
      }
    } catch (err) {
      console.error('Failed to submit assessment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <SkeletonLoader type="cards" count={3} />;
  }

  const totalSteps = categories.length;
  const progressPercent = Math.round(((currentCategoryIdx + 1) / totalSteps) * 100);

  return (
    <Box sx={{ maxWidth: 850, mx: 'auto', pb: 6 }}>
      {/* Top Progress Banner */}
      <Card sx={{ mb: 3, p: 3, borderRadius: 3.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', textTransform: 'uppercase' }}>
              Campus Psychological Evaluation
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Wellness Assessment Wizard
            </Typography>
          </Box>
          <Chip
            label={`Section ${currentCategoryIdx + 1} of ${totalSteps}: ${currentCategory}`}
            color="primary"
            sx={{ fontWeight: 700, borderRadius: 2 }}
          />
        </Box>

        <LinearProgress
          variant="determinate"
          value={progressPercent}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: 'background.subtle',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              background: 'linear-gradient(90deg, #0284C7, #6366F1)',
            },
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, overflowX: 'auto', py: 0.5 }}>
          {categories.map((cat, idx) => (
            <Button
              key={cat}
              size="small"
              onClick={() => {
                if (idx < currentCategoryIdx || validateCurrentSection()) {
                  setCurrentCategoryIdx(idx);
                }
              }}
              sx={{
                fontSize: '0.725rem',
                fontWeight: idx === currentCategoryIdx ? 800 : 500,
                color: idx === currentCategoryIdx ? 'primary.main' : 'text.secondary',
                minWidth: 'auto',
                px: 1,
                borderBottom: idx === currentCategoryIdx ? '2px solid #0284C7' : 'none',
                borderRadius: 0,
              }}
            >
              {cat}
            </Button>
          ))}
        </Box>
      </Card>

      {validationError && (
        <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 3, borderRadius: 3, fontWeight: 600 }}>
          {validationError}
        </Alert>
      )}

      {/* Questions List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 4 }}>
        {categoryQuestions.map((q, qIndex) => {
          const hasAnswer = answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== '';
          return (
            <Card
              key={q.id}
              sx={{
                p: 3,
                borderRadius: 3.5,
                border: (theme) => `1px solid ${hasAnswer ? theme.palette.primary.main : theme.palette.divider}`,
                boxShadow: hasAnswer ? '0 4px 16px rgba(2, 132, 199, 0.08)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 28, height: 28, borderRadius: '50%',
                    bgcolor: hasAnswer ? 'primary.main' : 'text.disabled',
                    color: '#FFFFFF', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0,
                  }}
                >
                  {qIndex + 1}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {q.questionText}
                </Typography>
              </Box>

              {/* Rating Scale */}
              {q.type === 'RATING_SCALE' && (
                <Box sx={{ px: 1, pt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      {q.minLabel || '1 (Lowest)'}
                    </Typography>
                    <Chip
                      label={hasAnswer ? `Selected: ${answers[q.id]} / ${q.maxRating || 10}` : 'Please Select a Number'}
                      color={hasAnswer ? 'primary' : 'default'}
                      variant={hasAnswer ? 'filled' : 'outlined'}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      {q.maxLabel || '10 (Highest)'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.8, justifyContent: 'space-between', mb: 2, flexWrap: 'wrap' }}>
                    {Array.from(
                      { length: (q.maxRating || 10) - (q.minRating || 1) + 1 },
                      (_, i) => (q.minRating || 1) + i
                    ).map((num) => {
                      const isSelected = answers[q.id] === num;
                      return (
                        <Button
                          key={num}
                          variant={isSelected ? 'contained' : 'outlined'}
                          color={isSelected ? 'primary' : 'inherit'}
                          onClick={() => handleAnswerChange(q.id, num)}
                          sx={{ minWidth: 40, height: 40, borderRadius: 2, fontWeight: 700, fontSize: '0.9rem', borderColor: isSelected ? 'primary.main' : 'divider' }}
                        >
                          {num}
                        </Button>
                      );
                    })}
                  </Box>
                  <Slider
                    value={answers[q.id] !== undefined ? Number(answers[q.id]) : (q.minRating || 1)}
                    min={q.minRating || 1}
                    max={q.maxRating || 10}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                    onChange={(_, val) => handleAnswerChange(q.id, val)}
                    sx={{ color: hasAnswer ? 'primary.main' : 'text.disabled', height: 8, '& .MuiSlider-thumb': { width: 22, height: 22 } }}
                  />
                </Box>
              )}

              {/* Multiple Choice / Frequency */}
              {(q.type === 'MULTIPLE_CHOICE' || q.type === 'FREQUENCY') && q.options && (
                <RadioGroup
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}
                >
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answers[q.id] === opt.text;
                    return (
                      <Box
                        key={oIdx}
                        sx={{
                          border: '1.5px solid',
                          borderColor: isSelected ? 'primary.main' : 'divider',
                          bgcolor: isSelected
                            ? (theme) => (theme.palette.mode === 'dark' ? 'rgba(2,132,199,0.18)' : 'rgba(2,132,199,0.08)')
                            : 'transparent',
                          borderRadius: 2.5, p: 1.2, px: 2, cursor: 'pointer', transition: 'all 0.15s ease',
                          '&:hover': { borderColor: 'primary.main' },
                        }}
                        onClick={() => handleAnswerChange(q.id, opt.text)}
                      >
                        <FormControlLabel
                          value={opt.text}
                          control={<Radio size="small" />}
                          label={opt.text}
                          sx={{ width: '100%', m: 0, '& .MuiTypography-root': { fontSize: '0.9rem', fontWeight: isSelected ? 700 : 500 } }}
                        />
                      </Box>
                    );
                  })}
                </RadioGroup>
              )}

              {/* Yes / No */}
              {q.type === 'YES_NO' && (
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  {['Yes', 'No'].map((choice) => {
                    const isSelected = (answers[q.id] || '').toLowerCase() === choice.toLowerCase();
                    return (
                      <Button
                        key={choice}
                        variant={isSelected ? 'contained' : 'outlined'}
                        color={isSelected ? 'primary' : 'inherit'}
                        onClick={() => handleAnswerChange(q.id, choice.toLowerCase())}
                        sx={{ py: 1.5, borderRadius: 2.5, fontWeight: 700, fontSize: '0.95rem', borderColor: isSelected ? 'primary.main' : 'divider' }}
                      >
                        {choice}
                      </Button>
                    );
                  })}
                </Box>
              )}
            </Card>
          );
        })}
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          color="inherit"
          disabled={currentCategoryIdx === 0}
          onClick={handlePrevCategory}
          startIcon={<ArrowBackIcon />}
          sx={{ borderRadius: 2.5, px: 3 }}
        >
          Previous Section
        </Button>

        {currentCategoryIdx < categories.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNextCategory}
            endIcon={<ArrowForwardIcon />}
            sx={{ borderRadius: 2.5, px: 3.5, py: 1.2, fontWeight: 700, background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)' }}
          >
            Next Section ({categories[currentCategoryIdx + 1]})
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            disabled={submitting}
            onClick={handleSubmit}
            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
            sx={{ borderRadius: 2.5, px: 4, py: 1.2, fontWeight: 700, fontSize: '1rem', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)' }}
          >
            {submitting ? 'Calculating Insights...' : 'Submit Assessment'}
          </Button>
        )}
      </Box>

      {/* Results Modal */}
      {assessmentResult && (
        <Dialog open={resultModalOpen} onClose={() => setResultModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 1.5 } }}>
          <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
            <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: 'success.light', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
              <CheckCircleIcon sx={{ fontSize: 36 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>Assessment Completed!</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Your psychological wellbeing indices have been analyzed.</Typography>
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center', py: 2 }}>
            <WellnessScoreDial score={assessmentResult.overallScore} riskLevel={assessmentResult.riskLevel} size={170} />
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.subtle', borderRadius: 3, textAlign: 'left' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Personalized Summary</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>{assessmentResult.summary}</Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button fullWidth variant="contained" color="primary" startIcon={<PictureAsPdfIcon />}
              onClick={() => { setResultModalOpen(false); setPdfModalOpen(true); }}
              sx={{ borderRadius: 2.5, py: 1.2 }}
            >
              Download PDF Report
            </Button>
            <Button fullWidth variant="outlined" onClick={() => navigate('/student/dashboard')} sx={{ borderRadius: 2.5 }}>
              Return to Dashboard
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {assessmentResult && (
        <PDFReportModal open={pdfModalOpen} onClose={() => setPdfModalOpen(false)} assessment={assessmentResult} student={student} />
      )}
    </Box>
  );
};

export default AssessmentWizard;
