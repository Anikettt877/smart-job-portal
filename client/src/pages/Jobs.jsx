import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobAPI } from '../services/api';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';
import { FiSearch, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import {
  Container, TextField, InputAdornment, Button, IconButton,
  FormControl, InputLabel, Select, MenuItem, Chip, Pagination,
  Typography, Card, CardContent
} from '@mui/material';

const JOB_TYPES    = ['Full-time', 'Part-time', 'Remote', 'Internship', 'Contract'];
const CATEGORIES   = ['Technology','Design','Marketing','Sales','Finance','Healthcare','Education','Engineering','HR','Other'];
const EXP_LEVELS   = ['Entry Level','Mid Level','Senior Level','Executive'];

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs,       setJobs]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total,      setTotal]      = useState(0);

  const [filters, setFilters] = useState({
    search:          searchParams.get('search')          || '',
    location:        searchParams.get('location')        || '',
    jobType:         searchParams.get('jobType')         || '',
    category:        searchParams.get('category')        || '',
    experienceLevel: searchParams.get('experienceLevel') || '',
    page:            parseInt(searchParams.get('page'))  || 1,
  });

  const [showFilters, setShowFilters] = useState(false);

  // ── Fetch jobs ─────────────────────────────────────────────────────────────
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      // Remove empty params
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '' && v !== 0));
      const { data } = await jobAPI.getAll(params);
      setJobs(data.jobs);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      toast.error('Failed to fetch jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  // Sync filters to URL params
  useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  const clearFilters = () => setFilters({ search:'', location:'', jobType:'', category:'', experienceLevel:'', page:1 });
  const hasActiveFilters = filters.jobType || filters.category || filters.experienceLevel || filters.location;

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (event, value) => {
    setFilters((prev) => ({ ...prev, page: value }));
  };

  return (
    <Container className="py-10 animate-fade-in" maxWidth="lg">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="h4" component="h1" className="font-bold text-slate-800 dark:text-white mb-1" sx={{ fontWeight: 700 }}>
          Find Your Next Job
        </Typography>
        <Typography className="text-slate-500 dark:text-slate-400">
          {loading ? 'Searching...' : `${total.toLocaleString()} job${total !== 1 ? 's' : ''} found`}
        </Typography>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
        <TextField
          variant="outlined"
          placeholder="Job title, keyword, or company..."
          value={filters.search}
          onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FiSearch className="text-slate-400 w-5 h-5" />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, bgcolor: 'background.paper' }}
        />
        <TextField
          variant="outlined"
          placeholder="Location..."
          value={filters.location}
          onChange={(e) => updateFilter('location', e.target.value)}
          size="small"
          sx={{ width: { xs: '100%', sm: 160 }, bgcolor: 'background.paper', display: { xs: 'none', sm: 'block' } }}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ px: 3, textTransform: 'none' }}>
          Search
        </Button>
        <Button
          type="button"
          variant={hasActiveFilters ? "contained" : "outlined"}
          color={hasActiveFilters ? "primary" : "inherit"}
          onClick={() => setShowFilters(!showFilters)}
          sx={{ textTransform: 'none', minWidth: 48, px: 2 }}
        >
          <FiFilter className="w-4 h-4" />
        </Button>
      </form>

      {/* Filter panel */}
      {showFilters && (
        <Card className="mb-6 animate-slide-up" sx={{ boxShadow: 1, borderRadius: 2 }}>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4">
            {/* Job Type */}
            <FormControl fullWidth size="small">
              <InputLabel>Job Type</InputLabel>
              <Select
                value={filters.jobType}
                label="Job Type"
                onChange={(e) => updateFilter('jobType', e.target.value)}
              >
                <MenuItem value=""><em>All Types</em></MenuItem>
                {JOB_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>
            {/* Category */}
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => updateFilter('category', e.target.value)}
              >
                <MenuItem value=""><em>All Categories</em></MenuItem>
                {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
            {/* Experience */}
            <FormControl fullWidth size="small">
              <InputLabel>Experience Level</InputLabel>
              <Select
                value={filters.experienceLevel}
                label="Experience Level"
                onChange={(e) => updateFilter('experienceLevel', e.target.value)}
              >
                <MenuItem value=""><em>All Levels</em></MenuItem>
                {EXP_LEVELS.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
              </Select>
            </FormControl>

            {hasActiveFilters && (
              <div className="sm:col-span-3 flex justify-end">
                <Button onClick={clearFilters} color="error" size="small" sx={{ textTransform: 'none' }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-5">
          {[['jobType', filters.jobType], ['category', filters.category], ['experienceLevel', filters.experienceLevel], ['location', filters.location]].map(([key, val]) =>
            val ? (
              <Chip
                key={key}
                label={val}
                onDelete={() => updateFilter(key, '')}
                color="primary"
                variant="outlined"
                size="small"
              />
            ) : null
          )}
        </div>
      )}

      {/* Job grid */}
      {loading ? (
        <Spinner />
      ) : jobs.length === 0 ? (
        <div className="text-center py-20">
          <FiSearch className="w-12 h-12 mx-auto mb-4 text-indigo-500" />
          <Typography variant="h6" className="font-semibold text-slate-700 dark:text-white mb-2">No jobs found</Typography>
          <Typography className="text-slate-500 mb-4">Try adjusting your search filters.</Typography>
          <Button onClick={clearFilters} variant="contained" color="primary" sx={{ textTransform: 'none' }}>Clear All Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => <JobCard key={job._id} job={job} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-10">
          <Pagination
            count={totalPages}
            page={filters.page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size="large"
          />
        </div>
      )}
    </Container>
  );
}
