import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { getSupabase } from '@/lib/supabase';
import { getRandomMessage } from '@/lib/messages';

export async function POST(req: NextRequest) {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
  const secret = req.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only send between 8 AM and 11 PM IST (UTC+5:30)
  const istHour = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })).getHours();
  if (istHour < 8 || istHour >= 23) {
    return NextResponse.json({ skipped: true, reason: 'Outside active hours (8AM–11PM IST)' });
  }

  const { data: subs, error } = await getSupabase()
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth') as {
      data: { endpoint: string; p256dh: string; auth: string }[] | null;
      error: unknown;
    };

  if (error) {
    console.error('Supabase fetch error:', error);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }

  const payload = JSON.stringify(getRandomMessage());
  const stale: string[] = [];

  await Promise.allSettled(
    (subs ?? []).map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
      } catch (err: any) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          stale.push(sub.endpoint);
        }
      }
    })
  );

  if (stale.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (getSupabase().from('push_subscriptions') as any).delete().in('endpoint', stale);
  }

  return NextResponse.json({ sent: (subs?.length ?? 0) - stale.length, removed: stale.length });
}
