'use client';

import React, { useState } from 'react';
import {
  QrCode,
  CheckCircle2,
  Clock,
  Camera,
  Users,
} from 'lucide-react';

interface AttendanceItem {
  id: string;
  studentName: string;
  rollNo: string;
  batchName: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  mode: string;
  time: string;
}

interface BatchStudent {
  id: string;
  rollNo: string;
  name: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

export function AttendanceClient() {
  const [rollInput, setRollInput] = useState('');
  const [recentCheckIns, setRecentCheckIns] = useState<AttendanceItem[]>([
    {
      id: 'chk-1',
      studentName: 'Aditya Kumar',
      rollNo: 'STU-2026-001',
      batchName: 'Java Cohort Alpha',
      status: 'PRESENT',
      mode: 'CLASSROOM',
      time: '09:58 AM',
    },
    {
      id: 'chk-2',
      studentName: 'Sanjana Joshi',
      rollNo: 'STU-2026-006',
      batchName: 'Java Cohort Alpha',
      status: 'PRESENT',
      mode: 'CLASSROOM',
      time: '09:55 AM',
    },
    {
      id: 'chk-3',
      studentName: 'Farhan Zaidi',
      rollNo: 'STU-2026-005',
      batchName: 'Java Cohort Alpha',
      status: 'LATE',
      mode: 'REMOTE_ZOOM',
      time: '10:07 AM',
    },
  ]);

  const [batchRoster, setBatchRoster] = useState<BatchStudent[]>([
    { id: 'stu-1', rollNo: 'STU-2026-001', name: 'Aditya Kumar', status: 'PRESENT' },
    { id: 'stu-2', rollNo: 'STU-2026-002', name: 'Neha Reddy', status: 'ABSENT' },
    { id: 'stu-3', rollNo: 'STU-2026-003', name: 'Karan Johar', status: 'PRESENT' },
    { id: 'stu-4', rollNo: 'STU-2026-004', name: 'Simran Kaur', status: 'PRESENT' },
    { id: 'stu-5', rollNo: 'STU-2026-005', name: 'Farhan Zaidi', status: 'LATE' },
    { id: 'stu-6', rollNo: 'STU-2026-006', name: 'Sanjana Joshi', status: 'PRESENT' },
  ]);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleKioskCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollInput.trim()) return;

    const matched = batchRoster.find(
      (s) => s.rollNo.toLowerCase() === rollInput.trim().toLowerCase()
    );

