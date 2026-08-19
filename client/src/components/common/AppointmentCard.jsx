import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VideocamIcon from '@mui/icons-material/Videocam';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LaunchIcon from '@mui/icons-material/Launch';

export const AppointmentCard = ({
  appointment,
  onCancel,
  onComplete,
  isCounselor = false,
}) => {
  if (!appointment) return null;

  const isConfirmed = appointment.status === 'CONFIRMED' || appointment.status === 'UPCOMING';
  const isCompleted = appointment.status === 'COMPLETED';
  const isCancelled = appointment.status === 'CANCELLED';

  const getStatusChip = () => {
    if (isCompleted) return <Chip label="Completed" color="success" size="small" variant="outlined" />;
    if (isCancelled) return <Chip label="Cancelled" color="error" size="small" variant="outlined" />;
    return <Chip label="Confirmed" color="primary" size="small" sx={{ fontWeight: 600 }} />;
  };

  const isOnline = appointment.mode === 'ONLINE';

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        borderLeft: isConfirmed ? '4px solid #0284C7' : isCompleted ? '4px solid #10B981' : '4px solid #94A3B8',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${isCounselor ? appointment.studentName : appointment.counselorName}`}
              sx={{ width: 44, height: 44, bgcolor: 'primary.light' }}
            />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {isCounselor ? appointment.studentName : appointment.counselorName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                {isCounselor
                  ? `${appointment.studentDepartment || 'Student'} • ${appointment.studentRegisterNo || ''}`
                  : `${appointment.counselorEmail || 'Campus Counselor'}`}
              </Typography>
            </Box>
          </Box>
          {getStatusChip()}
        </Box>

        <Typography variant="body2" sx={{ color: 'text.primary', mb: 2, fontWeight: 500 }}>
          {appointment.purpose || 'General Counseling & Wellness Consultation'}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, p: 1.5, borderRadius: 2, bgcolor: 'background.subtle' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <EventIcon sx={{ fontSize: 18, color: 'primary.main' }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {appointment.appointmentDate}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <AccessTimeIcon sx={{ fontSize: 18, color: 'primary.main' }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {appointment.startTime} {appointment.endTime ? `- ${appointment.endTime}` : ''}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            {isOnline ? (
              <VideocamIcon sx={{ fontSize: 18, color: 'info.main' }} />
            ) : (
              <LocationOnIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
            )}
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {isOnline ? 'Online Video Meeting' : (appointment.location || 'Counseling Center Room 201')}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isOnline && appointment.meetingLink && isConfirmed && (
              <Button
                variant="contained"
                size="small"
                startIcon={<LaunchIcon />}
                href={appointment.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                }}
              >
                Join Video Call
              </Button>
            )}
            {isCounselor && isConfirmed && onComplete && (
              <Button
                variant="outlined"
                color="success"
                size="small"
                onClick={() => onComplete(appointment)}
              >
                Log Session
              </Button>
            )}
          </Box>

          {isConfirmed && onCancel && (
            <Button
              variant="text"
              color="error"
              size="small"
              onClick={() => onCancel(appointment)}
            >
              Cancel Session
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
export default AppointmentCard;
