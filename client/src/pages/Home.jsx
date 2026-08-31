import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiSearch, FiBriefcase, FiUsers, FiTrendingUp,
  FiShield, FiZap, FiGlobe, FiArrowRight, FiCheckCircle, FiGrid,
} from 'react-icons/fi';
import {
  Container, TextField, InputAdornment, Button, Chip, Card, CardContent,
  Avatar, Typography
} from '@mui/material';

// ── Stats data ────────────────────────────────────────────────────────────────
const STATS = [
  { icon: FiBriefcase, value: '10,000+', label: 'Jobs Posted' },
  { icon: FiUsers,     value: '50,000+', label: 'Registered Users' },
  { icon: FiTrendingUp,value: '8,500+',  label: 'Successful Hires' },
  { icon: FiGlobe,     value: '200+',    label: 'Companies' },
];

const FEATURES = [
  { icon: FiZap,    title: 'Instant Apply',       desc: 'Apply to jobs with a single click. No lengthy forms.' },
  { icon: FiShield, title: 'Verified Companies',  desc: 'Every recruiter account is reviewed before posting.' },
  { icon: FiSearch, title: 'Smart Search',         desc: 'Filter by type, location, salary, and experience level.' },
  { icon: FiUsers,  title: 'Role-Based Portal',   desc: 'Separate dashboards for Job Seekers and Recruiters.' },
];

