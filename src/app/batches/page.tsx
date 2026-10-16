import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Layers, Calendar, DoorOpen } from 'lucide-react';
import { BatchList } from '@/components/batches/BatchList';

export default async function BatchesPage() {
  const user = await getCurrentUser();

  const batchWhere = user.role === 'TRAINER' && user.trainerId ? { trainerId: user.trainerId } : {};
  const rawBatches = await prisma.batch.findMany({
    where: batchWhere,
    include: {
      course: true,
      trainer: true,
      room: true,
      enrollments: {
        include: { student: true },
      },
    },
    orderBy: { startDate: 'desc' },
  });

  const batches = rawBatches.map((b) => ({
    id: b.id,
    code: b.code,
    name: b.name,
    mode: b.mode,
    daysOfWeek: b.daysOfWeek,
    startTime: b.startTime,
    endTime: b.endTime,
    maxStudents: b.maxStudents,
    onlineSeatLimit: b.onlineSeatLimit,
    courseName: b.course.name,
    trainerName: b.trainer.name,
    roomName: b.room ? b.room.name : 'Virtual Classroom',
    roomCapacity: b.room ? b.room.capacity : 35,
    enrollmentCount: b.enrollments.length,
    enrollments: b.enrollments.map((e) => ({
      id: e.student.id,
      studentName: e.student.name,
      rollNo: e.student.rollNo,
      email: e.student.email,
    })),
  }));

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

      {/* Interactive Batch List with filters and student inspection */}
      <BatchList batches={batches} />

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
