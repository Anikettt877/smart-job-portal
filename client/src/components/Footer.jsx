import React from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';
import { IconButton, Divider, Typography } from '@mui/material';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-12 pb-6 mt-auto">
      <div className="container-app">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <FiBriefcase className="w-6 h-6 text-indigo-400" />
              SmartHire
            </Link>
            <Typography variant="body2" className="text-slate-400 leading-relaxed max-w-xs">
              A modern job portal connecting talented professionals with top companies. Find your dream job or hire the best talent today.
            </Typography>
            <div className="flex gap-4 mt-4">
              {[FiGithub, FiLinkedin, FiTwitter].map((Icon, i) => (
                <IconButton 
                  key={i} 
                  component="a" 
                  href="#" 
                  className="rounded-lg text-slate-400 hover:bg-slate-800 hover:text-indigo-400 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </IconButton>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <Typography variant="subtitle2" className="text-white font-semibold mb-3">Quick Links</Typography>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/jobs', 'Browse Jobs'], ['/register', 'Create Account'], ['/login', 'Sign In']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-indigo-400 transition-colors">
                    <Typography variant="body2" component="span">{label}</Typography>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Recruiters */}
          <div>
            <Typography variant="subtitle2" className="text-white font-semibold mb-3">For Recruiters</Typography>
            <ul className="space-y-2 text-sm">
              {['/post-job', '/dashboard'].map((to) => (
                <li key={to}>
                  <Link to={to} className="hover:text-indigo-400 transition-colors capitalize">
                    <Typography variant="body2" component="span">{to.replace('/', '').replace('-', ' ')}</Typography>
                  </Link>
                </li>
              ))}
              <li><span className="text-xs bg-indigo-900/50 text-indigo-400 px-2 py-0.5 rounded-full">Register as Recruiter</span></li>
            </ul>
          </div>
        </div>

        <Divider sx={{ borderColor: '#1e293b', mb: 3 }} />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
          <Typography variant="caption">© {new Date().getFullYear()} SmartHire Job Portal. All rights reserved.</Typography>
          <Typography variant="caption">Built using MERN Stack</Typography>
        </div>
      </div>
    </footer>
  );
}
