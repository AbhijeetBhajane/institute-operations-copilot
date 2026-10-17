import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { AccessRestrictedCard } from '@/components/layout/AccessRestrictedCard';
import { ReconciliationClient } from './ReconciliationClient';

export default async function ReconciliationPage() {
  const user = await getCurrentUser();

  if (user.role === 'STUDENT' || user.role === 'COUNSELOR') {
    return (
      <AccessRestrictedCard
        role={user.role}
        requiredClearance="Accounts or Owner Clearance"
        reason={
          user.role === 'STUDENT'
            ? 'Bank and UPI statement reconciliation is strictly reserved for institute accounts administrators. Student accounts only have access to their personal fee receipts.'
            : 'Bank and UPI statement reconciliation is reserved for the Accounts and Owner roles. Counselors can view student fee status but cannot access raw financial reconciliation data.'
        }
      />
    );
  }

  return <ReconciliationClient />;
}
