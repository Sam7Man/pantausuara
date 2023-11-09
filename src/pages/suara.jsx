import { Helmet } from 'react-helmet-async';

import { SuaraView } from 'src/sections/suara';

// ----------------------------------------------------------------------

export default function SuaraPage() {
  return (
    <>
      <Helmet>
        <title> Suara | Pantausuara </title>
      </Helmet>

      <SuaraView />
    </>
  );
}
