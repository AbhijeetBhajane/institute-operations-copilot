'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Layers, Search, Filter, Users, X, ArrowRight } from 'lucide-react';

interface BatchItem {
  id: string;
  code: string;
  name: string;
  mode: string;
  daysOfWeek: string;
  startTime: string;
  endTime: string;
  maxStudents: number;
  onlineSeatLimit: number;
  courseName: string;
  trainerName: string;
  roomName: string;
  roomCapacity: number;
  enrollmentCount: number;
  enrollments: { id: string; studentName: string; rollNo: string; email: string }[];
}

interface Props {
  batches: BatchItem[];
}

export function BatchList({ batches }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMode, setSelectedMode] = useState('ALL');
  const [activeBatchModal, setActiveBatchModal] = useState<BatchItem | null>(null);

  const filtered = useMemo(() => {
    return batches.filter((b) => {
      const matchSearch =
        searchTerm === '' ||
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.trainerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchMode = selectedMode === 'ALL' || b.mode === selectedMode;
      return matchSearch && matchMode;
    });
  }, [batches, searchTerm, selectedMode]);

  return (
    <div className="space-y-6">
      {/* Search & Mode Filter */}
      <div className="p-4 rounded-3xl bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by cohort name, course, trainer, or code (e.g. JAVA-2026-A)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900 text-xs text-ink dark:text-paper-100 placeholder:text-ink-muted focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="px-3 py-2 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900 text-xs font-medium text-ink dark:text-paper-100 focus:outline-none"
          >
            <option value="ALL">All Modes</option>
            <option value="HYBRID">Hybrid</option>
            <option value="CLASSROOM">Classroom In-Person</option>
            <option value="ONLINE">Online Virtual</option>
          </select>
        </div>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((b) => {
          const capPercent = b.roomCapacity
            ? Math.round((b.enrollmentCount / b.roomCapacity) * 100)
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
                    <strong className="text-ink dark:text-paper-200">Course:</strong> {b.courseName}
                  </p>
                  <p>
                    <strong className="text-ink dark:text-paper-200">Trainer:</strong> {b.trainerName}
                  </p>
                  <p>
                    <strong className="text-ink dark:text-paper-200">Venue:</strong> {b.roomName}
                  </p>
                  <p className="font-mono text-saffron-dark dark:text-saffron font-bold text-[11px]">
                    🗓️ {b.daysOfWeek} @ {b.startTime} - {b.endTime}
                  </p>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted dark:text-ink-subtle">
                    <span>Physical Capacity</span>
                    <span>
                      {b.enrollmentCount} / {b.maxStudents} seats
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
                <button
                  onClick={() => setActiveBatchModal(b)}
                  className="font-bold text-saffron-dark dark:text-saffron hover:underline flex items-center gap-1"
                >
                  <span>View Students ({b.enrollmentCount})</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cohort Students Modal */}
      {activeBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-paper-800 rounded-3xl max-w-xl w-full p-6 space-y-4 border border-saffron shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveBatchModal(null)}
              className="absolute top-5 right-5 p-1 rounded-full hover:bg-paper-200 dark:hover:bg-paper-700 text-ink-muted"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="font-mono text-[10px] font-bold text-saffron bg-saffron/10 px-2 py-0.5 rounded">
                {activeBatchModal.code} • {activeBatchModal.mode}
              </span>
              <h3 className="font-serif text-2xl font-bold text-ink dark:text-paper-100 mt-1">
                {activeBatchModal.name}
              </h3>
              <p className="text-xs text-ink-muted">
                Mentor: {activeBatchModal.trainerName} • Venue: {activeBatchModal.roomName}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-mono font-bold uppercase text-ink-muted">
                Enrolled Students ({activeBatchModal.enrollments.length}):
              </p>
              <div className="divide-y divide-paper-200 dark:divide-paper-700 max-h-64 overflow-y-auto pr-1">
                {activeBatchModal.enrollments.map((enr) => (
                  <div key={enr.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-ink dark:text-paper-100">{enr.studentName}</p>
                      <p className="text-[11px] text-ink-muted font-mono">{enr.rollNo}</p>
                    </div>
                    <Link
                      href={`/students/${enr.id}`}
                      className="text-teal font-semibold text-[11px] hover:underline"
                    >
                      Student 360 →
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveBatchModal(null)}
                className="px-4 py-2 rounded-xl bg-paper-200 dark:bg-paper-700 text-ink dark:text-paper-100 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
