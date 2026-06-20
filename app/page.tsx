'use client';

import { useEffect, useState } from 'react';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from(Array.from(rawData).map((c) => c.charCodeAt(0)));
}

type Status = 'idle' | 'loading' | 'subscribed' | 'unsupported' | 'denied' | 'error';

export default function Home() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported');
      return;
    }
    navigator.serviceWorker.register('/sw.js');

    if (Notification.permission === 'granted') {
      checkExistingSubscription();
    }
  }, []);

  async function checkExistingSubscription() {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) setStatus('subscribed');
  }

  async function subscribe() {
    if (!('serviceWorker' in navigator)) return;
    setStatus('loading');

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'denied') {
        setStatus('denied');
        setMessage('Notifications blocked. Enable them in Safari Settings.');
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });

      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      });

      if (!res.ok) throw new Error('Subscribe API failed');

      setStatus('subscribed');
      setMessage('');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setMessage(`Error: ${err?.message ?? 'Unknown error'}`);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-8">
      <div className="flex flex-col items-center gap-3">
        <span className="text-7xl">💧</span>
        <h1 className="text-4xl font-bold tracking-tight">HydroRemind</h1>
        <p className="text-sky-100 text-lg max-w-xs">
          Get a friendly nudge every hour from 8 AM to 8 PM to drink water.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 w-full max-w-xs">
        {status === 'unsupported' && (
          <div className="bg-white/20 rounded-2xl p-5 text-sm">
            <p className="font-semibold mb-1">Not supported in this browser</p>
            <p className="text-sky-100">
              Add this page to your iPhone Home Screen, then open it from there.
            </p>
          </div>
        )}

        {status === 'subscribed' && (
          <div className="bg-white/20 rounded-2xl p-5">
            <p className="text-2xl mb-1">✅</p>
            <p className="font-semibold">You're all set!</p>
            <p className="text-sky-100 text-sm mt-1">
              Reminders will arrive every hour, 8 AM–8 PM IST.
            </p>
          </div>
        )}

        {(status === 'idle' || status === 'error' || status === 'denied') && (
          <button
            onClick={subscribe}
            className="w-full bg-white text-sky-600 font-bold text-lg py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
          >
            Enable Reminders
          </button>
        )}

        {status === 'loading' && (
          <div className="w-full bg-white/30 font-bold text-lg py-4 rounded-2xl text-center animate-pulse">
            Setting up…
          </div>
        )}

        {message && (
          <p className="text-sky-100 text-sm">{message}</p>
        )}
      </div>

      <div className="bg-white/10 rounded-2xl p-5 max-w-xs w-full text-sm text-sky-100 text-left space-y-2">
        <p className="font-semibold text-white">📱 iPhone setup</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Open this page in <strong>Safari</strong></li>
          <li>Tap the Share button (□↑)</li>
          <li>Choose <strong>"Add to Home Screen"</strong></li>
          <li>Open the app from your Home Screen</li>
          <li>Tap <strong>Enable Reminders</strong> above</li>
        </ol>
      </div>
    </main>
  );
}
