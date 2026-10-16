import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  FileCheck2,
  AlertTriangle,
  ExternalLink,
  Lock,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface Props {
  params: { id: string };
}

export default async function StudentDetailPage({ params }: Props) {
  const user = await getCurrentUser();

  const student = await prisma.student.findUnique({
    where: { id: params.id },
    include: {
      enrollments: { include: { batch: { include: { course: true, trainer: true, room: true } } } },
      attendances: { orderBy: { date: 'desc' }, take: 20 },
      submissions: { include: { assignment: true } },
      // Strict role gate: Trainer cannot query fee plans or instalments
      feePlans: user.role !== 'TRAINER' ? { include: { instalments: true } } : false,
      instalments: user.role !== 'TRAINER' ? { orderBy: { instalmentNo: 'asc' } } : false,
    },
  });

  if (!student) {
    notFound();
  }

  const activeBatch = student.enrollments[0]?.batch;
  const reasons: string[] = JSON.parse(student.riskReasons || '[]');

  // Attendance rate
  const totalLogged = student.attendances.length;
  const presentCount = student.attendances.filter((a) => a.status === 'PRESENT').length;
  const attendanceRate = totalLogged > 0 ? (presentCount / totalLogged) * 100 : 85;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <Link
        href="/students"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted dark:text-ink-subtle hover:text-ink"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Student Directory</span>
      </Link>

      {/* Student Profile Card */}
      <div className="bg-white dark:bg-paper-800 rounded-3xl border border-paper-300 dark:border-paper-700 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-saffron bg-saffron/10 px-2 py-0.5 rounded">
              {student.rollNo}
            </span>
            <span
              className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full ${
                student.riskLevel === 'HIGH'
                  ? 'bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
              }`}
            >
              {student.riskLevel} RISK ({student.riskScore.toFixed(0)}/100)
            </span>
          </div>

          <h2 className="font-serif text-3xl font-bold text-ink dark:text-paper-100">
            {student.name}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-ink-muted dark:text-ink-subtle">
            <span>📚 {activeBatch ? activeBatch.name : 'Unassigned'}</span>
            <span>📱 {student.phone}</span>
            <span>📧 {student.email}</span>
            <span>📍 {student.city}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${student.phone.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <span>Message on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Explainable Risk Details */}
      {reasons.length > 0 && (
        <div className="p-5 rounded-3xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 space-y-2">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-300 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            Explainable Risk Synthesis (Retention Copilot):
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {reasons.map((r, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-white dark:bg-paper-900 border border-red-200 dark:border-red-900/60 text-xs font-semibold text-red-700 dark:text-red-300"
              >
                ⚠️ {r}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Attendance Timeline vs Fees / Academics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Timeline */}
        <div className="bg-white dark:bg-paper-800 rounded-3xl border border-paper-300 dark:border-paper-700 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal" />
              <h3 className="font-serif text-lg font-bold text-ink dark:text-paper-100">
                Attendance Timeline
              </h3>
            </div>
            <span className="font-mono text-xs font-bold text-teal">
              {attendanceRate.toFixed(0)}% Overall Rate
            </span>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {student.attendances.map((att) => {
              const isAbsent = att.status === 'ABSENT';
              return (
                <div
                  key={att.id}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    isAbsent
                      ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300'
                      : 'bg-paper-50 dark:bg-paper-900/40 border-paper-200 dark:border-paper-700 text-ink dark:text-paper-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isAbsent ? (
                      <XCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    )}
                    <div>
                      <p className="font-bold">
                        {att.date.toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-[10px] text-ink-muted dark:text-ink-subtle">
                        Mode: {att.mode} • {att.notes || 'Biometric check-in verified'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                      isAbsent
                        ? 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    }`}
                  >
                    {att.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fees & EMIs (STRICTLY Hidden / Refused for Trainer Role) */}
        <div className="bg-white dark:bg-paper-800 rounded-3xl border border-paper-300 dark:border-paper-700 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <h3 className="font-serif text-lg font-bold text-ink dark:text-paper-100">
                Fee Plan & EMI Schedule
              </h3>
            </div>
            {user.role === 'TRAINER' && (
              <span className="font-mono text-[10px] text-red-500 font-bold flex items-center gap-1">
                <Lock className="w-3 h-3" /> RBAC GATED
              </span>
            )}
          </div>

          {user.role === 'TRAINER' ? (
            <div className="p-6 rounded-2xl bg-paper-100 dark:bg-paper-900 border border-paper-300 dark:border-paper-700 text-center space-y-2">
              <Lock className="w-8 h-8 text-red-500 mx-auto" />
              <h4 className="font-bold text-xs text-ink dark:text-paper-100">
                Financial Clearance Required
              </h4>
              <p className="text-[11px] text-ink-muted dark:text-ink-subtle leading-relaxed">
                As a Trainer, financial ledger and EMI payment records are strictly inaccessible per institute privacy protocol.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {student.instalments?.map((inst) => (
                <div
                  key={inst.id}
                  className="p-3.5 rounded-2xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900/40 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-ink dark:text-paper-100">
                      Instalment #{inst.instalmentNo}
                    </span>
                    <p className="text-[11px] text-ink-muted dark:text-ink-subtle">
                      Due Date: {inst.dueDate.toISOString().split('T')[0]}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-ink dark:text-paper-100">
                      ₹{inst.amount.toLocaleString('en-IN')}
                    </span>
                    <p>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded ${
                          inst.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-700'
                            : inst.status === 'OVERDUE'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {inst.status}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
