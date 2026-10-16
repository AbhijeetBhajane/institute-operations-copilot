import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'ClassPilot // Mission Control for Institutes',
  description:
    'Complete training institute operations platform with an AI operations copilot at its centre.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col bg-paper-100 dark:bg-paper-900 text-ink dark:text-paper-100 selection:bg-saffron selection:text-ink">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="border-t border-paper-300 dark:border-paper-800 py-4 text-center text-xs text-ink-muted dark:text-ink-subtle font-mono">
          ClassPilot • AI Operations Copilot • Autonomous Institute Operating System
        </footer>
      </body>
    </html>
  );
}
