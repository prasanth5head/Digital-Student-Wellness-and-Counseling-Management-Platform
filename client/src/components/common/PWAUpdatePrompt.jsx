import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';

/**
 * PWAUpdatePrompt
 * Shows a toast-style banner when a new service worker is ready to install.
 * The user can tap "Update Now" to apply the new version instantly.
 */
export const PWAUpdatePrompt = () => {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('[PWA] Service Worker registered:', r);
    },
    onRegisterError(error) {
      console.error('[PWA] Service Worker registration error:', error);
    },
  });

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  return (
    <Snackbar
      open={needRefresh}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          bgcolor: 'transparent',
          p: 0,
          boxShadow: 'none',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          bgcolor: '#0f172a',
          color: '#f1f5f9',
          px: 3,
          py: 2,
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(13, 148, 136, 0.4)',
          maxWidth: 420,
        }}
      >
        <SystemUpdateAltIcon sx={{ color: '#0d9488', fontSize: 28, flexShrink: 0 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#f1f5f9' }}>
            Update Available
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            A new version of AuraWell is ready.
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          onClick={handleUpdate}
          sx={{
            bgcolor: '#0d9488',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.8rem',
            borderRadius: 2,
            px: 2,
            textTransform: 'none',
            flexShrink: 0,
            '&:hover': { bgcolor: '#0f766e' },
          }}
        >
          Update Now
        </Button>
      </Box>
    </Snackbar>
  );
};

export default PWAUpdatePrompt;
