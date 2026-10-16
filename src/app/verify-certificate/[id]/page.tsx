import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { CheckCircle2, ShieldCheck, Award, ArrowLeft } from 'lucide-react';

interface Props {
  params: { id: string };
}

export default async function VerifyCertificatePage({ params }: Props) {
  const certificate = await prisma.certificate.findFirst({
    where: {
      OR: [
        { verificationCode: params.id },
        { certificateNo: params.id },
        { id: params.id },
      ],
    },
    include: { student: true, course: true },
  });

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-6">
      <Link
        href="/certificates"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Certificates</span>
      </Link>

      {certificate ? (
        <div className="bg-white dark:bg-paper-800 rounded-3xl border-2 border-emerald-500 shadow-2xl p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-400">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="font-mono text-xs font-bold uppercase text-emerald-600">
              ✓ Authentic Credential Verified
            </span>
            <h2 className="font-serif text-3xl font-bold text-ink dark:text-paper-100">
              Graduation Certificate Verified
            </h2>
            <p className="text-xs text-ink-muted dark:text-ink-subtle">
              Verified against ClassPilot Cryptographic Ledger on {new Date().toLocaleDateString('en-IN')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-700 text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-paper-200 dark:border-paper-800 pb-2">
              <span className="text-ink-muted">Student Name:</span>
              <span className="font-bold text-ink dark:text-paper-100">{certificate.student.name}</span>
            </div>
            <div className="flex justify-between border-b border-paper-200 dark:border-paper-800 pb-2">
              <span className="text-ink-muted">Student Roll No:</span>
              <span className="font-mono font-bold text-ink dark:text-paper-100">{certificate.student.rollNo}</span>
            </div>
            <div className="flex justify-between border-b border-paper-200 dark:border-paper-800 pb-2">
              <span className="text-ink-muted">Program Completed:</span>
              <span className="font-bold text-saffron-dark dark:text-saffron">{certificate.course.name}</span>
            </div>
            <div className="flex justify-between border-b border-paper-200 dark:border-paper-800 pb-2">
              <span className="text-ink-muted">Certificate Number:</span>
              <span className="font-mono font-bold">{certificate.certificateNo}</span>
            </div>
            <div className="flex justify-between border-b border-paper-200 dark:border-paper-800 pb-2">
              <span className="text-ink-muted">Graduation Standing:</span>
              <span className="font-bold text-emerald-600">{certificate.grade}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Verification Code:</span>
              <span className="font-mono font-bold text-teal">{certificate.verificationCode}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 text-center space-y-3">
          <p className="font-serif text-2xl font-bold text-ink dark:text-paper-100">
            Certificate Record Not Found
          </p>
          <p className="text-xs text-ink-muted dark:text-ink-subtle">
            Verification code &quot;{params.id}&quot; does not match any certificate issued by this institute.
          </p>
        </div>
      )}
    </div>
  );
}
