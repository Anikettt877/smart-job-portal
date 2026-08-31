/**
 * Dashboard Page
 * Role-based dashboard:
 *  - Recruiter: posted jobs, applicant management
 *  - User:      quick stats, recent applications, job suggestions
 *  - Admin:     system overview
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobAPI, applicationAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import {
  FiBriefcase, FiUsers, FiFileText, FiPlusCircle,
  FiEye, FiTrash2, FiEdit, FiChevronRight, FiTrendingUp,
  FiCheckCircle, FiClock, FiXCircle, FiToggleLeft, FiToggleRight,
} from 'react-icons/fi';
import {
  Card, CardContent, Avatar, Chip, Button, IconButton, Select, MenuItem,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  Tooltip, Divider, Typography, Paper, CircularProgress
} from '@mui/material';

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color = 'indigo', sub }) => {
  const colors = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
    emerald:{ bg: 'bg-emerald-50', text: 'text-emerald-600' },
    amber:  { bg: 'bg-amber-50', text: 'text-amber-600' },
    rose:   { bg: 'bg-rose-50', text: 'text-rose-600' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600' },
  };
  const theme = colors[color] || colors.indigo;
  
  return (
    <Card elevation={0} className="border border-slate-100 dark:border-slate-800">
      <CardContent className="p-5 flex items-center gap-4 !pb-5">
        <Avatar variant="rounded" className={`${theme.bg} ${theme.text}`} sx={{ width: 48, height: 48 }}>
          <Icon className="w-6 h-6" />
        </Avatar>
        <div>
          <Typography variant="h5" className="font-extrabold text-slate-800 dark:text-white">{value}</Typography>
          <Typography variant="body2" className="text-slate-500 dark:text-slate-400">{label}</Typography>
          {sub && <Typography variant="caption" className="text-slate-400 mt-0.5">{sub}</Typography>}
        </div>
      </CardContent>
    </Card>
  );
};

// ── Recruiter Dashboard ───────────────────────────────────────────────────────
const RecruiterDashboard = ({ user }) => {
  const [jobs,         setJobs]         = useState([]);
  const [applicants,   setApplicants]   = useState({});   // { jobId: [apps] }
  const [expandedJob,  setExpandedJob]  = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [updatingApp,  setUpdatingApp]  = useState(null);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await jobAPI.getMyJobs();
      setJobs(data.jobs);
    } catch { toast.error('Failed to load your jobs.'); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const loadApplicants = async (jobId) => {
    if (expandedJob === jobId) { setExpandedJob(null); return; }
    try {
      const { data } = await applicationAPI.getJobApps(jobId);
      setApplicants((prev) => ({ ...prev, [jobId]: data.applications }));
      setExpandedJob(jobId);
    } catch { toast.error('Failed to load applicants.'); }
  };

  const updateStatus = async (appId, status, jobId) => {
    try {
      setUpdatingApp(appId);
      await applicationAPI.updateStatus(appId, status);
      setApplicants((prev) => ({
        ...prev,
        [jobId]: prev[jobId].map((a) => a._id === appId ? { ...a, status } : a),
      }));
      toast.success(`Status updated to "${status}"`);
    } catch { toast.error('Failed to update status.'); }
    finally { setUpdatingApp(null); }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm('Delete this job and all its applications?')) return;
    try {
      await jobAPI.remove(jobId);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      toast.success('Job deleted.');
    } catch { toast.error('Failed to delete.'); }
  };

  const totalApps = jobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0);
  const activeJobs = jobs.filter((j) => j.isActive).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={FiBriefcase}  label="Total Jobs"     value={jobs.length}  color="indigo" />
        <StatCard icon={FiToggleRight} label="Active Jobs"   value={activeJobs}   color="emerald"/>
        <StatCard icon={FiUsers}      label="Total Applicants" value={totalApps}  color="violet" />
        <StatCard icon={FiTrendingUp} label="Avg. Apps/Job"  value={jobs.length ? (totalApps/jobs.length).toFixed(1) : 0} color="amber" />
      </div>

      {/* Quick action */}
      <div className="flex items-center justify-between">
        <Typography variant="h6" className="font-bold text-slate-800 dark:text-white">Your Job Listings</Typography>
        <Button variant="contained" component={Link} to="/post-job" startIcon={<FiPlusCircle />}>
          Post a Job
        </Button>
      </div>

      {loading ? <Spinner /> : jobs.length === 0 ? (
        <Card className="text-center">
          <CardContent className="p-12">
            <FiBriefcase className="w-12 h-12 mx-auto mb-4 text-indigo-500" />
            <Typography variant="h6" className="font-semibold text-slate-700 dark:text-white mb-2">No jobs posted yet</Typography>
            <Typography variant="body2" className="text-slate-500 mb-5">Post your first job listing to start receiving applications.</Typography>
            <Button variant="contained" component={Link} to="/post-job">Post Your First Job</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job._id} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar
                    sx={{
                      width: 40, height: 40,
                      background: 'linear-gradient(to bottom right, #6366f1, #9333ea)',
                      fontWeight: 'bold'
                    }}
                    variant="rounded"
                  >
                    {job.company?.charAt(0)}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <Typography variant="subtitle1" className="font-semibold text-slate-800 dark:text-white">{job.title}</Typography>
                        <Typography variant="body2" className="text-slate-500">{job.company} · {job.location} · {job.jobType}</Typography>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Chip
                          size="small"
                          label={job.isActive ? '● Active' : '○ Inactive'}
                          color={job.isActive ? 'success' : 'default'}
                          variant="outlined"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <FiUsers className="w-3.5 h-3.5" /> {job.applicationCount} applicants
                      </span>
                      <span className="text-xs text-slate-400">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                      {/* Actions */}
                      <div className="ml-auto flex items-center gap-1">
                        <Button
                          size="small"
                          onClick={() => loadApplicants(job._id)}
                          startIcon={<FiUsers />}
                          endIcon={<FiChevronRight className={`transition-transform ${expandedJob === job._id ? 'rotate-90' : ''}`} />}
                          sx={{ textTransform: 'none', bgcolor: 'primary.50', color: 'primary.main', '&:hover': { bgcolor: 'primary.100' } }}
                        >
                          {expandedJob === job._id ? 'Hide' : 'View'} Applicants
                        </Button>
                        <Tooltip title="Edit Job">
                          <IconButton size="small" component={Link} to={`/jobs/${job._id}/edit`} sx={{ color: 'text.secondary' }}>
                            <FiEdit className="w-4 h-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Job">
                          <IconButton size="small" onClick={() => deleteJob(job._id)} sx={{ color: 'error.main' }}>
                            <FiTrash2 className="w-4 h-4" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* Applicants panel */}
              {expandedJob === job._id && (
                <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  {!applicants[job._id] ? (
                    <div className="flex justify-center py-6"><CircularProgress size={24} /></div>
                  ) : applicants[job._id].length === 0 ? (
                    <p className="text-center py-6 text-sm text-slate-500">No applications yet for this job.</p>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                      {applicants[job._id].map((app) => (
                        <div key={app._id} className="px-5 py-4 flex items-start gap-4 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.50', color: 'primary.main', fontSize: '0.875rem', fontWeight: 'bold' }}>
                            {app.userId?.name?.charAt(0).toUpperCase()}
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div>
                                <Typography variant="subtitle2" className="font-medium text-slate-800 dark:text-white">{app.userId?.name}</Typography>
                                <Typography variant="caption" className="text-slate-500">{app.userId?.email}</Typography>
                                {app.userId?.skills?.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {app.userId.skills.slice(0,4).map((s) => (
                                      <Chip key={s} label={s} size="small" sx={{ height: 20, fontSize: '0.65rem' }} color="primary" variant="outlined" />
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <StatusBadge status={app.status} />
                                <Select
                                  size="small"
                                  value={app.status}
                                  disabled={updatingApp === app._id}
                                  onChange={(e) => updateStatus(app._id, e.target.value, job._id)}
                                  sx={{ fontSize: '0.75rem', height: 30 }}
                                >
                                  {['applied','reviewing','selected','rejected'].map((s) => (
                                    <MenuItem key={s} value={s} sx={{ fontSize: '0.75rem' }}>{s.charAt(0).toUpperCase()+s.slice(1)}</MenuItem>
                                  ))}
                                </Select>
                              </div>
                            </div>
                            {app.coverLetter && (
                              <Typography variant="caption" className="text-slate-500 mt-2 line-clamp-2 italic block">"{app.coverLetter}"</Typography>
                            )}
                            {app.resume && (
                              <a href={app.resume} target="_blank" rel="noopener noreferrer"
                                className="text-xs text-indigo-500 hover:underline mt-1 inline-block">View Resume</a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// ── User Dashboard ────────────────────────────────────────────────────────────
const UserDashboard = ({ user }) => {
  const [apps,    setApps]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await applicationAPI.getMyApps();
        setApps(data.applications);
      } catch { toast.error('Failed to load applications.'); }
      finally  { setLoading(false); }
    })();
  }, []);

  const statusCount = (s) => apps.filter((a) => a.status === s).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={FiFileText}   label="Total Applied"   value={apps.length}          color="indigo" />
        <StatCard icon={FiClock}      label="Under Review"    value={statusCount('reviewing')} color="amber" />
        <StatCard icon={FiCheckCircle}label="Selected"        value={statusCount('selected')}  color="emerald"/>
        <StatCard icon={FiXCircle}    label="Rejected"        value={statusCount('rejected')}  color="rose"  />
      </div>

      {/* Tips banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-slate-800 text-white p-5 flex items-center justify-between gap-4">
        <div>
          <Typography variant="subtitle1" className="font-bold mb-1">Ready to apply?</Typography>
          <Typography variant="body2" className="text-indigo-100">Browse thousands of fresh opportunities updated daily.</Typography>
        </div>
        <Button
          component={Link}
          to="/jobs"
          variant="contained"
          sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' }, fontWeight: 'bold', borderRadius: 2 }}
        >
          Browse Jobs
        </Button>
      </div>

      {/* Recent applications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h6" className="font-bold text-slate-800 dark:text-white">Recent Applications</Typography>
          <Link to="/applications" className="text-sm text-indigo-600 hover:underline font-medium">View all →</Link>
        </div>

        {loading ? <Spinner /> : apps.length === 0 ? (
          <Card className="text-center">
            <CardContent className="p-12">
              <FiFileText className="w-12 h-12 mx-auto mb-4 text-indigo-500" />
              <Typography variant="h6" className="font-semibold text-slate-700 dark:text-white mb-2">No applications yet</Typography>
              <Typography variant="body2" className="text-slate-500 mb-5">Start applying to jobs you love and track your progress here.</Typography>
              <Button variant="contained" component={Link} to="/jobs">Find Jobs</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {apps.slice(0, 5).map((app) => (
              <Card key={app._id} className="hover:border-indigo-200 transition-all group">
                <CardContent className="p-4 flex items-center gap-4 !pb-4">
                  <Avatar
                    sx={{ width: 40, height: 40, background: 'linear-gradient(to bottom right, #6366f1, #7c3aed)', fontWeight: 'bold', fontSize: '0.875rem' }}
                    variant="rounded"
                  >
                    {app.jobId?.company?.charAt(0) || '?'}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <Typography variant="subtitle2" className="font-semibold text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors truncate">
                      <Link to={`/jobs/${app.jobId?._id}`}>{app.jobId?.title || 'Job Deleted'}</Link>
                    </Typography>
                    <Typography variant="caption" className="text-slate-500 truncate block">
                      {app.jobId?.company} · {app.jobId?.location}
                    </Typography>
                  </div>
                  <div className="flex-shrink-0"><StatusBadge status={app.status} /></div>
                  <Typography variant="caption" className="text-slate-400 flex-shrink-0 hidden sm:block">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Profile completion hint */}
      <Card sx={{ bgcolor: '#fffbeb', border: '1px solid #fef3c7' }} elevation={0}>
        <CardContent className="p-5 !pb-5">
          <Typography variant="subtitle2" className="font-semibold text-amber-800 mb-1">Complete Your Profile</Typography>
          <Typography variant="caption" className="text-amber-700 mb-3 block">A complete profile with skills and bio increases your chances of getting selected.</Typography>
          <Link to="/profile" className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline">Update Profile →</Link>
        </CardContent>
      </Card>
    </div>
  );
};

// ── Admin Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await applicationAPI.getAll();
        setApps(data.applications);
      } catch { toast.error('Failed to load data.'); }
      finally  { setLoading(false); }
    })();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <Card sx={{ background: 'linear-gradient(to right, #1e293b, #0f172a)', color: 'white', border: 'none' }}>
        <CardContent className="p-6">
          <Typography variant="subtitle1" className="font-bold mb-1">Admin Overview</Typography>
          <Typography variant="body2" className="text-slate-300">You have full access to manage all platform data.</Typography>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={FiFileText} label="Total Applications" value={apps.length} color="indigo" />
        <StatCard icon={FiCheckCircle} label="Selected" value={apps.filter(a=>a.status==='selected').length} color="emerald" />
        <StatCard icon={FiXCircle} label="Rejected" value={apps.filter(a=>a.status==='rejected').length} color="rose" />
      </div>

      <div>
        <Typography variant="h6" className="font-bold text-slate-800 dark:text-white mb-4">All Applications</Typography>
        {loading ? <Spinner /> : (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  {['Applicant','Job','Company','Status','Applied On'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 'bold', color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {apps.slice(0, 20).map((app) => (
                  <TableRow key={app._id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" className="font-medium text-slate-800 dark:text-white">{app.userId?.name}</Typography>
                      <Typography variant="caption" className="text-slate-400">{app.userId?.email}</Typography>
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-300">{app.jobId?.title}</TableCell>
                    <TableCell className="text-slate-500">{app.jobId?.company}</TableCell>
                    <TableCell><StatusBadge status={app.status} /></TableCell>
                    <TableCell className="text-slate-400 text-xs">{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const roleLabel = { admin: 'Admin', recruiter: 'Recruiter', user: 'Job Seeker' };

  return (
    <div className="container-app py-10">
      {/* Welcome header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Avatar
            sx={{
              width: 48, height: 48,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              fontWeight: 'extrabold',
              fontSize: '1.25rem',
              boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4)'
            }}
            variant="rounded"
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <Typography variant="h5" className="font-bold text-slate-800 dark:text-white">
              {greet()}, {user?.name?.split(' ')[0]}
            </Typography>
            <Chip
              label={roleLabel[user?.role]}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mt: 0.5, fontWeight: 'bold' }}
            />
          </div>
        </div>
        <Typography variant="body2" className="text-slate-500 dark:text-slate-400 ml-15">
          {user?.role === 'recruiter' ? 'Manage your job listings and review applicants.' :
           user?.role === 'admin'     ? 'Full system access — manage users, jobs, and applications.' :
           'Track your applications and discover new opportunities.'}
        </Typography>
      </div>

      {/* Role-based content */}
      {user?.role === 'recruiter' && <RecruiterDashboard user={user} />}
      {user?.role === 'user'      && <UserDashboard      user={user} />}
      {user?.role === 'admin'     && <AdminDashboard />}
    </div>
  );
}
