/// <reference types="vite/client" />

interface Window {
  aif?: {
    track: (event: string, props?: Record<string, unknown>) => void;
    mvpId?: string;
    sessionId?: string;
  };
  __stargravity_cancel_mount_guard?: () => void;
}
