import { Container, Paper } from "@mui/material"
import { Breakpoint } from "@mui/system/createTheme/createBreakpoints"

export const CenterPage: React.FC<{ maxWidth?: Breakpoint | false }> = ({ maxWidth, ...props }) => {

  return (
    <Container maxWidth={maxWidth} sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      height: '100vh'
    }}>
      <Paper sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        p: '1em 2em',
        gap: 2
      }} >
        {props.children}
      </Paper>
    </Container>
  )
}