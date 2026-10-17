import { cookies } from 'next/headers';
import { prisma } from './db';
import { UserRole, AuthUser, PRESET_USERS, ROLE_PERMISSIONS } from './authTypes';

export * from './authTypes';

/**
 * Returns the currently authenticated user based on session cookie or header.
 * Default role is OWNER so the demo starts fully empowered.
 */
export async function getCurrentUser(): Promise<AuthUser> {
  try {
    const cookieStore = cookies();
    const roleCookie = cookieStore.get('classpilot_role')?.value as UserRole | undefined;

    if (roleCookie && PRESET_USERS[roleCookie]) {
      return PRESET_USERS[roleCookie];
    }
  } catch (error) {
    // If called outside request context (e.g., in background test)
  }

  return PRESET_USERS.OWNER;
}

/**
 * Validates whether a given role can query a specific database table.
 * Crucial for the AI Operations Copilot role gate.
 */
export function checkTableAccessForRole(role: UserRole, table: string): { allowed: boolean; reason?: string } {
  const normalizedTable = table.toLowerCase().trim();

  // Financial tables
  const financialTables = ['feeplan', 'instalment', 'payment', 'reconciliationrecord'];

  if (role === 'TRAINER') {
    if (financialTables.includes(normalizedTable)) {
      return {
        allowed: false,
        reason: `Role 'TRAINER' has no clearance to query or access financial table '${table}'. Request rejected by server security boundary.`,
      };
    }
  }

  if (role === 'COUNSELOR') {
    if (normalizedTable === 'reconciliationrecord') {
      return {
        allowed: false,
        reason: `Role 'COUNSELOR' is not authorized to access bank statement reconciliation data.`,
      };
    }
  }

  if (role === 'STUDENT') {
    const studentForbidden = ['reconciliationrecord', 'auditlog', 'user'];
    if (studentForbidden.includes(normalizedTable)) {
      return {
        allowed: false,
        reason: `Role 'STUDENT' has no clearance to access administrative table '${table}'. Access rejected by student security boundary.`,
      };
    }
  }

  return { allowed: true };
}
