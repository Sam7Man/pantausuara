import {
  IconLayoutDashboard,
  IconUserCog,
  IconFileAnalytics,
  IconUsersGroup,
  IconArchive,
} from '@tabler/icons-react';


const navConfig = [
  {
    label: 'HOME',
    items: [
      {
        title: 'dashboard',
        path: '/dashboard',
        icon: <IconLayoutDashboard />
      },
    ]
  },
  {
    label: 'MAIN',
    items: [
      {
        title: 'suara',
        path: '/suara',
        icon: <IconFileAnalytics />,
        // children: [
        //   {
        //     title: 'list suara',
        //     path: '/suara',
        //     icon: <IconPoint />,
        //   },
        //   {
        //     title: 'cek suara',
        //     path: '/suara/cek',
        //     icon: <IconPoint />,
        //   },
        // ],
      },
      {
        title: 'timses',
        path: '/timses',
        icon: <IconUsersGroup />,
      },
    ]
  },
  {
    label: 'SETTINGS',
    items: [
      {
        title: 'profile',
        path: '/profile',
        icon: <IconUserCog />,
      },
      {
        title: 'Logs',
        path: '/logs',
        icon: <IconArchive />,
      },
    ]
  },
];

export default navConfig;
