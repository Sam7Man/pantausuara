import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useUser } from 'src/sections/authentication/user/user-context';
import { useAuth } from 'src/sections/authentication/auth/auth-context';
import { IconLayoutDashboard, IconLogout, IconUserCog } from '@tabler/icons-react';
import { Grid } from '@mui/material';
// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    path: '/dashboard',
    icon: <IconLayoutDashboard size={19} />,
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: <IconUserCog size={19} />,
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const { handleLogout } = useAuth();
  const { userEmail, userName } = useUser();
  const navigate = useNavigate();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  }

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 45,
          height: 45,
          background: (theme) => alpha(theme.palette.primary.light, 0.9),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          alt='<IconUserCircle />'
          sx={{
            typography: 'body1',
            width: 42,
            height: 42,
            background: (theme) => alpha(theme.palette.primary.main, 0.01),
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
            '&:hover': {
              background: (theme) => alpha(theme.palette.primary.main, 0.5),
            },
          }}
        >
          {userName.charAt(0).toUpperCase() + userName.substring(1, 3)}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          p: 0,
          mt: 1,
          ml: 0.75,
          width: 200,
        }}
      >
        <Box sx={{ my: 1.5, px: 3 }} justifyContent="start">
          <Typography variant="subtitle1" fontSize={18} noWrap>
            {typeof userName === 'string' ? (userName.charAt(0).toUpperCase() + userName.slice(1)) : 'User Name'}
          </Typography>
          <Typography variant="body2" fontSize={15} sx={{ color: 'text.secondary' }} noWrap>
            {userEmail}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={() => handleNavigate(option.path)} sx={{ my: 1 }}>
            <Grid container spacing={1}>
              <Grid item>{option.icon}</Grid>
              <Grid item>
                <Typography>{option.label}</Typography>
              </Grid>
            </Grid>
          </MenuItem>
        ))}

        <Divider />
        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogout}
          sx={{ color: 'error.main', m: 1 }}
        >
          <Grid container spacing={1} alignItems="center" justifyItems="center">
            <Grid item><IconLogout size={20} /></Grid>
            <Typography variant='body1' fontWeight="bold">&nbsp;&nbsp;Logout</Typography>
          </Grid>
        </MenuItem>
      </Popover >
    </>
  );
}
