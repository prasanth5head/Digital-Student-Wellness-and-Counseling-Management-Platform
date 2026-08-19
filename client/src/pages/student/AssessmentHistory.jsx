import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import { assessmentAPI } from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import ScoreTrendChart from '../../components/common/ScoreTrendChart';
import RiskBadge from '../../components/common/RiskBadge';
import PDFReportModal from '../../components/common/PDFReportModal';
import EmptyState from '../../components/common/EmptyState';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export const AssessmentHistory = () => {
  const { student } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [pdfOpen, setPdfOpen] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await assessmentAPI.getHistory();
        if (res.success && res.data) {
          setHistory(res.data);
        }
      } catch (err) {
        console.error('Failed to load assessment history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return <SkeletonLoader type="table" />;
  }

  const trendData = [...history].reverse().map((item, idx) => ({
    date: `Test #${idx + 1} (${new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })})`,
    score: item.overallScore,
    stress: item.categoryScores?.find((c) => c.category === 'Stress')?.percentage || 30,
    sleep: item.categoryScores?.find((c) => c.category === 'Sleep')?.percentage || 70,
  }));

  const handleOpenPDF = (assessment) => {
    setSelectedAssessment(assessment);
    setPdfOpen(true);
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Assessment History & Progression
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Historical record of all psychological wellness evaluations and clinical milestones
        </Typography>
      </Box>

      {history.length > 0 && (
        <Card sx={{ p: 3, mb: 3.5, borderRadius: 3.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Longitudinal Wellness Evolution
          </Typography>
          <ScoreTrendChart data={trendData} height={260} />
        </Card>
      )}

      {/* History Table */}
      <Card sx={{ borderRadius: 3.5, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'background.subtle' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Overall Score</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Risk Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Summary Highlights</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Report Export</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <EmptyState
                      title="No Assessment History Yet"
                      description="Take your first wellness assessment to start generating longitudinal insights."
                      icon={HistoryIcon}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                history.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {new Date(row.createdAt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
                          {row.overallScore}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          /100
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <RiskBadge riskLevel={row.riskLevel} />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 320 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {row.summary}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={() => handleOpenPDF(row)}
                        sx={{ borderRadius: 2 }}
                      >
                        PDF Report
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* PDF Modal */}
      {selectedAssessment && (
        <PDFReportModal
          open={pdfOpen}
          onClose={() => setPdfOpen(false)}
          assessment={selectedAssessment}
          student={student}
        />
      )}
    </Box>
  );
};
export default AssessmentHistory;
