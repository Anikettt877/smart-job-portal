import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiBriefcase, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Card, CardContent, TextField, Button, Avatar, IconButton, InputAdornment, Box } from '@mui/material';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]         = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      const res = err.response?.data;
      if (res?.requiresVerification) {
        toast.error('Please verify your email first.');
        navigate('/verify-email', { state: { userId: res.userId, email: form.email } });
        return;
      }
      toast.error(res?.message || 'Login failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8 flex flex-col items-center">
          <Avatar sx={{ bgcolor: 'primary.main', mb: 2, width: 56, height: 56, boxShadow: 3 }}>
            <FiBriefcase size={28} />
          </Avatar>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back!</h1>
          <p className="text-slate-500 mt-1 text-sm">Sign in to your SmartHire account</p>
        </div>

        <Card elevation={3} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={onSubmit} className="space-y-5">
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
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-slate-700 mb-0">Password</label>
                  <Link to="/forgot-password" className="text-xs text-indigo-600 hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                <TextField
                  fullWidth
                  size="small"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={onChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiLock className="text-slate-400" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPass(!showPass)}
                          edge="end"
                          size="small"
                        >
                          {showPass ? <FiEyeOff /> : <FiEye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ py: 1.5, textTransform: 'none', fontSize: '1rem', borderRadius: 2 }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-500 mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Create one free</Link>
        </p>
      </div>
    </div>
  );
}