const CATEGORIES = [
  { label: 'Technology' },
  { label: 'Design' },
  { label: 'Marketing' },
  { label: 'Finance' },
  { label: 'Healthcare' },
  { label: 'Engineering' },
  { label: 'Education' },
  { label: 'HR' },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs${query ? `?search=${encodeURIComponent(query)}` : ''}`);
  };

  return (
    <div className="animate-fade-in">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-800/40 rounded-full blur-3xl" />

        <Container className="relative z-10 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full border border-white/20 mb-6 font-medium">
              Trusted Platform for Smarter Hiring
            </span>
            <Typography variant="h2" component="h1" className="font-extrabold leading-tight mb-6 tracking-tight text-white" sx={{ fontWeight: 800, fontSize: { xs: '2.25rem', md: '3.75rem' } }}>
              Connect Talent with{' '}
              <span className="text-yellow-300">Opportunity</span>
            </Typography>
            <Typography className="text-indigo-100 mb-10 leading-relaxed max-w-xl mx-auto" sx={{ fontSize: { xs: '1.125rem', md: '1.25rem' } }}>
              Discover thousands of jobs from top companies, or post a listing and find your perfect hire — all in one place.
            </Typography>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex gap-3 max-w-xl mx-auto items-center">
              <TextField
                variant="outlined"
                placeholder="Search jobs, companies, or keywords..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                fullWidth
                sx={{ backgroundColor: 'white', borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiSearch className="text-slate-400 w-5 h-5" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: '#facc15', color: '#0f172a', fontWeight: 'bold', py: 1.8, px: 4, borderRadius: 2, textTransform: 'none',
                  '&:hover': { bgcolor: '#fde047' }, boxShadow: 3, whiteSpace: 'nowrap'
                }}
              >
                Search Jobs
              </Button>
            </form>

            {/* Quick links */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {['Remote', 'Full-time', 'Internship', 'Senior Level'].map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => navigate(`/jobs?jobType=${tag}`)}
                  sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.1)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}
                  variant="outlined"
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-800 border-y border-slate-100 dark:border-slate-700">
        <Container className="py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Avatar sx={{ bgcolor: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', width: 48, height: 48, borderRadius: 4 }}>
                  <Icon className="w-6 h-6" />
                </Avatar>
                <Typography variant="h5" component="p" className="font-extrabold text-slate-800 dark:text-white" sx={{ fontWeight: 800 }}>
                  {value}
                </Typography>
                <Typography variant="body2" className="text-slate-500 dark:text-slate-400">
                  {label}
                </Typography>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Categories ────────────────────────────────────────────────────── */}
      <section className="py-16">
        <Container>
          <div className="text-center mb-10">
            <Typography variant="h4" component="h2" className="font-bold text-slate-800 dark:text-white mb-3" sx={{ fontWeight: 700 }}>
              Browse by Category
            </Typography>
            <Typography className="text-slate-500 dark:text-slate-400">
              Explore opportunities in your field
            </Typography>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map(({ label }) => (
              <Card
                key={label}
                component={Link}
                to={`/jobs?category=${label}`}
                className="text-center group transition-all duration-200"
                sx={{
                  textDecoration: 'none', borderRadius: 3, boxShadow: 'none', border: '1px solid #e2e8f0', backgroundColor: 'transparent',
                  '&:hover': { borderColor: '#c7d2fe', boxShadow: '0 4px 6px -1px rgba(199, 210, 254, 0.5)' }
                }}
              >
                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                  <Avatar sx={{ bgcolor: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', width: 48, height: 48, borderRadius: 3, mx: 'auto', mb: 2 }}>
                    <FiGrid className="w-5 h-5" />
                  </Avatar>
                  <Typography variant="body2" className="font-semibold text-slate-700 dark:text-white group-hover:text-indigo-600 transition-colors" sx={{ fontWeight: 600 }}>
                    {label}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="bg-indigo-50 dark:bg-slate-800/50 py-16">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h4" component="h2" className="font-bold text-slate-800 dark:text-white mb-3" sx={{ fontWeight: 700 }}>
              Why SmartHire?
            </Typography>
            <Typography className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              We build tools that make job hunting and hiring faster, smarter, and fairer.
            </Typography>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="text-center transition-all" sx={{ backgroundColor: 'transparent', borderRadius: 3, border: '1px solid transparent', '&:hover': { borderColor: '#c7d2fe' }, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Avatar sx={{ bgcolor: 'rgba(79, 70, 229, 0.15)', color: '#4f46e5', width: 48, height: 48, borderRadius: 3, mx: 'auto', mb: 2 }}>
                    <Icon className="w-6 h-6" />
                  </Avatar>
                  <Typography variant="subtitle1" component="h3" className="font-semibold text-slate-800 dark:text-white mb-2" sx={{ fontWeight: 600 }}>
                    {title}
                  </Typography>
                  <Typography variant="body2" className="text-slate-500 dark:text-slate-400">
                    {desc}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-16">
        <Container>
          <div className="grid md:grid-cols-2 gap-6">
            {/* For Job Seekers */}
            <Card className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white border-none" sx={{ borderRadius: 4, boxShadow: 3 }}>
              <CardContent sx={{ p: 4, '&:last-child': { pb: 4 } }}>
                <Typography variant="h5" component="h3" className="font-bold mb-3" sx={{ fontWeight: 700, color: 'white' }}>
                  Looking for a Job?
                </Typography>
                <ul className="space-y-2 text-indigo-100 text-sm mb-6">
                  {['Browse thousands of openings', 'One-click apply', 'Track your applications'].map(item => (
                    <li key={item} className="flex items-center gap-2"><FiCheckCircle className="w-4 h-4 text-yellow-300 flex-shrink-0" />{item}</li>
                  ))}
                </ul>
                <Button
                  component={Link}
                  to="/jobs"
                  variant="contained"
                  sx={{ bgcolor: 'white', color: '#4338ca', fontWeight: 'bold', borderRadius: 3, textTransform: 'none', px: 3, py: 1, '&:hover': { bgcolor: '#fefce8' } }}
                  endIcon={<FiArrowRight />}
                >
                  Find Jobs
                </Button>
              </CardContent>
            </Card>

            {/* For Recruiters */}
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-none" sx={{ borderRadius: 4, boxShadow: 3 }}>
              <CardContent sx={{ p: 4, '&:last-child': { pb: 4 } }}>
                <Typography variant="h5" component="h3" className="font-bold mb-3" sx={{ fontWeight: 700, color: 'white' }}>
                  Hiring Talent?
                </Typography>
                <ul className="space-y-2 text-slate-300 text-sm mb-6">
                  {['Post jobs for free', 'Manage applicants easily', 'Find the right candidate fast'].map(item => (
                    <li key={item} className="flex items-center gap-2"><FiCheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />{item}</li>
                  ))}
                </ul>
                <Button
                  component={Link}
                  to={isAuthenticated ? '/post-job' : '/register'}
                  variant="contained"
                  sx={{ bgcolor: '#4f46e5', color: 'white', fontWeight: 'bold', borderRadius: 3, textTransform: 'none', px: 3, py: 1, '&:hover': { bgcolor: '#6366f1' } }}
                  endIcon={<FiArrowRight />}
                >
                  Post a Job
                </Button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}
