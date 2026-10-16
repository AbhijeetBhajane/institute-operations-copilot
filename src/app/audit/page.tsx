import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { History, Shield, Download, Filter, Terminal, CheckCircle } from 'lucide-react';

export default async function AuditLogPage() {
  const user = await getCurrentUser();

  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

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
            System Audit Log ({auditLogs.length} events)
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

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-paper-800 rounded-3xl border border-paper-300 dark:border-paper-700 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-paper-200 dark:border-paper-700 flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-ink dark:text-paper-100">
            Audit Trail Records
          </h3>
          <span className="text-xs font-mono text-ink-muted">ISO 27001 Access Ledger</span>
        </div>

        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-paper-100 dark:bg-paper-900 font-mono text-ink-muted border-b border-paper-200 dark:border-paper-700 sticky top-0">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor & Role</th>
                <th className="p-3">Action Type</th>
                <th className="p-3">Prompt / Event</th>
                <th className="p-3">Latency</th>
                <th className="p-3">Telemetry Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-200 dark:divide-paper-700">
              {auditLogs.map((log) => {
                const isRefusal = log.action === 'COPILOT_QUERY_REFUSED';
                const isExecution = log.action === 'COPILOT_ACTION_EXECUTE';
                const isReplan = log.action === 'TIMETABLE_REPLAN';

                return (
                  <tr
                    key={log.id}
                    className={`hover:bg-paper-50 dark:hover:bg-paper-700/20 transition-colors ${
                      isRefusal ? 'bg-red-50/40 dark:bg-red-950/20' : ''
                    }`}
                  >
                    <td className="p-3 font-mono text-[11px] text-ink-muted whitespace-nowrap">
                      {log.createdAt.toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="p-3 font-medium text-ink dark:text-paper-100">
                      {log.userName}
                      <span className="ml-1.5 px-1.5 py-0.2 rounded bg-paper-200 dark:bg-paper-700 font-mono text-[9px] font-bold">
                        {log.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          isRefusal
                            ? 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400'
                            : isExecution
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                            : isReplan
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400'
                            : 'bg-paper-200 dark:bg-paper-700 text-ink-muted'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-ink dark:text-paper-100 max-w-xs truncate font-sans">
                      {log.prompt || '—'}
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-600">
                      {log.executionTimeMs ? `${log.executionTimeMs}ms` : '—'}
                    </td>
                    <td className="p-3 text-[11px] text-ink-muted dark:text-ink-subtle max-w-sm truncate">
                      {log.details || log.query || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
