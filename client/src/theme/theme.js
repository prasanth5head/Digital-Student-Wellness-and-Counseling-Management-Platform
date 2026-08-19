import { createTheme } from '@mui/material/styles';

export const getTheme = (mode = 'light') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#0284C7', // Medical Sky Blue / Cyan
        light: '#38BDF8',
        dark: '#0369A1',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#6366F1', // Indigo / Serenity
        light: '#818CF8',
        dark: '#4338CA',
        contrastText: '#FFFFFF',
      },
      success: {
        main: '#10B981', // Emerald / Low Risk
        light: '#34D399',
        dark: '#059669',
        contrastText: '#FFFFFF',
      },
      warning: {
        main: '#F59E0B', // Amber / Moderate Risk
        light: '#FBBF24',
        dark: '#D97706',
        contrastText: '#FFFFFF',
      },
      error: {
        main: '#EF4444', // Rose / High & Critical Risk
        light: '#F87171',
        dark: '#DC2626',
        contrastText: '#FFFFFF',
      },
      info: {
        main: '#06B6D4', // Cyan
        light: '#22D3EE',
        dark: '#0891B2',
      },
      background: {
        default: isDark ? '#0B0F19' : '#F8FAFC',
        paper: isDark ? '#111827' : '#FFFFFF',
        subtle: isDark ? '#1E293B' : '#F1F5F9',
        glass: isDark ? 'rgba(17, 24, 39, 0.75)' : 'rgba(255, 255, 255, 0.85)',
      },
      text: {
        primary: isDark ? '#F9FAFB' : '#0F172A',
        secondary: isDark ? '#9CA3AF' : '#475569',
        disabled: isDark ? '#6B7280' : '#94A3B8',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
      risk: {
        low: '#10B981',
        moderate: '#F59E0B',
        high: '#F97316',
        critical: '#EF4444',
      }
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: {
        fontFamily: '"Outfit", sans-serif',
        fontWeight: 700,
        fontSize: '2.5rem',
        letterSpacing: '-0.02em',
      },
      h2: {
        fontFamily: '"Outfit", sans-serif',
        fontWeight: 700,
        fontSize: '2rem',
        letterSpacing: '-0.02em',
      },
      h3: {
        fontFamily: '"Outfit", sans-serif',
        fontWeight: 600,
        fontSize: '1.5rem',
        letterSpacing: '-0.01em',
      },
      h4: {
        fontFamily: '"Outfit", sans-serif',
        fontWeight: 600,
        fontSize: '1.25rem',
      },
      h5: {
        fontFamily: '"Outfit", sans-serif',
        fontWeight: 600,
        fontSize: '1.1rem',
      },
      h6: {
        fontFamily: '"Outfit", sans-serif',
        fontWeight: 600,
        fontSize: '0.95rem',
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
      },
      body1: {
        fontSize: '0.95rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.85rem',
        lineHeight: 1.5,
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
        letterSpacing: '0.01em',
      },
    },
    shape: {
      borderRadius: 14,
    },
    shadows: [
      'none',
      isDark ? '0 2px 8px rgba(0, 0, 0, 0.4)' : '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.04)',
      isDark ? '0 4px 14px rgba(0, 0, 0, 0.5)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      isDark ? '0 8px 20px rgba(0, 0, 0, 0.6)' : '0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
      isDark ? '0 12px 28px rgba(0, 0, 0, 0.7)' : '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03)',
      isDark ? '0 20px 35px rgba(0, 0, 0, 0.8)' : '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
      ...Array(19).fill('none'),
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '8px 18px',
            fontSize: '0.875rem',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
            },
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
            },
          },
          containedSecondary: {
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: 'none',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(226, 232, 240, 0.8)',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease',
            '&:hover': {
              borderColor: isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(2, 132, 199, 0.3)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '0.75rem',
          },
        },
      },
    },
  });
};
