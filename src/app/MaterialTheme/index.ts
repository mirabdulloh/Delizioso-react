import { createTheme } from '@mui/material/styles';
import { common } from '@mui/material/colors';
import shadow from './shadow';
import typography from './typography';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f8f8ff',
      paper: common.white,
    },
    primary: {
      contrastText: '#ffffff',
      main: '#3FA72F',
    },
    secondary: {
      contrastText: '#ffffff',
      main: '#FF8A00',
    },
    text: {
      primary: '#343434',
      secondary: '#d7b586',
    },
  },

  components: {
    MuiContainer: {
      styleOverrides: {
        root: { height: '100%' },
        maxWidthLg: {
          maxWidth: '1300px',
          '@media (min-width:1200px)': {
            maxWidth: '1300px',
          },
        },
      },
    },

    MuiCssBaseline: {
      styleOverrides: {
        html: { height: '100%' },
        body: { background: '#f4f6f8', height: '100%', minHeight: '100%' },
      },
    },

    // ✅ BUTTON GLOBAL STYLE (radius + hover)
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,          // ✅ border radius here (NOT css)
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.2s ease',
        },

        /* Use a subtle brightness filter on hover for all contained buttons
           so buttons with custom backgrounds (eg. white) keep their intended hover.
           Avoid forcing specific backgroundColor here which can override per-button sx. */
        contained: {
          '&:hover': {
            filter: 'brightness(0.94)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
          },
        },
      },
    },
  },

  // if shadow/typography typings make error, keep as any
  shadows: shadow as any,
  typography: typography as any,
});

export default theme;
