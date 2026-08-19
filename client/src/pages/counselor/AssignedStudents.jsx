import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import SearchIcon from '@mui/icons-material/Search';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { counselorAPI } from '../../api/axiosConfig';
import RiskBadge from '../../components/common/RiskBadge';
import EmptyState from '../../components/common/EmptyState';
import SkeletonLoader from '../../components/common/SkeletonLoader';

export const AssignedStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await counselorAPI.getDashboard();
        if (res.success && res.data && res.data.assignedStudents) {
          setStudents(res.data.assignedStudents);
        }
      } catch (err) {
        console.error('Failed to load students:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) {
    return <SkeletonLoader type="table" />;
  }

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.registerNumber?.toLowerCase().includes(search.toLowerCase()) ||
      s.departmentName?.toLowerCase().includes(search.toLowerCase());

    const matchesRisk =
      riskFilter === 'ALL' || s.riskLevel === riskFilter;

    return matchesSearch && matchesRisk;
  });

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Assigned Student Caseload
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Monitor psychological indicators, review historical assessments, and manage confidential clinical records
        </Typography>
      </Box>

      {/* Filter and Search Bar */}
      <Card sx={{ p: 2.5, mb: 3, borderRadius: 3.5, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((lvl) => (
            <Chip
              key={lvl}
              label={lvl === 'ALL' ? 'All Risk Levels' : `${lvl} Risk`}
              clickable
              onClick={() => setRiskFilter(lvl)}
              color={riskFilter === lvl ? (lvl === 'CRITICAL' || lvl === 'HIGH' ? 'error' : lvl === 'MODERATE' ? 'warning' : 'primary') : 'default'}
              variant={riskFilter === lvl ? 'filled' : 'outlined'}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            />
          ))}
        </Box>

        <TextField
          size="small"
          placeholder="Search by student name, roll no, department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: '100%', sm: 300 }, '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
        />
      </Card>

      {/* Students Table */}
      <Card sx={{ borderRadius: 3.5, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'background.subtle' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Student Information</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Department & Year</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Wellness Score</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Risk Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Key Dimensions</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Clinical Profile</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <EmptyState
                      title="No Students Found"
                      description="No student records match your current filter criteria."
                      icon={PeopleAltIcon}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((s) => (
                  <TableRow key={s.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={s.avatar} sx={{ width: 40, height: 40 }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {s.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {s.registerNumber} • {s.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {s.departmentName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Year {s.yearOfStudy || 3}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: s.currentWellnessScore < 60 ? 'error.main' : 'primary.main' }}>
                          {s.currentWellnessScore}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          /100
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <RiskBadge riskLevel={s.riskLevel} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        Stress: <strong style={{ color: s.stressScore > 50 ? '#EF4444' : 'inherit' }}>{s.stressScore}%</strong>
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        Anxiety: <strong style={{ color: s.anxietyScore > 50 ? '#F59E0B' : 'inherit' }}>{s.anxietyScore}%</strong>
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        Sleep: <strong style={{ color: s.sleepScore < 60 ? '#EF4444' : '#10B981' }}>{s.sleepScore}%</strong>
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate(`/counselor/students/${s.id}`)}
                        sx={{
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                        }}
                      >
                        7-Tab Profile
                      </Button>
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
export default AssignedStudents;
