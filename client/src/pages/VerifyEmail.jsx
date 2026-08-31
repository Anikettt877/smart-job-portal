import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import toast from 'react-hot-toast';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, TextField, Button, Avatar, Box } from '@mui/material';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;
  const email  = location.state?.email;

  const { setAuth } = useAuth();
  const [otp,       setOtp]       = useState(['', '', '', '', '', '']);
  const [loading,   setLoading]   = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputs = useRef([]);

  useEffect(() => { if (!userId) navigate('/register'); }, [userId, navigate]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      inputs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split('')); inputs.current[5]?.focus(); }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) { toast.error('Enter the complete 6-digit OTP.'); return; }
    try {
      setLoading(true);
      const { data } = await axiosInstance.post('/auth/verify-email', { userId, otp: otpString });
      setAuth({ user: data.user, token: data.token });
      toast.success(data.message);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed.');
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      await axiosInstance.post('/auth/resend-otp', { userId });
      toast.success('New OTP sent!');
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } catch (err) {
      toast.error('Failed to resend OTP.');
    } finally { setResending(false); }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8 flex flex-col items-center">
          <Avatar sx={{ bgcolor: 'primary.100', color: 'primary.main', mb: 2, width: 64, height: 64 }}>
            <FiMail size={32} />
          </Avatar>
          <h1 className="text-2xl font-bold text-slate-800">Verify Your Email</h1>
          <p className="text-slate-500 mt-2 text-sm">
            OTP sent to <span className="font-semibold text-indigo-600">{email}</span>
          </p>
        </div>

        <Card elevation={3} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box className="flex gap-2 sm:gap-3 justify-center mb-6" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  inputRef={(el) => (inputs.current[index] = el)}
                  variant="outlined"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  inputProps={{
                    inputMode: 'numeric',
                    maxLength: 1,
                    sx: {
                      textAlign: 'center',
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      p: 1.5,
                      width: '1.5rem',
                      height: '1.5rem',
                      bgcolor: digit ? 'primary.50' : 'background.paper',
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: digit ? 'primary.400' : 'divider',
                        borderWidth: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />
              ))}
            </Box>

            <Button 
              onClick={handleVerify} 
              disabled={loading || otp.join('').length !== 6} 
              variant="contained"
              fullWidth
              sx={{ py: 1.5, textTransform: 'none', fontSize: '1rem', borderRadius: 2, mb: 3 }}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>

            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-slate-500">Resend in <span className="font-bold text-indigo-600">{countdown}s</span></p>
              ) : (
                <Button 
                  onClick={handleResend} 
                  disabled={resending} 
                  color="primary"
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  {resending ? 'Sending...' : 'Resend OTP'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={() => navigate('/register')} 
          startIcon={<FiArrowLeft />}
          sx={{ mt: 3, mx: 'auto', display: 'flex', color: 'text.secondary', textTransform: 'none' }}
        >
          Back to Register
        </Button>
      </div>
    </div>
  );
}