import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Video, Play, Lock, Clock, ExternalLink } from 'lucide-react';

export default async function RecordingsPage() {
  const user = await getCurrentUser();

  const batchWhere = user.role === 'TRAINER' && user.trainerId ? { batch: { trainerId: user.trainerId } } : {};
  const recordings = await prisma.recording.findMany({
    where: batchWhere,
    include: { batch: { include: { trainer: true } } },
    orderBy: { sessionDate: 'desc' },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-paper-800 p-6 rounded-3xl border border-paper-300 dark:border-paper-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <Video className="w-4 h-4" />
            <span>Classroom Session Recordings Library</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-ink dark:text-paper-100">
            Recorded Masterclasses ({recordings.length})
          </h2>
          <p className="text-xs text-ink-muted dark:text-ink-subtle mt-0.5">
            Encrypted playback links restricted to enrolled cohort students and assigned trainers.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recordings.map((rec) => (
          <div
            key={rec.id}
            className="p-5 rounded-3xl bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-40 rounded-2xl bg-paper-200 dark:bg-paper-900 border border-paper-300 dark:border-paper-700 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-saffron text-ink flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                  <Play className="w-5 h-5 fill-ink ml-0.5" />
                </div>
                <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 text-white font-mono text-[10px]">
                  {rec.durationMins} Mins
                </span>
              </div>

              <div>
                <span className="font-mono text-[10px] text-teal font-bold">
                  {rec.batch.name}
                </span>
                <h3 className="font-serif text-lg font-bold text-ink dark:text-paper-100 line-clamp-1 mt-0.5">
                  {rec.sessionTitle}
                </h3>
                <p className="text-xs text-ink-muted dark:text-ink-subtle mt-1 line-clamp-2">
                  {rec.notes}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-paper-200 dark:border-paper-700 flex items-center justify-between text-xs font-mono">
              <span className="text-ink-muted">Passcode: {rec.passcode || 'RESTRICTED'}</span>
              <span className="text-teal font-bold flex items-center gap-1">
                <Lock className="w-3 h-3" /> Enrolled Only
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
