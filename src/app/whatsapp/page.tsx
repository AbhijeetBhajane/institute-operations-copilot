'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, ExternalLink, Send, CheckCheck, Clock, Check, PhoneCall } from 'lucide-react';

interface OutboxMessage {
  id: string;
  recipientName: string;
  phone: string;
  rollNo: string;
  message: string;
  status: 'QUEUED' | 'SENT' | 'DELIVERED';
  timestamp: string;
  waLink: string;
}

export default function WhatsAppOutboxPage() {
  const [messages, setMessages] = useState<OutboxMessage[]>([
    {
      id: 'wa-1',
      recipientName: 'Aditya Kumar',
      phone: '+91 98221 44001',
      rollNo: 'STU-2026-001',
      message:
        'Hi Aditya, Rajesh from ClassPilot here. We noticed you missed 4 recent sessions in Java Full Stack. We want to make sure you stay on track! Also, a friendly reminder that your next EMI (₹16,000) is scheduled for 18 Oct. Let us know if you need any academic backup support: https://classpilot.io/pay/STU-2026-001',
      status: 'DELIVERED',
      timestamp: '10:14 AM',
      waLink: 'https://wa.me/919822144001',
    },
    {
      id: 'wa-2',
      recipientName: 'Neha Reddy',
      phone: '+91 98221 44002',
      rollNo: 'STU-2026-002',
      message:
        'Hi Neha, Rajesh from ClassPilot here. We noticed you missed 3 recent sessions in Java Full Stack. We want to make sure you stay on track! Also, a friendly reminder that your next EMI (₹16,000) is scheduled for 15 Oct (overdue by 1 day). Let us know if you need any academic backup support: https://classpilot.io/pay/STU-2026-002',
      status: 'DELIVERED',
      timestamp: '10:15 AM',
      waLink: 'https://wa.me/919822144002',
    },
    {
      id: 'wa-3',
      recipientName: 'Karan Johar',
      phone: '+91 98221 44003',
      rollNo: 'STU-2026-003',
      message:
        'Hi Karan, Rajesh from ClassPilot here. We noticed you missed 5 recent sessions in Java Full Stack (Cohort Beta). Your next EMI (₹16,000) is scheduled for 20 Oct. Link: https://classpilot.io/pay/STU-2026-003',
      status: 'SENT',
      timestamp: '10:16 AM',
      waLink: 'https://wa.me/919822144003',
    },
  ]);

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

      {/* Messages Feed */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-5 rounded-3xl bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between border-b border-paper-200 dark:border-paper-700 pb-2.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-ink dark:text-paper-100">{msg.recipientName}</span>
                <span className="px-2 py-0.2 rounded bg-paper-200 dark:bg-paper-700 font-mono text-[10px] text-ink-muted">
                  {msg.rollNo}
                </span>
                <span className="text-[11px] font-mono text-emerald-600 font-bold">{msg.phone}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-600 font-bold">
                  <CheckCheck className="w-3.5 h-3.5" /> {msg.status}
                </span>
                <span className="text-[10px] font-mono text-ink-muted">{msg.timestamp}</span>
              </div>
            </div>

            {/* WhatsApp Chat Bubble */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-xs font-sans text-ink dark:text-paper-100 leading-relaxed">
              💬 {msg.message}
            </div>

            <div className="flex justify-end">
              <a
                href={msg.waLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm transition-all"
              >
                <span>Open in WhatsApp Web (wa.me)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
