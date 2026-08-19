import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import ShieldIcon from '@mui/icons-material/Shield';

import { adminAPI } from '../../api/axiosConfig';
import EmptyState from '../../components/common/EmptyState';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAuditLogs().then((res) => {
      if (res.success && res.data) {
        setLogs(res.data.content || res.data || []);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <SkeletonLoader type="table" />;
  }

  const getActionColor = (act) => {
    if (act?.includes('LOGIN')) return 'primary';
    if (act?.includes('ASSESSMENT')) return 'info';
    if (act?.includes('APPOINTMENT')) return 'success';
    if (act?.includes('NOTE')) return 'secondary';
    return 'default';
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Security & Audit Activity Logs
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Immutable system security events, clinical note access tracking, and authentication audit trail
        </Typography>
      </Box>

      {/* Table */}
      <Card sx={{ borderRadius: 3.5, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'background.subtle' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Timestamp</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>User / Actor</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Action Event</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Details & Context</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>IP / Client</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <EmptyState
                      title="No Audit Events"
                      description="Security audit log is currently clean."
                      icon={ShieldIcon}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {log.userName || log.userEmail || 'System'}
                    </TableCell>
                    <TableCell>
                      <Chip label={log.userRole || 'USER'} size="small" sx={{ fontSize: '0.7rem' }} />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.action}
                        color={getActionColor(log.action)}
                        size="small"
                        sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                      />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {log.details || log.targetEntityType}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>
                      {log.ipAddress || '127.0.0.1'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};
export default AuditLogs;
