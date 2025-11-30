import React, { createContext, useContext, useState, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [history, setHistory] = useState([]);

  const addNotification = useCallback((text, type = 'info', timeout = 4000, actions = null) => {
    const id = Date.now() + Math.random();
    const n = { id, text, type, actions, timeout };
    setNotifications(prev => [...prev, n]);
    // keep a short history of recent notifications for the UI
    setHistory(prev => [n, ...prev].slice(0, 50));

    if (timeout && timeout > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(x => x.id !== id));
      }, timeout);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, history, addNotification, removeNotification, markAsRead, clearHistory }}>
      {children}

      {/* Global Snackbars for notifications (MUI) */}
      {notifications.map((n) => (
        <Snackbar
          key={n.id}
          open={true}
          autoHideDuration={n.timeout || 4000}
          onClose={() => removeNotification(n.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Box sx={{ width: { xs: '90vw', sm: 360 } }}>
            <Alert
              onClose={() => removeNotification(n.id)}
              severity={n.type}
              elevation={6}
              variant="filled"
              action={(
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {n.actions ? n.actions.map((a, i) => (
                    <Button key={i} color="inherit" size="small" onClick={() => { try { a.handler(); } catch(e){ console.error(e); } }} aria-label={a.label}>
                      {a.label}
                    </Button>
                  )) : null}
                  <IconButton size="small" aria-label="close" color="inherit" onClick={() => removeNotification(n.id)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
              sx={{ alignItems: 'center' }}
            >
              {n.text}
            </Alert>
          </Box>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}

export default NotificationProvider;
