import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Layers, Calendar, DoorOpen, Users, Sparkles, ArrowRight } from 'lucide-react';

export default async function BatchesPage() {
  const user = await getCurrentUser();

  const batchWhere = user.role === 'TRAINER' && user.trainerId ? { trainerId: user.trainerId } : {};
  const batches = await prisma.batch.findMany({
    where: batchWhere,
    include: {
      course: true,
      trainer: true,
      room: true,
      enrollments: true,
    },
    orderBy: { startDate: 'desc' },
  });

  const rooms = await prisma.room.findMany();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-paper-800 p-6 rounded-3xl border border-paper-300 dark:border-paper-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-saffron uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Academic Infrastructure & Batch Matrix</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-ink dark:text-paper-100">
            Batches & Cohorts ({batches.length})
          </h2>
          <p className="text-xs text-ink-muted dark:text-ink-subtle mt-0.5">
            Active batch timings, trainer allocations, room capacity compliance, and delivery modes.
          </p>
        </div>

        <Link
          href="/timetable"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-saffron hover:bg-saffron-light text-ink font-bold text-xs shadow-sm transition-all"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Open Timetable Solver</span>
        </Link>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {batches.map((b) => {
          const capPercent = b.room?.capacity
            ? Math.round((b.enrollments.length / b.room.capacity) * 100)
            : 80;

          return (
            <div
              key={b.id}
              className="p-5 rounded-3xl border border-paper-300 dark:border-paper-700 bg-white dark:bg-paper-800 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-paper-200 dark:bg-paper-800 text-ink-muted">
                    {b.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal/10 text-teal">
                    {b.mode}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-ink dark:text-paper-100 line-clamp-1">
                  {b.name}
                </h3>

                <div className="text-xs text-ink-muted dark:text-ink-subtle space-y-1 font-sans">
                  <p>
                    <strong className="text-ink dark:text-paper-200">Course:</strong> {b.course.name}
                  </p>
                  <p>
                    <strong className="text-ink dark:text-paper-200">Trainer:</strong> {b.trainer.name}
                  </p>
                  <p>
                    <strong className="text-ink dark:text-paper-200">Venue:</strong>{' '}
                    {b.room ? b.room.name : 'Online Classroom'}
                  </p>
                  <p className="font-mono text-saffron-dark dark:text-saffron font-bold text-[11px]">
                    🗓️ {b.daysOfWeek} @ {b.startTime} - {b.endTime}
                  </p>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted dark:text-ink-subtle">
                    <span>Enrollment Capacity</span>
                    <span>
                      {b.enrollments.length} / {b.maxStudents} seats
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-paper-200 dark:bg-paper-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        capPercent > 90 ? 'bg-amber-500' : 'bg-teal'
                      }`}
                      style={{ width: `${Math.min(100, capPercent)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-paper-200 dark:border-paper-700 flex items-center justify-between text-xs">
                <span className="font-mono text-teal font-medium">
                  {b.onlineSeatLimit} online seats
                </span>
                <Link
                  href="/students"
                  className="font-bold text-saffron-dark dark:text-saffron hover:underline flex items-center gap-1"
                >
                  <span>Cohort Students</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Room Infrastructure Monitor */}
      <div className="bg-white dark:bg-paper-800 rounded-3xl border border-paper-300 dark:border-paper-700 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <DoorOpen className="w-5 h-5 text-teal" />
          <h3 className="font-serif text-xl font-bold text-ink dark:text-paper-100">
            Physical Room Venues & Hardware Infrastructure
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-2xl bg-paper-50 dark:bg-paper-900/60 border border-paper-200 dark:border-paper-700 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink dark:text-paper-100">{r.name}</span>
                <span className="px-2 py-0.5 rounded bg-paper-200 dark:bg-paper-800 text-[10px] font-mono font-bold">
                  {r.capacity} Seats
                </span>
              </div>
              <p className="text-[11px] text-ink-muted dark:text-ink-subtle">{r.features}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
