export interface StatementEntry {
  utrRef: string;
  senderName: string;
  amount: number;
  statementDate: string;
  remarks?: string;
}

export interface CandidateInstalment {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  amount: number;
  dueDate: string;
  status: string;
}

export interface ReconciliationMatchResult {
  entry: StatementEntry;
  matchedInstalment?: CandidateInstalment;
  matchType: 'MATCHED' | 'PARTIAL' | 'UNMATCHED' | 'DUPLICATE';
  confidenceScore: number; // 0 - 1.0
  reasons: string[];
}

// Levenshtein distance for fuzzy name matching
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function nameSimilarity(name1: string, name2: string): number {
  const n1 = name1.toLowerCase().trim();
  const n2 = name2.toLowerCase().trim();

  if (n1 === n2) return 1.0;
  if (n1.includes(n2) || n2.includes(n1)) return 0.9;

  // Handle "N. Reddy" vs "Neha Reddy"
  const tokens1 = n1.split(/\s+/);
  const tokens2 = n2.split(/\s+/);
  if (tokens1.length > 0 && tokens2.length > 0) {
    const lastNameMatch = tokens1[tokens1.length - 1] === tokens2[tokens2.length - 1];
    if (lastNameMatch) return 0.88;
  }

  const maxLen = Math.max(n1.length, n2.length);
  if (maxLen === 0) return 1.0;
  const dist = levenshteinDistance(n1, n2);
  return Math.max(0, 1 - dist / maxLen);
}

/**
 * Fuzzy reconciliation matching algorithm
 */
export function reconcileStatements(
  statementEntries: StatementEntry[],
  openInstalments: CandidateInstalment[],
  existingUtrs: Set<string>
): ReconciliationMatchResult[] {
  const results: ReconciliationMatchResult[] = [];
  const matchedInstalmentIds = new Set<string>();

  for (const entry of statementEntries) {
    // 1. Duplicate UTR check
    if (existingUtrs.has(entry.utrRef)) {
      results.push({
        entry,
        matchType: 'DUPLICATE',
        confidenceScore: 1.0,
        reasons: ['UTR reference has already been processed in a prior bank reconciliation run.'],
      });
      continue;
    }

    let bestMatch: CandidateInstalment | undefined;
    let highestScore = 0;
    let matchReasons: string[] = [];

    for (const inst of openInstalments) {
      if (matchedInstalmentIds.has(inst.id)) continue;

      let score = 0;
      const reasons: string[] = [];

      // Check amount match
      const amountDiff = Math.abs(entry.amount - inst.amount);
      if (amountDiff === 0) {
        score += 0.5;
        reasons.push('Exact amount match (₹' + entry.amount.toLocaleString('en-IN') + ')');
      } else if (amountDiff <= 500) {
        score += 0.25;
        reasons.push(`Partial amount (difference of ₹${amountDiff})`);
      }

      // Check name similarity
      const sim = nameSimilarity(entry.senderName, inst.studentName);
      if (sim >= 0.85) {
        score += 0.5 * sim;
        reasons.push(`Strong name correlation (${(sim * 100).toFixed(0)}% match to ${inst.studentName})`);
      } else if (sim >= 0.5) {
        score += 0.25 * sim;
        reasons.push(`Possible name correspondence (${(sim * 100).toFixed(0)}% to ${inst.studentName})`);
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = inst;
        matchReasons = reasons;
      }
    }

    if (bestMatch && highestScore >= 0.8) {
      matchedInstalmentIds.add(bestMatch.id);
      results.push({
        entry,
        matchedInstalment: bestMatch,
        matchType: 'MATCHED',
        confidenceScore: Math.min(1.0, highestScore),
        reasons: matchReasons,
      });
    } else if (bestMatch && highestScore >= 0.45) {
      results.push({
        entry,
        matchedInstalment: bestMatch,
        matchType: 'PARTIAL',
        confidenceScore: highestScore,
        reasons: matchReasons,
      });
    } else {
      results.push({
        entry,
        matchType: 'UNMATCHED',
        confidenceScore: highestScore,
        reasons: ['No qualifying unpaid instalment found matching amount or sender name.'],
      });
    }
  }

  return results;
}
