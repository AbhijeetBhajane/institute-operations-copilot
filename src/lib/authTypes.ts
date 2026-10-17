export type UserRole = 'OWNER' | 'COUNSELOR' | 'TRAINER' | 'ACCOUNTS' | 'STUDENT';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  trainerId?: string | null;
  studentId?: string | null;
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
  STUDENT: {
    id: 'usr-student-aditya',
    name: 'Aditya Kumar (Student)',
    email: 'aditya.kumar1@student.classpilot.io',
    role: 'STUDENT',
    studentId: 'stu-001',
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
    isStudentPortal?: boolean;
  }
> = {
  OWNER: {
    canViewFees: true,
    canViewReconciliation: true,
    canEditAcademics: true,
    canViewAllBatches: true,
    canApproveFinancialActions: true,
    canExportAuditLogs: true,
    isStudentPortal: false,
  },
  COUNSELOR: {
    canViewFees: true,
    canViewReconciliation: false,
    canEditAcademics: false,
    canViewAllBatches: true,
    canApproveFinancialActions: false,
    canExportAuditLogs: false,
    isStudentPortal: false,
  },
  TRAINER: {
    canViewFees: false, // STRICTLY FORBIDDEN
    canViewReconciliation: false,
    canEditAcademics: true,
    canViewAllBatches: false,
    canApproveFinancialActions: false,
    canExportAuditLogs: false,
    isStudentPortal: false,
  },
  ACCOUNTS: {
    canViewFees: true,
    canViewReconciliation: true,
    canEditAcademics: false,
    canViewAllBatches: true,
    canApproveFinancialActions: true,
    canExportAuditLogs: true,
    isStudentPortal: false,
  },
  STUDENT: {
    canViewFees: false, // Cannot view global fee tables or other students' finances
    canViewReconciliation: false, // STRICTLY FORBIDDEN
    canEditAcademics: false, // Cannot alter schedules or marks
    canViewAllBatches: false, // Only views their enrolled batch
    canApproveFinancialActions: false,
    canExportAuditLogs: false,
    isStudentPortal: true,
  },
};

