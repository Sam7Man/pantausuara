import { Helmet } from 'react-helmet-async';

import { TimsesView } from 'src/sections/timses';

// ----------------------------------------------------------------------

export default function TimsesPage() {
  return (
    <>
      <Helmet>
        <title> Timses | Pantausuara </title>
      </Helmet>

      <TimsesView />
    </>
  );
}
