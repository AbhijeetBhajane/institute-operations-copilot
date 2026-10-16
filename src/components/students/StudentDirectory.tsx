'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  AlertTriangle,
  ExternalLink,
  ArrowRight,
  RotateCcw,
  Users,
  CheckCircle,
  Calendar,
  X,
} from 'lucide-react';

interface StudentItem {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: string;
  riskScore: number;
  riskLevel: string;
  riskReasons: string;
  batchName?: string;
  courseName?: string;
}

interface Props {
  students: StudentItem[];
  batches: string[];
}

export function StudentDirectory({ students, batches }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState<'RISK_DESC' | 'NAME_ASC' | 'ROLL_ASC'>('RISK_DESC');
  const [activeModalStudent, setActiveModalStudent] = useState<StudentItem | null>(null);

  const filtered = useMemo(() => {
    return students
      .filter((s) => {
        const matchesSearch =
          searchTerm === '' ||
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (s.batchName && s.batchName.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesBatch = selectedBatch === 'ALL' || s.batchName === selectedBatch;
        const matchesRisk = selectedRisk === 'ALL' || s.riskLevel === selectedRisk;
        const matchesStatus = selectedStatus === 'ALL' || s.status === selectedStatus;

        return matchesSearch && matchesBatch && matchesRisk && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'RISK_DESC') return b.riskScore - a.riskScore;
        if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
        return a.rollNo.localeCompare(b.rollNo);
      });
  }, [students, searchTerm, selectedBatch, selectedRisk, selectedStatus, sortBy]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedBatch('ALL');
    setSelectedRisk('ALL');
    setSelectedStatus('ALL');
    setSortBy('RISK_DESC');
  };

  return (
    <div className="space-y-6">
      {/* Interactive Filter Control Panel */}
      <div className="p-5 rounded-3xl bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, roll number (e.g. STU-2026-001), or city..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900 text-xs text-ink dark:text-paper-100 placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-teal"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Batch Filter */}
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="px-3 py-2 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900 text-xs font-medium text-ink dark:text-paper-100 focus:outline-none"
            >
              <option value="ALL">All Batches</option>
              {batches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            {/* Risk Level Filter */}
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-3 py-2 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900 text-xs font-medium text-ink dark:text-paper-100 focus:outline-none"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HIGH">High Risk (Pulse)</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900 text-xs font-medium text-ink dark:text-paper-100 focus:outline-none font-mono"
            >
              <option value="RISK_DESC">Highest Risk Score</option>
              <option value="NAME_ASC">Name (A-Z)</option>
              <option value="ROLL_ASC">Roll Number</option>
            </select>

            {/* Reset Filter Button */}
            <button
              onClick={handleReset}
              className="p-2 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-100 dark:bg-paper-800 text-ink-muted hover:text-ink hover:bg-paper-200 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter telemetry status */}
        <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted dark:text-ink-subtle border-t border-paper-200 dark:border-paper-700/60 pt-2">
          <span>
            Showing <strong>{filtered.length}</strong> of {students.length} enrolled learners
          </span>
          {(searchTerm || selectedBatch !== 'ALL' || selectedRisk !== 'ALL') && (
            <span className="text-teal font-semibold">Active filters applied</span>
          )}
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => {
          const isHighRisk = s.riskLevel === 'HIGH';
          const isMediumRisk = s.riskLevel === 'MEDIUM';
          const reasons: string[] = JSON.parse(s.riskReasons || '[]');

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
                    📚 {s.batchName || 'Unassigned Batch'}
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
                          className="px-2 py-0.5 rounded text-[10px] bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 font-sans"
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

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveModalStudent(s)}
                    className="px-2.5 py-1 rounded-lg bg-paper-100 dark:bg-paper-700 hover:bg-paper-200 text-ink dark:text-paper-100 text-[11px] font-medium"
                  >
                    Quick View
                  </button>

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
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-paper-800 rounded-3xl border border-paper-300 dark:border-paper-700 space-y-3">
          <Users className="w-8 h-8 text-ink-muted mx-auto" />
          <h4 className="font-serif text-lg font-bold text-ink dark:text-paper-100">
            No students matching current filters
          </h4>
          <p className="text-xs text-ink-muted">
            Try adjusting your search term or resetting the batch/risk filters.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-saffron text-ink font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Quick View Student Modal */}
      {activeModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-paper-800 rounded-3xl max-w-lg w-full p-6 space-y-4 border border-saffron shadow-2xl relative">
            <button
              onClick={() => setActiveModalStudent(null)}
              className="absolute top-5 right-5 p-1 rounded-full hover:bg-paper-200 dark:hover:bg-paper-700 text-ink-muted"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="font-mono text-xs font-bold text-saffron bg-saffron/10 px-2 py-0.5 rounded">
                {activeModalStudent.rollNo}
              </span>
              <h3 className="font-serif text-2xl font-bold text-ink dark:text-paper-100 mt-1">
                {activeModalStudent.name}
              </h3>
              <p className="text-xs text-ink-muted">
                {activeModalStudent.batchName || 'Java Full Stack'} • {activeModalStudent.city}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-700 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-ink-muted">Contact Phone:</span>
                <span className="font-mono font-bold text-ink dark:text-paper-100">
                  {activeModalStudent.phone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Email:</span>
                <span className="font-mono text-ink dark:text-paper-100">
                  {activeModalStudent.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Retention Risk Score:</span>
                <span className="font-mono font-bold text-red-600">
                  {activeModalStudent.riskScore.toFixed(0)}/100 ({activeModalStudent.riskLevel})
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Link
                href={`/students/${activeModalStudent.id}`}
                className="px-4 py-2 rounded-xl bg-teal text-white font-bold text-xs"
              >
                Open Full Student 360
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
