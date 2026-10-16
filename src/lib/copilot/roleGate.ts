import { UserRole } from '../auth';

export interface RoleGateResult {
  allowed: boolean;
  refusalReason?: string;
  filteredAllowedTables: string[];
}

const ALL_TABLES = [
  'Student',
  'Course',
  'Batch',
  'Trainer',
  'Room',
  'Enrollment',
  'FeePlan',
  'Instalment',
  'Payment',
  'AttendanceRecord',
  'Assignment',
  'Submission',
  'Recording',
  'Certificate',
  'ReconciliationRecord',
  'AuditLog',
];

const TRAINER_ALLOWED_TABLES = [
  'Student',
  'Course',
  'Batch',
  'Trainer',
  'Room',
  'Enrollment',
  'AttendanceRecord',
  'Assignment',
  'Submission',
  'Recording',
];

const COUNSELOR_ALLOWED_TABLES = [
  'Student',
  'Course',
  'Batch',
  'Trainer',
  'Room',
  'Enrollment',
  'FeePlan',
  'Instalment',
  'AttendanceRecord',
  'Assignment',
  'Certificate',
];

const ACCOUNTS_ALLOWED_TABLES = [
  'Student',
  'Course',
  'Batch',
  'Trainer',
  'Enrollment',
  'FeePlan',
  'Instalment',
  'Payment',
  'ReconciliationRecord',
  'Certificate',
  'AuditLog',
];

// Jailbreak triggers & financial keywords for prompt inspection
const JAILBREAK_PATTERNS = [
  /ignore (all |previous |your )?(rules|instructions|constraints|system|prompts)/i,
  /as (the |an )?(owner|administrator|admin|director|accounts lead)/i,
  /pretend (you are|to be) (owner|admin|accounts)/i,
  /system override/i,
  /developer mode/i,
  /sudo /i,
  /grant .* access/i,
  /bypass .* restriction/i,
];

const FINANCIAL_KEYWORDS = [
  'fee',
  'fees',
  'emi',
  'emis',
  'instalment',
  'instalments',
  'payment',
  'payments',
  'due',
  'dues',
  'overdue',
  'balance',
  'amount',
  'paid',
  'unpaid',
  'collected',
  'collection',
  'revenue',
  'reconciliation',
  'bank statement',
  'utr',
  'cheque',
  'refund',
];

/**
 * Filter the allowed schema definition given to the query planner,
 * and inspect the prompt for adversarial bypass attempts.
 */
export function evaluateRoleGate(role: UserRole, prompt: string): RoleGateResult {
  const lowerPrompt = prompt.toLowerCase();

  // 1. Jailbreak phrase detection
  const isJailbreakAttempt = JAILBREAK_PATTERNS.some((pattern) => pattern.test(lowerPrompt));

  // 2. Trainer financial restriction check
  if (role === 'TRAINER') {
    const mentionsFinancials = FINANCIAL_KEYWORDS.some((kw) => {
      // word boundary check
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      return regex.test(lowerPrompt);
    });

    if (mentionsFinancials || isJailbreakAttempt) {
      return {
        allowed: false,
        refusalReason:
          "Access Restricted: As a Trainer, your clearance is strictly limited to academic operations (your assigned batches, student attendance, assignments, and session recordings). Access to fee plans, EMIs, payments, and financial records is protected and restricted to the Accounts and Owner roles. This attempt has been logged in the audit trail.",
        filteredAllowedTables: TRAINER_ALLOWED_TABLES,
      };
    }

    return {
      allowed: true,
      filteredAllowedTables: TRAINER_ALLOWED_TABLES,
    };
  }

  // 3. Counselor reconciliation check
  if (role === 'COUNSELOR') {
    if (lowerPrompt.includes('reconciliation') || lowerPrompt.includes('bank statement') || lowerPrompt.includes('utr')) {
      return {
        allowed: false,
        refusalReason:
          "Access Restricted: Bank and UPI statement reconciliation is reserved for the Accounts and Owner roles. Counselors can view student fee status but cannot access raw financial reconciliation data.",
        filteredAllowedTables: COUNSELOR_ALLOWED_TABLES,
      };
    }

    return {
      allowed: true,
      filteredAllowedTables: COUNSELOR_ALLOWED_TABLES,
    };
  }

  if (role === 'ACCOUNTS') {
    return {
      allowed: true,
      filteredAllowedTables: ACCOUNTS_ALLOWED_TABLES,
    };
  }

  // OWNER has full access
  return {
    allowed: true,
    filteredAllowedTables: ALL_TABLES,
  };
}
