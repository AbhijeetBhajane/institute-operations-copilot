'use client';

import React, { useState, useEffect } from 'react';
import { TimetableSlot, ConflictRecord, SolveResult } from '@/lib/timetable/types';
import {
  Calendar,
  AlertTriangle,
  Play,
  RotateCcw,
  Clock,
  Sparkles,
  CheckCircle2,
  Users,
  DoorOpen,
  BookOpen,
  Info,
  X,
} from 'lucide-react';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

export function TimetableGrid() {
  const [schedule, setSchedule] = useState<TimetableSlot[]>([]);
  const [conflicts, setConflicts] = useState<ConflictRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [solving, setSolving] = useState(false);
  const [viewBy, setViewBy] = useState<'ROOM' | 'TRAINER' | 'BATCH'>('ROOM');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('ALL');
  const [solveResult, setSolveResult] = useState<SolveResult | null>(null);
  const [showChangeReport, setShowChangeReport] = useState(false);
  const [activeSlotModal, setActiveSlotModal] = useState<TimetableSlot | null>(null);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/timetable/solve');
      const data = await res.json();
      setSchedule(data.slots || []);
      setConflicts(data.conflicts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleSolve = async () => {
    setSolving(true);
    try {
      const res = await fetch('/api/timetable/solve', { method: 'POST' });
      const data = await res.json();
      setSolveResult(data);
      setSchedule(data.schedule || []);
      setConflicts(data.conflictsAfter || []);
      setShowChangeReport(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSolving(false);
    }
  };

  const handleTriggerClash = async () => {
    setLoading(true);
    try {
      await fetch('/api/timetable/trigger-clash', { method: 'POST' });
      await fetchSchedule();
      setSolveResult(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getSlotsForCell = (day: string, entityId: string) => {
    return schedule.filter((s) => {
      if (s.day !== day) return false;
      if (viewBy === 'ROOM') return s.roomId === entityId;
      if (viewBy === 'TRAINER') return s.trainerId === entityId;
      return s.batchId === entityId;
    });
  };

  const rooms = Array.from(
    new Set(schedule.map((s) => JSON.stringify({ id: s.roomId, name: s.roomName, cap: s.roomCapacity })))
  ).map((str) => JSON.parse(str));

  const trainers = Array.from(
    new Set(schedule.map((s) => JSON.stringify({ id: s.trainerId, name: s.trainerName })))
  ).map((str) => JSON.parse(str));

  const batches = Array.from(
    new Set(
      schedule.map((s) =>
        JSON.stringify({ id: s.batchId, name: s.batchName, code: s.batchCode, cap: s.roomCapacity })
      )
    )
  ).map((str) => JSON.parse(str));

  const activeEntities = viewBy === 'ROOM' ? rooms : viewBy === 'TRAINER' ? trainers : batches;
  const activeDays = selectedDayFilter === 'ALL' ? DAYS : DAYS.filter((d) => d === selectedDayFilter);

  return (
    <div className="space-y-6">
      {/* Control Banner */}
      <div className="bg-white dark:bg-paper-800 rounded-3xl border border-paper-300 dark:border-paper-700 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-saffron uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Smart Timetable Engine • Constraint Satisfaction Solver</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-ink dark:text-paper-100">
            Weekly Clash-Free Schedule
          </h2>
          <p className="text-xs text-ink-muted dark:text-ink-subtle mt-0.5">
            Real-time constraint solver balancing trainer availability, batch size, and room capacity.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Switcher: Room / Trainer / Batch */}
          <div className="flex items-center bg-paper-100 dark:bg-paper-900 rounded-xl p-1 border border-paper-300 dark:border-paper-700 text-xs font-medium">
            <button
              onClick={() => setViewBy('ROOM')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewBy === 'ROOM'
                  ? 'bg-white dark:bg-paper-800 text-ink dark:text-paper-100 shadow-sm font-bold'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              By Room
            </button>
            <button
              onClick={() => setViewBy('TRAINER')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewBy === 'TRAINER'
                  ? 'bg-white dark:bg-paper-800 text-ink dark:text-paper-100 shadow-sm font-bold'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              By Trainer
            </button>
            <button
              onClick={() => setViewBy('BATCH')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewBy === 'BATCH'
                  ? 'bg-white dark:bg-paper-800 text-ink dark:text-paper-100 shadow-sm font-bold'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              By Batch
            </button>
          </div>

          {/* Filter by Day */}
          <select
            value={selectedDayFilter}
            onChange={(e) => setSelectedDayFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900 text-xs font-mono font-medium text-ink dark:text-paper-100 focus:outline-none"
          >
            <option value="ALL">All Days (Mon-Sat)</option>
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Trigger Deliberate Clash (Demo button) */}
          <button
            onClick={handleTriggerClash}
            disabled={loading || solving}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-semibold text-xs hover:bg-red-100 transition-colors"
            title="Create a deliberate trainer conflict for judging demo"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Trigger Demo Clash
          </button>

          {/* Run CP Solver Button */}
          <button
            onClick={handleSolve}
            disabled={solving || loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron hover:bg-saffron-light active:scale-95 text-ink font-bold text-xs shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4 fill-ink/20" />
            {solving ? 'Solving Constraints...' : 'Re-Plan Schedule'}
          </button>
        </div>
      </div>

      {/* Conflict Alert Banner (If any active clash exists) */}
      {conflicts.length > 0 && (
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm animate-pulse">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs text-amber-900 dark:text-amber-200">
                {conflicts.length} Active Scheduling Conflict Detected
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                {conflicts[0].description}
              </p>
            </div>
          </div>
          <button
            onClick={handleSolve}
            className="px-5 py-2.5 rounded-xl bg-saffron font-bold text-xs text-ink hover:bg-saffron-light flex-shrink-0 shadow-sm"
          >
            Auto-Resolve Conflict Now
          </button>
        </div>
      )}

      {/* Visual Weekly Grid */}
      <div className="bg-white dark:bg-paper-800 rounded-3xl border border-paper-300 dark:border-paper-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-paper-900 border-b border-paper-200 dark:border-paper-700">
                <th className="p-3 text-left text-xs font-mono font-bold text-ink-muted uppercase tracking-wider w-44">
                  {viewBy === 'ROOM' ? 'Room / Capacity' : viewBy === 'TRAINER' ? 'Trainer' : 'Batch / Cohort'}
                </th>
                {activeDays.map((d) => (
                  <th
                    key={d}
                    className="p-3 text-center text-xs font-mono font-bold text-ink dark:text-paper-100 uppercase tracking-wider border-l border-paper-200 dark:border-paper-700 min-w-[170px]"
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-200 dark:divide-paper-700">
              {activeEntities.map((entity) => (
                <tr key={entity.id} className="hover:bg-paper-50 dark:hover:bg-paper-700/20">
                  <td className="p-3 font-medium text-xs text-ink dark:text-paper-100 bg-paper-50 dark:bg-paper-900/40 border-r border-paper-200 dark:border-paper-700">
                    <p className="font-bold">{entity.name}</p>
                    {entity.cap && (
                      <p className="text-[11px] text-ink-muted dark:text-ink-subtle font-mono">
                        Capacity: {entity.cap} seats
                      </p>
                    )}
                    {entity.code && (
                      <p className="text-[10px] text-saffron-dark dark:text-saffron font-mono">
                        {entity.code}
                      </p>
                    )}
                  </td>

                  {activeDays.map((d) => {
                    const slots = getSlotsForCell(d, entity.id);
                    return (
                      <td
                        key={d}
                        className="p-2 border-l border-paper-200 dark:border-paper-700 align-top min-h-[90px]"
                      >
                        <div className="space-y-1.5">
                          {slots.map((s, idx) => {
                            const isConflict = s.hasConflict;
                            return (
                              <button
                                key={idx}
                                onClick={() => setActiveSlotModal(s)}
                                className={`w-full text-left p-2 rounded-xl text-xs space-y-1 border transition-all hover:scale-[1.02] ${
                                  isConflict
                                    ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 shadow-sm'
                                    : 'bg-paper-100 dark:bg-paper-900/80 border-paper-300 dark:border-paper-700 text-ink dark:text-paper-100'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold font-mono text-[10px] text-saffron-dark dark:text-saffron">
                                    {s.startTime} - {s.endTime}
                                  </span>
                                  {isConflict && (
                                    <span className="px-1.5 py-0.2 rounded bg-red-600 text-white font-mono text-[9px] font-bold">
                                      CLASH
                                    </span>
                                  )}
                                </div>
                                <p className="font-bold text-[11px] line-clamp-1">{s.batchName}</p>
                                <div className="text-[10px] text-ink-muted dark:text-ink-subtle flex items-center justify-between">
                                  <span>{viewBy === 'ROOM' ? s.trainerName : s.roomName}</span>
                                  <span className="font-mono">{s.studentCount} enrolled</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slot Details Modal */}
      {activeSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-paper-800 rounded-3xl max-w-md w-full p-6 space-y-4 border border-saffron shadow-2xl relative">
            <button
              onClick={() => setActiveSlotModal(null)}
              className="absolute top-5 right-5 p-1 rounded-full hover:bg-paper-200 dark:hover:bg-paper-700 text-ink-muted"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="font-mono text-[10px] font-bold text-saffron bg-saffron/10 px-2 py-0.5 rounded">
                {activeSlotModal.batchCode} • {activeSlotModal.mode}
              </span>
              <h3 className="font-serif text-xl font-bold text-ink dark:text-paper-100 mt-1">
                {activeSlotModal.batchName}
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-700 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-ink-muted">Time Slot:</span>
                <span className="font-mono font-bold text-ink dark:text-paper-100">
                  {activeSlotModal.day} @ {activeSlotModal.startTime} - {activeSlotModal.endTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Assigned Trainer:</span>
                <span className="font-bold text-ink dark:text-paper-100">{activeSlotModal.trainerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Assigned Room:</span>
                <span className="font-bold text-ink dark:text-paper-100">
                  {activeSlotModal.roomName} (Cap: {activeSlotModal.roomCapacity})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Enrolled Students:</span>
                <span className="font-mono font-bold text-teal">{activeSlotModal.studentCount} students</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveSlotModal(null)}
                className="px-4 py-2 rounded-xl bg-paper-200 dark:bg-paper-700 text-ink dark:text-paper-100 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Report Modal (Appears after solving with written explanation) */}
      {showChangeReport && solveResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-paper-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 border border-saffron shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-paper-200 dark:border-paper-700 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="font-serif text-xl font-bold text-ink dark:text-paper-100">
                  Timetable Change Report & Written Explanation
                </h3>
              </div>
              <span className="font-mono text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                Solved in {solveResult.solveTimeMs}ms
              </span>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none text-xs font-sans leading-relaxed">
              <div
                dangerouslySetInnerHTML={{
                  __html: solveResult.changeReportMarkdown
                    .replace(/\n\n/g, '<br/><br/>')
                    .replace(/### (.*)/g, '<h4 class="text-sm font-bold mt-2">$1</h4>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/`([^`]+)`/g, '<code class="bg-paper-200 dark:bg-paper-700 px-1 py-0.5 rounded font-mono">$1</code>'),
                }}
              />
            </div>

            <div className="pt-3 border-t border-paper-200 dark:border-paper-700 flex justify-end">
              <button
                onClick={() => setShowChangeReport(false)}
                className="px-5 py-2 rounded-xl bg-saffron text-ink font-bold text-xs hover:bg-saffron-light"
              >
                Done / Keep New Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
