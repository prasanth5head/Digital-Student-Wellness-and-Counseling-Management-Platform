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
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

import { adminAPI } from '../../api/axiosConfig';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await adminAPI.toggleUserStatus(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <SkeletonLoader type="table" />;
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleChip = (role) => {
    if (role === 'ROLE_ADMIN') return <Chip label="ADMINISTRATOR" color="error" size="small" sx={{ fontWeight: 700 }} />;
    if (role === 'ROLE_COUNSELOR') return <Chip label="COUNSELOR" color="secondary" size="small" sx={{ fontWeight: 700 }} />;
    return <Chip label="STUDENT" color="primary" size="small" sx={{ fontWeight: 700 }} />;
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          User Directory & Role Access Control
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Manage user accounts, RBAC permissions, and active login authorization status
        </Typography>
      </Box>

      {/* Search Bar */}
      <Card sx={{ p: 2.5, mb: 3, borderRadius: 3.5 }}>
        <TextField
          size="small"
          placeholder="Search by user name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: '100%', sm: 340 }, '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
        />
      </Card>

      {/* Users Table */}
      <Card sx={{ borderRadius: 3.5, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'background.subtle' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>User Profile</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email Address</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Account Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Access Toggle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell sx={{ fontWeight: 700 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={u.avatar} sx={{ width: 36, height: 36 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {u.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{getRoleChip(u.role)}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.active ? 'Active' : 'Suspended'}
                      color={u.active ? 'success' : 'default'}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Switch
                      checked={u.active}
                      onChange={() => handleToggleStatus(u.id)}
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};
export default UserManagement;
