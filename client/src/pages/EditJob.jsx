import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  Container, Typography, Card, CardContent, TextField,
  FormControl, InputLabel, Select, MenuItem, Button, Chip,
  Checkbox, FormControlLabel, CircularProgress
} from '@mui/material';

const JOB_TYPES  = ['Full-time','Part-time','Remote','Internship','Contract'];
const CATEGORIES = ['Technology','Design','Marketing','Sales','Finance','Healthcare','Education','Engineering','HR','Other'];
const EXP_LEVELS = ['Entry Level','Mid Level','Senior Level','Executive'];

export default function EditJob() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching,setFetching]= useState(true);
  const [reqInput,setReqInput]= useState('');
  const [form, setForm]       = useState({
    title:'',company:'',location:'',salary:'',description:'',
    requirements:[],jobType:'Full-time',category:'Technology',
    experienceLevel:'Entry Level',deadline:'',isActive:true,
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await jobAPI.getById(id);
        const job = data.job;
        setForm({
          title: job.title, company: job.company, location: job.location,
          salary: job.salary || '', description: job.description,
          requirements: job.requirements || [], jobType: job.jobType,
          category: job.category, experienceLevel: job.experienceLevel,
          deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
          isActive: job.isActive,
        });
      } catch { toast.error('Failed to load job.'); navigate('/dashboard'); }
      finally   { setFetching(false); }
    })();
  }, [id, navigate]);

  const onChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const addReq = () => {
    const t = reqInput.trim();
    if (t && !form.requirements.includes(t)) { setForm({ ...form, requirements:[...form.requirements,t] }); setReqInput(''); }
  };

  const removeReq = (i) => setForm({ ...form, requirements: form.requirements.filter((_,idx) => idx !== i) });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await jobAPI.update(id, form);
      toast.success('Job updated successfully!');
      navigate(`/jobs/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update.');
    } finally { setLoading(false); }
  };

  if (fetching) return <div className="flex justify-center items-center min-h-64"><CircularProgress /></div>;

  return (
    <Container className="py-10 max-w-3xl animate-fade-in" maxWidth="md">
      <Typography variant="h4" component="h1" className="font-bold text-slate-800 dark:text-white mb-8" sx={{ fontWeight: 700 }}>
        Edit Job
      </Typography>

      <form onSubmit={onSubmit} className="space-y-6">
        <Card sx={{ boxShadow: 1, borderRadius: 2 }}>
          <CardContent className="space-y-4 p-6">
            <Typography variant="h6" className="font-semibold text-slate-800 dark:text-white border-b border-slate-100 pb-3" sx={{ fontWeight: 600 }}>
              Basic Information
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[['title','Job Title'],['company','Company'],['location','Location'],['salary','Salary']].map(([name, label]) => (
                <TextField key={name} name={name} label={label} value={form[name]} onChange={onChange} fullWidth size="small" required={name !== 'salary'} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: 1, borderRadius: 2 }}>
          <CardContent className="space-y-4 p-6">
            <Typography variant="h6" className="font-semibold text-slate-800 dark:text-white border-b border-slate-100 pb-3" sx={{ fontWeight: 600 }}>
              Classification
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
                size="small"
                fullWidth
                sx={{ maxWidth: 200 }}
              />
            </div>
            <div className="mt-4">
              <FormControlLabel
                control={<Checkbox id="isActive" name="isActive" checked={form.isActive} onChange={onChange} color="primary" />}
                label="Job is active (visible to applicants)"
              />
            </div>
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: 1, borderRadius: 2 }}>
          <CardContent className="space-y-4 p-6">
            <Typography variant="h6" className="font-semibold text-slate-800 dark:text-white border-b border-slate-100 pb-3" sx={{ fontWeight: 600 }}>
              Job Details
            </Typography>
            <div>
              <TextField
                name="description"
                label="Description"
                value={form.description}
                onChange={onChange}
                multiline
                rows={7}
                fullWidth
                required
              />
            </div>
            <div>
              <Typography variant="body2" className="mb-2 text-slate-700">Requirements</Typography>
              <div className="flex gap-2">
                <TextField
                  value={reqInput}
                  onChange={(e) => setReqInput(e.target.value)}
                  onKeyDown={(e) => e.key==='Enter' && (e.preventDefault(), addReq())}
                  placeholder="Add a requirement..."
                  fullWidth
                  size="small"
                />
                <Button type="button" onClick={addReq} variant="outlined" color="primary">Add</Button>
              </div>
              {form.requirements.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.requirements.map((req, i) => (
                    <Chip key={i} label={req} onDelete={() => removeReq(i)} color="primary" variant="outlined" />
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" onClick={() => navigate(`/jobs/${id}`)} variant="outlined" color="inherit" fullWidth sx={{ py: 1.5, textTransform: 'none' }}>Cancel</Button>
          <Button type="submit" disabled={loading} variant="contained" color="primary" fullWidth sx={{ py: 1.5, textTransform: 'none' }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Container>
  );
}
