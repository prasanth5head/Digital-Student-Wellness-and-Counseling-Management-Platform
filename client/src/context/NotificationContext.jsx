import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationAPI } from '../api/axiosConfig';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

const NotificationContext = createContext();

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { registerNotificationListener } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState({ open: false, title: '', message: '', severity: 'info' });

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const [notifRes, countRes] = await Promise.all([
        notificationAPI.getAll(),
        notificationAPI.getUnreadCount(),
      ]);
      if (notifRes.success) setNotifications(notifRes.data || []);
      if (countRes.success) setUnreadCount(countRes.data || 0);
    } catch (err) {
      console.warn('Failed to load notifications:', err.message);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubscribe = registerNotificationListener((newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);

      let severity = 'info';
      if (newNotif.type?.includes('ALERT') || newNotif.title?.includes('High Risk')) severity = 'error';
      else if (newNotif.type?.includes('ACCEPTED') || newNotif.type?.includes('CONFIRMED')) severity = 'success';
      else if (newNotif.type?.includes('REJECTED') || newNotif.type?.includes('CANCELLED')) severity = 'warning';

      setToast({
        open: true,
        title: newNotif.title,
        message: newNotif.message,
        severity,
      });
    });

    return unsubscribe;
  }, [isAuthenticated, registerNotificationListener]);

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={closeToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: 3,
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            fontWeight: 500,
          }}
        >
          <strong>{toast.title}</strong>
          <div>{toast.message}</div>
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
