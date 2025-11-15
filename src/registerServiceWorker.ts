// This file handles PWA service worker registration with user notifications

export function registerSW() {
  if ('serviceWorker' in navigator) {
    // Only show update notifications in production
    if (import.meta.env.PROD) {
      // The service worker is automatically registered by vite-plugin-pwa
      // This file is for future custom update notifications
      window.addEventListener('load', () => {
        // Listen for service worker updates
        navigator.serviceWorker.ready.then((registration) => {
          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000); // Check every hour
        });
      });
    }
  }
}
