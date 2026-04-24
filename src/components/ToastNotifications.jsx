import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Zap, AlertTriangle, AlertOctagon, Info } from 'lucide-react';

const URGENCY_CONFIG = {
  info: {
    border:  '#818CF8',
    bg:      'rgba(238,242,255,0.98)',
    icon:    Info,
    iconBg:  '#EEF2FF',
    iconClr: '#6366F1',
    bar:     '#818CF8',
    label:   'Info',
    duration: 7000,
  },
  warning: {
    border:  '#F59E0B',
    bg:      'rgba(255,251,235,0.98)',
    icon:    Zap,
    iconBg:  '#FFFBEB',
    iconClr: '#D97706',
    bar:     '#F59E0B',
    label:   'Warning',
    duration: 8000,
  },
  danger: {
    border:  '#F97316',
    bg:      'rgba(255,247,237,0.98)',
    icon:    AlertTriangle,
    iconBg:  '#FFF7ED',
    iconClr: '#EA580C',
    bar:     '#F97316',
    label:   'Alert',
    duration: 10000,
  },
  critical: {
    border:  '#EF4444',
    bg:      'rgba(254,242,242,0.98)',
    icon:    AlertOctagon,
    iconBg:  '#FEF2F2',
    iconClr: '#DC2626',
    bar:     '#EF4444',
    label:   '🚨 Critical',
    duration: 0, // stays until dismissed
  },
};

function Toast({ toast, onDismiss }) {
  const [exiting, setExiting]     = useState(false);
  const [progress, setProgress]   = useState(100);
  const intervalRef               = useRef(null);
  const cfg = URGENCY_CONFIG[toast.urgency] || URGENCY_CONFIG.info;

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 350);
  }, [toast.id, onDismiss]);

  useEffect(() => {
    if (!cfg.duration) return;
    const step = 50;
    const dec  = (step / cfg.duration) * 100;
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p - dec <= 0) { clearInterval(intervalRef.current); dismiss(); return 0; }
        return p - dec;
      });
    }, step);
    return () => clearInterval(intervalRef.current);
  }, [cfg.duration, dismiss]);

  const Icon = cfg.icon;

  return (
    <div
      style={{
        background: cfg.bg,
        borderLeft: `4px solid ${cfg.border}`,
        animation: exiting
          ? 'toast-out 0.35s cubic-bezier(0.55,0,1,0.45) forwards'
          : 'toast-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
      }}
      className="relative w-80 rounded-2xl overflow-hidden pointer-events-auto"
    >
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
             style={{ background: cfg.iconBg }}>
          <Icon size={15} strokeWidth={2} style={{ color: cfg.iconClr }} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: cfg.border }}>
              {cfg.label}
            </p>
          </div>
          <p className="text-sm font-semibold text-[#1A1E2E] leading-snug">{toast.title}</p>
          {toast.body && (
            <p className="text-xs text-[#6B7A99] mt-1 leading-relaxed">{toast.body}</p>
          )}
        </div>

        {/* Dismiss */}
        <button
          onClick={dismiss}
          className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors flex-shrink-0 mt-0.5"
        >
          <X size={12} className="text-[#8B95A8]" />
        </button>
      </div>

      {/* Progress bar */}
      {cfg.duration > 0 && (
        <div className="h-0.5 w-full" style={{ background: `${cfg.border}20` }}>
          <div
            className="h-full transition-none"
            style={{ width: `${progress}%`, background: cfg.border }}
          />
        </div>
      )}
    </div>
  );
}

// ── Hook to manage the toast queue ──────────────────────────────────────────

let _id = 0;

export function useToasts() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, body, urgency = 'info' }) => {
    const id = ++_id;
    setToasts(prev => [...prev.slice(-3), { id, title, body, urgency }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

// ── Portal component ─────────────────────────────────────────────────────────

export default function ToastNotifications({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none"
      aria-live="assertive"
    >
      {toasts.map(t => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
