import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { adminAPI } from '../../api/axiosConfig';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const CATEGORIES = ['Stress', 'Anxiety', 'Sleep', 'Academic Pressure', 'Social Wellbeing', 'Emotional Wellbeing', 'Workload', 'Lifestyle'];

export const QuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [form, setForm] = useState({
    category: 'Stress',
    questionText: '',
    type: 'RATING_SCALE',
    minRating: 1,
    maxRating: 10,
    minLabel: 'Very Low',
    maxLabel: 'Extreme',
    order: 1,
    active: true,
  });

  const fetchQuestions = async () => {
    try {
      const res = await adminAPI.getQuestions();
      if (res.success && res.data) {
        setQuestions(res.data);
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleOpenCreate = () => {
    setEditingQuestion(null);
    setForm({
      category: 'Stress',
      questionText: '',
      type: 'RATING_SCALE',
      minRating: 1,
      maxRating: 10,
      minLabel: 'Very Low',
      maxLabel: 'Extreme',
      order: questions.length + 1,
      active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (q) => {
    setEditingQuestion(q);
    setForm({
      category: q.category,
      questionText: q.questionText,
      type: q.type,
      minRating: q.minRating || 1,
      maxRating: q.maxRating || 10,
      minLabel: q.minLabel || 'Very Low',
      maxLabel: q.maxLabel || 'Extreme',
      order: q.order || 1,
      active: q.active,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteQuestion(id);
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        await adminAPI.updateQuestion(editingQuestion.id, form);
      } else {
        await adminAPI.createQuestion(form);
      }
      setModalOpen(false);
      fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <SkeletonLoader type="table" />;
  }

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Assessment Question Bank Management
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Configure dynamic assessment questions, question types, categories, and rating parameters
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ borderRadius: 2.5 }}
        >
          Add Assessment Question
        </Button>
      </Box>

      {/* Table */}
      <Card sx={{ borderRadius: 3.5, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'background.subtle' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Question Text</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Format</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((q) => (
                <TableRow key={q.id} hover>
                  <TableCell sx={{ fontWeight: 700 }}>{q.order}</TableCell>
                  <TableCell>
                    <Chip label={q.category} size="small" color="primary" sx={{ fontWeight: 700 }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{q.questionText}</TableCell>
                  <TableCell>
                    <Chip label={q.type} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                  </TableCell>
                  <TableCell>
                    <Chip label={q.active ? 'Active' : 'Inactive'} color={q.active ? 'success' : 'default'} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenEdit(q)} color="primary">
                      <EditIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(q.id)} color="error">
                      <DeleteIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingQuestion ? 'Edit Assessment Question' : 'Add New Assessment Question'}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" id="question-form" onSubmit={handleSave}>
            <TextField
              fullWidth
              select
              label="Wellness Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              margin="dense"
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              multiline
              rows={2}
              label="Question Prompt Text"
              value={form.questionText}
              onChange={(e) => setForm({ ...form, questionText: e.target.value })}
              margin="dense"
              required
            />

            <TextField
              fullWidth
              select
              label="Input Type Format"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              margin="dense"
            >
              <MenuItem value="RATING_SCALE">Rating Scale (1 - 10 Slider)</MenuItem>
              <MenuItem value="YES_NO">Binary Yes / No Choice</MenuItem>
              <MenuItem value="FREQUENCY">Frequency Scale (Never - Daily)</MenuItem>
              <MenuItem value="MULTIPLE_CHOICE">Multiple Choice Options</MenuItem>
            </TextField>

            {form.type === 'RATING_SCALE' && (
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, my: 0.5 }}>
                <TextField
                  label="Minimum Label"
                  value={form.minLabel}
                  onChange={(e) => setForm({ ...form, minLabel: e.target.value })}
                  margin="dense"
                />
                <TextField
                  label="Maximum Label"
                  value={form.maxLabel}
                  onChange={(e) => setForm({ ...form, maxLabel: e.target.value })}
                  margin="dense"
                />
              </Box>
            )}

            <TextField
              label="Sequence Display Order"
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })}
              margin="dense"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setModalOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" form="question-form" variant="contained" color="primary">
            {editingQuestion ? 'Update Question' : 'Save Question'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default QuestionManagement;
