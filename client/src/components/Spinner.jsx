import React from 'react';
import { CircularProgress, Backdrop, Typography } from '@mui/material';

export default function Spinner({ fullscreen = false, size = 'md' }) {
  const sizeMap = { sm: 20, md: 32, lg: 48 };

  const spinner = (
    <CircularProgress size={sizeMap[size] || 32} sx={{ color: '#4f46e5' }} />
  );

  if (fullscreen) {
    return (
      <Backdrop
        open={true}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <div className="flex flex-col items-center gap-4">
          {spinner}
          <Typography className="text-slate-500 text-sm font-medium animate-pulse">
            Loading...
          </Typography>
        </div>
      </Backdrop>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  );
}
