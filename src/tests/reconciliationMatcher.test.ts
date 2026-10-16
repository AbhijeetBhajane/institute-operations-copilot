import { reconcileStatements, StatementEntry, CandidateInstalment } from '../lib/reconciliation/matcher';

export function testReconciliationMatcher(): { passed: number; failed: number; errors: string[] } {
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

  console.log('\n--- 🧪 Testing Payment Statement Reconciliation Matcher ---');

  const openInstalments: CandidateInstalment[] = [
    {
      id: 'inst-001',
      studentId: 'stu-001',
      studentName: 'Aditya Kumar',
      rollNo: 'STU-2026-001',
      amount: 16000,
      dueDate: '2026-10-18',
      status: 'DUE',
    },
    {
      id: 'inst-002',
      studentId: 'stu-002',
      studentName: 'Neha Reddy',
      rollNo: 'STU-2026-002',
      amount: 16000,
      dueDate: '2026-10-15',
      status: 'OVERDUE',
    },
    {
      id: 'inst-003',
      studentId: 'stu-003',
      studentName: 'Karan Johar',
      rollNo: 'STU-2026-003',
      amount: 16000,
      dueDate: '2026-10-20',
      status: 'DUE',
    },
  ];

  const existingUtrs = new Set<string>(['UPI/PREV/1122334455']);

  const statementEntries: StatementEntry[] = [
    {
      utrRef: 'UPI/AXIS/9988776655',
      senderName: 'Aditya Kumar',
      amount: 16000,
      statementDate: '2026-10-16',
    },
    {
      utrRef: 'UPI/HDFC/4455667788',
      senderName: 'N. Reddy', // Fuzzy match to Neha Reddy
      amount: 16000,
      statementDate: '2026-10-16',
    },
    {
      utrRef: 'UPI/PREV/1122334455', // Duplicate UTR
      senderName: 'Someone Else',
      amount: 16000,
      statementDate: '2026-10-15',
    },
    {
      utrRef: 'IMPS/SBI/0001112223',
      senderName: 'Unknown Person',
      amount: 7200,
      statementDate: '2026-10-14',
    },
  ];

  const results = reconcileStatements(statementEntries, openInstalments, existingUtrs);

  // Match 1: Exact
  assert(results[0].matchType === 'MATCHED', 'Accurately matches exact name and amount for Aditya Kumar');
  assert(results[0].matchedInstalment?.studentName === 'Aditya Kumar', 'Identifies correct student record');

  // Match 2: Fuzzy name "N. Reddy"
  assert(
    results[1].matchType === 'MATCHED' || results[1].matchType === 'PARTIAL',
    'Performs fuzzy match on "N. Reddy" to "Neha Reddy"'
  );
  assert(results[1].matchedInstalment?.studentName === 'Neha Reddy', 'Identified Neha Reddy via fuzzy similarity');

  // Match 3: Duplicate UTR
  assert(results[2].matchType === 'DUPLICATE', 'Flags previously processed UTR as DUPLICATE');

  // Match 4: Unmatched unknown entry
  assert(results[3].matchType === 'UNMATCHED', 'Flags unknown sender and irregular amount as UNMATCHED');

  return { passed, failed, errors };
}
