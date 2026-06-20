self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title ?? '💧 HydroRemind';
  const options = {
    body: data.body ?? 'Time to drink water!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'hydro-reminder',
    renotify: true,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
