'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Copy,
  RefreshCw,
  Search,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { ReconciliationMatchResult } from '@/lib/reconciliation/matcher';

export default function ReconciliationPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Demo statement entries populated from database seed
    const mockEntries = [
      {
        id: 'rec-1',
        utrRef: 'UPI/AXIS/628919283001',
        senderName: 'Aditya Kumar',
        amount: 16000.0,
        status: 'MATCHED',
        confidenceScore: 1.0,
        matchedStudent: 'Aditya Kumar (STU-2026-001)',
        notes: 'Exact match: Amount ₹16,000 matches Instalment 2 due Oct 18',
      },
      {
        id: 'rec-2',
        utrRef: 'UPI/HDFC/992182741002',
        senderName: 'N. Reddy',
        amount: 16000.0,
        status: 'PARTIAL',
        confidenceScore: 0.88,
        matchedStudent: 'Neha Reddy (STU-2026-002)',
        notes: 'Fuzzy similarity (88%): "N. Reddy" corresponds to Neha Reddy',
      },
      {
        id: 'rec-3',
        utrRef: 'UPI/ICIC/448102938003',
        senderName: 'Kunal Patel',
        amount: 16000.0,
        status: 'MATCHED',
        confidenceScore: 0.99,
        matchedStudent: 'Kunal Patel (STU-2026-025)',
        notes: 'Exact match with student name and instalment schedule',
      },
      {
        id: 'rec-4',
        utrRef: 'IMPS/SBI/120938475004',
        senderName: 'Unknown Depositor',
        amount: 12500.0,
        status: 'UNMATCHED',
        confidenceScore: 0.15,
        matchedStudent: '—',
        notes: 'Unrecognized amount (₹12,500); no student record matches sender name',
      },
      {
        id: 'rec-5',
        utrRef: 'UPI/PAYTM/883920192005',
        senderName: 'Duplicate Test Entry',
        amount: 16000.0,
        status: 'DUPLICATE',
        confidenceScore: 1.0,
        matchedStudent: '—',
        notes: 'Duplicate UTR detected in statement ledger; already processed',
      },
    ];
    setEntries(mockEntries);
    setLoading(false);
  }, []);

  const handleApproveMatch = (id: string) => {
    setApprovedIds((prev) => new Set([...prev, id]));
  };

  const handleApproveAllMatched = () => {
    const matchedIds = entries
      .filter((e) => e.status === 'MATCHED' || e.status === 'PARTIAL')
      .map((e) => e.id);
    setApprovedIds(new Set(matchedIds));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-paper-800 p-6 rounded-3xl border border-paper-300 dark:border-paper-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal uppercase tracking-wider mb-1">
            <FileCheck2 className="w-4 h-4" />
            <span>Automated Statement Reconciliation</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-ink dark:text-paper-100">
            Bank & UPI Statement Matcher
          </h2>
          <p className="text-xs text-ink-muted dark:text-ink-subtle mt-0.5">
            Fuzzy matching on sender names, transaction UTRs, and expected instalment amounts.
          </p>
        </div>

        <button
          onClick={handleApproveAllMatched}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron hover:bg-saffron-light active:scale-95 text-ink font-bold text-xs shadow-sm transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>One-Click Approve All High-Confidence Matches</span>
        </button>
      </div>

      {/* CSV Dropzone Banner */}
      <div className="p-6 rounded-3xl border-2 border-dashed border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900/40 text-center space-y-2">
        <UploadCloud className="w-8 h-8 text-teal mx-auto" />
        <h3 className="font-bold text-sm text-ink dark:text-paper-100">
          Upload Bank Statement CSV or UPI Settlement Export
        </h3>
        <p className="text-xs text-ink-muted dark:text-ink-subtle max-w-md mx-auto">
          Currently parsing active HDFC/Axis bank statement batch. Fuzzy reconciliation algorithm correlates depositor initials to registered student names.
        </p>
      </div>

      {/* Statement Reconciliation Grid */}
      <div className="bg-white dark:bg-paper-800 rounded-3xl border border-paper-300 dark:border-paper-700 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-paper-200 dark:border-paper-700 flex items-center justify-between">
          <h4 className="font-serif text-base font-bold text-ink dark:text-paper-100">
            Statement Entries ({entries.length})
          </h4>
          <span className="text-xs font-mono text-ink-muted">Confidence Threshold &gt;= 80%</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-paper-100 dark:bg-paper-900 font-mono text-ink-muted border-b border-paper-200 dark:border-paper-700">
              <tr>
                <th className="p-3">UTR Reference</th>
                <th className="p-3">Sender Name</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Correlated Student</th>
                <th className="p-3">Match Status</th>
                <th className="p-3">Confidence</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-200 dark:divide-paper-700">
              {entries.map((entry) => {
                const isApproved = approvedIds.has(entry.id);
                const isMatched = entry.status === 'MATCHED';
                const isPartial = entry.status === 'PARTIAL';
                const isDuplicate = entry.status === 'DUPLICATE';

                return (
                  <tr
                    key={entry.id}
                    className="hover:bg-paper-50 dark:hover:bg-paper-700/20 transition-colors"
                  >
                    <td className="p-3 font-mono font-bold text-ink dark:text-paper-100">
                      {entry.utrRef}
                    </td>
                    <td className="p-3 font-semibold text-ink dark:text-paper-100">
                      {entry.senderName}
                    </td>
                    <td className="p-3 font-mono font-bold">
                      ₹{entry.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-ink dark:text-paper-200">
                      {entry.matchedStudent}
                      <p className="text-[10px] text-ink-muted dark:text-ink-subtle">{entry.notes}</p>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          isMatched
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                            : isPartial
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                            : isDuplicate
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400'
                            : 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400'
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold">
                      {(entry.confidenceScore * 100).toFixed(0)}%
                    </td>
                    <td className="p-3 text-right">
                      {isApproved ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Reconciled
                        </span>
                      ) : isMatched || isPartial ? (
                        <button
                          onClick={() => handleApproveMatch(entry.id)}
                          className="px-3 py-1 rounded-lg bg-teal text-white hover:bg-teal-dark text-[11px] font-bold transition-all"
                        >
                          Approve Match
                        </button>
                      ) : (
                        <span className="text-[11px] text-ink-muted">Manual Review</span>
                      )}
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
