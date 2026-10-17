'use client';

import React, { useState, useEffect } from 'react';
import { UserRole, PRESET_USERS } from '@/lib/authTypes';
import { Shield, Check, RefreshCw, UserCheck } from 'lucide-react';

export function RoleSwitcher() {
  const [currentRole, setCurrentRole] = useState<UserRole>('OWNER');
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    // Read cookie on mount
    const match = document.cookie.match(/classpilot_role=([^;]+)/);
    if (match && match[1] && PRESET_USERS[match[1] as UserRole]) {
      setCurrentRole(match[1] as UserRole);
    }
  }, []);

  const handleRoleChange = async (role: UserRole) => {
    setIsSwitching(true);
    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        setCurrentRole(role);
        setIsOpen(false);
        // Reload page to reflect role-based server-side filtering
        window.location.reload();
      }
    } catch (e) {
      console.error('Failed to switch role', e);
    } finally {
      setIsSwitching(false);
    }
  };

  const roleColors: Record<UserRole, { bg: string; text: string; badge: string }> = {
    OWNER: { bg: 'bg-saffron/10 border-saffron/30', text: 'text-saffron-dark dark:text-saffron', badge: 'bg-saffron text-ink' },
    COUNSELOR: { bg: 'bg-teal/10 border-teal/30', text: 'text-teal dark:text-teal-light', badge: 'bg-teal text-white' },
    TRAINER: { bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800', text: 'text-indigo-700 dark:text-indigo-300', badge: 'bg-indigo-600 text-white' },
    ACCOUNTS: { bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-300', badge: 'bg-emerald-600 text-white' },
    STUDENT: { bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800', text: 'text-sky-700 dark:text-sky-300', badge: 'bg-sky-600 text-white' },
  };

  const user = PRESET_USERS[currentRole];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${roleColors[currentRole].bg} hover:shadow-sm`}
        title="Switch simulated role for judging demo"
      >
        <span className={`w-2 h-2 rounded-full ${currentRole === 'OWNER' ? 'bg-saffron animate-pulse' : 'bg-teal'}`} />
        <span className="font-semibold text-ink dark:text-paper-100">{user.name}</span>
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider ${roleColors[currentRole].badge}`}>
          {currentRole}
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-paper-800 rounded-xl shadow-2xl border border-paper-300 dark:border-paper-800 z-50 p-2.5">
            <div className="px-3 py-2 border-b border-paper-200 dark:border-paper-800/80 mb-2">
              <p className="text-xs font-bold text-ink dark:text-paper-100 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-saffron" />
                Demo Persona & Role Gate
              </p>
              <p className="text-[11px] text-ink-muted dark:text-ink-subtle mt-0.5">
                Switch role to test server-side column filtering & RBAC enforcement.
              </p>
            </div>

            <div className="space-y-1.5">
              {(Object.keys(PRESET_USERS) as UserRole[]).map((r) => {
                const u = PRESET_USERS[r];
                const isActive = r === currentRole;
                return (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    disabled={isSwitching}
                    className={`w-full text-left p-2.5 rounded-lg transition-all flex items-start justify-between ${
                      isActive
                        ? 'bg-paper-100 dark:bg-paper-900 border border-saffron/40'
                        : 'hover:bg-paper-50 dark:hover:bg-paper-900/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-ink dark:text-paper-100">{u.name}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${roleColors[r].badge}`}>
                          {r}
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-muted dark:text-ink-subtle mt-0.5">
                        {r === 'OWNER' && 'Full system access & financial clearance'}
                        {r === 'COUNSELOR' && 'Student 360, retention reminders (no bank recon)'}
                        {r === 'TRAINER' && 'Only assigned cohort (STRICT zero fee/payment access)'}
                        {r === 'ACCOUNTS' && 'Fee ledger, statement reconciliation, certificates'}
                        {r === 'STUDENT' && 'Personal learning portal, timetable, fee receipts, and recordings'}
                      </p>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-saffron flex-shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
