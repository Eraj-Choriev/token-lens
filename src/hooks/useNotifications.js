import { useEffect, useRef, useCallback } from 'react';
import { notify } from '../lib/sound';

const THRESHOLDS = [
  {
    pct: 50, urgency: 'info',
    title: (plan, label) => `50% of ${plan} ${label} used`,
    body:  ()            => 'Halfway there. Pace yourself or route simpler tasks to Haiku.',
  },
  {
    pct: 75, urgency: 'warning',
    title: (plan, label) => `75% of ${plan} ${label} used`,
    body:  ()            => 'Only 25% remaining. Switch repetitive tasks to Haiku to preserve budget.',
  },
  {
    pct: 90, urgency: 'danger',
    title: (plan, label) => `90% of ${plan} ${label} used`,
    body:  ()            => 'Just 10% left — switch to Haiku immediately or requests may throttle.',
  },
  {
    pct: 100, urgency: 'critical',
    title: (plan, label) => `Limit reached — ${plan} ${label}`,
    body:  ()            => 'You have hit 100%. New requests may be blocked or severely throttled.',
  },
];

export function useNotifications(planUsage, enabled = true, onToast) {
  const notifiedRef = useRef(new Set());

  // Reset when re-enabled so alerts fire fresh
  useEffect(() => {
    if (enabled) notifiedRef.current = new Set();
  }, [enabled]);

  useEffect(() => {
    if (!planUsage || !enabled) return;
    const { weeklyPct, sessionPct, plan } = planUsage;
    const maxPct  = Math.max(weeklyPct, sessionPct);
    const isSession = sessionPct >= weeklyPct;
    const label   = isSession ? 'session context' : 'weekly limit';

    for (const t of THRESHOLDS) {
      if (maxPct >= t.pct && !notifiedRef.current.has(t.pct)) {
        notifiedRef.current.add(t.pct);
        const title = t.title(plan, label);
        const body  = t.body();

        // 1. In-app toast
        onToast?.({ title, body, urgency: t.urgency });

        // 2. Chime + voice (fire-and-forget)
        notify(t.urgency, t.pct, plan).catch(() => {});
      }
    }
  }, [planUsage, enabled, onToast]);
}
