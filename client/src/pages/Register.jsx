import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiBriefcase, FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { 
  Card, CardContent, TextField, Button, Avatar, 
  IconButton, InputAdornment, ToggleButtonGroup, ToggleButton, LinearProgress, Box
} from '@mui/material';

const ROLES = [
  { value: 'user',      label: 'Job Seeker',  desc: 'Browse and apply to jobs' },
  { value: 'recruiter', label: 'Recruiter',   desc: 'Post jobs and hire talent' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleRoleChange = (e, newRole) => {
    if (newRole !== null) {
      setForm({ ...form, role: newRole });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill in all fields.'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    try {
      setLoading(true);
      const data = await register(form);
      navigate('/verify-email', { state: { userId: data.userId, email: data.email || form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const passwordStrength = Math.min((form.password.length / 9) * 100, 100);
  let progressColor = 'error';
  if (form.password.length >= 6) progressColor = 'warning';
  if (form.password.length >= 9) progressColor = 'success';

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8 flex flex-col items-center">
          <Avatar sx={{ bgcolor: 'primary.main', mb: 2, width: 56, height: 56, boxShadow: 3 }}>
            <FiBriefcase size={28} />
          </Avatar>
          <h1 className="text-2xl font-bold text-slate-800">Create your account</h1>
          <p className="text-slate-500 mt-1 text-sm">Join SmartHire — it's free!</p>
        </div>

        <Card elevation={3} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={onSubmit} className="space-y-5">

              {/* Role Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">I am a...</label>
                <ToggleButtonGroup
                  value={form.role}
                  exclusive
                  onChange={handleRoleChange}
                  fullWidth
                  sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, '& .MuiToggleButtonGroup-grouped': { border: 0, '&:not(:first-of-type)': { borderRadius: 2 }, '&:first-of-type': { borderRadius: 2 } } }}
                >
                  {ROLES.map(({ value, label, desc }) => (
                    <ToggleButton
                      key={value}
                      value={value}
                      sx={{
                        p: 2,
                        textTransform: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        border: '1px solid',
                        borderColor: form.role === value ? 'primary.main' : 'divider',
                        bgcolor: form.role === value ? 'primary.50' : 'background.paper',
                        '&.Mui-selected, &.Mui-selected:hover': {
                          bgcolor: 'primary.50',
                          borderColor: 'primary.main',
                        }
                      }}
                    >
                      <span className="text-sm font-semibold text-slate-700">{label}</span>
                      <span className="text-xs text-slate-500 mt-0.5">{desc}</span>
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <TextField
                  fullWidth
                  size="small"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={onChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiUser className="text-slate-400" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <TextField
                  fullWidth
                  size="small"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={onChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiMail className="text-slate-400" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <TextField
                  fullWidth
                  size="small"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={onChange}
                  required
                  inputProps={{ minLength: 6 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiLock className="text-slate-400" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPass(!showPass)} edge="end" size="small">
                          {showPass ? <FiEyeOff /> : <FiEye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {/* Password strength */}
                <Box sx={{ mt: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={passwordStrength} 
                    color={progressColor}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ py: 1.5, textTransform: 'none', fontSize: '1rem', borderRadius: 2 }}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}