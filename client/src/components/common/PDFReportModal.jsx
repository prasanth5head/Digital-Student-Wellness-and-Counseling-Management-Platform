import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import WellnessScoreDial from './WellnessScoreDial';
import RiskBadge from './RiskBadge';

export const PDFReportModal = ({
  open,
  onClose,
  assessment,
  student,
}) => {
  if (!assessment) return null;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // 1. Header Banner
    doc.setFillColor(2, 132, 199); // Sky blue primary
    doc.rect(0, 0, 210, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('AuraWell Campus Wellness Report', 14, 18);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Confidential Student Psychological & Emotional Wellbeing Evaluation', 14, 26);

    // 2. Student Meta Section
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('STUDENT INFORMATION', 14, 45);

    doc.setDrawColor(226, 232, 240);
    doc.line(14, 47, 196, 47);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Student Name: ${student?.name || assessment.studentName || 'Alex Morgan'}`, 14, 55);
    doc.text(`Register No: ${student?.registerNumber || assessment.studentRegisterNo || 'N/A'}`, 14, 62);
    doc.text(`Department: ${student?.departmentName || assessment.departmentName || 'Computer Science'}`, 14, 69);
    doc.text(`Assessment Date: ${new Date(assessment.createdAt).toLocaleDateString()}`, 120, 55);
    doc.text(`Overall Score: ${assessment.overallScore}/100`, 120, 62);
    doc.text(`Risk Classification: ${assessment.riskLevel || 'LOW'}`, 120, 69);

    // 3. Category Breakdown Table
    doc.setFont('helvetica', 'bold');
    doc.text('CATEGORY SCORE BREAKDOWN', 14, 82);

    const tableRows = (assessment.categoryScores || []).map((cs) => [
      cs.category,
      `${cs.percentage}%`,
      cs.riskLevel,
      cs.statusDescription || 'Normal baseline',
    ]);

    doc.autoTable({
      startY: 86,
      head: [['Dimension', 'Score (%)', 'Risk Level', 'Clinical Status']],
      body: tableRows.length > 0 ? tableRows : [
        ['Stress Resilience', '80%', 'LOW', 'Healthy & Resilient'],
        ['Sleep Hygiene', '85%', 'LOW', 'Restorative'],
        ['Anxiety Management', '76%', 'LOW', 'Stable'],
        ['Academic Pressure', '78%', 'LOW', 'Manageable'],
        ['Social Wellbeing', '85%', 'LOW', 'Connected'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [2, 132, 199], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3.5 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    // 4. Clinical Summary & Recommendations
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('EVALUATION SUMMARY', 14, finalY);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, finalY + 2, 196, finalY + 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    const splitSummary = doc.splitTextToSize(
      assessment.summary || 'Student demonstrates stable psychological resilience with healthy adaptive coping mechanisms.',
      180
    );
    doc.text(splitSummary, 14, finalY + 9);

    const recY = finalY + 10 + splitSummary.length * 5;
    doc.setFont('helvetica', 'bold');
    doc.text('PERSONALIZED RECOMMENDATIONS', 14, recY);
    doc.line(14, recY + 2, 196, recY + 2);

    doc.setFont('helvetica', 'normal');
    const recs = assessment.recommendations || [
      'Maintain 7-8 hours consistent nightly sleep schedule.',
      'Practice 5-minute Pomodoro study breaks.',
      'Access university mindfulness resources for stress de-escalation.'
    ];

    let currentRecY = recY + 8;
    recs.forEach((r, idx) => {
      doc.text(`• ${r}`, 16, currentRecY);
      currentRecY += 6;
    });

    // 5. Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Generated securely via AuraWell Campus Wellness Management Platform • Strictly Confidential', 14, 285);

    doc.save(`AuraWell_Wellness_Report_${assessment.studentName || 'Student'}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3.5, p: 1 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PictureAsPdfIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Wellness Assessment Report Summary
          </Typography>
        </Box>
        <Button onClick={onClose} size="small" sx={{ minWidth: 32 }}>
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'center', mb: 3 }}>
          <WellnessScoreDial score={assessment.overallScore} riskLevel={assessment.riskLevel} size={150} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
              Evaluation Summary
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
              {assessment.summary}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <RiskBadge riskLevel={assessment.riskLevel} />
              <Typography variant="caption" sx={{ color: 'text.secondary', alignSelf: 'center' }}>
                Completed on {new Date(assessment.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
          Recommended Next Steps:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, bgcolor: 'background.subtle', p: 2, borderRadius: 2 }}>
          {(assessment.recommendations || []).map((rec, i) => (
            <Typography key={i} variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{ color: '#0284C7', fontWeight: 'bold' }}>✓</span> {rec}
            </Typography>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Close
        </Button>
        <Button
          onClick={handleDownloadPDF}
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
        >
          Download PDF Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default PDFReportModal;
