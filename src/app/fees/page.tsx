import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { CreditCard, Lock, AlertOctagon, TrendingUp, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export default async function FeesPage() {
  const user = await getCurrentUser();

  // STRICT SERVER-SIDE ENFORCEMENT: Trainer is strictly prohibited
  if (user.role === 'TRAINER') {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto border-2 border-red-300 dark:border-red-800">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-ink dark:text-paper-100">
          403 Forbidden: Financial Clearance Required
        </h2>
        <p className="text-sm text-ink-muted dark:text-ink-subtle leading-relaxed">
          Access to fee plans, instalment statuses, cash collections, and payment logs is restricted to the Accounts and Owner roles. As a Trainer ({user.name}), your scope is limited to academic mentoring and attendance tracking.
        </p>
        <div className="pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-paper-200 dark:bg-paper-800 text-ink dark:text-paper-100 font-bold text-xs"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Fetch all instalments
  const instalments = await prisma.instalment.findMany({
    include: { student: true, payments: true },
    orderBy: { dueDate: 'asc' },
  });

  const now = new Date('2026-10-16T12:00:00.000Z');

  // Calculate Aging Buckets for Overdue
  let bucket0to15 = 0;
  let bucket16to30 = 0;
  let bucket30plus = 0;
  let totalOverdue = 0;
  let totalPaid = 0;

  for (const inst of instalments) {
    if (inst.status === 'PAID') {
      totalPaid += inst.amount;
    } else if (inst.status === 'OVERDUE') {
      totalOverdue += inst.amount;
      const diffDays = Math.floor((now.getTime() - inst.dueDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays <= 15) bucket0to15 += inst.amount;
      else if (diffDays <= 30) bucket16to30 += inst.amount;
      else bucket30plus += inst.amount;
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-paper-800 p-6 rounded-3xl border border-paper-300 dark:border-paper-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4" />
            <span>Accounts & Instalment Management</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-ink dark:text-paper-100">
            Fees & Overdue Aging Tracker
          </h2>
          <p className="text-xs text-ink-muted dark:text-ink-subtle mt-0.5">
            Real-time instalment collections, payment reconciliation, and overdue delinquency aging.
          </p>
        </div>

        <Link
          href="/reconciliation"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal text-white font-bold text-xs shadow-sm hover:bg-teal-dark transition-all"
        >
          <span>Statement Reconciliation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Aging Buckets Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 shadow-sm space-y-1">
          <p className="text-xs font-mono text-ink-muted dark:text-ink-subtle">TOTAL COLLECTIONS (PAID)</p>
          <p className="font-serif text-3xl font-bold text-emerald-600">
            ₹{totalPaid.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">Reconciled via UPI / Netbanking</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-paper-800 border border-amber-200 dark:border-amber-900/60 shadow-sm space-y-1">
          <p className="text-xs font-mono text-amber-600">OVERDUE (0 - 15 DAYS)</p>
          <p className="font-serif text-3xl font-bold text-amber-600">
            ₹{bucket0to15.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-ink-muted">Grace period & gentle reminder stage</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-paper-800 border border-orange-200 dark:border-orange-900/60 shadow-sm space-y-1">
          <p className="text-xs font-mono text-orange-600">OVERDUE (16 - 30 DAYS)</p>
          <p className="font-serif text-3xl font-bold text-orange-600">
            ₹{bucket16to30.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-ink-muted">Counselor telephone outreach</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-paper-800 border border-red-200 dark:border-red-900/60 shadow-sm space-y-1">
          <p className="text-xs font-mono text-red-600">CRITICAL OVERDUE (30+ DAYS)</p>
          <p className="font-serif text-3xl font-bold text-red-600">
            ₹{bucket30plus.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-red-500 font-medium">LMS recording access lock candidate</p>
        </div>
      </div>

      {/* Instalments Table */}
      <div className="bg-white dark:bg-paper-800 rounded-3xl border border-paper-300 dark:border-paper-700 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-paper-200 dark:border-paper-700 flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-ink dark:text-paper-100">
            Instalment Ledger ({instalments.length} records)
          </h3>
          <span className="text-xs font-mono text-ink-muted">Sorted chronologically by due date</span>
        </div>

        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-paper-100 dark:bg-paper-900 font-mono text-ink-muted border-b border-paper-200 dark:border-paper-700 sticky top-0">
              <tr>
                <th className="p-3">Roll No</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">EMI #</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Transaction UTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-200 dark:divide-paper-700">
              {instalments.slice(0, 40).map((inst) => {
                const isOverdue = inst.status === 'OVERDUE';
                const isPaid = inst.status === 'PAID';
                const payment = inst.payments[0];

                return (
                  <tr
                    key={inst.id}
                    className="hover:bg-paper-50 dark:hover:bg-paper-700/30 transition-colors"
                  >
                    <td className="p-3 font-mono font-bold">{inst.student.rollNo}</td>
                    <td className="p-3 font-semibold text-ink dark:text-paper-100">
                      {inst.student.name}
                    </td>
                    <td className="p-3 font-mono">EMI #{inst.instalmentNo}</td>
                    <td className="p-3 font-mono font-bold">
                      ₹{inst.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 font-mono">{inst.dueDate.toISOString().split('T')[0]}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-700'
                            : isOverdue
                            ? 'bg-red-100 text-red-600'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {inst.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-ink-muted">
                      {payment ? payment.transactionRef : '—'}
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
