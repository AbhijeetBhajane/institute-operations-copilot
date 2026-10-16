import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { CreditCard, Lock, ArrowRight } from 'lucide-react';
import { FeesTracker } from '@/components/fees/FeesTracker';

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
  const rawInstalments = await prisma.instalment.findMany({
    include: { student: true, payments: true },
    orderBy: { dueDate: 'asc' },
  });

  const now = new Date('2026-10-16T12:00:00.000Z');

  let bucket0to15 = 0;
  let bucket16to30 = 0;
  let bucket30plus = 0;
  let totalPaid = 0;

  const instalments = rawInstalments.map((inst) => {
    const diffDays = Math.floor((now.getTime() - inst.dueDate.getTime()) / (1000 * 3600 * 24));
    if (inst.status === 'PAID') {
      totalPaid += inst.amount;
    } else if (inst.status === 'OVERDUE') {
      if (diffDays <= 15) bucket0to15 += inst.amount;
      else if (diffDays <= 30) bucket16to30 += inst.amount;
      else bucket30plus += inst.amount;
    }

    return {
      id: inst.id,
      instalmentNo: inst.instalmentNo,
      amount: inst.amount,
      dueDate: inst.dueDate.toISOString().split('T')[0],
      status: inst.status,
      studentId: inst.student.id,
      studentName: inst.student.name,
      rollNo: inst.student.rollNo,
      studentPhone: inst.student.phone,
      transactionRef: inst.payments[0]?.transactionRef,
      paidAt: inst.paidAt ? inst.paidAt.toISOString() : undefined,
      diffDays,
    };
  });

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

      {/* Interactive Fees Tracker with Aging & Status filters */}
      <FeesTracker
        instalments={instalments}
        totalPaid={totalPaid}
        bucket0to15={bucket0to15}
        bucket16to30={bucket16to30}
        bucket30plus={bucket30plus}
      />
    </div>
  );
}
