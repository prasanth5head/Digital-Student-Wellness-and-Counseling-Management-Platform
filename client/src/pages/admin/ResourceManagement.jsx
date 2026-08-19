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

import { resourceAPI } from '../../api/axiosConfig';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const CATEGORIES = ['Stress Management', 'Sleep', 'Meditation', 'Academic Pressure', 'Social Wellness', 'Exercise'];

export const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Stress Management',
    contentMarkdown: '',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600',
    videoUrl: '',
    author: 'AuraWell Clinical Team',
    readTime: '5 min read',
  });

  const fetchResources = async () => {
    try {
      const res = await resourceAPI.getAll();
      if (res.success && res.data) {
        setResources(res.data);
      }
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleOpenCreate = () => {
    setEditingResource(null);
    setForm({
      title: '',
      description: '',
      category: 'Stress Management',
      contentMarkdown: '',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600',
      videoUrl: '',
      author: 'AuraWell Clinical Team',
      readTime: '5 min read',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (r) => {
    setEditingResource(r);
    setForm({
      title: r.title,
      description: r.description,
      category: r.category,
      contentMarkdown: r.contentMarkdown || '',
      imageUrl: r.imageUrl,
      videoUrl: r.videoUrl || '',
      author: r.author || 'AuraWell Clinical Team',
      readTime: r.readTime || '5 min read',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await resourceAPI.delete(id);
      fetchResources();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingResource) {
        await resourceAPI.update(editingResource.id, form);
      } else {
        await resourceAPI.create(form);
      }
      setModalOpen(false);
      fetchResources();
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
            Curated Resource Library Management
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Publish, curate, and update student wellness articles, relaxation videos, and mindfulness guides
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ borderRadius: 2.5 }}
        >
          Publish New Resource
        </Button>
      </Box>

      {/* Table */}
      <Card sx={{ borderRadius: 3.5, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'background.subtle' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Title & Description</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Author</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Read Time</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resources.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell sx={{ maxWidth: 360 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {r.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={r.category} size="small" color="primary" sx={{ fontWeight: 700 }} />
                  </TableCell>
                  <TableCell>{r.author}</TableCell>
                  <TableCell>{r.readTime}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenEdit(r)} color="primary">
                      <EditIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(r.id)} color="error">
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
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingResource ? 'Edit Wellness Resource' : 'Publish New Wellness Resource'}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" id="resource-form" onSubmit={handleSave}>
            <TextField
              fullWidth
              label="Resource Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              margin="dense"
              required
            />

            <TextField
              fullWidth
              select
              label="Category"
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
              label="Short Teaser / Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              margin="dense"
              required
            />

            <TextField
              fullWidth
              multiline
              rows={5}
              label="Full Content (Markdown Format Supported)"
              value={form.contentMarkdown}
              onChange={(e) => setForm({ ...form, contentMarkdown: e.target.value })}
              margin="dense"
              required
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Cover Image URL"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Video Guide URL (Optional)"
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  margin="dense"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Author / Provider"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Estimated Read Time"
                  value={form.readTime}
                  onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                  margin="dense"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setModalOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" form="resource-form" variant="contained" color="primary">
            {editingResource ? 'Update Resource' : 'Publish Resource'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default ResourceManagement;
