import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { List, ListItemIcon, ListItemButton, ListItemText, Collapse } from '@mui/material';
import { IconChevronDown, IconChevronRight, IconPower } from '@tabler/icons-react';

import { useUser } from 'src/sections/authentication/user/user-context';
import { usePathname } from 'src/routes/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
import { useAuth } from 'src/sections/authentication/auth/auth-context';
import { RouterLink } from 'src/routes/components';
import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';

import { NAV } from './config-layout';
import navConfig from './config-navigation';



export default function Nav({ openNav, onCloseNav }) {
  const { userName } = useUser();
  const pathname = usePathname();
  const { handleLogout } = useAuth();

  const upLg = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);


  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: (theme) => alpha(theme.palette.grey[700], 0.12),
      }}
    >
      <Avatar
        alt='User'
        sx={{
          typography: 'body1',
          width: 44,
          height: 44,
          color: 'common.black',
          border: (theme) => `solid 2px ${theme.palette.background.default}`,
        }}
      >
        {userName.charAt(0).toUpperCase() + userName.substring(1, 3)}
      </Avatar>
      <Box>
        <Typography variant="subtitle2">{userName}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Calon Legislatif
        </Typography>
      </Box>
      <Button
        variant="contained"
        aria-label="logout"
        size="small"
        sx={{
          minWidth: '2.45rem',
          maxHeight: '2.45rem',
          minHeight: '2.45rem',
          bgcolor: (theme) => alpha(theme.palette.primary.light, 0.85),
        }}
        onClick={handleLogout}
      >
        <IconPower onClick={handleLogout} />
      </Button>
    </Box>
  );

  const renderNavItems = (items, label, depth = 0) => (
    <>
      <Typography variant="subtitle1" display="block" gutterBottom sx={{ fontSize: 13.5, px: 2, pt: 2.5, color: 'text.secondary' }}>
        {label}
      </Typography>
      {items.map((item) => (
        <NavItem key={item.title} item={item} depth={depth} />
      ))}
    </>
  );

  // const renderMenu = (
  //   <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
  //     {navConfig.map((section) => renderNavItems(section.items, section.label))}
  //   </Stack>
  // );

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map((section, index) => (
        <React.Fragment key={`${section.label}-${index}`}>
          {renderNavItems(section.items, section.label)}
        </React.Fragment>
      ))}
    </Stack>
  );


  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Logo sx={{ mt: 3, ml: 4 }} />

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />

    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item, depth = 0 }) {
  const [open, setOpen] = useState(() => {
    const isOpen = localStorage.getItem(`nav-item-${item.title}`) === 'true';
    return isOpen;
  });
  const pathname = usePathname();
  const active = item.path === pathname;
  const hasChildren = item.children && item.children.length > 0;

  const handleToggle = () => {
    setOpen(!open);
    localStorage.setItem(`nav-item-${item.title}`, !open);
  };

  const itemStyle = {
    minHeight: 44,
    borderRadius: 0.75,
    typography: 'body2',
    color: 'text.secondary',
    textTransform: 'capitalize',
    fontWeight: active ? 'bold' : 'fontWeightMedium',
    pl: 2 + depth * 2, 
    ...(active && {
      color: 'primary.main',
      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
      '&:hover': {
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
      },
    }),
  };

  const iconStyle = {
    minWidth: 0, 
    mr: 1,
    color: active ? 'primary.main' : 'text.secondary',
  };

  return (
    <>
      <ListItemButton
        onClick={hasChildren ? handleToggle : undefined}
        component={hasChildren ? 'div' : RouterLink}
        href={hasChildren ? undefined : item.path}
        sx={itemStyle}
      >
        <ListItemIcon sx={iconStyle}>
          {item.icon}
        </ListItemIcon>
        <ListItemText primary={item.title} />
        {hasChildren && (open ? <IconChevronDown /> : <IconChevronRight />)}
      </ListItemButton>
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((child) => (
              <NavItem key={child.title} item={child} depth={depth + 1} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
  depth: PropTypes.number,
};
