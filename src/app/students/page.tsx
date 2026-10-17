import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Users, ArrowRight } from 'lucide-react';
import { StudentDirectory } from '@/components/students/StudentDirectory';
import { AccessRestrictedCard } from '@/components/layout/AccessRestrictedCard';

export default async function StudentsPage() {
  const user = await getCurrentUser();

  if (user.role === 'STUDENT') {
    return (
      <AccessRestrictedCard
        role={user.role}
        requiredClearance="Counselor, Trainer, or Owner Clearance"
        reason="Students only have access to their personal Student 360 dossier and learning portal. Browsing the master directory of other enrolled learners is restricted."
      />
    );
  }

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

  const rawStudents = await prisma.student.findMany({
    where: studentWhere,
    include: {
      enrollments: { include: { batch: { include: { course: true } } } },
    },
    orderBy: { riskScore: 'desc' },
  });

  const allBatches = await prisma.batch.findMany({
    select: { name: true },
    distinct: ['name'],
  });

  const students = rawStudents.map((s) => ({
    id: s.id,
    rollNo: s.rollNo,
    name: s.name,
    email: s.email,
    phone: s.phone,
    city: s.city,
    status: s.status,
    riskScore: s.riskScore,
    riskLevel: s.riskLevel,
    riskReasons: s.riskReasons,
    batchName: s.enrollments[0]?.batch?.name,
    courseName: s.enrollments[0]?.batch?.course?.name,
  }));

  const batchNames = allBatches.map((b) => b.name);

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
          <span>Ask Copilot about a Student</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Interactive Directory with live search, filters & sort */}
      <StudentDirectory students={students} batches={batchNames} />
    </div>
  );
}
