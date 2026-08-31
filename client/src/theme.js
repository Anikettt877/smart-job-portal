/**
 * MUI Theme Configuration
 * Custom theme matching the existing indigo/slate design system
 * Supports light and dark mode
 */

import { createTheme } from '@mui/material/styles';

const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary:    { main: '#6366f1', light: '#818cf8', dark: '#4f46e5', contrastText: '#fff' },
            secondary:  { main: '#0f172a', light: '#334155', dark: '#020617', contrastText: '#fff' },
            error:      { main: '#ef4444' },
            warning:    { main: '#f59e0b' },
            success:    { main: '#10b981' },
            info:       { main: '#3b82f6' },
            background: { default: '#f8fafc', paper: '#ffffff' },
            text:       { primary: '#1e293b', secondary: '#64748b' },
            divider:    '#e2e8f0',
          }
        : {
            primary:    { main: '#818cf8', light: '#a5b4fc', dark: '#6366f1', contrastText: '#fff' },
            secondary:  { main: '#f1f5f9', light: '#f8fafc', dark: '#e2e8f0', contrastText: '#0f172a' },
            error:      { main: '#f87171' },
            warning:    { main: '#fbbf24' },
            success:    { main: '#34d399' },
            info:       { main: '#60a5fa' },
            background: { default: '#0f172a', paper: '#1e293b' },
            text:       { primary: '#f1f5f9', secondary: '#94a3b8' },
            divider:    '#334155',
          }),
    },
    typography: {
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '10px 20px',
            fontSize: '0.875rem',
            fontWeight: 600,
          },
          containedPrimary: {
            background: '#6366f1',
            '&:hover': { background: '#4f46e5' },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: { borderRadius: 10 },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 16,
            border: `1px solid ${theme.palette.divider}`,
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: theme.shadows[4],
              transform: 'translateY(-2px)',
            },
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 20, fontWeight: 600, fontSize: '0.75rem' },
        },
      },
      MuiTextField: {
        defaultProps: { size: 'small', variant: 'outlined' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              fontSize: '0.875rem',
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: { borderRadius: 12 },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { borderRadius: 12 },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: 16 },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            fontWeight: 700,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            minHeight: 40,
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: { minHeight: 40 },
        },
      },
      MuiPagination: {
        styleOverrides: {
          root: { '& .MuiPaginationItem-root': { borderRadius: 12, fontWeight: 600 } },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: { fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { borderRadius: 4, height: 8 },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: { borderRadius: '0 16px 16px 0' },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backdropFilter: 'blur(12px)',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: { borderRadius: 8, fontSize: '0.75rem', fontWeight: 500 },
        },
      },
    },
  });

export default getTheme;
