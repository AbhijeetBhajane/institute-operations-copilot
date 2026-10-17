import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { AccessRestrictedCard } from '@/components/layout/AccessRestrictedCard';
import { AttendanceClient } from './AttendanceClient';

export default async function AttendancePage() {
  const user = await getCurrentUser();

  if (user.role === 'STUDENT') {
    return (
      <AccessRestrictedCard
        role={user.role}
        requiredClearance="Trainer or Operator Clearance"
        reason="The Biometric Turnstile Kiosk simulator and Classroom Roster Marking Sheet are restricted to trainers and staff operators. Students can verify their personal attendance telemetry in their learning portal."
      />
    );
  }

  return <AttendanceClient />;
}
