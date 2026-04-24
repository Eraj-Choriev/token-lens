import { useEffect, useRef, useCallback } from 'react';

// Fires at 50 / 75 / 90 / 100 % of plan limits
const THRESHOLDS = [
  { pct: 50,  emoji: '💡', urgency: 'info',    msg: (plan, label) => [`💡 Halfway through your ${plan} ${label}`, 'You\'ve used 50% of your limit. Pace yourself or switch to Haiku for lighter tasks.'] },
  { pct: 75,  emoji: '⚡', urgency: 'warning', msg: (plan, label) => [`⚡ 75% of ${plan} ${label} used`, 'Only 25% remaining. Consider using Haiku for simple tasks to preserve budget.'] },
  { pct: 90,  emoji: '⚠️', urgency: 'danger',  msg: (plan, label) => [`⚠️ 90% of ${plan} ${label} used`, 'Only 10% left — switch to Haiku immediately or your requests may throttle soon.'] },
  { pct: 100, emoji: '🚨', urgency: 'critical', msg: (plan, label) => [`🚨 Limit Reached — TokenLens`, `You've hit 100% of your ${plan} ${label}. New requests may be blocked or throttled.`] },
];

export function useNotifications(planUsage, enabled = true) {
  const notifiedRef = useRef(new Set());

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return 'unsupported';
    if (Notification.permission === 'default') {
      return await Notification.requestPermission();
    }
    return Notification.permission;
  }, []);

  const sendNotification = useCallback((title, body) => {
    if (Notification.permission !== 'granted' || !enabled) return;
    try {
      new Notification(title, {
        body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: `tokenlens-${title}`,
      });
    } catch {}
  }, [enabled]);

  // Reset fired thresholds when enabled toggled back on so re-entry fires fresh
  useEffect(() => {
    if (enabled) notifiedRef.current = new Set();
  }, [enabled]);

  useEffect(() => {
    if (!planUsage || !enabled) return;
    const { weeklyPct, sessionPct, plan } = planUsage;
    const maxPct = Math.max(weeklyPct, sessionPct);
    const isSession = sessionPct >= weeklyPct;
    const limitLabel = isSession ? 'session context' : 'weekly limit';

    for (const { pct, msg } of THRESHOLDS) {
      if (maxPct >= pct && !notifiedRef.current.has(pct)) {
        notifiedRef.current.add(pct);
        const [title, body] = msg(plan, limitLabel);
        sendNotification(title, body);
      }
    }
  }, [planUsage, enabled, sendNotification]);

  return {
    requestPermission,
    sendNotification,
    permission: typeof Notification !== 'undefined' ? Notification.permission : 'unsupported',
  };
}
