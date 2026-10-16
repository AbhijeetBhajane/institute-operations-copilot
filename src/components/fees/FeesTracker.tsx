'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  RotateCcw,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';

interface InstalmentItem {
  id: string;
  instalmentNo: number;
  amount: number;
  dueDate: string;
  status: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  studentPhone: string;
  transactionRef?: string;
  paidAt?: string;
  diffDays: number;
}

interface Props {
  instalments: InstalmentItem[];
  totalPaid: number;
  bucket0to15: number;
  bucket16to30: number;
  bucket30plus: number;
}

export function FeesTracker({
  instalments: initialInstalments,
  totalPaid,
  bucket0to15,
  bucket16to30,
  bucket30plus,
}: Props) {
  const [instalments, setInstalments] = useState(initialInstalments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedAging, setSelectedAging] = useState('ALL');
  const [activePaymentModal, setActivePaymentModal] = useState<InstalmentItem | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return instalments.filter((inst) => {
      const matchSearch =
        searchTerm === '' ||
        inst.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.rollNo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = selectedStatus === 'ALL' || inst.status === selectedStatus;

      let matchAging = true;
      if (selectedAging === '0-15') {
        matchAging = inst.status === 'OVERDUE' && inst.diffDays <= 15;
      } else if (selectedAging === '16-30') {
        matchAging = inst.status === 'OVERDUE' && inst.diffDays > 15 && inst.diffDays <= 30;
      } else if (selectedAging === '30+') {
        matchAging = inst.status === 'OVERDUE' && inst.diffDays > 30;
      }

      return matchSearch && matchStatus && matchAging;
    });
  }, [instalments, searchTerm, selectedStatus, selectedAging]);

  const handleMarkPaid = (instId: string) => {
    setInstalments((prev) =>
      prev.map((i) =>
        i.id === instId
          ? {
              ...i,
              status: 'PAID',
              transactionRef: `UPI/OFFLINE/${Math.floor(10000000 + Math.random() * 90000000)}`,
            }
          : i
      )
    );
    setPaymentSuccess(`Instalment marked as PAID! Receipt issued and payment logged.`);
    setActivePaymentModal(null);
    setTimeout(() => setPaymentSuccess(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Aging Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => {
            setSelectedStatus('PAID');
            setSelectedAging('ALL');
          }}
          className={`p-5 rounded-2xl bg-white dark:bg-paper-800 border text-left transition-all ${
            selectedStatus === 'PAID'
              ? 'border-emerald-500 ring-2 ring-emerald-400/20'
              : 'border-paper-300 dark:border-paper-700'
          }`}
        >
          <p className="text-xs font-mono text-ink-muted">TOTAL COLLECTIONS (PAID)</p>
          <p className="font-serif text-3xl font-bold text-emerald-600">
            ₹{totalPaid.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">Click to filter paid</p>
        </button>

        <button
          onClick={() => {
            setSelectedStatus('OVERDUE');
            setSelectedAging('0-15');
          }}
          className={`p-5 rounded-2xl bg-white dark:bg-paper-800 border text-left transition-all ${
            selectedAging === '0-15'
              ? 'border-amber-500 ring-2 ring-amber-400/20'
              : 'border-amber-200 dark:border-amber-900/60'
          }`}
        >
          <p className="text-xs font-mono text-amber-600">OVERDUE (0 - 15 DAYS)</p>
          <p className="font-serif text-3xl font-bold text-amber-600">
            ₹{bucket0to15.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-ink-muted">Grace period & gentle reminder</p>
        </button>

        <button
          onClick={() => {
            setSelectedStatus('OVERDUE');
            setSelectedAging('16-30');
          }}
          className={`p-5 rounded-2xl bg-white dark:bg-paper-800 border text-left transition-all ${
            selectedAging === '16-30'
              ? 'border-orange-500 ring-2 ring-orange-400/20'
              : 'border-orange-200 dark:border-orange-900/60'
          }`}
        >
          <p className="text-xs font-mono text-orange-600">OVERDUE (16 - 30 DAYS)</p>
          <p className="font-serif text-3xl font-bold text-orange-600">
            ₹{bucket16to30.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-ink-muted">Counselor telephone outreach</p>
        </button>

        <button
          onClick={() => {
            setSelectedStatus('OVERDUE');
            setSelectedAging('30+');
          }}
          className={`p-5 rounded-2xl bg-white dark:bg-paper-800 border text-left transition-all ${
            selectedAging === '30+'
              ? 'border-red-500 ring-2 ring-red-400/20'
              : 'border-red-200 dark:border-red-900/60'
          }`}
        >
          <p className="text-xs font-mono text-red-600">CRITICAL OVERDUE (30+ DAYS)</p>
          <p className="font-serif text-3xl font-bold text-red-600">
            ₹{bucket30plus.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-red-500 font-medium">LMS recording access lock candidate</p>
        </button>
      </div>

      {paymentSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-200 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{paymentSuccess}</span>
        </div>
      )}

      {/* Filter Control Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search instalments by student name or roll number (e.g. STU-2026-001)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900 text-xs text-ink dark:text-paper-100 placeholder:text-ink-muted focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setSelectedAging('ALL');
            }}
            className="px-3 py-2 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900 text-xs font-medium text-ink dark:text-paper-100 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="OVERDUE">Overdue Only</option>
            <option value="DUE">Upcoming Due</option>
            <option value="PAID">Paid Only</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedStatus('ALL');
              setSelectedAging('ALL');
            }}
            className="p-2 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-100 dark:bg-paper-800 text-ink-muted hover:text-ink"
            title="Reset filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Instalments Table */}
      <div className="bg-white dark:bg-paper-800 rounded-3xl border border-paper-300 dark:border-paper-700 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-paper-200 dark:border-paper-700 flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-ink dark:text-paper-100">
            Instalment Ledger ({filtered.length} records matching)
          </h3>
          <span className="text-xs font-mono text-ink-muted">Sorted chronologically by due date</span>
        </div>

        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-paper-100 dark:bg-paper-900 font-mono text-ink-muted border-b border-paper-200 dark:border-paper-700 sticky top-0">
              <tr>
                <th className="p-3">Roll No</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">EMI #</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Transaction UTR</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-200 dark:divide-paper-700">
              {filtered.map((inst) => {
                const isOverdue = inst.status === 'OVERDUE';
                const isPaid = inst.status === 'PAID';

                return (
                  <tr
                    key={inst.id}
                    className="hover:bg-paper-50 dark:hover:bg-paper-700/30 transition-colors"
                  >
                    <td className="p-3 font-mono font-bold">{inst.rollNo}</td>
                    <td className="p-3 font-semibold text-ink dark:text-paper-100">
                      {inst.studentName}
                    </td>
                    <td className="p-3 font-mono">EMI #{inst.instalmentNo}</td>
                    <td className="p-3 font-mono font-bold">
                      ₹{inst.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 font-mono">{inst.dueDate}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                            : isOverdue
                            ? 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                        }`}
                      >
                        {inst.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-ink-muted">
                      {inst.transactionRef || '—'}
                    </td>
                    <td className="p-3 text-right">
                      {!isPaid ? (
                        <button
                          onClick={() => setActivePaymentModal(inst)}
                          className="px-2.5 py-1 rounded-lg bg-teal text-white hover:bg-teal-dark text-[11px] font-bold"
                        >
                          Record Payment
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono text-emerald-600 font-bold">
                          ✓ Settled
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {activePaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-paper-800 rounded-3xl max-w-md w-full p-6 space-y-4 border border-saffron shadow-2xl relative">
            <button
              onClick={() => setActivePaymentModal(null)}
              className="absolute top-5 right-5 p-1 rounded-full hover:bg-paper-200 dark:hover:bg-paper-700 text-ink-muted"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="font-mono text-[10px] font-bold text-saffron bg-saffron/10 px-2 py-0.5 rounded">
                COLLECT PAYMENT • EMI #{activePaymentModal.instalmentNo}
              </span>
              <h3 className="font-serif text-2xl font-bold text-ink dark:text-paper-100 mt-1">
                {activePaymentModal.studentName}
              </h3>
              <p className="text-xs text-ink-muted font-mono">{activePaymentModal.rollNo}</p>
            </div>

            <div className="p-4 rounded-2xl bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-700 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-ink-muted">Amount Due:</span>
                <span className="font-mono font-bold text-base text-ink dark:text-paper-100">
                  ₹{activePaymentModal.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Due Date:</span>
                <span className="font-mono font-bold text-ink dark:text-paper-100">
                  {activePaymentModal.dueDate}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setActivePaymentModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-muted hover:bg-paper-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleMarkPaid(activePaymentModal.id)}
                className="px-5 py-2 rounded-xl bg-saffron text-ink font-bold text-xs hover:bg-saffron-light"
              >
                Confirm Payment Received
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
