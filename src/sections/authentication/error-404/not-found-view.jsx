import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import Logo from 'src/components/logo';

// ----------------------------------------------------------------------

export default function NotFoundView() {
  const renderHeader = (
    <Box
      component="header"
      sx={{
        top: 0,
        left: 0,
        width: 1,
        lineHeight: 0,
        position: 'fixed',
        p: (theme) => ({ xs: theme.spacing(3, 3, 0), sm: theme.spacing(5, 5, 0) }),
      }}
    >
      <Logo />
    </Box>
  );

  return (
    <>
      {renderHeader}

      <Container>
        <Box
          display="flex"
          flexDirection="column"
          height="100vh"
          textAlign="center"
          justifyContent="center"
        >

          <Container maxWidth="md">
            <img src="/assets/illustrations/404-error.svg" alt="404" style={{ width: '100%', maxWidth: '500px' }} />
          <Typography variant="h2" mb={4}>
            Opps!!!
          </Typography>
            <Typography align="center" variant="h6" mb={4}>
              Sorry, we couldn&apos;t find the page you&apos;re looking for. Perhaps you&apos;ve mistyped the URL?
            </Typography>
            <Button color="primary" variant="contained" size="large" component={RouterLink} to="/dashboard" disableElevation>
              Go Back to Home
            </Button>
          </Container>
        </Box>
      </Container>
    </>
  );
}
