'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserRole, PRESET_USERS } from '@/lib/authTypes';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Calendar,
  Lock,
  MessageSquare,
  Users,
  CheckCircle,
  FileCheck,
  Terminal,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [switching, setSwitching] = useState<string | null>(null);

  const loginAsRole = async (role: UserRole) => {
    setSwitching(role);
    try {
      await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      router.push('/dashboard');
    } catch (e) {
      console.error(e);
      setSwitching(null);
    }
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron/10 border border-saffron/30 text-saffron-dark dark:text-saffron text-xs font-mono font-bold tracking-wider">
          <Sparkles className="w-4 h-4 fill-saffron/20" />
          <span>AI OPERATIONS COPILOT AT THE CENTRE</span>
        </div>

        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ink dark:text-paper-100 leading-[1.1]">
          Mission control for your classroom.
        </h1>

        <p className="text-base sm:text-lg text-ink-muted dark:text-ink-subtle max-w-2xl mx-auto leading-relaxed">
          Institutes run on spreadsheets, WhatsApp groups and memory. ClassPilot lets staff run institute operations by simply asking in natural language—and acts safely on the answer.
        </p>

        {/* Quick Demo Persona Switcher Bar for Judges */}
        <div className="p-6 rounded-3xl bg-white dark:bg-paper-800 border-2 border-saffron/40 shadow-stamp max-w-2xl mx-auto space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold uppercase text-ink dark:text-paper-100 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-saffron" /> 1-Click Judge Persona Launcher:
            </span>
            <span className="text-saffron-dark dark:text-saffron font-bold">RBAC Enforced</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => loginAsRole('OWNER')}
              disabled={!!switching}
              className="p-3 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900 hover:border-saffron hover:shadow-sm text-left transition-all"
            >
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-saffron text-ink font-bold">
                OWNER
              </span>
              <p className="text-xs font-bold text-ink dark:text-paper-100 mt-1">Rajesh R.</p>
              <p className="text-[10px] text-ink-muted dark:text-ink-subtle">Full Clearance</p>
            </button>

            <button
              onClick={() => loginAsRole('COUNSELOR')}
              disabled={!!switching}
              className="p-3 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900 hover:border-teal hover:shadow-sm text-left transition-all"
            >
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-teal text-white font-bold">
                COUNSELOR
              </span>
              <p className="text-xs font-bold text-ink dark:text-paper-100 mt-1">Meera M.</p>
              <p className="text-[10px] text-ink-muted dark:text-ink-subtle">Retention Focus</p>
            </button>

            <button
              onClick={() => loginAsRole('TRAINER')}
              disabled={!!switching}
              className="p-3 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900 hover:border-indigo-400 hover:shadow-sm text-left transition-all"
            >
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-600 text-white font-bold">
                TRAINER
              </span>
              <p className="text-xs font-bold text-ink dark:text-paper-100 mt-1">Priya S.</p>
              <p className="text-[10px] text-red-500 font-bold">Zero Fee Access</p>
            </button>

            <button
              onClick={() => loginAsRole('ACCOUNTS')}
              disabled={!!switching}
              className="p-3 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900 hover:border-emerald-400 hover:shadow-sm text-left transition-all"
            >
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-600 text-white font-bold">
                ACCOUNTS
              </span>
              <p className="text-xs font-bold text-ink dark:text-paper-100 mt-1">Suresh A.</p>
              <p className="text-[10px] text-ink-muted dark:text-ink-subtle">Ledger & Recon</p>
            </button>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/copilot"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-saffron hover:bg-saffron-light active:scale-95 text-ink font-bold text-sm shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4 fill-ink/20" />
            <span>Launch AI Copilot (The Hero)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/timetable"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-paper-300 dark:border-paper-700 bg-white dark:bg-paper-800 text-ink dark:text-paper-100 font-bold text-sm hover:border-saffron transition-all"
          >
            <Calendar className="w-4 h-4 text-teal" />
            <span>Smart Timetable Engine</span>
          </Link>
        </div>
      </div>

      {/* Feature Architecture Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-saffron/10 text-saffron flex items-center justify-center">
            <Terminal className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl font-bold text-ink dark:text-paper-100">
            Show Your Work Receipts
          </h3>
          <p className="text-xs text-ink-muted dark:text-ink-subtle leading-relaxed">
            Every query displays the exact SELECT query executed, tables touched, execution duration in milliseconds, and plain English explanation with zero SQL injection risk.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal/10 text-teal flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl font-bold text-ink dark:text-paper-100">
            Stamped Action Approval Slips
          </h3>
          <p className="text-xs text-ink-muted dark:text-ink-subtle leading-relaxed">
            Actions are NEVER executed automatically. The Copilot renders a diff view and editable student WhatsApp drafts with Approve / Edit / Reject buttons.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl font-bold text-ink dark:text-paper-100">
            Server-Side Role Firewall
          </h3>
          <p className="text-xs text-ink-muted dark:text-ink-subtle leading-relaxed">
            Trainers asking about fees get a polite security refusal even with jailbreak phrasing (&quot;ignore rules&quot;, &quot;as the owner&quot;). All attempts logged to the immutable audit trail.
          </p>
        </div>
      </div>

      {/* Live Operational Metrics */}
      <div className="p-6 rounded-3xl bg-paper-100 dark:bg-paper-800/60 border border-paper-300 dark:border-paper-700 text-center space-y-4">
        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-subtle">
          Seeded Production-Grade Database State
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div>
            <p className="font-serif text-3xl font-bold text-ink dark:text-paper-100">150</p>
            <p className="text-[11px] text-ink-muted dark:text-ink-subtle font-mono">Students</p>
          </div>
          <div>
            <p className="font-serif text-3xl font-bold text-ink dark:text-paper-100">12</p>
            <p className="text-[11px] text-ink-muted dark:text-ink-subtle font-mono">Batches</p>
          </div>
          <div>
            <p className="font-serif text-3xl font-bold text-ink dark:text-paper-100">8</p>
            <p className="text-[11px] text-ink-muted dark:text-ink-subtle font-mono">Trainers</p>
          </div>
          <div>
            <p className="font-serif text-3xl font-bold text-ink dark:text-paper-100">5</p>
            <p className="text-[11px] text-ink-muted dark:text-ink-subtle font-mono">Rooms</p>
          </div>
          <div>
            <p className="font-serif text-3xl font-bold text-emerald-600 dark:text-emerald-400">3,000</p>
            <p className="text-[11px] text-ink-muted dark:text-ink-subtle font-mono">Attendance Logs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
