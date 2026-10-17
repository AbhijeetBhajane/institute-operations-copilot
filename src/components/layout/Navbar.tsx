'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  Sparkles,
  Calendar,
  Users,
  Layers,
  CreditCard,
  QrCode,
  FileCheck2,
  FileText,
  History,
  MessageSquare,
  Moon,
  Sun,
  Video,
  BookOpen,
  Search,
  Command,
} from 'lucide-react';
import { RoleSwitcher } from './RoleSwitcher';
import { UserRole, PRESET_USERS } from '@/lib/authTypes';

export function Navbar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('OWNER');

  useEffect(() => {
    // Check initial dark mode
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
    const match = document.cookie.match(/classpilot_role=([^;]+)/);
    if (match && match[1] && PRESET_USERS[match[1] as UserRole]) {
      setCurrentRole(match[1] as UserRole);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const adminNavLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Compass },
    { href: '/copilot', label: 'AI Copilot', icon: Sparkles, hero: true },
    { href: '/timetable', label: 'Timetable', icon: Calendar },
    { href: '/students', label: 'Students', icon: Users },
    { href: '/batches', label: 'Batches', icon: Layers },
    { href: '/fees', label: 'Fees & EMIs', icon: CreditCard },
    { href: '/attendance', label: 'Attendance', icon: QrCode },
    { href: '/reconciliation', label: 'Reconciliation', icon: FileCheck2 },
    { href: '/certificates', label: 'Certificates', icon: FileText },
    { href: '/audit', label: 'Audit Log', icon: History },
    { href: '/whatsapp', label: 'Outbox', icon: MessageSquare },
  ];

  const studentNavLinks = [
    { href: '/dashboard', label: 'My Learning Portal', icon: Compass },
    { href: '/copilot', label: 'Student AI Copilot', icon: Sparkles, hero: true },
    { href: '/recordings', label: 'Class Recordings', icon: Video },
    { href: '/certificates', label: 'My Certificates', icon: FileText },
    { href: '/students/stu-001', label: 'My Dossier & Profile', icon: Users },
  ];

  const navLinks = currentRole === 'STUDENT' ? studentNavLinks : adminNavLinks;


  return (
    <header className="sticky top-0 z-30 bg-paper-100/90 dark:bg-paper-900/90 backdrop-blur-md border-b border-paper-300 dark:border-paper-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Mark */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-ink dark:bg-paper-800 flex items-center justify-center text-saffron shadow-md border border-saffron/30 transition-transform group-hover:scale-105">
                <Sparkles className="w-5 h-5 fill-saffron/20 text-saffron" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-ink dark:text-paper-100 flex items-center gap-1.5">
                  ClassPilot
                  <span className="text-[10px] font-sans font-semibold uppercase px-1.5 py-0.2 rounded bg-saffron/20 text-saffron-dark dark:text-saffron">
                    Mission Control
                  </span>
                </span>
                <p className="text-[10px] text-ink-muted dark:text-ink-subtle -mt-1 font-mono">
                  Institute AI Operations
                </p>
              </div>
            </Link>

            {/* Navigation items */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.slice(0, 7).map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      item.hero
                        ? isActive
                          ? 'bg-saffron text-ink font-bold shadow-sm'
                          : 'bg-saffron/10 text-saffron-dark dark:text-saffron hover:bg-saffron/20'
                        : isActive
                        ? 'bg-paper-200 dark:bg-paper-800 text-ink dark:text-paper-100 font-semibold'
                        : 'text-ink-muted dark:text-ink-subtle hover:text-ink dark:hover:text-paper-100 hover:bg-paper-200/50 dark:hover:bg-paper-800/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Secondary navigation dropdown / more */}
            <div className="hidden sm:flex items-center gap-1 border-r border-paper-300 dark:border-paper-800 pr-3">
              {navLinks.slice(7).map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-paper-200 dark:bg-paper-800 text-ink dark:text-paper-100'
                        : 'text-ink-muted dark:text-ink-subtle hover:text-ink dark:hover:text-paper-100 hover:bg-paper-200/50 dark:hover:bg-paper-800/50'
                    }`}
                    title={item.label}
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                );
              })}
            </div>

            {/* Quick Copilot Cmd+K launcher button */}
            <Link
              href="/copilot"
              className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-paper-200/80 dark:bg-paper-800/80 border border-paper-300 dark:border-paper-700 text-xs text-ink-muted dark:text-ink-subtle hover:border-saffron/60 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Ask Operations...</span>
              <kbd className="flex items-center gap-0.5 text-[10px] bg-paper-100 dark:bg-paper-900 px-1.5 py-0.5 rounded border border-paper-300 dark:border-paper-700 font-mono">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </Link>

            {/* Dark Mode Night Shift Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-ink-muted dark:text-ink-subtle hover:bg-paper-200 dark:hover:bg-paper-800 transition-colors"
              title={isDark ? 'Switch to Warm Paper Mode' : 'Switch to Night Shift Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-saffron" /> : <Moon className="w-4 h-4 text-ink" />}
            </button>

            {/* 1-Click Role Switcher */}
            <RoleSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
