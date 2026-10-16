import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { History, Terminal } from 'lucide-react';
import { AuditLogViewer } from '@/components/audit/AuditLogViewer';

export default async function AuditLogPage() {
  const user = await getCurrentUser();

  const rawLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 60,
  });

  const logs = rawLogs.map((l) => ({
    id: l.id,
    createdAt: l.createdAt.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    userName: l.userName,
    role: l.role,
    action: l.action,
    prompt: l.prompt,
    query: l.query,
    executionTimeMs: l.executionTimeMs,
    details: l.details,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-paper-800 p-6 rounded-3xl border border-paper-300 dark:border-paper-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-saffron uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>Immutable Governance & Traceability</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-ink dark:text-paper-100">
            System Audit Log ({logs.length} events)
          </h2>
          <p className="text-xs text-ink-muted dark:text-ink-subtle mt-0.5">
            Cryptographic ledger tracking all Copilot semantic queries, human action authorizations, and timetable re-plans.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/copilot"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-paper-100 dark:bg-paper-700 text-ink dark:text-paper-100 font-bold text-xs hover:bg-paper-200 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-saffron" />
            <span>Run New Query</span>
          </Link>
        </div>
      </div>

      {/* Interactive Audit Log Viewer with filters and CSV export */}
      <AuditLogViewer initialLogs={logs} />
    </div>
  );
}
