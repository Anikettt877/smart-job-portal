import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import toast from 'react-hot-toast';
import { FiLock, FiEye, FiEyeOff, FiMail } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, TextField, Button, Avatar, IconButton, InputAdornment } from '@mui/material';

export default function ResetPassword() {
  const navigate   = useNavigate();
  const { setAuth } = useAuth();
  const [form,     setForm]     = useState({ email: '', otp: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match.'); return; }
    if (!form.email || !form.otp) { toast.error('Email and OTP are required.'); return; }
    try {
      setLoading(true);
      const { data } = await axiosInstance.put('/auth/reset-password', {
        email: form.email,
        otp: form.otp,
        password: form.password,
      });
      setAuth({ user: data.user, token: data.token });
      toast.success('Password reset successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. OTP may have expired.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8 flex flex-col items-center">
          <Avatar sx={{ bgcolor: 'primary.100', color: 'primary.main', mb: 2, width: 64, height: 64 }}>
            <FiLock size={32} />
          </Avatar>
          <h1 className="text-2xl font-bold text-slate-800">Set New Password</h1>
        </div>

        <Card elevation={3} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <TextField
                  fullWidth
                  size="small"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
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
                <label className="block text-sm font-medium text-slate-700 mb-1">OTP</label>
                <TextField
                  fullWidth
                  size="small"
                  type="text"
                  value={form.otp}
                  onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  placeholder="6-digit code"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiLock className="text-slate-400" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <TextField
                  fullWidth
                  size="small"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 6 characters"
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
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                <TextField
                  fullWidth
                  size="small"
                  type={showPass ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  placeholder="Re-enter password"
                  required
                  error={Boolean(form.confirm && form.password !== form.confirm)}
                  helperText={form.confirm && form.password !== form.confirm ? "Passwords do not match" : ""}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiLock className="text-slate-400" />
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
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Link to="/login" className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 mx-auto mt-5 justify-center">
          Back to Login
        </Link>
      </div>
    </div>
  );
}