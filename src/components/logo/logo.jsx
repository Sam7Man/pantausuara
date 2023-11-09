import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import { Box, Link } from '@mui/material';
// import { useTheme } from '@mui/material/styles';

// import { RouterLink } from 'src/routes/components';


const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  // const theme = useTheme();

  // const PRIMARY_LIGHT = theme.palette.primary.light;
  // const PRIMARY_MAIN = theme.palette.primary.main;
  // const PRIMARY_DARK = theme.palette.primary.dark;

  const logo = (
    <Box
      component="img"
      src="/assets/pantausuara.jpg"
      sx={{ width: 75, maxHeight: 75, cursor: 'pointer', borderRadius: 1,...sx }}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link to="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
