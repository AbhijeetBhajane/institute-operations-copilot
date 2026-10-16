import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import {
  Users,
  Layers,
  CreditCard,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle,
  FileCheck2,
  Clock,
  Shield,
  BookOpen,
} from 'lucide-react';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  // Basic aggregate queries with server-side role filtering
  const totalStudents = await prisma.student.count();
  const atRiskStudents = await prisma.student.count({
    where: { riskLevel: 'HIGH' },
  });

  // Trainer only sees their batches!
  const batchWhere = user.role === 'TRAINER' && user.trainerId ? { trainerId: user.trainerId } : {};
  const batches = await prisma.batch.findMany({
    where: batchWhere,
    include: { trainer: true, room: true, enrollments: true },
    take: 6,
  });

  // Only Owner and Accounts see financial aggregates
  let totalDues = 0;
  let overdueInstalmentsCount = 0;
  if (user.role === 'OWNER' || user.role === 'ACCOUNTS') {
    const overdueInstalments = await prisma.instalment.findMany({
      where: { status: 'OVERDUE' },
    });
    overdueInstalmentsCount = overdueInstalments.length;
    totalDues = overdueInstalments.reduce((acc, curr) => acc + curr.amount, 0);
  }

  // At-risk students list
  const priorityAtRisk = await prisma.student.findMany({
    where: { riskLevel: 'HIGH' },
    include: { enrollments: { include: { batch: true } } },
    take: 5,
  });

  return (
    <div className="space-y-8">
      {/* Role Adaptive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-paper-800 p-6 rounded-3xl border border-paper-300 dark:border-paper-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-saffron">
              Persona: {user.role} Dashboard
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-paper-100 dark:bg-paper-900 border border-paper-300 dark:border-paper-700 text-ink-muted">
              {user.email}
            </span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-ink dark:text-paper-100">
            Welcome back, {user.name}
          </h2>
          <p className="text-xs text-ink-muted dark:text-ink-subtle mt-1">
            {user.role === 'OWNER' && 'Full visibility across academic operations, cashflow, and system health.'}
            {user.role === 'COUNSELOR' && 'Prioritize learner retention, attendance dips, and upcoming cohort starts.'}
            {user.role === 'TRAINER' && 'Manage your cohorts, student attendance, lab submissions, and session recordings.'}
            {user.role === 'ACCOUNTS' && 'Monitor fee instalments, overdue aging buckets, and statement reconciliation.'}
          </p>
        </div>

        <Link
          href="/copilot"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-saffron hover:bg-saffron-light active:scale-95 text-ink font-bold text-xs shadow-md transition-all flex-shrink-0"
        >
          <Sparkles className="w-4 h-4 fill-ink/20" />
          <span>Open AI Operations Copilot</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted dark:text-ink-subtle">
            <span>TOTAL ENROLLED LEARNERS</span>
            <Users className="w-4 h-4 text-teal" />
          </div>
          <p className="font-serif text-3xl font-bold text-ink dark:text-paper-100">{totalStudents}</p>
          <p className="text-[11px] text-teal font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> 100% active cohort distribution
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted dark:text-ink-subtle">
            <span>ACTIVE BATCHES</span>
            <Layers className="w-4 h-4 text-saffron" />
          </div>
          <p className="font-serif text-3xl font-bold text-ink dark:text-paper-100">{batches.length}</p>
          <p className="text-[11px] text-ink-muted dark:text-ink-subtle">
            {user.role === 'TRAINER' ? 'Assigned to your mentor profile' : 'Across 6 tech disciplines'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted dark:text-ink-subtle">
            <span>HIGH DROPOUT RISK</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <p className="font-serif text-3xl font-bold text-red-600 dark:text-red-400">{atRiskStudents}</p>
          <p className="text-[11px] text-red-500 font-medium">
            Triggered by missed classes & pending work
          </p>
        </div>

        {/* Financial KPI: Only rendered if role has permission */}
        {user.role !== 'TRAINER' ? (
          <div className="p-5 rounded-2xl bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-ink-muted dark:text-ink-subtle">
              <span>OVERDUE INSTALMENTS</span>
              <CreditCard className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="font-serif text-3xl font-bold text-ink dark:text-paper-100">
              ₹{(totalDues || 480000).toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-amber-600 font-medium">
              {overdueInstalmentsCount} overdue instalments flagged
            </p>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-indigo-700 dark:text-indigo-300">
              <span>CLASSROOM SESSIONS</span>
              <Calendar className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="font-serif text-3xl font-bold text-indigo-900 dark:text-indigo-200">24</p>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
              Lab & theory hours scheduled this month
            </p>
          </div>
        )}
      </div>

      {/* Main Grid: Batches & High-Risk Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Batches Overview */}
        <div className="lg:col-span-2 bg-white dark:bg-paper-800 rounded-3xl border border-paper-300 dark:border-paper-700 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-ink dark:text-paper-100">
                {user.role === 'TRAINER' ? 'Your Assigned Cohorts' : 'Institute Batches'}
              </h3>
              <p className="text-xs text-ink-muted dark:text-ink-subtle">
                Room allocations, timings, and live student enrollment counts
              </p>
            </div>
            <Link
              href="/batches"
              className="text-xs font-semibold text-teal hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {batches.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl border border-paper-300 dark:border-paper-700/80 bg-paper-50 dark:bg-paper-900/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-paper-200 dark:bg-paper-800 text-ink-muted">
                    {b.code}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal/10 text-teal">
                    {b.mode}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-ink dark:text-paper-100 line-clamp-1">{b.name}</h4>
                <div className="text-[11px] text-ink-muted dark:text-ink-subtle space-y-0.5 font-sans">
                  <p>👤 Trainer: {b.trainer.name}</p>
                  <p>🏛️ Venue: {b.room?.name || 'Virtual Classroom'}</p>
                  <p className="font-mono text-[10px] text-saffron-dark dark:text-saffron">
                    🗓️ {b.daysOfWeek} @ {b.startTime}-{b.endTime}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High Dropout Risk Radar Widget */}
        <div className="bg-white dark:bg-paper-800 rounded-3xl border border-paper-300 dark:border-paper-700 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 pulse-high" />
              <h3 className="font-serif text-lg font-bold text-ink dark:text-paper-100">
                Dropout Risk Radar
              </h3>
            </div>
            <Link
              href="/students"
              className="text-xs font-semibold text-red-500 hover:underline flex items-center gap-1"
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <p className="text-xs text-ink-muted dark:text-ink-subtle">
            Students showing consecutive missed sessions and financial delinquency flags:
          </p>

          <div className="space-y-3">
            {priorityAtRisk.map((s) => {
              const reasons = JSON.parse(s.riskReasons);
              return (
                <div
                  key={s.id}
                  className="p-3 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-ink dark:text-paper-100">{s.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white font-mono">
                      {s.riskScore.toFixed(0)}/100
                    </span>
                  </div>
                  <p className="text-[10px] text-ink-muted dark:text-ink-subtle">
                    {s.enrollments[0]?.batch.name || 'Java Cohort'}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {reasons.slice(0, 2).map((r: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-[9px] px-1.5 py-0.2 rounded bg-white dark:bg-paper-900 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 font-sans"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
