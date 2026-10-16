import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { FileText, CheckCircle2, QrCode, ExternalLink, Award, ArrowRight } from 'lucide-react';

export default async function CertificatesPage() {
  const user = await getCurrentUser();

  const certificates = await prisma.certificate.findMany({
    include: { student: true, course: true },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-paper-800 p-6 rounded-3xl border border-paper-300 dark:border-paper-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-saffron uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Graduation & Credential Verification</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-ink dark:text-paper-100">
            Completion Certificates
          </h2>
          <p className="text-xs text-ink-muted dark:text-ink-subtle mt-0.5">
            Automated eligibility verification rules: Attendance &gt;= 80% and Fees 100% Cleared.
          </p>
        </div>
      </div>

      {/* Certificate Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="p-6 rounded-3xl bg-white dark:bg-paper-800 border-2 border-saffron/30 shadow-receipt space-y-4 relative overflow-hidden"
          >
            {/* Top Certificate Watermark */}
            <div className="flex items-center justify-between border-b border-paper-200 dark:border-paper-700 pb-3">
              <div>
                <span className="font-mono text-[10px] font-bold text-saffron-dark dark:text-saffron">
                  OFFICIAL INSTITUTE CREDENTIAL
                </span>
                <p className="font-mono text-xs font-bold text-ink dark:text-paper-100">
                  {cert.certificateNo}
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                VERIFIED STATUS: {cert.status}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-ink-muted dark:text-ink-subtle font-serif italic">
                This is to certify that
              </p>
              <h3 className="font-serif text-2xl font-bold text-ink dark:text-paper-100">
                {cert.student.name}
              </h3>
              <p className="text-xs text-ink-muted dark:text-ink-subtle">
                has successfully fulfilled all academic criteria, capstone defenses, and attendance requirements for:
              </p>
              <p className="font-bold text-sm text-saffron-dark dark:text-saffron">
                {cert.course.name}
              </p>
              <p className="text-xs text-ink-muted dark:text-ink-subtle font-mono">
                Awarded with: <strong>{cert.grade}</strong>
              </p>
            </div>

            {/* Verification Footer */}
            <div className="pt-4 border-t border-paper-200 dark:border-paper-700 flex items-center justify-between text-xs">
              <div>
                <p className="text-[10px] text-ink-muted dark:text-ink-subtle font-mono">
                  Cryptographic Verification Code:
                </p>
                <p className="font-mono font-bold text-ink dark:text-paper-100">
                  {cert.verificationCode}
                </p>
              </div>

              <Link
                href={`/verify-certificate/${cert.verificationCode}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-paper-100 dark:bg-paper-700 font-bold text-teal text-xs hover:bg-paper-200 transition-colors"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Verify Credential</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
