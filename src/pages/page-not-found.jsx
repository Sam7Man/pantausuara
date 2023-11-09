import { Helmet } from 'react-helmet-async';

import { NotFoundView } from 'src/sections/authentication/error-404';

// ----------------------------------------------------------------------

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title> 404 Page Not Found </title>
      </Helmet>

      <NotFoundView />
    </>
  );
}
