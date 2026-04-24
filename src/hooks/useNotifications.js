import { useEffect, useRef, useCallback } from 'react';

const THRESHOLDS = [75, 90, 100];

export function useNotifications(planUsage) {
  const notifiedRef = useRef(new Set());

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return 'unsupported';
    if (Notification.permission === 'default') {
      const result = await Notification.requestPermission();
      return result;
    }
    return Notification.permission;
  }, []);

  const sendNotification = useCallback((title, body, icon = '⚡') => {
    if (Notification.permission !== 'granted') return;
    try {
      new Notification(title, {
        body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: 'tokenlens',
      });
    } catch {}
  }, []);

  useEffect(() => {
    if (!planUsage) return;
    const { weeklyPct, sessionPct, plan } = planUsage;
    const maxPct = Math.max(weeklyPct, sessionPct);

    for (const threshold of THRESHOLDS) {
      if (maxPct >= threshold && !notifiedRef.current.has(threshold)) {
        notifiedRef.current.add(threshold);
        const isSession = sessionPct >= weeklyPct;
        const label = isSession ? 'session context' : 'weekly limit';

        if (threshold === 100) {
          sendNotification(
            '🚨 Token Limit Reached — TokenLens',
            `You've hit 100% of your ${plan} ${label}. Requests may be throttled.`,
          );
        } else if (threshold === 90) {
          sendNotification(
            `⚠️ ${threshold}% of ${plan} ${label} used`,
            `Only ${100 - threshold}% remaining. Consider switching to Haiku for simpler tasks.`,
          );
        } else {
          sendNotification(
            `💡 ${threshold}% of ${plan} ${label} used`,
            'You\'re using tokens quickly. Check TokenLens for optimization tips.',
          );
        }
      }
    }
  }, [planUsage, sendNotification]);

  return { requestPermission, sendNotification, permission: typeof Notification !== 'undefined' ? Notification.permission : 'unsupported' };
}
