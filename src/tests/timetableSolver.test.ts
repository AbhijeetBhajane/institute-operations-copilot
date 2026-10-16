import { solveSchedule, triggerDeliberateClash, getExpandedSchedule } from '../lib/timetable/solver';

export async function testTimetableSolver(): Promise<{ passed: number; failed: number; errors: string[] }> {
  let passed = 0;
  let failed = 0;
  const errors: string[] = [];

  function assert(condition: boolean, testName: string) {
    if (condition) {
      passed++;
      console.log(`  ✓ ${testName}`);
    } else {
      failed++;
      errors.push(`FAIL: ${testName}`);
      console.error(`  ✗ ${testName}`);
    }
  }

  console.log('\n--- 🧪 Testing Smart Timetable Engine & Clash Solver ---');

  // Step 1: Trigger deliberate clash on Priya Sharma (TUE 10:00 AM)
  await triggerDeliberateClash();

  // Step 2: Detect initial conflicts
  const initial = await getExpandedSchedule();
  assert(initial.conflicts.length > 0, 'Detects deliberate trainer double-booking clash on Priya Sharma');
  assert(initial.conflicts[0].type === 'TRAINER_CLASH', 'Correctly classifies conflict as TRAINER_CLASH');

  // Step 3: Run the constraint solver
  const solution = await solveSchedule();
  assert(solution.success === true, 'Timetable solver successfully finds clash-free schedule');
  assert(solution.conflictsAfter.length === 0, 'Post-solve schedule has 0 remaining conflicts');
  assert(solution.moves.length === 1, 'Applies minimal disruption: exactly 1 batch moved');
  assert(solution.solveTimeMs < 5000, `Re-plans schedule rapidly (${solution.solveTimeMs}ms)`);
  assert(solution.changeReportMarkdown.includes('Moved Batch'), 'Generates written Change Report with reasoning');

  return { passed, failed, errors };
}
