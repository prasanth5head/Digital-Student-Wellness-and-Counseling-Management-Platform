import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import { resourceAPI } from '../../api/axiosConfig';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';

const CATEGORIES = [
  'ALL',
  'Stress Management',
  'Sleep',
  'Meditation',
  'Academic Pressure',
  'Social Wellness',
  'Exercise',
];

export const StudentResources = () => {
  const [resources, setResources] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [bookmarks, setBookmarks] = useState(new Set());
  const [category, setCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Article Read Modal
  const [readModalOpen, setReadModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  const fetchResources = async () => {
    try {
      const [allRes, recRes, bmkRes] = await Promise.all([
        resourceAPI.getAll(category === 'ALL' ? '' : category, search),
        resourceAPI.getRecommended(),
        resourceAPI.getBookmarks(),
      ]);

      if (allRes.success && allRes.data) setResources(allRes.data);
      if (recRes.success && recRes.data) setRecommended(recRes.data);
      if (bmkRes.success && bmkRes.data) {
        setBookmarks(new Set(bmkRes.data.map((b) => b.id)));
      }
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [category, search]);

  const handleToggleBookmark = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await resourceAPI.toggleBookmark(id);
      if (res.success) {
        setBookmarks((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenArticle = (res) => {
    setSelectedResource(res);
    setReadModalOpen(true);
  };

  if (loading) {
    return <SkeletonLoader type="cards" count={6} />;
  }

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Wellness & Mental Health Resource Library
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Curated guides, evidence-based coping strategies, audio meditations, and academic self-care tools
        </Typography>
      </Box>

      {/* Smart Recommendations Section */}
      {recommended.length > 0 && category === 'ALL' && !search && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <AutoAwesomeIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Personalized Recommendations (Based on Your Assessment)
            </Typography>
          </Box>
          <Grid container spacing={2.5}>
            {recommended.slice(0, 3).map((res) => (
              <Grid item xs={12} sm={6} md={4} key={`rec-${res.id}`}>
                <Card
                  onClick={() => handleOpenArticle(res)}
                  sx={{
                    borderRadius: 3.5,
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.25s ease',
                    border: '1px solid rgba(2, 132, 199, 0.3)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 28px rgba(2, 132, 199, 0.15)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="150"
                    image={res.imageUrl}
                    alt={res.title}
                  />
                  <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip label={res.category} size="small" color="primary" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
                      <IconButton size="small" onClick={(e) => handleToggleBookmark(e, res.id)}>
                        {bookmarks.has(res.id) ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                      </IconButton>
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3, mb: 1 }}>
                      {res.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem', mb: 2, flexGrow: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {res.description}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      {res.author} • {res.readTime || '5 min read'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Search & Filter Controls */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3.5, alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Category Pills */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              clickable
              onClick={() => setCategory(cat)}
              color={category === cat ? 'primary' : 'default'}
              variant={category === cat ? 'filled' : 'outlined'}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            />
          ))}
        </Box>

        {/* Search Field */}
        <TextField
          size="small"
          placeholder="Search articles, topics, tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: '100%', sm: 260 }, '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
        />
      </Box>

      {/* Resources Grid */}
      {resources.length === 0 ? (
        <EmptyState
          title="No Resources Found"
          description="Try adjusting your search query or selecting a different category filter."
        />
      ) : (
        <Grid container spacing={2.5}>
          {resources.map((res) => (
            <Grid item xs={12} sm={6} md={4} key={res.id}>
              <Card
                onClick={() => handleOpenArticle(res)}
                sx={{
                  borderRadius: 3.5,
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={res.imageUrl}
                    alt={res.title}
                  />
                  {res.videoUrl && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'rgba(0,0,0,0.6)',
                        borderRadius: '50%',
                        p: 1,
                        color: '#FFFFFF',
                        display: 'flex',
                      }}
                    >
                      <PlayCircleOutlineIcon sx={{ fontSize: 36 }} />
                    </Box>
                  )}
                </Box>
                <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Chip
                      label={res.category}
                      size="small"
                      sx={{ bgcolor: 'background.subtle', fontWeight: 700, fontSize: '0.7rem' }}
                    />
                    <IconButton size="small" onClick={(e) => handleToggleBookmark(e, res.id)}>
                      {bookmarks.has(res.id) ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                    </IconButton>
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3, mb: 1 }}>
                    {res.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.825rem', mb: 2, flexGrow: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {res.description}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                    {(res.tags || []).slice(0, 3).map((tag) => (
                      <Typography key={tag} variant="caption" sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.7rem' }}>
                        #{tag}
                      </Typography>
                    ))}
                  </Box>

                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    {res.author} • {res.readTime || '5 min read'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Reader Modal */}
      {selectedResource && (
        <Dialog
          open={readModalOpen}
          onClose={() => setReadModalOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3.5, p: 1 } }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Chip label={selectedResource.category} size="small" color="primary" sx={{ mb: 1, fontWeight: 700 }} />
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {selectedResource.title}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                By {selectedResource.author} • {selectedResource.readTime || '5 min read'}
              </Typography>
            </Box>
            <IconButton onClick={() => setReadModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers sx={{ py: 3 }}>
            <CardMedia
              component="img"
              height="240"
              image={selectedResource.imageUrl}
              alt={selectedResource.title}
              sx={{ borderRadius: 2.5, mb: 3 }}
            />

            <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {selectedResource.contentMarkdown || selectedResource.description}
            </Typography>

            {selectedResource.videoUrl && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'background.subtle', borderRadius: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Watch Multimedia Guided Practice
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Includes guided relaxation audio and mindfulness video walkthrough
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  href={selectedResource.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<PlayCircleOutlineIcon />}
                >
                  Watch Guide
                </Button>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setReadModalOpen(false)} variant="outlined">
              Close Reader
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};
export default StudentResources;
