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

function cancelMountGuard(): void {
  const cancelGuard = window.__stargravity_cancel_mount_guard;
  if (typeof cancelGuard === 'function') {
    cancelGuard();
  }
}

function removeStaticShell(): void {
  const shell = document.getElementById('static-shell');
  if (shell && shell.parentNode) {
    shell.parentNode.removeChild(shell);
  }
}

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );

  // React 19 renders asynchronously. Use a MutationObserver to detect
  // when React replaces the static shell content, then clean up.
  const observer = new MutationObserver(() => {
    const shell = document.getElementById('static-shell');
    if (!shell || !shell.parentNode) {
      observer.disconnect();
      cancelMountGuard();
    }
  });
  observer.observe(rootElement, { childList: true, subtree: true });

  // Safety timeout: if MutationObserver hasn't fired within 5s, force cleanup.
  // This handles edge cases where React mounts but doesn't remove the shell.
  setTimeout(() => {
    observer.disconnect();
    removeStaticShell();
    cancelMountGuard();
  }, 5000);
} catch (err) {
  console.error('StarGravity: Failed to initialize React app', err);
  showFallbackError();
}
