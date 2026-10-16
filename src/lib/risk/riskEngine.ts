export interface RiskInput {
  attendanceRate: number; // 0 - 100%
  recentAbsences: number; // missed in last 6 sessions
  pendingAssignments: number;
  overdueInstalmentsCount: number;
  totalOverdueAmount: number;
}

export interface RiskEvaluation {
  riskScore: number; // 0 - 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  reasonChips: string[];
  plainExplanation: string;
}

/**
 * Calculates a multi-factor, explainable dropout risk score for a student
 */
export function calculateStudentRisk(input: RiskInput): RiskEvaluation {
  let score = 0;
  const reasonChips: string[] = [];

  // Factor 1: Attendance Trajectory (Weight: 45%)
  if (input.recentAbsences >= 4) {
    score += 45;
    reasonChips.push(`Missed ${input.recentAbsences} of last 6 classes`);
  } else if (input.recentAbsences >= 2) {
    score += 25;
    reasonChips.push(`Missed ${input.recentAbsences} recent sessions`);
  } else if (input.attendanceRate < 75) {
    score += 20;
    reasonChips.push(`Overall attendance below 75% (${input.attendanceRate.toFixed(0)}%)`);
  }

  // Factor 2: Financial Delinquency (Weight: 35%)
  if (input.overdueInstalmentsCount >= 2) {
    score += 35;
    reasonChips.push(`Multiple EMIs overdue (₹${input.totalOverdueAmount.toLocaleString('en-IN')})`);
  } else if (input.overdueInstalmentsCount === 1) {
    score += 25;
    reasonChips.push(`2nd EMI payment overdue (₹${input.totalOverdueAmount.toLocaleString('en-IN')})`);
  }

  // Factor 3: Academic Submission Engagement (Weight: 20%)
  if (input.pendingAssignments >= 2) {
    score += 20;
    reasonChips.push(`${input.pendingAssignments} coursework assignments overdue`);
  } else if (input.pendingAssignments === 1) {
    score += 10;
    reasonChips.push(`1 pending assignment submission`);
  }

  const finalScore = Math.min(100, Math.max(0, score));

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (finalScore >= 65) riskLevel = 'HIGH';
  else if (finalScore >= 35) riskLevel = 'MEDIUM';

  const plainExplanation =
    reasonChips.length > 0
      ? `Student flagged at ${riskLevel} risk due to: ${reasonChips.join(', ')}.`
      : 'Student is academically active and in good financial standing.';

  return {
    riskScore: finalScore,
    riskLevel,
    reasonChips,
    plainExplanation,
  };
}
