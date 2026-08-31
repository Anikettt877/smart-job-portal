/**
 * Profile Page
 * View and edit the authenticated user's profile
 * Includes: personal info, skills, bio, contact details
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  FiUser, FiMail, FiMapPin, FiPhone, FiGlobe,
  FiEdit2, FiSave, FiX, FiPlus, FiAward, FiBriefcase,
} from 'react-icons/fi';
import { Card, CardContent, Avatar, Chip, TextField, Button, LinearProgress, Divider, Typography } from '@mui/material';

const SkillInput = ({ skills, onChange }) => {
  const [input, setInput] = useState('');

  const add = () => {
    const t = input.trim();
    if (t && !skills.includes(t) && skills.length < 20) {
      onChange([...skills, t]);
      setInput('');
    }
  };

  const remove = (skill) => onChange(skills.filter((s) => s !== skill));

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <TextField
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="e.g. React, Node.js, Python..."
          className="flex-1"
        />
        <Button variant="outlined" onClick={add} sx={{ minWidth: '40px', px: 2 }}>
          <FiPlus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Chip
            key={skill}
            label={skill}
            onDelete={() => remove(skill)}
            color="primary"
            variant="outlined"
            size="small"
          />
        ))}
        {skills.length === 0 && (
          <Typography variant="caption" className="text-slate-400 italic">Add skills to improve your profile visibility.</Typography>
        )}
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value, color = 'primary.main', bgcolor = 'primary.50' }) => (
  <div className="flex items-center gap-3">
    <Avatar sx={{ width: 36, height: 36, bgcolor: bgcolor, color: color }} variant="rounded">
      <Icon className="w-4 h-4" />
    </Avatar>
    <div className="min-w-0">
      <Typography variant="overline" display="block" className="text-slate-400 tracking-wide font-medium" sx={{ lineHeight: 1 }}>{label}</Typography>
      <Typography variant="body2" className="font-medium text-slate-700 dark:text-slate-200 truncate">
        {value || <span className="italic text-slate-400">Not provided</span>}
      </Typography>
    </div>
  </div>
);

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);

  const [form, setForm] = useState({
    name:     user?.name     || '',
    bio:      user?.bio      || '',
    skills:   user?.skills   || [],
    location: user?.location || '',
    phone:    user?.phone    || '',
    website:  user?.website  || '',
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name cannot be empty.'); return; }
    try {
      setSaving(true);
      const { data } = await authAPI.updateProfile(form);
      updateUser(data.user);
      toast.success('Profile updated successfully.');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    setForm({
      name: user?.name || '', bio: user?.bio || '', skills: user?.skills || [],
      location: user?.location || '', phone: user?.phone || '', website: user?.website || '',
    });
    setEditing(false);
  };

  const roleBadge = {
    admin:     { label: 'Admin',      color: 'secondary' },
    recruiter: { label: 'Recruiter',  color: 'info' },
    user:      { label: 'Job Seeker', color: 'success' },
  }[user?.role] || { label: 'User', color: 'default' };

  const fields = [user?.bio, user?.skills?.length, user?.location, user?.phone, user?.website];
  const score  = Math.round((fields.filter(Boolean).length / fields.length) * 100);

  return (
    <div className="container-app py-10 max-w-4xl animate-fade-in">
      <Typography variant="h4" className="font-bold text-slate-800 dark:text-white mb-8">My Profile</Typography>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-5">
          <Card className="text-center">
            <CardContent>
              <Avatar
                sx={{
                  width: 96,
                  height: 96,
                  fontSize: '2.5rem',
                  mx: 'auto',
                  mb: 2,
                  background: 'linear-gradient(to bottom right, #6366f1, #7c3aed)',
                  boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.2)'
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6" className="font-bold text-slate-800 dark:text-white">{user?.name}</Typography>
              <Typography variant="body2" className="text-slate-500 mb-2">{user?.email}</Typography>
              <Chip label={roleBadge.label} color={roleBadge.color} size="small" sx={{ fontWeight: 'bold' }} />
              <Typography variant="caption" display="block" className="text-slate-400 mt-3">
                Member since {new Date(user?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <Typography variant="subtitle2" className="font-semibold text-slate-700 dark:text-white">Profile Strength</Typography>
                <Typography variant="subtitle2" className={`font-bold ${score === 100 ? 'text-emerald-600' : score >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                  {score}%
                </Typography>
              </div>
              <LinearProgress
                variant="determinate"
                value={score}
                color={score === 100 ? "success" : score >= 60 ? "warning" : "error"}
                sx={{ height: 8, borderRadius: 4 }}
              />
              {score < 100 && (
                <Typography variant="caption" display="block" className="text-slate-400 mt-2">
                  {!user?.bio && '• Add a bio  '}
                  {!user?.location && '• Add location  '}
                  {!user?.phone && '• Add phone  '}
                  {!user?.skills?.length && '• Add skills'}
                </Typography>
              )}
            </CardContent>
          </Card>

          {!editing && (
            <Card>
              <CardContent className="space-y-4">
                <InfoRow icon={FiMail}    label="Email"    value={user?.email} />
                <InfoRow icon={FiMapPin}  label="Location" value={user?.location} color="#f43f5e" bgcolor="#fff1f2" />
                <InfoRow icon={FiPhone}   label="Phone"    value={user?.phone}    color="#10b981" bgcolor="#ecfdf5" />
                {user?.website && (
                  <div className="flex items-center gap-3">
                    <Avatar sx={{ width: 36, height: 36, bgcolor: '#f5f3ff', color: '#8b5cf6' }} variant="rounded">
                      <FiGlobe className="w-4 h-4" />
                    </Avatar>
                    <div className="min-w-0">
                      <Typography variant="overline" display="block" className="text-slate-400 tracking-wide font-medium" sx={{ lineHeight: 1 }}>Website</Typography>
                      <a href={user.website} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-medium text-indigo-600 hover:underline truncate block">{user.website}</a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="flex justify-end">
            {!editing ? (
              <Button variant="contained" onClick={() => setEditing(true)} startIcon={<FiEdit2 className="w-4 h-4" />}>
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outlined" onClick={onCancel} startIcon={<FiX className="w-4 h-4" />}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={onSave} disabled={saving} startIcon={!saving && <FiSave className="w-4 h-4" />}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>

          {!editing ? (
            <>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                    <FiUser className="w-4 h-4 text-indigo-500" /> About Me
                  </Typography>
                  {user?.bio ? (
                    <Typography variant="body2" className="text-slate-600 dark:text-slate-300 leading-relaxed">{user.bio}</Typography>
                  ) : (
                    <Typography variant="body2" className="text-slate-400 italic">No bio added yet. Click "Edit Profile" to add one.</Typography>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="subtitle1" className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <FiAward className="w-4 h-4 text-indigo-500" /> Skills & Expertise
                  </Typography>
                  {user?.skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill) => (
                        <Chip key={skill} label={skill} color="primary" variant="outlined" size="small" className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" />
                      ))}
                    </div>
                  ) : (
                    <Typography variant="body2" className="text-slate-400 italic">No skills added yet. Skills help recruiters find you!</Typography>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="subtitle1" className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <FiBriefcase className="w-4 h-4 text-indigo-500" /> Account Details
                  </Typography>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Account Role</span>
                      <Chip label={roleBadge.label} color={roleBadge.color} size="small" sx={{ fontWeight: 'bold' }} />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Member Since</span>
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {new Date(user?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <form onSubmit={onSave} className="space-y-5">
              <Card>
                <CardContent className="space-y-4">
                  <Typography variant="subtitle1" className="font-semibold text-slate-800 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-700">
                    Personal Information
                  </Typography>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Typography variant="caption" className="font-medium mb-1 block">Full Name <span className="text-red-500">*</span></Typography>
                      <TextField fullWidth size="small" name="name" value={form.name} onChange={onChange} placeholder="Your full name" required />
                    </div>

                    <div>
                      <Typography variant="caption" className="font-medium mb-1 block">Location</Typography>
                      <TextField fullWidth size="small" name="location" value={form.location} onChange={onChange} placeholder="e.g. Mumbai, India" />
                    </div>

                    <div>
                      <Typography variant="caption" className="font-medium mb-1 block">Phone Number</Typography>
                      <TextField fullWidth size="small" name="phone" value={form.phone} onChange={onChange} placeholder="+91 98765 43210" />
                    </div>

                    <div>
                      <Typography variant="caption" className="font-medium mb-1 block">Website / Portfolio</Typography>
                      <TextField fullWidth size="small" name="website" value={form.website} onChange={onChange} placeholder="https://yourportfolio.com" />
                    </div>
                  </div>

                  <div>
                    <Typography variant="caption" className="font-medium mb-1 block">Bio</Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      name="bio"
                      value={form.bio}
                      onChange={onChange}
                      placeholder="Tell recruiters about yourself — your experience, goals, and what makes you unique..."
                      inputProps={{ maxLength: 300 }}
                    />
                    <Typography variant="caption" className="text-slate-400 mt-1 block">{form.bio.length}/300 characters</Typography>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="subtitle1" className="font-semibold text-slate-800 dark:text-white pb-3 mb-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
                    <FiAward className="w-4 h-4 text-indigo-500" /> Skills
                  </Typography>
                  <SkillInput skills={form.skills} onChange={(updated) => setForm({ ...form, skills: updated })} />
                  <Typography variant="caption" className="text-slate-400 mt-2 block">Press Enter or click + to add a skill. Max 20 skills.</Typography>
                </CardContent>
              </Card>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
