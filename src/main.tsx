import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/tailwind.css';
import './styles/globals.scss';

import App from './App.tsx';
import ErrorBoundary from './components/error-boundary.tsx';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <StrictMode>
      <App />
    </StrictMode>
  </ErrorBoundary>,
);
