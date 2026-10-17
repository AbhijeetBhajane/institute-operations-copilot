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

  // If logged in as STUDENT, render the dedicated Student Learning Portal!
  if (user.role === 'STUDENT') {
    const student = await prisma.student.findUnique({
      where: { id: user.studentId || 'stu-001' },
      include: {
        enrollments: {
          include: {
            batch: {
              include: { course: true, trainer: true, room: true },
            },
          },
        },
        attendances: {
          orderBy: { date: 'desc' },
          take: 12,
        },
        instalments: {
          orderBy: { instalmentNo: 'asc' },
        },
        certificates: true,
      },
    });

    const activeEnrollment = student?.enrollments[0];
    const activeBatch = activeEnrollment?.batch;
    const recordings = activeBatch
      ? await prisma.recording.findMany({
          where: { batchId: activeBatch.id },
          take: 4,
          orderBy: { sessionDate: 'desc' },
        })
      : [];

    const totalAtt = student?.attendances.length || 0;
    const presentAtt = student?.attendances.filter((a) => a.status === 'PRESENT').length || 0;
    const absentAtt = student?.attendances.filter((a) => a.status === 'ABSENT').length || 0;
    const attPct = totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 100) : 80;

    const overdues = student?.instalments.filter((i) => i.status === 'OVERDUE') || [];
    const dues = student?.instalments.filter((i) => i.status === 'DUE') || [];
    const paids = student?.instalments.filter((i) => i.status === 'PAID') || [];
    const nextDueEmi = overdues[0] || dues[0] || null;
    const totalPaidAmount = paids.reduce((acc, curr) => acc + curr.amount, 0);

    return (
      <div className="space-y-8">
        {/* Student Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-sky-50 via-paper-50 to-teal/10 dark:from-sky-950/40 dark:via-paper-800 dark:to-teal-950/30 p-6 rounded-3xl border border-sky-200 dark:border-sky-900 shadow-sm relative overflow-hidden">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                Learner Portal • Enrolled in {activeBatch?.name || 'Java Cohort Alpha'}
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white dark:bg-paper-800 text-ink-muted dark:text-ink-subtle font-bold border border-sky-200 dark:border-sky-800">
                {student?.rollNo || 'STU-2026-001'}
              </span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-ink dark:text-paper-100">
              Welcome back, {student?.name || user.name}!
            </h2>
            <p className="text-xs text-ink-muted dark:text-ink-subtle">
              Track your weekly lecture schedule, verify attendance marks, download fee receipts, and access recorded masterclasses.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/copilot"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-saffron hover:bg-saffron-light active:scale-95 text-ink font-bold text-xs shadow-md transition-all flex-shrink-0"
            >
              <Sparkles className="w-4 h-4 fill-ink/20" />
              <span>Ask Student AI Copilot</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Key Student Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Attendance */}
          <div className="p-5 rounded-2xl bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-ink-muted dark:text-ink-subtle">
              <span>MY ATTENDANCE</span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="font-serif text-3xl font-bold text-ink dark:text-paper-100">{attPct}%</p>
            <p className="text-[11px] text-emerald-600 font-medium">
              {presentAtt} sessions present • {absentAtt} absent
            </p>
            <div className="w-full h-1.5 rounded-full bg-paper-200 dark:bg-paper-700 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${attPct}%` }} />
            </div>
          </div>

          {/* Card 2: Next Fee EMI */}
          <div className="p-5 rounded-2xl bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-ink-muted dark:text-ink-subtle">
              <span>NEXT INSTALMENT</span>
              <CreditCard className="w-4 h-4 text-teal" />
            </div>
            <p className="font-serif text-3xl font-bold text-ink dark:text-paper-100">
              ₹{nextDueEmi ? nextDueEmi.amount.toLocaleString('en-IN') : '0'}
            </p>
            <p className="text-[11px] text-amber-600 font-medium">
              {nextDueEmi ? `Due on ${nextDueEmi.dueDate.toISOString().split('T')[0]}` : 'All Fees Paid ✓'}
            </p>
            <p className="text-[10px] text-ink-muted dark:text-ink-subtle">
              Paid: ₹{totalPaidAmount.toLocaleString('en-IN')} of ₹48,000
            </p>
          </div>

          {/* Card 3: Batch & Schedule */}
          <div className="p-5 rounded-2xl bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-ink-muted dark:text-ink-subtle">
              <span>CLASS SCHEDULE</span>
              <Calendar className="w-4 h-4 text-saffron" />
            </div>
            <p className="font-serif text-lg font-bold text-ink dark:text-paper-100 truncate">
              {activeBatch?.daysOfWeek || 'MON,WED,FRI'}
            </p>
            <p className="text-[11px] text-saffron-dark dark:text-saffron font-mono font-semibold">
              {activeBatch?.startTime || '09:00'} - {activeBatch?.endTime || '11:30'}
            </p>
            <p className="text-[10px] text-ink-muted dark:text-ink-subtle">
              Venue: {activeBatch?.room?.name || 'Room 101'}
            </p>
          </div>

          {/* Card 4: Trainer Profile */}
          <div className="p-5 rounded-2xl bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-ink-muted dark:text-ink-subtle">
              <span>COURSE MENTOR</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="font-serif text-lg font-bold text-ink dark:text-paper-100 truncate">
              {activeBatch?.trainer.name || 'Priya Sharma'}
            </p>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
              Lead Enterprise Architect
            </p>
            <p className="text-[10px] text-ink-muted dark:text-ink-subtle truncate">
              Specialization: Microservices & Spring
            </p>
          </div>
        </div>

        {/* Schedule & Attendance Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Enrolled Batch & Weekly Timetable */}
          <div className="lg:col-span-2 bg-white dark:bg-paper-800 rounded-3xl border border-paper-300 dark:border-paper-700 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-paper-200 dark:border-paper-700 pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-ink dark:text-paper-100">
                  Enrolled Cohort Curriculum
                </h3>
                <p className="text-xs text-ink-muted dark:text-ink-subtle">
                  {activeBatch?.course.name || 'Java Full Stack & Cloud Microservices'}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal/10 text-teal">
                Mode: {activeBatch?.mode || 'HYBRID'}
              </span>
            </div>

            {/* Weekly Timetable slots */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-ink-muted dark:text-ink-subtle uppercase tracking-wider">
                Weekly Class Routine:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { day: 'Monday', time: '09:00 - 11:30 AM', topic: 'Core Java, Streams & Lambdas', room: 'Room 101' },
                  { day: 'Wednesday', time: '09:00 - 11:30 AM', topic: 'Spring Boot 3 RESTful APIs', room: 'Room 101' },
                  { day: 'Friday', time: '09:00 - 11:30 AM', topic: 'Docker Containerization Lab', room: 'Room 101' },
                ].map((slot, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-700/80 space-y-1"
                  >
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-saffron/20 text-saffron-dark dark:text-saffron">
                      {slot.day}
                    </span>
                    <p className="font-bold text-xs text-ink dark:text-paper-100 mt-1">{slot.topic}</p>
                    <p className="text-[11px] font-mono text-ink-muted dark:text-ink-subtle">{slot.time}</p>
                    <p className="text-[10px] text-teal font-medium">📍 {slot.room}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Attendance Log */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-ink-muted dark:text-ink-subtle uppercase tracking-wider">
                  Recent Session Telemetry:
                </h4>
                <span className="text-[11px] font-mono text-ink-muted dark:text-ink-subtle">
                  Verified by Biometric Turnstile
                </span>
              </div>
              <div className="divide-y divide-paper-200 dark:divide-paper-700 text-xs">
                {student?.attendances.slice(0, 5).map((att, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-ink dark:text-paper-100 font-bold">
                        {att.date.toISOString().split('T')[0]}
                      </span>
                      <span className="text-[11px] text-ink-muted dark:text-ink-subtle ml-2">
                        {att.mode === 'CLASSROOM' ? '🏫 In-Person Lab' : '💻 Virtual Webhook'}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                        att.status === 'PRESENT'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                      }`}
                    >
                      {att.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Fee Ledger & Receipts */}
          <div className="bg-white dark:bg-paper-800 rounded-3xl border border-paper-300 dark:border-paper-700 p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-paper-200 dark:border-paper-700 pb-3">
                <h3 className="font-serif text-lg font-bold text-ink dark:text-paper-100 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-teal" />
                  <span>My Fee Instalment Ledger</span>
                </h3>
                <p className="text-xs text-ink-muted dark:text-ink-subtle">
                  Official payment receipt history and upcoming schedules
                </p>
              </div>

              <div className="space-y-3">
                {student?.instalments.map((inst, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border border-paper-200 dark:border-paper-700 bg-paper-50 dark:bg-paper-900/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-ink dark:text-paper-100">
                        Instalment #{inst.instalmentNo}
                      </p>
                      <p className="font-mono text-[11px] text-ink-muted dark:text-ink-subtle">
                        Due: {inst.dueDate.toISOString().split('T')[0]}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-mono font-bold text-ink dark:text-paper-100">
                        ₹{inst.amount.toLocaleString('en-IN')}
                      </p>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inst.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                        }`}
                      >
                        {inst.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal/10 border border-teal/30 space-y-2">
              <p className="text-xs font-bold text-teal dark:text-teal-light flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>Verified Payment Confirmation</span>
              </p>
              <p className="text-[11px] text-ink-muted dark:text-ink-subtle leading-relaxed">
                Receipts are signed by ClassPilot Financial Services. Need fee assistance? Ask your counselor or discuss flexible plans.
              </p>
              <Link
                href="/students/stu-001"
                className="inline-flex items-center gap-1 text-xs font-bold text-teal hover:underline pt-1"
              >
                <span>View Full Academic 360 Dossier →</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Course Masterclass Recordings for Student */}
        <div className="bg-white dark:bg-paper-800 rounded-3xl border border-paper-300 dark:border-paper-700 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-ink dark:text-paper-100">
                Recorded Masterclasses ({recordings.length})
              </h3>
              <p className="text-xs text-ink-muted dark:text-ink-subtle">
                Private recorded lectures for {activeBatch?.name || 'your cohort'}
              </p>
            </div>
            <Link
              href="/recordings"
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>All Recordings</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recordings.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl border border-paper-200 dark:border-paper-700 bg-paper-50 dark:bg-paper-900/60 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <span className="font-mono text-[10px] text-indigo-600 font-bold">
                    {rec.durationMins} MINS
                  </span>
                  <h4 className="font-serif font-bold text-xs text-ink dark:text-paper-100 line-clamp-2">
                    {rec.sessionTitle}
                  </h4>
                  <p className="text-[10px] text-ink-muted dark:text-ink-subtle line-clamp-1">
                    {rec.notes}
                  </p>
                </div>
                <Link
                  href="/recordings"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition-colors"
                >
                  <span>Watch Session ▶</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Staff Aggregate queries with server-side role filtering
  const totalStudents = await prisma.student.count();
  const atRiskStudents = await prisma.student.count({
    where: { riskLevel: 'HIGH' },
  });

  const batchWhere = user.role === 'TRAINER' && user.trainerId ? { trainerId: user.trainerId } : {};
  const batches = await prisma.batch.findMany({
    where: batchWhere,
    include: { trainer: true, room: true, enrollments: true },
    take: 6,
  });

  let totalDues = 0;
  let overdueInstalmentsCount = 0;
  if (user.role === 'OWNER' || user.role === 'ACCOUNTS') {
    const overdueInstalments = await prisma.instalment.findMany({
      where: { status: 'OVERDUE' },
    });
    overdueInstalmentsCount = overdueInstalments.length;
    totalDues = overdueInstalments.reduce((acc, curr) => acc + curr.amount, 0);
  }

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
