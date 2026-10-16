'use client';

import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  ExternalLink,
  Search,
  Filter,
  CheckCheck,
  Send,
  Plus,
  X,
} from 'lucide-react';

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

export function WhatsAppOutboxViewer() {
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
      waLink: 'https://wa.me/919822144001?text=Hi%20Aditya',
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
      waLink: 'https://wa.me/919822144002?text=Hi%20Neha',
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
      waLink: 'https://wa.me/919822144003?text=Hi%20Karan',
    },
    {
      id: 'wa-4',
      recipientName: 'Simran Kaur',
      phone: '+91 98221 44004',
      rollNo: 'STU-2026-004',
      message:
        'Hi Simran, Rajesh from ClassPilot here. A friendly reminder that your next EMI (₹16,000) is due on 17 Oct. Please clear dues to ensure uninterrupted lab access: https://classpilot.io/pay/STU-2026-004',
      status: 'QUEUED',
      timestamp: '10:18 AM',
      waLink: 'https://wa.me/919822144004?text=Hi%20Simran',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeName, setComposeName] = useState('Gaurav Mehta');
  const [composePhone, setComposePhone] = useState('+91 98450 12013');
  const [composeMessage, setComposeMessage] = useState(
    'Hi Gaurav, Rajesh from ClassPilot here. Just checking in on your project milestone progress for Spring Boot. Let us know if you have questions!'
  );

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      const matchSearch =
        searchTerm === '' ||
        m.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = selectedStatus === 'ALL' || m.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [messages, searchTerm, selectedStatus]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = composePhone.replace(/[^0-9]/g, '');
    const newMsg: OutboxMessage = {
      id: `wa-${Date.now()}`,
      recipientName: composeName,
      phone: composePhone,
      rollNo: 'STU-CUSTOM',
      message: composeMessage,
      status: 'DELIVERED',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      waLink: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(composeMessage)}`,
    };

    setMessages([newMsg, ...messages]);
    setShowComposeModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="p-4 rounded-3xl bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search outbox by student name, roll number, or message text..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900 text-xs text-ink dark:text-paper-100 placeholder:text-ink-muted focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900 text-xs font-medium text-ink dark:text-paper-100 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="DELIVERED">Delivered</option>
            <option value="SENT">Sent</option>
            <option value="QUEUED">Queued</option>
          </select>

          <button
            onClick={() => setShowComposeModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron hover:bg-saffron-light text-ink font-bold text-xs shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Compose Message</span>
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {filtered.map((msg) => (
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
                <span
                  className={`flex items-center gap-1 font-mono text-[11px] font-bold ${
                    msg.status === 'DELIVERED'
                      ? 'text-emerald-600'
                      : msg.status === 'SENT'
                      ? 'text-teal'
                      : 'text-amber-600'
                  }`}
                >
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm transition-all"
              >
                <span>Open in WhatsApp Web (wa.me)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Compose Custom Message Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-paper-800 rounded-3xl max-w-md w-full p-6 space-y-4 border border-saffron shadow-2xl relative">
            <button
              onClick={() => setShowComposeModal(false)}
              className="absolute top-5 right-5 p-1 rounded-full hover:bg-paper-200 dark:hover:bg-paper-700 text-ink-muted"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="font-mono text-xs font-bold text-saffron uppercase tracking-wider">
                WHATSAPP OUTBOX DISPATCH
              </span>
              <h3 className="font-serif text-2xl font-bold text-ink dark:text-paper-100 mt-1">
                Compose Custom Message
              </h3>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-ink dark:text-paper-100">Recipient Student Name:</label>
                <input
                  type="text"
                  value={composeName}
                  onChange={(e) => setComposeName(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900"
                />
              </div>

              <div>
                <label className="font-bold text-ink dark:text-paper-100">Phone Number:</label>
                <input
                  type="text"
                  value={composePhone}
                  onChange={(e) => setComposePhone(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-ink dark:text-paper-100">Message Text:</label>
                <textarea
                  rows={4}
                  value={composeMessage}
                  onChange={(e) => setComposeMessage(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-paper-300 dark:border-paper-700 bg-paper-50 dark:bg-paper-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-muted hover:bg-paper-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-saffron text-ink font-bold text-xs hover:bg-saffron-light"
                >
                  Dispatch to Outbox
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
