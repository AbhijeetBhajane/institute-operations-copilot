import React from 'react';
import { MessageSquare } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { WhatsAppOutboxViewer } from '@/components/whatsapp/WhatsAppOutboxViewer';
import { AccessRestrictedCard } from '@/components/layout/AccessRestrictedCard';

export default async function WhatsAppOutboxPage() {
  const user = await getCurrentUser();

  if (user.role === 'STUDENT') {
    return (
      <AccessRestrictedCard
        role={user.role}
        requiredClearance="Staff Outreach Clearance (Owner, Counselor, or Accounts)"
        reason="The WhatsApp Outbox Queue is for institute administrators and mentors to stage and verify outgoing notifications. Students cannot manage the messaging outbox."
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-paper-800 p-6 rounded-3xl border border-paper-300 dark:border-paper-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Business Cloud API Simulator</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-ink dark:text-paper-100">
            WhatsApp Outbox Queue
          </h2>
          <p className="text-xs text-ink-muted dark:text-ink-subtle mt-0.5">
            Real-time simulator displaying dispatched student academic reminders with direct wa.me links.
          </p>
        </div>
      </div>

      {/* Interactive Outbox Viewer with search, filters, and compose modal */}
      <WhatsAppOutboxViewer />
    </div>
  );
}
