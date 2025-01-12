import { createRoot } from 'react-dom/client';

import './styles/tailwind.css';
import './styles/globals.scss';
import './styles/components.css';

import App from './App.tsx';
import ErrorBoundary from './components/error-boundary.tsx';
import { ThemeProvider } from './components/Theme/theme-provider.tsx';
import { Toaster } from './components/ui/sonner.tsx';
import { UserStoreProvider } from '@/stores/user/userContext';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <UserStoreProvider>
        <App />
        <Toaster />
      </UserStoreProvider>
    </ThemeProvider>
  </ErrorBoundary>,
);
