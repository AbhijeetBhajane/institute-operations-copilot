import { testQueryValidator } from './queryValidator.test';
import { testRoleGate } from './roleGate.test';
import { testTimetableSolver } from './timetableSolver.test';
import { testReconciliationMatcher } from './reconciliationMatcher.test';
import { prisma } from '../lib/db';

async function runAll() {
  console.log('====================================================');
  console.log('🚀 Running ClassPilot Comprehensive Test Suite');
  console.log('====================================================');

  const r1 = testQueryValidator();
  const r2 = testRoleGate();
  const r3 = await testTimetableSolver();
  const r4 = testReconciliationMatcher();

  const totalPassed = r1.passed + r2.passed + r3.passed + r4.passed;
  const totalFailed = r1.failed + r2.failed + r3.failed + r4.failed;
  const allErrors = [...r1.errors, ...r2.errors, ...r3.errors, ...r4.errors];

  console.log('\n====================================================');
  console.log(`📊 Test Summary: ${totalPassed} Passed, ${totalFailed} Failed`);
  console.log('====================================================');

  if (totalFailed > 0) {
    console.error('❌ Failures:');
    allErrors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  } else {
    console.log('🎉 ALL TESTS PASSED! System is fully verified.');
  }

  await prisma.$disconnect();
}

runAll().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
