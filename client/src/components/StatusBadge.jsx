import React from 'react';
import { Chip } from '@mui/material';

const STATUS_COLORS = {
  applied: 'info',
  reviewing: 'warning',
  selected: 'success',
  rejected: 'error',
};

export default function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || 'default';
  
  return (
    <Chip
      label={status}
      color={color}
      size="small"
      className="capitalize font-semibold text-xs"
    />
  );
}
