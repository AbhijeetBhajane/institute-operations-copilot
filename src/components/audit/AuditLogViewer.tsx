'use client';

import React, { useState, useMemo } from 'react';
import { History, Search, Filter, Download, RotateCcw, Terminal } from 'lucide-react';

interface AuditItem {
  id: string;
  createdAt: string;
  userName: string;
  role: string;
  action: string;
  prompt?: string | null;
  query?: string | null;
  executionTimeMs?: number | null;
  details?: string | null;
}

interface Props {
  initialLogs: AuditItem[];
}

export function AuditLogViewer({ initialLogs }: Props) {
  const [logs] = useState(initialLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedAction, setSelectedAction] = useState('ALL');

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        searchTerm === '' ||
        (log.prompt && log.prompt.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.userName && log.userName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchRole = selectedRole === 'ALL' || log.role === selectedRole;
      const matchAction = selectedAction === 'ALL' || log.action === selectedAction;

      return matchSearch && matchRole && matchAction;
    });
  }, [logs, searchTerm, selectedRole, selectedAction]);

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'User', 'Role', 'Action', 'Prompt', 'ExecutionTimeMs', 'Details'];
    const csvRows = [
      headers.join(','),
      ...filtered.map((l) =>
        [
          `"${l.id}"`,
          `"${l.createdAt}"`,
          `"${l.userName}"`,
          `"${l.role}"`,
          `"${l.action}"`,
          `"${(l.prompt || '').replace(/"/g, '""')}"`,
          `"${l.executionTimeMs || 0}"`,
          `"${(l.details || '').replace(/"/g, '""')}"`,
        ].join(',')
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `classpilot_audit_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Control Filter Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail by prompt, actor, or details..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900 text-xs text-ink dark:text-paper-100 placeholder:text-ink-muted focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900 text-xs font-medium text-ink dark:text-paper-100 focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="OWNER">Owner</option>
            <option value="COUNSELOR">Counselor</option>
            <option value="TRAINER">Trainer</option>
            <option value="ACCOUNTS">Accounts</option>
            <option value="SYSTEM">System</option>
          </select>

          {/* Action Filter */}
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-2 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900 text-xs font-medium text-ink dark:text-paper-100 focus:outline-none"
          >
            <option value="ALL">All Actions</option>
            <option value="COPILOT_QUERY">Copilot Query</option>
            <option value="COPILOT_ACTION_EXECUTE">Action Execute</option>
            <option value="COPILOT_ACTION_REJECT">Action Reject</option>
            <option value="TIMETABLE_REPLAN">Timetable Re-plan</option>
            <option value="COPILOT_QUERY_REFUSED">RBAC Refusal</option>
          </select>

          {/* Export to CSV Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal text-white hover:bg-teal-dark font-bold text-xs shadow-sm transition-all"
            title="Download CSV export"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white dark:bg-paper-800 rounded-3xl border border-paper-300 dark:border-paper-700 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-paper-200 dark:border-paper-700 flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-ink dark:text-paper-100">
            Audit Trail Records ({filtered.length} matching events)
          </h3>
          <span className="text-xs font-mono text-ink-muted">Cryptographic Traceability</span>
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
              {filtered.map((log) => {
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
                      {log.createdAt}
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
