import { createTheme } from "@mui/material"

const theme = createTheme({
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "avenir next", avenir, "helvetica neue", helvetica, ubuntu, roboto, noto, "segoe ui", arial, sans-serif',
    button: {
      textTransform: 'none'
    }
  },
  palette: {
    primary: {
      contrastText: '#fafafa',
      main: '#e63946',
    },
    secondary: {
      main: '#f1be3e',
    },

    background: {
      default: '#de7d60',
    },
    contrastThreshold: 3,
    tonalOffset: 0.1,
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          color: "#FAFAFA",
          backgroundColor: "#1F2F3C",
          padding: "0.4em 1em"
        }
      }
    },
    MuiModal: {
      styleOverrides: {
        root: {
          display: "flex",
          alignItems: 'center',
          justifyContent: 'center'
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'filled'
      }
    },
  },
})

export default theme