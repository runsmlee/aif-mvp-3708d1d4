import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from './components/ErrorBoundary';
import { App } from './App';
import './index.css';

function showFallbackError(): void {
  const shell = document.getElementById('static-shell');
  if (shell) shell.style.display = 'none';
  const fb = document.getElementById('fallback-error');
  if (fb) fb.style.display = 'block';
}

function onReactMounted(): void {
  // Remove the static shell from the DOM
  const shell = document.getElementById('static-shell');
  if (shell && shell.parentNode) {
    shell.parentNode.removeChild(shell);
  }
  // Cancel the mount guard timer set in index.html
  const cancelGuard = window.__stargravity_cancel_mount_guard;
  if (typeof cancelGuard === 'function') {
    cancelGuard();
  }
}

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );

  // React 19 renders asynchronously via MessageChannel scheduling.
  // Schedule cleanup after the render commit completes.
  // queueMicrotask runs after the current task, setTimeout(0) runs
  // after the microtask and any pending MessageChannel callbacks.
  queueMicrotask(() => {
    setTimeout(onReactMounted, 0);
  });
} catch (err) {
  console.error('StarGravity: Failed to initialize React app', err);
  showFallbackError();
}