    const studentName = matched ? matched.name : `Student (${rollInput.toUpperCase()})`;
    const newItem: AttendanceItem = {
      id: `chk-${Date.now()}`,
      studentName,
      rollNo: rollInput.toUpperCase(),
      batchName: 'Java Cohort Alpha',
      status: 'PRESENT',
      mode: 'CLASSROOM',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setRecentCheckIns([newItem, ...recentCheckIns]);
    if (matched) {
      setBatchRoster((prev) =>
        prev.map((s) => (s.id === matched.id ? { ...s, status: 'PRESENT' } : s))
      );
    }

    setSuccessMsg(`✓ Biometric Check-In Verified: ${studentName} (${newItem.rollNo})`);
    setRollInput('');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const toggleStudentStatus = (id: string, newStatus: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setBatchRoster((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const handleMarkAllPresent = () => {
    setBatchRoster((prev) => prev.map((s) => ({ ...s, status: 'PRESENT' })));
    setSuccessMsg('All students in session marked as PRESENT!');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-paper-800 p-6 rounded-3xl border border-paper-300 dark:border-paper-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal uppercase tracking-wider mb-1">
            <QrCode className="w-4 h-4" />
            <span>Hybrid Attendance Engine & Kiosk Gateway</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-ink dark:text-paper-100">
            Classroom Check-In & Hybrid Logs
          </h2>
          <p className="text-xs text-ink-muted dark:text-ink-subtle mt-0.5">
            Physical turnstile QR kiosk simulator combined with classroom attendance roster marking.
          </p>
        </div>

        <button
          onClick={handleMarkAllPresent}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal text-white hover:bg-teal-dark font-bold text-xs shadow-sm transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Mark All Cohort Present</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kiosk Simulator Terminal */}
        <div className="bg-white dark:bg-paper-800 rounded-3xl border-2 border-saffron/40 dark:border-saffron/30 p-6 shadow-stamp space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-saffron uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-4 h-4" /> Turnstile Kiosk Simulator
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <p className="text-xs text-ink-muted dark:text-ink-subtle">
            Students scan their ID card QR code or enter roll number at the classroom tablet:
          </p>

          <form onSubmit={handleKioskCheckIn} className="space-y-3">
            <div>
              <label className="text-[11px] font-mono font-bold text-ink dark:text-paper-100">
                ENTER STUDENT ROLL NUMBER:
              </label>
              <input
                type="text"
                value={rollInput}
                onChange={(e) => setRollInput(e.target.value)}
                placeholder="e.g. STU-2026-001"
                className="w-full mt-1 p-3 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900 font-mono text-sm uppercase font-bold focus:outline-none focus:ring-2 focus:ring-saffron"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] font-mono text-ink-muted w-full">Quick Autofill:</span>
              <button
                type="button"
                onClick={() => setRollInput('STU-2026-001')}
                className="px-2 py-1 rounded-lg bg-paper-200 dark:bg-paper-700 text-ink dark:text-paper-100 text-[11px] font-mono"
              >
                Aditya (STU-001)
              </button>
              <button
                type="button"
                onClick={() => setRollInput('STU-2026-002')}
                className="px-2 py-1 rounded-lg bg-paper-200 dark:bg-paper-700 text-ink dark:text-paper-100 text-[11px] font-mono"
              >
                Neha (STU-002)
              </button>
              <button
                type="button"
                onClick={() => setRollInput('STU-2026-005')}
                className="px-2 py-1 rounded-lg bg-paper-200 dark:bg-paper-700 text-ink dark:text-paper-100 text-[11px] font-mono"
              >
                Farhan (STU-005)
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-saffron hover:bg-saffron-light text-ink font-bold text-xs transition-all shadow-sm"
            >
              Simulate Biometric Check-In
            </button>
          </form>

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-medium flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="p-3 rounded-xl bg-paper-100 dark:bg-paper-900 border border-paper-200 dark:border-paper-700/80 text-[11px] text-ink-muted dark:text-ink-subtle font-mono space-y-1">
            <p>📷 Kiosk Camera: Ready (Optical QR sensor)</p>
            <p>⏱️ Turnstile Check-In Latency: 38ms</p>
          </div>
        </div>

        {/* Live Attendance Stream & Cohort Roster */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cohort Roster Marking */}
          <div className="bg-white dark:bg-paper-800 rounded-3xl border border-paper-300 dark:border-paper-700 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-ink dark:text-paper-100 flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal" />
                  Today&apos;s Class Roster & Marking
                </h3>
                <p className="text-xs text-ink-muted">Java Full Stack (Cohort Alpha - Morning)</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  {batchRoster.filter((s) => s.status === 'PRESENT').length} / {batchRoster.length} Present
                </span>
              </div>
            </div>

            <div className="divide-y divide-paper-200 dark:divide-paper-700 max-h-64 overflow-y-auto pr-1">
              {batchRoster.map((s) => (
                <div key={s.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-ink dark:text-paper-100">{s.name}</span>
                    <span className="font-mono text-[11px] text-ink-muted ml-2">{s.rollNo}</span>
                  </div>

                  {/* 3-State Toggle: Present / Absent / Late */}
                  <div className="flex items-center gap-1 font-mono text-[10px]">
                    <button
                      onClick={() => toggleStudentStatus(s.id, 'PRESENT')}
                      className={`px-2 py-1 rounded font-bold transition-all ${
                        s.status === 'PRESENT'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-paper-100 dark:bg-paper-700 text-ink-muted hover:text-ink'
                      }`}
                    >
                      PRESENT
                    </button>
                    <button
                      onClick={() => toggleStudentStatus(s.id, 'LATE')}
                      className={`px-2 py-1 rounded font-bold transition-all ${
                        s.status === 'LATE'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-paper-100 dark:bg-paper-700 text-ink-muted hover:text-ink'
                      }`}
                    >
                      LATE
                    </button>
                    <button
                      onClick={() => toggleStudentStatus(s.id, 'ABSENT')}
                      className={`px-2 py-1 rounded font-bold transition-all ${
                        s.status === 'ABSENT'
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-paper-100 dark:bg-paper-700 text-ink-muted hover:text-ink'
                      }`}
                    >
                      ABSENT
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Check-In Feed */}
          <div className="bg-white dark:bg-paper-800 rounded-3xl border border-paper-300 dark:border-paper-700 p-6 space-y-3">
            <h4 className="font-serif text-base font-bold text-ink dark:text-paper-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-saffron" />
              Turnstile Check-In Stream
            </h4>

            <div className="divide-y divide-paper-200 dark:divide-paper-700">
              {recentCheckIns.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-ink dark:text-paper-100">{item.studentName}</span>
                    <span className="font-mono text-[10px] text-ink-muted">({item.rollNo})</span>
                    <span className="text-[10px] text-teal font-medium">[{item.mode}]</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-ink-muted">{item.time}</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
