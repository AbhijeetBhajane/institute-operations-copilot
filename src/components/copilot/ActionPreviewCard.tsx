'use client';

import React, { useState } from 'react';
import { ActionPreviewData, MessageDraft } from '@/lib/copilot/types';
import {
  CheckCircle2,
  XCircle,
  MessageSquare,
  ExternalLink,
  Edit3,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Save,
  Check,
} from 'lucide-react';

interface Props {
  action: ActionPreviewData;
  onActionComplete?: () => void;
}

export function ActionPreviewCard({ action, onActionComplete }: Props) {
  const [drafts, setDrafts] = useState<MessageDraft[]>(action.messageDrafts || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [status, setStatus] = useState<'PENDING' | 'EXECUTED' | 'REJECTED'>(action.status as any);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const startEdit = (idx: number) => {
    setEditingIndex(idx);
    setEditText(drafts[idx].message);
  };

  const saveEdit = (idx: number) => {
    const updated = [...drafts];
    updated[idx].message = editText;
    const cleanPhone = updated[idx].phone.replace(/[^0-9]/g, '');
    updated[idx].waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(editText)}`;
    setDrafts(updated);
    setEditingIndex(null);
  };

  const handleDecision = async (decision: 'APPROVE' | 'REJECT') => {
    if (decision === 'APPROVE' && drafts.length > 1 && !showConfirmModal) {
      setShowConfirmModal(true);
      return;
    }

    setIsSubmitting(true);
    setShowConfirmModal(false);

    try {
      const res = await fetch('/api/copilot/execute-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionId: action.id,
          decision,
          editedPayload: drafts,
        }),
      });

      if (res.ok) {
        setStatus(decision === 'APPROVE' ? 'EXECUTED' : 'REJECTED');
        if (onActionComplete) onActionComplete();
      }
    } catch (e) {
      console.error('Failed to submit decision', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-paper-800 rounded-2xl border-2 border-saffron/40 dark:border-saffron/30 shadow-stamp p-6 space-y-5 relative overflow-hidden transition-all">
      {/* Background Stamped Watermark when executed */}
      {status === 'EXECUTED' && (
        <div className="absolute top-6 right-6 approval-stamp approval-stamp-executed animate-bounce">
          APPROVED & DISPATCHED
        </div>
      )}
      {status === 'REJECTED' && (
        <div className="absolute top-6 right-6 approval-stamp border-red-500 text-red-500">
          REJECTED BY OPERATOR
        </div>
      )}
      {status === 'PENDING' && (
        <div className="absolute top-6 right-6 approval-stamp">
          REQUIRES HUMAN APPROVAL
        </div>
      )}

      {/* Title & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-saffron-dark dark:text-saffron uppercase tracking-wider mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Action Preview Card • Non-Auto-Executing Safeguard</span>
        </div>
        <h3 className="font-serif text-2xl font-bold text-ink dark:text-paper-100">
          {action.title}
        </h3>
        <p className="text-xs text-ink-muted dark:text-ink-subtle mt-1">
          {action.description}
        </p>
      </div>

      {/* Diff View Box */}
      {action.diffSummary && action.diffSummary.length > 0 && (
        <div className="p-4 rounded-xl bg-paper-100 dark:bg-paper-900 border border-paper-300 dark:border-paper-700/60 space-y-2">
          <p className="text-xs font-mono font-bold text-ink dark:text-paper-100 uppercase tracking-wider">
            System State Diff View (Pending Changes):
          </p>
          <div className="divide-y divide-paper-200 dark:divide-paper-800 text-xs">
            {action.diffSummary.map((diff, i) => (
              <div key={i} className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-ink dark:text-paper-100">{diff.target}</span>
                  <span className="text-[11px] text-ink-muted dark:text-ink-subtle ml-2">({diff.field})</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-red-500 line-through bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded">
                    {String(diff.before)}
                  </span>
                  <ArrowRight className="w-3 h-3 text-ink-muted" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded">
                    {String(diff.after)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generated WhatsApp Drafts (Editable per student) */}
      {drafts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono font-bold text-ink dark:text-paper-100 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-teal" />
              Generated WhatsApp Message Drafts ({drafts.length} Recipients):
            </p>
            <span className="text-[11px] text-ink-muted dark:text-ink-subtle">
              Click &quot;Edit Message&quot; to customize individual student copy
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-1">
            {drafts.map((draft, idx) => {
              const isEditing = editingIndex === idx;
              return (
                <div
                  key={draft.studentId}
                  className="p-3.5 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900/60 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink dark:text-paper-100">{draft.studentName}</span>
                      <span className="px-1.5 py-0.2 rounded bg-paper-200 dark:bg-paper-800 text-[10px] font-mono text-ink-muted">
                        {draft.rollNo}
                      </span>
                      <span className="text-[11px] text-teal font-medium">{draft.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <button
                          onClick={() => saveEdit(idx)}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-teal text-white text-[11px] font-medium"
                        >
                          <Save className="w-3 h-3" /> Save
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(idx)}
                          disabled={status !== 'PENDING'}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-paper-200 dark:bg-paper-800 hover:bg-paper-300 text-[11px] text-ink dark:text-paper-100"
                        >
                          <Edit3 className="w-3 h-3" /> Edit Message
                        </button>
                      )}

                      <a
                        href={draft.waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium"
                        title="Open WhatsApp Web deep link directly"
                      >
                        <ExternalLink className="w-3 h-3" /> wa.me
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp Message Bubble */}
                  {isEditing ? (
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 rounded-lg border border-teal text-ink dark:text-paper-100 bg-white dark:bg-paper-800 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-teal"
                    />
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-ink dark:text-paper-100 font-sans leading-relaxed">
                      💬 &quot;{draft.message}&quot;
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Human-in-the-Loop Action Bar */}
      {status === 'PENDING' && (
        <div className="pt-3 border-t border-paper-200 dark:border-paper-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-ink-muted dark:text-ink-subtle flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-saffron flex-shrink-0" />
            <span>
              Action will NOT touch student phones until authorized with your cryptographic stamp.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => handleDecision('REJECT')}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-300 dark:border-red-900 text-red-600 dark:text-red-400 font-semibold text-xs hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Reject Action
            </button>

            <button
              onClick={() => handleDecision('APPROVE')}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-saffron hover:bg-saffron-light active:scale-95 text-ink font-bold text-xs shadow-md transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Authorizing...' : `Approve & Dispatch (${drafts.length})`}
            </button>
          </div>
        </div>
      )}

      {status === 'EXECUTED' && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>
            Dispatched to WhatsApp Outbox Simulator. View individual delivery status in the Outbox tab.
          </span>
        </div>
      )}

      {/* Bulk Action Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-paper-800 rounded-2xl max-w-md w-full p-6 space-y-4 border border-saffron shadow-2xl">
            <div className="flex items-center gap-3 text-saffron">
              <AlertTriangle className="w-6 h-6" />
              <h4 className="font-serif text-lg font-bold text-ink dark:text-paper-100">
                Confirm Bulk Dispatch
              </h4>
            </div>
            <p className="text-xs text-ink-muted dark:text-ink-subtle leading-relaxed">
              You are about to approve and queue WhatsApp reminders for{' '}
              <strong className="text-ink dark:text-paper-100">{drafts.length} students</strong>. Each message contains personal academic attendance data and fee payment instructions.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-muted hover:bg-paper-200 dark:hover:bg-paper-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDecision('APPROVE')}
                className="px-5 py-2 rounded-xl bg-saffron font-bold text-xs text-ink hover:bg-saffron-light"
              >
                Yes, Dispatch All {drafts.length}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
