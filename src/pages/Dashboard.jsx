import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CategoryIcon from '@mui/icons-material/Category';

import useTechnologies from '../hooks/useTechnologies';
import { useNotifications } from '../contexts/NotificationContext';

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index} aria-labelledby={`tab-${index}`}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function Dashboard() {
  const { technologies } = useTechnologies();
  const [tab, setTab] = useState(0);
  const { notifications, history, clearHistory } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleBadgeClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const total = technologies.length;
  const completed = technologies.filter(t => t.status === 'completed').length;
  const inProgress = technologies.filter(t => t.status === 'in-progress').length;
  const notStarted = technologies.filter(t => t.status === 'not-started').length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const categoriesMap = technologies.reduce((acc, t) => {
    const c = t.category || 'other';
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});

  const handleTabChange = (_, v) => setTab(v);

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Панель управления</Typography>
          <IconButton color="inherit" aria-label="уведомления" onClick={handleBadgeClick}>
            <Badge variant="dot" color="error" invisible={history.length === 0}>
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Menu anchorEl={anchorEl} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1">Последние уведомления</Typography>
            </Box>
            <Divider />
            {history.length === 0 && (
              <MenuItem disabled>Нет уведомлений</MenuItem>
            )}
            {history.map(n => (
              <MenuItem key={n.id} onClick={() => { if (n.actions && n.actions[0] && typeof n.actions[0].handler === 'function') { try { n.actions[0].handler(); } catch(e){} } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body2">{n.text}</Typography>
                  <Typography variant="caption" color="text.secondary">{n.type}</Typography>
                </Box>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={() => { clearHistory(); handleClose(); }}>Очистить историю</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Tabs value={tab} onChange={handleTabChange} aria-label="dashboard tabs">
        <Tab label="Обзор" id="tab-0" />
        <Tab label="Технологии" id="tab-1" />
        <Tab label="Категории" id="tab-2" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography color="text.secondary" variant="body2">Завершено</Typography>
                </Box>
                <Typography variant="h4">{completed}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CategoryIcon color="action" sx={{ mr: 1 }} />
                  <Typography color="text.secondary" variant="body2">Всего</Typography>
                </Box>
                <Typography variant="h4">{total}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Общий прогресс</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  <LinearProgress variant="determinate" value={percent} sx={{ flex: 1, height: 10, borderRadius: 1 }} />
                  <Typography variant="h6" sx={{ minWidth: 48 }}>{percent}%</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>Сводка статусов</Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Не начато" secondary={notStarted} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="В процессе" secondary={inProgress} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Завершено" secondary={completed} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>Последние технологии</Typography>
                <List>
                  {technologies.slice().reverse().slice(0, 8).map(t => (
                    <ListItem key={t.id} secondaryAction={<Chip label={t.status} size="small" />}>
                      <ListItemText primary={t.title} secondary={t.category} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>Все технологии</Typography>
            <List>
              {technologies.map(t => (
                <ListItem key={t.id}>
                  <ListItemText primary={t.title} secondary={`${t.category} — ${t.status}`} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tab} index={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>Категории</Typography>
            <List>
              {Object.entries(categoriesMap).map(([cat, count]) => (
                <ListItem key={cat}>
                  <ListItemText primary={cat} secondary={`Технологий: ${count}`} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  );
}
