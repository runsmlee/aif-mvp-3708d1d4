import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from './components/ErrorBoundary';
import { App } from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

try {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
} catch (err) {
  console.error('StarGravity: Failed to initialize React app', err);
  const shell = document.getElementById('static-shell');
  if (shell) shell.style.display = 'none';
  const fb = document.getElementById('fallback-error');
  if (fb) fb.style.display = 'block';
}
