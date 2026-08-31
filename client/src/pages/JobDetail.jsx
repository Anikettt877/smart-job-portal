/**
 * JobDetail Page
 * Full job description with apply modal for logged-in users
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobAPI, applicationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';
import {
  FiMapPin, FiDollarSign, FiClock, FiBriefcase, FiUsers,
  FiArrowLeft, FiSend, FiX, FiCheckCircle, FiEdit, FiTrash2,
} from 'react-icons/fi';
import {
  Card, CardContent, Chip, Avatar, Button, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Divider
} from '@mui/material';

const jobTypeColors = {
  'Full-time':'bg-emerald-100 text-emerald-700','Part-time':'bg-sky-100 text-sky-700',
  'Remote':'bg-violet-100 text-violet-700','Internship':'bg-amber-100 text-amber-700','Contract':'bg-orange-100 text-orange-700',
};

export default function JobDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [job,       setJob]       = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [applied,   setApplied]   = useState(false);
  const [form,      setForm]      = useState({ resume: '', coverLetter: '' });
  const [submitting,setSubmitting]= useState(false);
  const [deleting,  setDeleting]  = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await jobAPI.getById(id);
        setJob(data.job);
      } catch {
        toast.error('Job not found.');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await applicationAPI.apply({ jobId: id, ...form });
      setApplied(true);
      setShowModal(false);
      toast.success('Application submitted.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job? This cannot be undone.')) return;
    try {
      setDeleting(true);
      await jobAPI.remove(id);
      toast.success('Job deleted successfully.');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to delete job.');
    } finally {
      setDeleting(false);
    }
  };

  const isOwner = user && job && (user._id === job.postedBy?._id || user.role === 'admin');
  const canApply = isAuthenticated && user?.role === 'user' && !applied;

  if (loading) return <Spinner fullscreen />;
  if (!job)    return null;

  return (
    <div className="container-app py-10 animate-fade-in max-w-5xl">
      {/* Back */}
      <Button
        component={Link}
        to="/jobs"
        startIcon={<FiArrowLeft className="w-4 h-4" />}
        sx={{ mb: 3, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
        className="mb-6"
      >
        Back to Jobs
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main Content ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header card */}
          <Card className="p-2">
            <CardContent>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      background: 'linear-gradient(to bottom right, #6366f1, #9333ea)',
                      fontWeight: 'bold',
                      fontSize: '1.25rem'
                    }}
                    variant="rounded"
                  >
                    {job.company?.charAt(0)}
                  </Avatar>
                  <div>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">{job.title}</h1>
                    <p className="text-slate-500 text-sm">{job.company} · {job.category}</p>
                  </div>
                </div>
                {isOwner && (
                  <div className="flex gap-2">
                    <IconButton component={Link} to={`/jobs/${id}/edit`} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'primary.50' } }}>
                      <FiEdit className="w-4 h-4" />
                    </IconButton>
                    <IconButton onClick={handleDelete} disabled={deleting} sx={{ color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: 'error.50' } }}>
                      <FiTrash2 className="w-4 h-4" />
                    </IconButton>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-slate-500 mb-4">
                <span className="flex items-center gap-1.5"><FiMapPin className="w-4 h-4 text-indigo-400" />{job.location}</span>
                <span className="flex items-center gap-1.5"><FiDollarSign className="w-4 h-4 text-emerald-400" />{job.salary || 'Not Disclosed'}</span>
                <span className="flex items-center gap-1.5"><FiUsers className="w-4 h-4 text-rose-400" />{job.applicationCount} applicants</span>
                <span className="flex items-center gap-1.5"><FiClock className="w-4 h-4 text-amber-400" />
                  {new Date(job.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Chip size="small" label={job.jobType} className={jobTypeColors[job.jobType] || 'bg-slate-100 text-slate-600'} />
                <Chip size="small" label={job.experienceLevel} className="bg-indigo-100 text-indigo-700" />
                {job.deadline && (
                  <Chip size="small" label={`Deadline: ${new Date(job.deadline).toLocaleDateString()}`} className="bg-red-100 text-red-600" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="p-2">
            <CardContent>
              <h2 className="font-semibold text-slate-800 dark:text-white mb-3 text-lg">Job Description</h2>
              <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                {job.description}
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          {job.requirements?.length > 0 && (
            <Card className="p-2">
              <CardContent>
                <h2 className="font-semibold text-slate-800 dark:text-white mb-3 text-lg">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <FiCheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">
          {/* Apply card */}
          <Card className="sticky top-20">
            <CardContent>
              <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Apply for this Position</h3>

              {applied ? (
                <div className="text-center py-4">
                  <FiCheckCircle className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
                  <p className="text-sm font-semibold text-emerald-600">Application Submitted!</p>
                  <Button variant="outlined" component={Link} to="/applications" className="mt-3" fullWidth>View My Applications</Button>
                </div>
              ) : !isAuthenticated ? (
                <div className="text-center">
                  <p className="text-sm text-slate-500 mb-3">Sign in to apply for this job</p>
                  <Button variant="contained" component={Link} to="/login" fullWidth className="mb-2">Sign In to Apply</Button>
                  <Button variant="outlined" component={Link} to="/register" fullWidth>Create Account</Button>
                </div>
              ) : user?.role !== 'user' ? (
                <p className="text-sm text-slate-500 text-center">Only Job Seekers can apply for jobs.</p>
              ) : (
                <Button variant="contained" onClick={() => setShowModal(true)} fullWidth size="large" startIcon={<FiSend className="w-4 h-4" />}>
                  Apply Now
                </Button>
              )}

              <Divider className="my-4" />
              <div className="space-y-2 text-xs text-slate-500">
                <div className="flex justify-between"><span>Posted by</span><span className="font-medium">{job.postedBy?.name}</span></div>
                <div className="flex justify-between"><span>Job Type</span><span className="font-medium">{job.jobType}</span></div>
                <div className="flex justify-between"><span>Experience</span><span className="font-medium">{job.experienceLevel}</span></div>
                <div className="flex justify-between"><span>Category</span><span className="font-medium">{job.category}</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Recruiter actions */}
          {isOwner && (
            <Card>
              <CardContent>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-3 text-sm">Recruiter Actions</h3>
                <Button variant="outlined" component={Link} to={`/jobs/${id}/edit`} fullWidth className="mb-2">Edit Job</Button>
                <Button variant="contained" component={Link} to={`/dashboard?job=${id}`} fullWidth>View Applicants</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ── Apply Modal ── */}
      <Dialog open={showModal} onClose={() => !submitting && setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="font-bold text-slate-800 dark:text-white">Apply: {job.title}</span>
          <IconButton onClick={() => setShowModal(false)} disabled={submitting}>
            <FiX className="w-5 h-5" />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleApply}>
          <DialogContent dividers className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Resume URL <span className="text-slate-400 font-normal">(optional)</span></label>
              <TextField
                fullWidth
                size="small"
                type="url"
                value={form.resume}
                onChange={(e) => setForm({ ...form, resume: e.target.value })}
                placeholder="https://your-resume-link.com"
              />
              <p className="text-xs text-slate-400 mt-1">Link to your LinkedIn profile, Google Drive, or portfolio.</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Cover Letter <span className="text-slate-400 font-normal">(optional)</span></label>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={form.coverLetter}
                onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
                inputProps={{ maxLength: 1000 }}
                placeholder="Tell the recruiter why you're a great fit..."
              />
              <p className="text-xs text-slate-400 mt-1">{form.coverLetter.length}/1000</p>
            </div>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button variant="outlined" onClick={() => setShowModal(false)} disabled={submitting} fullWidth>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting} fullWidth startIcon={!submitting && <FiSend className="w-4 h-4" />}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
