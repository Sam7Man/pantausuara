import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import { AuthProvider } from './sections/authentication/auth/auth-context';
import { UserProvider } from './sections/authentication/user/user-context';
import { SuaraProvider } from './sections/suara/context/suara-context';


export default function App() {
  useScrollToTop();

  return (
    <UserProvider>
      <AuthProvider>
        <ThemeProvider>
          <SuaraProvider>
            <Router />
          </SuaraProvider>
        </ThemeProvider>
      </AuthProvider>
    </UserProvider>
  );
}
