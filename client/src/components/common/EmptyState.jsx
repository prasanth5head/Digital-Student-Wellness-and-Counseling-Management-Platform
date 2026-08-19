import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InboxIcon from '@mui/icons-material/Inbox';

export const EmptyState = ({
  title = 'No Data Found',
  description = 'There are no items to display at this moment.',
  icon: Icon = InboxIcon,
  actionLabel,
  onAction,
}) => {
  return (
    <Box
      sx={{
        p: 6,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: 'background.subtle',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          color: 'text.secondary',
        }}
      >
        <Icon sx={{ fontSize: 32 }} />
      </Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 360, mb: actionLabel ? 2.5 : 0 }}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" color="primary" onClick={onAction} size="small">
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
