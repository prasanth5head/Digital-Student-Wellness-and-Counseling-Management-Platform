import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/axiosConfig';

const AuthContext = createContext();

export const DEMO_ACCOUNTS = [
  {
    roleName: 'Student',
    role: 'ROLE_STUDENT',
    name: 'Alex Morgan',
    email: 'student.alex@wellness.edu',
    password: 'Student@123',
    badge: '3rd Yr CSE • Score 84',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexMorgan',
  },
  {
    roleName: 'Counselor',
    role: 'ROLE_COUNSELOR',
    name: 'Dr. Sarah Jenkins',
    email: 'counselor.sarah@wellness.edu',
    password: 'Counselor@123',
    badge: 'CBT & Stress Specialist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJenkins',
  },
  {
    roleName: 'Admin',
    role: 'ROLE_ADMIN',
    name: 'Campus Wellness Admin',
    email: 'admin@wellness.edu',
    password: 'Admin@123',
    badge: 'Executive Oversight',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminHealth',
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aurawell_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [student, setStudent] = useState(() => {
    const saved = localStorage.getItem('aurawell_student');
    return saved ? JSON.parse(saved) : null;
  });
  const [counselor, setCounselor] = useState(() => {
    const saved = localStorage.getItem('aurawell_counselor');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('aurawell_token'));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      if (res.success && res.data) {
        const { token: jwtToken, user: userData, student: studentData, counselor: counselorData } = res.data;
        setToken(jwtToken);
        setUser(userData);
        setStudent(studentData);
        setCounselor(counselorData);

        localStorage.setItem('aurawell_token', jwtToken);
        localStorage.setItem('aurawell_user', JSON.stringify(userData));
        if (studentData) localStorage.setItem('aurawell_student', JSON.stringify(studentData));
        if (counselorData) localStorage.setItem('aurawell_counselor', JSON.stringify(counselorData));

        return { success: true, user: userData };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await authAPI.register(formData);
      if (res.success && res.data) {
        const { token: jwtToken, user: userData, student: studentData, counselor: counselorData } = res.data;
        setToken(jwtToken);
        setUser(userData);
        setStudent(studentData);
        setCounselor(counselorData);

        localStorage.setItem('aurawell_token', jwtToken);
        localStorage.setItem('aurawell_user', JSON.stringify(userData));
        if (studentData) localStorage.setItem('aurawell_student', JSON.stringify(studentData));
        if (counselorData) localStorage.setItem('aurawell_counselor', JSON.stringify(counselorData));

        return { success: true, user: userData };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (credential, extraData = {}) => {
    setLoading(true);
    try {
      const res = await authAPI.googleAuth({ credential, ...extraData });
      if (res.success && res.data) {
        const { token: jwtToken, user: userData, student: studentData, counselor: counselorData } = res.data;
        setToken(jwtToken);
        setUser(userData);
        setStudent(studentData);
        setCounselor(counselorData);

        localStorage.setItem('aurawell_token', jwtToken);
        localStorage.setItem('aurawell_user', JSON.stringify(userData));
        if (studentData) localStorage.setItem('aurawell_student', JSON.stringify(studentData));
        if (counselorData) localStorage.setItem('aurawell_counselor', JSON.stringify(counselorData));

        return { success: true, user: userData };
      }
      return { success: false, message: res.message || 'Google authentication failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Google authentication failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setStudent(null);
    setCounselor(null);
    localStorage.removeItem('aurawell_token');
    localStorage.removeItem('aurawell_user');
    localStorage.removeItem('aurawell_student');
    localStorage.removeItem('aurawell_counselor');
    window.location.href = '/login';
  };

  const switchDemoAccount = async (demoAccount) => {
    return await login(demoAccount.email, demoAccount.password);
  };

  const refreshProfile = (updatedStudent, updatedCounselor) => {
    if (updatedStudent) {
      setStudent(updatedStudent);
      localStorage.setItem('aurawell_student', JSON.stringify(updatedStudent));
    }
    if (updatedCounselor) {
      setCounselor(updatedCounselor);
      localStorage.setItem('aurawell_counselor', JSON.stringify(updatedCounselor));
    }
  };

  const value = {
    user,
    student,
    counselor,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    role: user?.role,
    isStudent: user?.role === 'ROLE_STUDENT',
    isCounselor: user?.role === 'ROLE_COUNSELOR',
    isAdmin: user?.role === 'ROLE_ADMIN',
    login,
    register,
    googleLogin,
    logout,
    switchDemoAccount,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
