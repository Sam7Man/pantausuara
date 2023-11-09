import { Helmet } from 'react-helmet-async';

import { DashboardView } from 'src/sections/overview';

// ----------------------------------------------------------------------

export default function DashboardPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard | Pantausuara </title>
      </Helmet>

      <DashboardView />
    </>
  );
}
