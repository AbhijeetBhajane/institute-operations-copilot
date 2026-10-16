export type UserRole = 'OWNER' | 'COUNSELOR' | 'TRAINER' | 'ACCOUNTS';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  trainerId?: string | null;
}

export const PRESET_USERS: Record<UserRole, AuthUser> = {
  OWNER: {
    id: 'usr-owner-01',
    name: 'Rajesh Ramanathan',
    email: 'owner@classpilot.io',
    role: 'OWNER',
  },
  COUNSELOR: {
    id: 'usr-counselor-01',
    name: 'Meera Menon',
    email: 'counselor@classpilot.io',
    role: 'COUNSELOR',
  },
  TRAINER: {
    id: 'usr-trainer-priya',
    name: 'Priya Sharma (Trainer)',
    email: 'trainer@classpilot.io',
    role: 'TRAINER',
    trainerId: 'tr-priya',
  },
  ACCOUNTS: {
    id: 'usr-accounts-01',
    name: 'Suresh Agarwal',
    email: 'accounts@classpilot.io',
    role: 'ACCOUNTS',
  },
};

export const ROLE_PERMISSIONS: Record<
  UserRole,
  {
    canViewFees: boolean;
    canViewReconciliation: boolean;
    canEditAcademics: boolean;
    canViewAllBatches: boolean;
    canApproveFinancialActions: boolean;
    canExportAuditLogs: boolean;
  }
> = {
  OWNER: {
    canViewFees: true,
    canViewReconciliation: true,
    canEditAcademics: true,
    canViewAllBatches: true,
    canApproveFinancialActions: true,
    canExportAuditLogs: true,
  },
  COUNSELOR: {
    canViewFees: true,
    canViewReconciliation: false,
    canEditAcademics: false,
    canViewAllBatches: true,
    canApproveFinancialActions: false,
    canExportAuditLogs: false,
  },
  TRAINER: {
    canViewFees: false, // STRICTLY FORBIDDEN
    canViewReconciliation: false,
    canEditAcademics: true,
    canViewAllBatches: false,
    canApproveFinancialActions: false,
    canExportAuditLogs: false,
  },
  ACCOUNTS: {
    canViewFees: true,
    canViewReconciliation: true,
    canEditAcademics: false,
    canViewAllBatches: true,
    canApproveFinancialActions: true,
    canExportAuditLogs: true,
  },
};
