import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { UserRole } from '@/lib/authTypes';

interface Props {
  role: UserRole;
  requiredClearance?: string;
  reason?: string;
}

export function AccessRestrictedCard({
  role,
  requiredClearance = 'Administrative Clearance (Owner, Counselor, or Accounts)',
  reason,
}: Props) {
  const defaultReason =
    role === 'STUDENT'
      ? 'As a Student, your clearance is strictly limited to your personal learning portal, enrolled batch timetable, attendance telemetry, fee receipts, recordings, and certificates. Global administrative and multi-student management operations are restricted.'
      : `Your current role '${role}' does not have sufficient permissions to view or edit this operational module.`;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="p-8 rounded-3xl bg-white dark:bg-paper-800 border-2 border-amber-300 dark:border-amber-900 shadow-xl space-y-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto border-2 border-amber-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-600">
            Security Firewall • RBAC Boundary
          </span>
          <h2 className="font-serif text-3xl font-bold text-ink dark:text-paper-100">
            Access Restricted to {role}
          </h2>
          <p className="text-xs text-ink-muted dark:text-ink-subtle leading-relaxed max-w-lg mx-auto">
            {reason || defaultReason}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-paper-100 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 text-left text-xs space-y-2 font-mono">
          <div className="flex justify-between">
            <span className="text-ink-muted">Current Session Persona:</span>
            <span className="font-bold text-ink dark:text-paper-100">{role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">Required Clearance:</span>
            <span className="font-bold text-amber-600">{requiredClearance}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {role === 'STUDENT' ? (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal hover:bg-teal-dark text-white font-bold text-xs shadow-md transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Go to My Student Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-saffron hover:bg-saffron-light text-ink font-bold text-xs shadow-md transition-all"
            >
              <span>Return to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          <Link
            href="/copilot"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-100 dark:bg-paper-900 hover:border-saffron text-ink dark:text-paper-100 font-bold text-xs transition-all"
          >
            <Sparkles className="w-4 h-4 text-saffron" />
            <span>Ask AI Copilot</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
