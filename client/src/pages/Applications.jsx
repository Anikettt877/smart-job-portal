/**
 * Applications Page
 * Full application tracker for Job Seekers
 * Shows all applications with status, job details, and ability to withdraw
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import {
  FiFileText, FiMapPin, FiDollarSign, FiBriefcase,
  FiClock, FiTrash2, FiExternalLink, FiFilter, FiSearch,
  FiCheckCircle, FiXCircle, FiAlertCircle,
} from 'react-icons/fi';
import {
  Card, CardContent, Tabs, Tab, Avatar, Button, IconButton,
  LinearProgress, Collapse, TextField, InputAdornment, Divider
} from '@mui/material';

const STATUS_TABS = [
  { label: 'All',       value: '',          icon: <FiFileText />,    color: 'slate' },
  { label: 'Applied',   value: 'applied',   icon: <FiAlertCircle />, color: 'blue' },
  { label: 'Reviewing', value: 'reviewing', icon: <FiClock />,       color: 'amber' },
  { label: 'Selected',  value: 'selected',  icon: <FiCheckCircle />, color: 'emerald' },
  { label: 'Rejected',  value: 'rejected',  icon: <FiXCircle />,     color: 'red' },
];

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 3600)    return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)   return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
};

export default function Applications() {
  const [apps,       setApps]       = useState([]);
  const [filtered,   setFiltered]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState('');
  const [search,     setSearch]     = useState('');
  const [withdrawing,setWithdrawing]= useState(null);
  const [expanded,   setExpanded]   = useState(null);

  const fetchApps = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await applicationAPI.getMyApps();
      setApps(data.applications);
      setFiltered(data.applications);
    } catch {
      toast.error('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  useEffect(() => {
    let result = apps;
    if (activeTab) result = result.filter((a) => a.status === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((a) =>
        a.jobId?.title?.toLowerCase().includes(q) ||
        a.jobId?.company?.toLowerCase().includes(q) ||
        a.jobId?.location?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [apps, activeTab, search]);

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Withdraw this application? This cannot be undone.')) return;
    try {
      setWithdrawing(appId);
      await applicationAPI.withdraw(appId);
      setApps((prev) => prev.filter((a) => a._id !== appId));
      toast.success('Application withdrawn.');
    } catch {
      toast.error('Failed to withdraw application.');
    } finally {
      setWithdrawing(null);
    }
  };

  const countByStatus = (s) => apps.filter((a) => a.status === s).length;

  return (
    <div className="container-app py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">My Applications</h1>
        <p className="text-slate-500 dark:text-slate-400">
          {loading ? 'Loading...' : `${apps.length} total application${apps.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Progress overview */}
      {apps.length > 0 && !loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Applied',   count: countByStatus('applied'),   barColor: 'primary', bg: 'bg-blue-50',    text: 'text-blue-700'    },
            { label: 'Reviewing', count: countByStatus('reviewing'), barColor: 'warning', bg: 'bg-amber-50',   text: 'text-amber-700'   },
            { label: 'Selected',  count: countByStatus('selected'),  barColor: 'success', bg: 'bg-emerald-50', text: 'text-emerald-700' },
            { label: 'Rejected',  count: countByStatus('rejected'),  barColor: 'error',   bg: 'bg-red-50',     text: 'text-red-700'     },
          ].map(({ label, count, bg, text, barColor }) => (
            <Card key={label} className={`${bg} border-none`} elevation={0}>
              <CardContent className="p-4">
                <p className={`text-2xl font-extrabold ${text}`}>{count}</p>
                <p className={`text-sm font-medium ${text} opacity-80`}>{label}</p>
                {apps.length > 0 && (
                  <LinearProgress
                    variant="determinate"
                    value={(count / apps.length) * 100}
                    color={barColor}
                    sx={{ mt: 2, height: 6, borderRadius: 1 }}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <TextField
          fullWidth
          size="small"
          placeholder="Search by job title, company, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FiSearch className="text-slate-400 w-4 h-4" />
              </InputAdornment>
            ),
          }}
        />
      </div>

      {/* Status tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, val) => setActiveTab(val)}
        variant="scrollable"
        scrollButtons="auto"
        className="mb-6"
        sx={{ minHeight: 48 }}
      >
        {STATUS_TABS.map(({ label, value, icon }) => {
          const cnt = value ? countByStatus(value) : apps.length;
          return (
            <Tab
              key={value}
              value={value}
              label={<span className="flex items-center gap-1.5">{label} <span className="text-xs px-1.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">{cnt}</span></span>}
              icon={icon}
              iconPosition="start"
              sx={{ minHeight: 48 }}
            />
          );
        })}
      </Tabs>

      {/* Application list */}
      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <Card className="p-16 text-center">
          <CardContent>
            <FiFileText className="w-12 h-12 mx-auto mb-4 text-indigo-500" />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-white mb-2">
              {activeTab || search ? 'No matching applications' : 'No applications yet'}
            </h3>
            <p className="text-slate-500 mb-5 text-sm">
              {activeTab || search ? 'Try a different filter or search term.' : 'Start applying to jobs and track your progress here.'}
            </p>
            {!activeTab && !search && (
              <Button variant="contained" component={Link} to="/jobs">Browse Jobs</Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const job = app.jobId;
            const isExpanded = expanded === app._id;
            const steps = ['applied','reviewing','selected'];
            const isRejected = app.status === 'rejected';
            const progressValue = isRejected ? 100 : ((steps.indexOf(app.status) + 1) / steps.length) * 100;

            return (
              <Card key={app._id} className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'border-indigo-200 shadow-indigo-50' : ''}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        background: 'linear-gradient(to bottom right, #6366f1, #7c3aed)',
                        fontWeight: 'bold',
                        fontSize: '1.125rem'
                      }}
                      variant="rounded"
                    >
                      {job?.company?.charAt(0) || '?'}
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-800 dark:text-white truncate">
                            {job?.title || <span className="text-slate-400 italic">Job no longer available</span>}
                          </h3>
                          <p className="text-sm text-slate-500 mt-0.5">{job?.company}</p>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>

                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-400">
                        {job?.location && <span className="flex items-center gap-1"><FiMapPin className="w-3 h-3" />{job.location}</span>}
                        {job?.salary && <span className="flex items-center gap-1"><FiDollarSign className="w-3 h-3" />{job.salary}</span>}
                        {job?.jobType && <span className="flex items-center gap-1"><FiBriefcase className="w-3 h-3" />{job.jobType}</span>}
                        <span className="flex items-center gap-1"><FiClock className="w-3 h-3" />Applied {timeAgo(app.createdAt)}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        {job?._id && (
                          <Button
                            component={Link}
                            to={`/jobs/${job._id}`}
                            size="small"
                            startIcon={<FiExternalLink />}
                            sx={{ textTransform: 'none', minWidth: 0, padding: '4px 8px' }}
                          >
                            View Job
                          </Button>
                        )}
                        {(app.coverLetter || app.resume) && (
                          <Button
                            onClick={() => setExpanded(isExpanded ? null : app._id)}
                            size="small"
                            sx={{ textTransform: 'none', color: 'text.secondary', ml: 1 }}
                          >
                            {isExpanded ? '▲ Less' : '▼ Details'}
                          </Button>
                        )}
                        <Button
                          onClick={() => handleWithdraw(app._id)}
                          disabled={withdrawing === app._id}
                          size="small"
                          color="error"
                          startIcon={<FiTrash2 />}
                          sx={{ ml: 'auto', textTransform: 'none' }}
                        >
                          {withdrawing === app._id ? 'Withdrawing...' : 'Withdraw'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <Collapse in={isExpanded}>
                  <Divider />
                  <div className="bg-slate-50 dark:bg-slate-800/40 px-5 py-4 space-y-3">
                    {app.resume && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Resume</p>
                        <a href={app.resume} target="_blank" rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:underline break-all">
                          {app.resume}
                        </a>
                      </div>
                    )}
                    {app.coverLetter && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Cover Letter</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                          {app.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>
                </Collapse>

                <div className="px-5 pb-3 pt-1">
                  <LinearProgress
                    variant="determinate"
                    value={progressValue}
                    color={isRejected ? 'error' : 'primary'}
                    sx={{ height: 6, borderRadius: 1 }}
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Applied</span>
                    <span>Reviewing</span>
                    <span>Decision</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm mb-3">Looking for more opportunities?</p>
          <Button variant="contained" component={Link} to="/jobs">Browse All Jobs</Button>
        </div>
      )}
    </div>
  );
}
