import { UserRole } from '../auth';
import { evaluateRoleGate } from './roleGate';

export interface ValidationSuccess {
  isValid: true;
  sanitizedQuery: string;
  tablesTouched: string[];
}

export interface ValidationFailure {
  isValid: false;
  reason: string;
}

export type QueryValidationResult = ValidationSuccess | ValidationFailure;

const FORBIDDEN_SQL_KEYWORDS = [
  'insert',
  'update',
  'delete',
  'drop',
  'alter',
  'truncate',
  'create',
  'grant',
  'revoke',
  'execute',
  'exec',
  'attach',
  'detach',
  'vacuum',
  'reindex',
  'pragma',
];

/**
 * Validates that a generated SQL or Semantic query is strictly READ-ONLY (SELECT),
 * references only tables allowed for the user's role, and conforms to parameter constraints.
 */
export function validateQuery(
  rawQuery: string,
  role: UserRole
): QueryValidationResult {
  const trimmed = rawQuery.trim();

  // 1. Must start with SELECT
  if (!/^select\b/i.test(trimmed)) {
    return {
      isValid: false,
      reason: 'Validation Error: Only read-only SELECT queries are permitted by the Copilot semantic layer.',
    };
  }

  // 2. Reject SQL comments explicitly without regex quantifier hazards
  if (trimmed.includes('--') || trimmed.includes('/*') || trimmed.includes('*/')) {
    return {
      isValid: false,
      reason: 'Validation Error: SQL comment syntax (--, /* */) is prohibited in semantic queries.',
    };
  }

  // 3. Multiple statements check
  if (trimmed.includes(';')) {
    const parts = trimmed.split(';').map((p) => p.trim()).filter(Boolean);
    if (parts.length > 1) {
      return {
        isValid: false,
        reason: 'Validation Error: Multi-statement SQL chaining (semicolon) is strictly prohibited.',
      };
    }
  }

  // 4. Destructive and administrative keywords check
  const lowerQuery = trimmed.toLowerCase();
  for (const kw of FORBIDDEN_SQL_KEYWORDS) {
    const wordRegex = new RegExp(`(?:^|[\\s;,\\(])${kw}(?:[\\s;,\\)]|$)`, 'i');
    if (wordRegex.test(lowerQuery)) {
      return {
        isValid: false,
        reason: `Validation Error: Query contains forbidden SQL keyword '${kw}'.`,
      };
    }
  }

  // 5. Role-based table whitelist verification
  const { filteredAllowedTables } = evaluateRoleGate(role, trimmed);
  const tablesTouched: string[] = [];

  // Match identifiers after FROM or JOIN
  const tableMatches = Array.from(trimmed.matchAll(/(?:from|join)\s+([a-zA-Z0-9_]+)/gi));
  for (const match of tableMatches) {
    const tableName = match[1];
    // Find canonical case match in schema
    const canonical = filteredAllowedTables.find(
      (t) => t.toLowerCase() === tableName.toLowerCase()
    );

    if (!canonical) {
      return {
        isValid: false,
        reason: `Access Violation: Table '${tableName}' is not in the authorized schema whitelist for role '${role}'.`,
      };
    }

    if (!tablesTouched.includes(canonical)) {
      tablesTouched.push(canonical);
    }
  }

  // Ensure LIMIT is present
  let sanitized = trimmed;
  if (!/\blimit\s+\d+/i.test(sanitized)) {
    sanitized = `${sanitized} LIMIT 100`;
  }

  return {
    isValid: true,
    sanitizedQuery: sanitized,
    tablesTouched,
  };
}
