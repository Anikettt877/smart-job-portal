import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiHome, FiSearch } from 'react-icons/fi';
import { Button, Typography } from '@mui/material';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center px-4">
      <div className="text-center animate-slide-up max-w-md">
        {/* Illustration */}
        <div className="relative mb-8 inline-block">
          <div className="w-24 h-24 rounded-3xl bg-indigo-100 flex items-center justify-center">
            <FiSearch className="w-12 h-12 text-indigo-600" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-500 font-bold text-lg">!</span>
          </div>
        </div>

        <Typography variant="h1" className="text-7xl font-extrabold text-indigo-600 mb-3 tracking-tight">404</Typography>
        <Typography variant="h4" className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Page Not Found</Typography>
        <Typography variant="body1" className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </Typography>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outlined" color="primary" onClick={() => navigate(-1)} startIcon={<FiArrowLeft className="w-4 h-4" />}>
            Go Back
          </Button>
          <Button variant="contained" color="primary" component={Link} to="/" startIcon={<FiHome className="w-4 h-4" />}>
            Home
          </Button>
          <Button variant="outlined" color="primary" component={Link} to="/jobs" startIcon={<FiSearch className="w-4 h-4" />}>
            Browse Jobs
          </Button>
        </div>
      </div>
    </div>
  );
}
