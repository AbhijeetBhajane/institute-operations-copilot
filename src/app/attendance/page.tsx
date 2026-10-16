'use client';

import React, { useState, useEffect } from 'react';
import {
  QrCode,
  CheckCircle2,
  Clock,
  Laptop,
  Users,
  Camera,
  Search,
  Sparkles,
} from 'lucide-react';

interface AttendanceItem {
  id: string;
  studentName: string;
  rollNo: string;
  batchName: string;
  status: string;
  mode: string;
  time: string;
}

export default function AttendancePage() {
  const [rollInput, setRollInput] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('batch-java-a');
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
      rollNo: 'STU-2026-012',
      batchName: 'Java Cohort Alpha',
      status: 'PRESENT',
      mode: 'ONLINE',
      time: '10:01 AM (Zoom Webhook)',
    },
    {
      id: 'chk-3',
      studentName: 'Gaurav Mehta',
      rollNo: 'STU-2026-013',
      batchName: 'Java Cohort Alpha',
      status: 'LATE',
      mode: 'CLASSROOM',
      time: '10:14 AM',
    },
  ]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleKioskCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollInput.trim()) return;

    const roll = rollInput.trim().toUpperCase();
    const newEntry: AttendanceItem = {
      id: `chk-${Date.now()}`,
      studentName: `Student ${roll}`,
      rollNo: roll,
      batchName: 'Java Cohort Alpha',
      status: 'PRESENT',
      mode: 'CLASSROOM',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setRecentCheckIns([newEntry, ...recentCheckIns]);
    setSuccessMsg(`Check-in verified for ${roll}! Logged with biometric kiosk timestamp.`);
    setRollInput('');
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
            Physical turnstile QR kiosk simulator combined with virtual online join logs.
          </p>
        </div>
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

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-saffron hover:bg-saffron-light text-ink font-bold text-xs transition-all shadow-sm"
              >
                Simulate QR Scan / Check-In
              </button>
              <button
                type="button"
                onClick={() => setRollInput('STU-2026-001')}
                className="px-3 py-2.5 rounded-xl bg-paper-200 dark:bg-paper-700 text-ink dark:text-paper-100 text-xs font-mono font-bold"
              >
                Autofill Aditya
              </button>
            </div>
          </form>

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-medium flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="p-3 rounded-xl bg-paper-100 dark:bg-paper-900 border border-paper-200 dark:border-paper-700/80 text-[11px] text-ink-muted dark:text-ink-subtle font-mono space-y-1">
            <p>📷 Camera State: Ready (1080p optical sensor)</p>
            <p>⏱️ Average Turnstile Latency: 42ms</p>
          </div>
        </div>

        {/* Live Attendance Stream */}
        <div className="lg:col-span-2 bg-white dark:bg-paper-800 rounded-3xl border border-paper-300 dark:border-paper-700 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-ink dark:text-paper-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal" />
              Live Check-In Activity Stream (Today&apos;s Sessions)
            </h3>
            <span className="text-xs font-mono text-ink-muted">Hybrid Telemetry</span>
          </div>

          <div className="divide-y divide-paper-200 dark:divide-paper-700">
            {recentCheckIns.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                      item.mode === 'CLASSROOM'
                        ? 'bg-teal/10 text-teal'
                        : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                    }`}
                  >
                    {item.mode === 'CLASSROOM' ? '🏛️' : '💻'}
                  </div>
                  <div>
                    <p className="font-bold text-ink dark:text-paper-100">{item.studentName}</p>
                    <p className="text-[11px] text-ink-muted dark:text-ink-subtle font-mono">
                      {item.rollNo} • {item.batchName} ({item.mode})
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-[11px] text-ink-muted dark:text-ink-subtle">
                    {item.time}
                  </span>
                  <p>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                      {item.status}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
