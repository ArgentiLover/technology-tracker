import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

function getStatusColor(status) {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in-progress':
      return 'info';
    case 'not-started':
    default:
      return 'default';
  }
}

function getStatusText(status) {
  switch (status) {
    case 'completed':
      return 'Завершено';
    case 'in-progress':
      return 'В процессе';
    case 'not-started':
    default:
      return 'Не начато';
  }
}

export default function SimpleTechCard({ technology, onStatusChange }) {
  const handleComplete = () => {
    if (onStatusChange) onStatusChange(technology.id, 'completed');
  };

  const handleToggle = () => {
    if (!onStatusChange) return;
    const next = technology.status === 'in-progress' ? 'not-started' : 'in-progress';
    onStatusChange(technology.id, next);
  };

  return (
    <Card sx={{ maxWidth: 345, margin: 2 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {technology.title}
        </Typography>
        {technology.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {technology.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <Chip label={technology.category} variant="outlined" size="small" />
          <Chip label={getStatusText(technology.status)} color={getStatusColor(technology.status)} size="small" />
        </Box>
      </CardContent>
      <CardActions>
        {technology.status !== 'completed' && (
          <Button size="small" variant="contained" color="primary" onClick={handleComplete}>
            Завершить
          </Button>
        )}

        <Button size="small" variant="outlined" color="secondary" onClick={handleToggle}>
          {technology.status === 'in-progress' ? 'Приостановить' : 'Начать'}
        </Button>
      </CardActions>
    </Card>
  );
}
