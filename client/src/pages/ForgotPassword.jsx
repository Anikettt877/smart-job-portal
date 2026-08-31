import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import toast from 'react-hot-toast';
import { FiMail, FiArrowLeft, FiSend } from 'react-icons/fi';
import { Card, CardContent, TextField, Button, Avatar, InputAdornment } from '@mui/material';

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axiosInstance.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8 flex flex-col items-center">
          <Avatar sx={{ bgcolor: 'primary.100', color: 'primary.main', mb: 2, width: 64, height: 64 }}>
            <FiMail size={32} />
          </Avatar>
          <h1 className="text-2xl font-bold text-slate-800">Forgot Password?</h1>
          <p className="text-slate-500 mt-2 text-sm">Enter your email and we'll send a reset OTP.</p>
        </div>

        <Card elevation={3} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {sent ? (
              <div className="text-center py-4">
                <FiSend className="w-12 h-12 mx-auto mb-4 text-indigo-500" />
                <h3 className="font-bold text-slate-800 text-lg mb-2">Check Your Email!</h3>
                <p className="text-slate-500 text-sm mb-4">Reset OTP sent to <span className="font-semibold text-indigo-600">{email}</span></p>
                <p className="text-xs text-slate-400">OTP expires in 15 minutes.</p>
                <Button 
                  onClick={() => setSent(false)} 
                  variant="outlined" 
                  fullWidth 
                  sx={{ mt: 3, py: 1.5, textTransform: 'none', borderRadius: 2 }}
                >
                  Try different email
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <TextField
                    fullWidth
                    size="small"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{ py: 1.5, textTransform: 'none', fontSize: '1rem', borderRadius: 2, display: 'flex', gap: 1 }}
                >
                  {loading ? 'Sending...' : <><FiSend /> Send Reset OTP</>}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
        
        {sent && (
          <Button 
            component={Link} 
            to="/reset-password"
            variant="outlined"
            fullWidth
            sx={{ mt: 3, py: 1.5, textTransform: 'none', borderRadius: 2, bgcolor: 'white' }}
          >
            Enter OTP and reset password
          </Button>
        )}

        <Link to="/login" className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 mx-auto mt-5 justify-center">
          <FiArrowLeft className="w-4 h-4" /> Back to Login
        </Link>
      </div>
    </div>
  );
}