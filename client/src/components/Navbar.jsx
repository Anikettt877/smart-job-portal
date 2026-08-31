/**
 * Navbar Component
 * Responsive navigation with role-aware links and dark-mode toggle
 */

import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiBriefcase, FiMenu, FiX, FiChevronDown,
  FiUser, FiLogOut, FiLayout, FiMoon, FiSun, FiFileText,
} from 'react-icons/fi';
import { 
  AppBar, Toolbar, IconButton, Avatar, Menu, MenuItem, Drawer, 
  Button, Tooltip, Divider, Typography, Box
} from '@mui/material';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen,    setMenuOpen]    = useState(false);
  const [anchorEl,    setAnchorEl]    = useState(null);
  const [darkMode,    setDarkMode]    = useState(() => localStorage.getItem('theme') === 'dark');
  const [scrolled,    setScrolled]    = useState(false);

  const dropOpen = Boolean(anchorEl);

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Navbar shadow on scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = () => { 
    logout(); 
    navigate('/'); 
    setAnchorEl(null); 
    setMenuOpen(false); 
  };

  const navLinkCls = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-150 no-underline ${isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'}`;

  const roleLabel = { admin: 'Admin', recruiter: 'Recruiter', user: 'Seeker' };

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={scrolled ? 4 : 0}
        sx={{
          backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid',
          borderColor: darkMode ? 'rgba(30, 41, 59, 1)' : 'rgba(241, 245, 249, 1)',
          color: 'inherit',
          transition: 'box-shadow 0.2s',
        }}
      >
        <div className="container-app w-full max-w-7xl mx-auto px-4">
          <Toolbar disableGutters className="h-16 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600 no-underline">
              <FiBriefcase className="w-6 h-6" />
              <span>Smart<span className="text-slate-800 dark:text-white">Hire</span></span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/" className={navLinkCls}>Home</NavLink>
              <NavLink to="/jobs" className={navLinkCls}>Browse Jobs</NavLink>
              {isAuthenticated && user?.role === 'recruiter' && (
                <NavLink to="/post-job" className={navLinkCls}>Post a Job</NavLink>
              )}
              {isAuthenticated && user?.role === 'user' && (
                <NavLink to="/applications" className={navLinkCls}>My Applications</NavLink>
              )}
              <NavLink to="/dashboard" className={navLinkCls}>Dashboard</NavLink>
            </nav>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              {/* Dark mode */}
              <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
                <IconButton onClick={() => setDarkMode(!darkMode)} className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors">
                  {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                </IconButton>
              </Tooltip>

              {isAuthenticated ? (
                <>
                  <Button 
                    onClick={(e) => setAnchorEl(e.currentTarget)} 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-slate-700 transition-colors normal-case"
                    disableRipple
                  >
                    <Avatar sx={{ width: 28, height: 28, bgcolor: '#4f46e5', fontSize: '0.875rem', fontWeight: 'bold' }}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[120px] truncate">{user?.name}</span>
                    <FiChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                  </Button>

                  <Menu
                    anchorEl={anchorEl}
                    open={dropOpen}
                    onClose={() => setAnchorEl(null)}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                        mt: 1.5,
                        width: 220,
                        borderRadius: 3,
                        backgroundColor: darkMode ? '#1e293b' : '#fff',
                      }
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <Box px={2} py={1}>
                      <Typography variant="caption" className="text-slate-500 dark:text-slate-400">Signed in as</Typography>
                      <Typography variant="body2" className="font-semibold text-slate-800 dark:text-white truncate block">{user?.email}</Typography>
                      <Typography variant="caption" className="text-indigo-600 font-medium block">{roleLabel[user?.role]}</Typography>
                    </Box>
                    <Divider sx={{ my: 1, borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }} />
                    <MenuItem component={Link} to="/dashboard" onClick={() => setAnchorEl(null)} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600">
                      <FiLayout className="w-4 h-4" /> Dashboard
                    </MenuItem>
                    <MenuItem component={Link} to="/profile" onClick={() => setAnchorEl(null)} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600">
                      <FiUser className="w-4 h-4" /> Profile
                    </MenuItem>
                    {user?.role === 'user' && (
                      <MenuItem component={Link} to="/applications" onClick={() => setAnchorEl(null)} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600">
                        <FiFileText className="w-4 h-4" /> My Applications
                      </MenuItem>
                    )}
                    <Divider sx={{ my: 1, borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }} />
                    <MenuItem onClick={handleLogout} className="flex items-center gap-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <FiLogOut className="w-4 h-4" /> Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button component={Link} to="/login" variant="outlined" sx={{ textTransform: 'none', borderRadius: 2 }}>Log In</Button>
                  <Button component={Link} to="/register" variant="contained" sx={{ textTransform: 'none', borderRadius: 2, bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' } }}>Sign Up</Button>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <Tooltip title="Menu">
              <IconButton onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-slate-600">
                <FiMenu className="w-6 h-6" />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </div>
      </AppBar>

      {/* Mobile menu Drawer */}
      <Drawer
        anchor="top"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        PaperProps={{
          sx: {
            top: '64px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            backgroundColor: darkMode ? '#0f172a' : '#ffffff',
            borderBottom: '1px solid',
            borderColor: darkMode ? '#1e293b' : '#f1f5f9',
          }
        }}
        hideBackdrop
      >
        <Box px={2} pb={2} pt={1}>
          <nav className="flex flex-col gap-1">
            {[
              { to: '/',            label: 'Home' },
              { to: '/jobs',        label: 'Browse Jobs' },
              { to: '/dashboard',   label: 'Dashboard', auth: true },
              { to: '/post-job',    label: 'Post a Job',       roles: ['recruiter','admin'] },
              { to: '/applications',label: 'My Applications',  roles: ['user'] },
              { to: '/profile',     label: 'Profile',          auth: true },
            ].map(({ to, label, auth, roles: r }) => {
              if (auth  && !isAuthenticated)        return null;
              if (r && (!isAuthenticated || !r.includes(user?.role))) return null;
              return (
                <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors no-underline ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
                  {label}
                </NavLink>
              );
            })}
            
            <Box mt={2} pt={2} borderTop={1} borderColor={darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}>
              {isAuthenticated ? (
                <Button onClick={handleLogout} variant="contained" color="error" fullWidth sx={{ textTransform: 'none', borderRadius: 2 }}>
                  Logout
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button component={Link} to="/login" onClick={() => setMenuOpen(false)} variant="outlined" fullWidth sx={{ textTransform: 'none', borderRadius: 2 }}>Log In</Button>
                  <Button component={Link} to="/register" onClick={() => setMenuOpen(false)} variant="contained" fullWidth sx={{ textTransform: 'none', borderRadius: 2, bgcolor: '#4f46e5' }}>Sign Up</Button>
                </div>
              )}
            </Box>
            
            <Box mt={2} display="flex" justifyContent="center">
              <Button 
                onClick={() => setDarkMode(!darkMode)} 
                startIcon={darkMode ? <FiSun /> : <FiMoon />}
                variant="text" 
                color="inherit"
                sx={{ textTransform: 'none', color: darkMode ? '#cbd5e1' : '#64748b' }}
              >
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </Box>
          </nav>
        </Box>
      </Drawer>
    </>
  );
}
