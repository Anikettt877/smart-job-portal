import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FiBriefcase } from 'react-icons/fi';
import {
  Container, Typography, Card, CardContent, TextField,
  FormControl, InputLabel, Select, MenuItem, Button, Chip,
  IconButton
} from '@mui/material';

const JOB_TYPES    = ['Full-time','Part-time','Remote','Internship','Contract'];
const CATEGORIES   = ['Technology','Design','Marketing','Sales','Finance','Healthcare','Education','Engineering','HR','Other'];
const EXP_LEVELS   = ['Entry Level','Mid Level','Senior Level','Executive'];

export default function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [reqInput, setReqInput] = useState('');

  const [form, setForm] = useState({
    title: '', company: '', location: '', salary: '', description: '',
    requirements: [], jobType: 'Full-time', category: 'Technology',
    experienceLevel: 'Entry Level', deadline: '',
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addRequirement = () => {
    const trimmed = reqInput.trim();
    if (trimmed && !form.requirements.includes(trimmed)) {
      setForm({ ...form, requirements: [...form.requirements, trimmed] });
      setReqInput('');
    }
  };

  const removeRequirement = (i) => {
    setForm({ ...form, requirements: form.requirements.filter((_, idx) => idx !== i) });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.location || !form.description) {
      toast.error('Please fill in all required fields.'); return;
    }
    if (form.description.length < 30) {
      toast.error('Description must be at least 30 characters.'); return;
    }
    try {
      setLoading(true);
      const { data } = await jobAPI.create(form);
      toast.success('Job posted successfully.');
      navigate(`/jobs/${data.job._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-10 max-w-3xl animate-fade-in" maxWidth="md">
      <div className="mb-8">
        <Typography variant="h4" component="h1" className="font-bold text-slate-800 dark:text-white flex items-center gap-3" sx={{ fontWeight: 700 }}>
          <FiBriefcase className="w-8 h-8 text-indigo-600" /> Post a New Job
        </Typography>
        <Typography className="text-slate-500 mt-1">Fill in the details to attract the best candidates.</Typography>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card sx={{ boxShadow: 1, borderRadius: 2 }}>
          <CardContent className="space-y-4 p-6">
            <Typography variant="h6" className="font-semibold text-slate-800 dark:text-white border-b border-slate-100 pb-3" sx={{ fontWeight: 600 }}>
              Basic Information
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField name="title" label="Job Title" value={form.title} onChange={onChange} placeholder="e.g. Frontend Developer" required fullWidth size="small" />
              <TextField name="company" label="Company Name" value={form.company} onChange={onChange} placeholder="e.g. Acme Corp" required fullWidth size="small" />
              <TextField name="location" label="Location" value={form.location} onChange={onChange} placeholder="e.g. Mumbai, India" required fullWidth size="small" />
              <TextField name="salary" label="Salary" value={form.salary} onChange={onChange} placeholder="e.g. ₹8-12 LPA" fullWidth size="small" />
            </div>
          </CardContent>
        </Card>

        {/* Classification */}
        <Card sx={{ boxShadow: 1, borderRadius: 2 }}>
          <CardContent className="space-y-4 p-6">
            <Typography variant="h6" className="font-semibold text-slate-800 dark:text-white border-b border-slate-100 pb-3" sx={{ fontWeight: 600 }}>
              Job Classification
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormControl fullWidth size="small">
                <InputLabel>Job Type</InputLabel>
                <Select name="jobType" value={form.jobType} onChange={onChange} label="Job Type">
                  {JOB_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select name="category" value={form.category} onChange={onChange} label="Category">
                  {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Experience Level</InputLabel>
                <Select name="experienceLevel" value={form.experienceLevel} onChange={onChange} label="Experience Level">
                  {EXP_LEVELS.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                </Select>
              </FormControl>
            </div>
            <div>
              <TextField
                type="date"
                name="deadline"
                label="Application Deadline"
                value={form.deadline}
                onChange={onChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                size="small"
                fullWidth
                sx={{ maxWidth: 200 }}
                helperText="Optional"
              />
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card sx={{ boxShadow: 1, borderRadius: 2 }}>
          <CardContent className="space-y-4 p-6">
            <Typography variant="h6" className="font-semibold text-slate-800 dark:text-white border-b border-slate-100 pb-3" sx={{ fontWeight: 600 }}>
              Job Details
            </Typography>
            <div>
              <TextField
                name="description"
                label="Job Description"
                value={form.description}
                onChange={onChange}
                multiline
                rows={7}
                placeholder="Describe the role, responsibilities, and what a typical day looks like..."
                required
                fullWidth
                helperText={`${form.description.length} characters (min 30)`}
              />
            </div>

            {/* Requirements */}
            <div>
              <Typography variant="body2" className="mb-2 text-slate-700">Requirements <span className="text-slate-400 font-normal">(optional)</span></Typography>
              <div className="flex gap-2">
                <TextField
                  value={reqInput}
                  onChange={(e) => setReqInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  placeholder="e.g. 3+ years of React experience"
                  fullWidth
                  size="small"
                />
                <Button type="button" onClick={addRequirement} variant="outlined" color="primary">
                  Add
                </Button>
              </div>
              {form.requirements.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.requirements.map((req, i) => (
                    <Chip key={i} label={req} onDelete={() => removeRequirement(i)} color="primary" variant="outlined" />
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="button" onClick={() => navigate('/dashboard')} variant="outlined" color="inherit" fullWidth sx={{ py: 1.5, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} variant="contained" color="primary" fullWidth sx={{ py: 1.5, textTransform: 'none' }}>
            {loading ? 'Posting...' : 'Post Job'}
          </Button>
        </div>
      </form>
    </Container>
  );
}
