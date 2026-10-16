import { validateQuery } from '../lib/copilot/queryValidator';

export function testQueryValidator(): { passed: number; failed: number; errors: string[] } {
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

  console.log('\n--- 🧪 Testing Query Validator ---');

  // Test 1: Legitimate SELECT query with whitelisted table for OWNER
  const res1 = validateQuery('SELECT id, name, email FROM Student WHERE status = "ENROLLED"', 'OWNER');
  assert(res1.isValid === true, 'Allows valid SELECT on Student for OWNER');
  if (res1.isValid) {
    assert(res1.sanitizedQuery.includes('LIMIT 100'), 'Enforces automatic row limit capping');
  }

  // Test 2: Destructive statements must be rejected
  const res2 = validateQuery('DROP TABLE Student;', 'OWNER');
  assert(res2.isValid === false, 'Rejects DROP TABLE attempt');

  const res3 = validateQuery('DELETE FROM AttendanceRecord WHERE id = "1"', 'OWNER');
  assert(res3.isValid === false, 'Rejects DELETE FROM attempt');

  const res4 = validateQuery('UPDATE FeePlan SET totalAmount = 0', 'OWNER');
  assert(res4.isValid === false, 'Rejects UPDATE statement');

  // Test 3: Multi-statement chaining with semicolon rejected
  const res5 = validateQuery('SELECT * FROM Student; DROP TABLE Batch;', 'OWNER');
  assert(res5.isValid === false, 'Rejects multi-statement chaining via semicolon');

  // Test 4: SQL comments (-- and /* */) rejected
  const res6 = validateQuery('SELECT * FROM Student -- bypass filter', 'OWNER');
  assert(res6.isValid === false, 'Rejects SQL inline comments (--)');

  // Test 5: Role-based whitelist: Trainer attempting to access FeePlan or Instalment table
  const res7 = validateQuery('SELECT id, amount, dueDate FROM Instalment', 'TRAINER');
  assert(res7.isValid === false, 'Rejects Trainer querying Instalment table via query validator');

  return { passed, failed, errors };
}
