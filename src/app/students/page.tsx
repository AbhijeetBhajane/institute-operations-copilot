import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Users, Search, AlertTriangle, Shield, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';

export default async function StudentsPage() {
  const user = await getCurrentUser();

  // If Trainer, filter to students in their batches
  const studentWhere =
    user.role === 'TRAINER' && user.trainerId
      ? {
          enrollments: {
            some: {
              batch: { trainerId: user.trainerId },
            },
          },
        }
      : {};

  const students = await prisma.student.findMany({
    where: studentWhere,
    include: {
      enrollments: { include: { batch: true } },
      instalments: user.role !== 'TRAINER',
    },
    orderBy: { riskScore: 'desc' },
    take: 60,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-paper-800 p-6 rounded-3xl border border-paper-300 dark:border-paper-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Learner Directory & Dropout Risk Radar</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-ink dark:text-paper-100">
            Enrolled Students ({students.length})
          </h2>
          <p className="text-xs text-ink-muted dark:text-ink-subtle mt-0.5">
            Real-time student profiles with multi-factor retention risk scoring and academic timelines.
          </p>
        </div>

        <Link
          href="/copilot"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-saffron hover:bg-saffron-light text-ink font-bold text-xs shadow-sm transition-all"
        >
          <span>Ask Copilot to Filter</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((s) => {
          const isHighRisk = s.riskLevel === 'HIGH';
          const isMediumRisk = s.riskLevel === 'MEDIUM';
          const reasons: string[] = JSON.parse(s.riskReasons || '[]');
          const batch = s.enrollments[0]?.batch;

          return (
            <div
              key={s.id}
              className={`p-5 rounded-3xl border bg-white dark:bg-paper-800 shadow-sm transition-all flex flex-col justify-between ${
                isHighRisk
                  ? 'border-red-300 dark:border-red-900/60 ring-1 ring-red-400/20'
                  : 'border-paper-300 dark:border-paper-700 hover:border-paper-400'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-ink-muted dark:text-ink-subtle">
                      {s.rollNo}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-ink dark:text-paper-100">
                      {s.name}
                    </h3>
                  </div>

                  {/* Risk Badge with Glowing Pulse */}
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                      isHighRisk
                        ? 'bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800'
                        : isMediumRisk
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                        : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    {isHighRisk && <span className="w-2 h-2 rounded-full bg-red-500 pulse-high" />}
                    <span>
                      {s.riskLevel} RISK ({s.riskScore.toFixed(0)})
                    </span>
                  </div>
                </div>

                {/* Cohort & Contact */}
                <div className="text-xs text-ink-muted dark:text-ink-subtle space-y-1">
                  <p className="font-medium text-ink dark:text-paper-200">
                    📚 {batch ? batch.name : 'Unassigned Batch'}
                  </p>
                  <p>📱 {s.phone}</p>
                  <p>📍 {s.city}</p>
                </div>

                {/* Explainable Risk Reason Chips */}
                {reasons.length > 0 && (
                  <div className="p-3 rounded-2xl bg-paper-100 dark:bg-paper-900/80 border border-paper-200 dark:border-paper-700/80 space-y-1.5">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted dark:text-ink-subtle flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-red-500" /> Explainable Risk Flags:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {reasons.map((r, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-paper-200 dark:border-paper-700 mt-4 flex items-center justify-between">
                <Link
                  href={`/students/${s.id}`}
                  className="text-xs font-bold text-teal hover:underline flex items-center gap-1"
                >
                  <span>Student 360</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <a
                  href={`https://wa.me/${s.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>WhatsApp</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
