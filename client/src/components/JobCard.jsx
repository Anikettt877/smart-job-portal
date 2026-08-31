/**
 * JobCard Component
 * Displays a single job listing in a card format
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiDollarSign, FiClock, FiUsers, FiArrowRight, FiBookmark } from 'react-icons/fi';
import { Card, CardContent, CardActions, Avatar, Chip, IconButton, Button, Tooltip, Typography } from '@mui/material';

// ── Badge colour map ───────────────────────────────────────────────────────────
const jobTypeColors = {
  'Full-time':  'bg-emerald-100 text-emerald-700',
  'Part-time':  'bg-sky-100 text-sky-700',
  'Remote':     'bg-violet-100 text-violet-700',
  'Internship': 'bg-amber-100 text-amber-700',
  'Contract':   'bg-orange-100 text-orange-700',
};

const expColors = {
  'Entry Level':  'bg-teal-50 text-teal-700',
  'Mid Level':    'bg-blue-50 text-blue-700',
  'Senior Level': 'bg-purple-50 text-purple-700',
  'Executive':    'bg-rose-50 text-rose-700',
};

// ── Time ago helper ───────────────────────────────────────────────────────────
const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)        return 'Just now';
  if (diff < 3600)      return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)     return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000)   return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 2592000)}mo ago`;
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function JobCard({ job, compact = false }) {
  const {
    _id, title, company, location, salary, jobType,
    experienceLevel, applicationCount, createdAt, category,
  } = job;

  return (
    <Card className="flex flex-col gap-2 group animate-slide-up rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow dark:bg-slate-900" elevation={0} sx={{ height: '100%' }}>
      <CardContent className="flex flex-col gap-4 flex-1 p-5 pb-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Company initial avatar */}
            <div className="flex items-center gap-3 mb-2">
              <Avatar 
                variant="rounded"
                sx={{ 
                  background: 'linear-gradient(135deg, #6366f1, #9333ea)', 
                  width: 40, 
                  height: 40,
                  fontWeight: 'bold',
                  fontSize: '0.875rem'
                }}
              >
                {company?.charAt(0).toUpperCase()}
              </Avatar>
              <div className="min-w-0">
                <Typography variant="caption" className="text-slate-500 truncate block">{company}</Typography>
                <Typography variant="caption" className="text-slate-400 block">{category}</Typography>
              </div>
            </div>

            <Typography 
              variant="h6" 
              className="font-semibold text-slate-800 dark:text-white text-base leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2"
            >
              {title}
            </Typography>
          </div>

          {/* Bookmark (decorative) */}
          <Tooltip title="Bookmark Job" placement="top">
            <IconButton className="text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 transition-colors flex-shrink-0" size="small">
              <FiBookmark className="w-5 h-5" />
            </IconButton>
          </Tooltip>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <Tooltip title="Location"><span className="flex items-center gap-1"><FiMapPin className="w-3 h-3 text-indigo-400" />{location}</span></Tooltip>
          <Tooltip title="Salary"><span className="flex items-center gap-1"><FiDollarSign className="w-3 h-3 text-emerald-400" />{salary || 'Not Disclosed'}</span></Tooltip>
          <Tooltip title="Posted"><span className="flex items-center gap-1"><FiClock className="w-3 h-3 text-amber-400" />{timeAgo(createdAt)}</span></Tooltip>
          {applicationCount > 0 && (
            <Tooltip title="Applications"><span className="flex items-center gap-1"><FiUsers className="w-3 h-3 text-rose-400" />{applicationCount} applied</span></Tooltip>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          <Chip 
            label={jobType} 
            size="small" 
            className={`font-medium ${jobTypeColors[jobType] || 'bg-slate-100 text-slate-600'}`} 
            sx={{ border: 'none', '& .MuiChip-label': { px: 1.5 } }} 
          />
          <Chip 
            label={experienceLevel} 
            size="small" 
            className={`font-medium ${expColors[experienceLevel] || 'bg-slate-100 text-slate-600'}`} 
            sx={{ border: 'none', '& .MuiChip-label': { px: 1.5 } }} 
          />
        </div>
      </CardContent>

      {/* Footer */}
      <CardActions className="mt-auto pt-2 pb-4 px-5 border-t border-slate-50 dark:border-slate-800/50">
        <Button
          component={Link}
          to={`/jobs/${_id}`}
          fullWidth
          className="flex items-center justify-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 group-hover:gap-3 transition-all duration-200 normal-case"
        >
          View Details <FiArrowRight className="w-4 h-4" />
        </Button>
      </CardActions>
    </Card>
  );
}
