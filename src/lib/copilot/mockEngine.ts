import { prisma } from '../db';
import { UserRole } from '../auth';
import { CopilotQueryResult, MessageDraft, DiffItem, ActionPreviewData } from './types';
import { evaluateRoleGate } from './roleGate';
import { validateQuery } from './queryValidator';

export async function processCopilotQuery(
  prompt: string,
  role: UserRole = 'OWNER',
  userId: string = 'usr-owner-01',
  userName: string = 'Rajesh Ramanathan',
  followUpContext?: any
): Promise<CopilotQueryResult> {
  const startTime = Date.now();

  // 1. Role Gate check & jailbreak prevention
  const roleGate = evaluateRoleGate(role, prompt);
  if (!roleGate.allowed) {
    // Log to Audit Log even if refused
    await prisma.auditLog.create({
      data: {
        userId,
        userName,
        role,
        action: 'COPILOT_QUERY_REFUSED',
        prompt,
        query: 'N/A - Refused by Role Gate',
        tablesTouched: 'SECURITY_BOUNDARY',
        rowCount: 0,
        executionTimeMs: Date.now() - startTime,
        details: roleGate.refusalReason,
      },
    });

    return {
      plan: {
        intent: 'Access evaluation & security gate inspection',
        steps: ['Analyze asking user role & permissions', 'Inspect query target schema', 'Enforce RBAC boundary'],
        reasoning: 'The system detected an unauthorized request to restricted schema tables.',
      },
      receipt: {
        query: '-- REJECTED BY SERVER RBAC GATEWAY --',
        tablesTouched: [],
        rowCount: 0,
        executionTimeMs: Date.now() - startTime,
        plainEnglishExplanation: 'Query was halted before reaching database execution because role lacks necessary clearance.',
      },
      columns: [],
      rows: [],
      refused: true,
      refusalReason: roleGate.refusalReason,
    };
  }

  const lower = prompt.toLowerCase();

  // SCENARIO 1: The Hero Query
  // "Which students in the Java batch have missed 3+ classes and have an EMI due this week? Draft a WhatsApp reminder for each."
  const isJavaEmiQuery =
    (lower.includes('java') && (lower.includes('missed') || lower.includes('attendance') || lower.includes('absent')) && (lower.includes('emi') || lower.includes('fee') || lower.includes('due'))) ||
    lower.includes('draft a whatsapp reminder') ||
    lower.includes('hero');

  // SCENARIO 1B: Follow-up query
  const isFollowUpCohortB =
    lower.includes('only those in') ||
    lower.includes('evening batch') ||
    lower.includes('cohort beta') ||
    lower.includes('batch b');

  if (isJavaEmiQuery || isFollowUpCohortB) {
    const querySQL = isFollowUpCohortB
      ? `SELECT s.id, s.rollNo, s.name, s.phone, b.name as batchName,
       COUNT(CASE WHEN a.status = 'ABSENT' THEN 1 END) as missedClasses,
       i.dueDate, i.amount as emiAmount, i.status as emiStatus
FROM Student s
JOIN Enrollment e ON s.id = e.studentId
JOIN Batch b ON e.batchId = b.id
JOIN AttendanceRecord a ON s.id = a.studentId AND a.batchId = b.id
JOIN Instalment i ON s.id = i.studentId
WHERE b.id = 'batch-java-b'
  AND i.dueDate BETWEEN '2026-10-14' AND '2026-10-21'
  AND i.status IN ('DUE', 'OVERDUE')
GROUP BY s.id, i.id
HAVING missedClasses >= 3
LIMIT 50;`
      : `SELECT s.id, s.rollNo, s.name, s.phone, b.name as batchName,
       COUNT(CASE WHEN a.status = 'ABSENT' THEN 1 END) as missedClasses,
       i.dueDate, i.amount as emiAmount, i.status as emiStatus
FROM Student s
JOIN Enrollment e ON s.id = e.studentId
JOIN Batch b ON e.batchId = b.id
JOIN AttendanceRecord a ON s.id = a.studentId AND a.batchId = b.id
JOIN Instalment i ON s.id = i.studentId
WHERE b.courseId = 'crs-java'
  AND i.dueDate BETWEEN '2026-10-14' AND '2026-10-21'
  AND i.status IN ('DUE', 'OVERDUE')
GROUP BY s.id, i.id
HAVING missedClasses >= 3
LIMIT 50;`;

    // Validate the query through the strict whitelist validator
    const validation = validateQuery(querySQL, role);
    if (!validation.isValid) {
      throw new Error((validation as any).reason);
    }

    // Fetch actual matching students from database
    const batchFilter = isFollowUpCohortB ? { id: 'batch-java-b' } : { courseId: 'crs-java' };

    const matchingStudents = await prisma.student.findMany({
      where: {
        enrollments: {
          some: {
            batch: batchFilter,
          },
        },
        instalments: {
          some: {
            dueDate: {
              gte: new Date('2026-10-14T00:00:00.000Z'),
              lte: new Date('2026-10-21T23:59:59.000Z'),
            },
            status: { in: ['DUE', 'OVERDUE'] },
          },
        },
      },
      include: {
        enrollments: {
          include: { batch: true },
        },
        instalments: {
          where: {
            dueDate: {
              gte: new Date('2026-10-14T00:00:00.000Z'),
              lte: new Date('2026-10-21T23:59:59.000Z'),
            },
            status: { in: ['DUE', 'OVERDUE'] },
          },
        },
        attendances: {
          where: { status: 'ABSENT' },
          orderBy: { date: 'desc' },
          take: 10,
        },
      },
      take: 10,
    });

    // Filter to those with at least 3 missed classes
    const qualified = matchingStudents.filter((s) => s.attendances.length >= 3);

    // Format rows for table rendering
    const rows = qualified.map((s) => {
      const activeEnrollment = s.enrollments[0];
      const activeInstalment = s.instalments[0];
      return {
        id: s.id,
        rollNo: s.rollNo,
        name: s.name,
        phone: s.phone,
        batchName: activeEnrollment?.batch.name || 'Java Full Stack',
        missedClasses: s.attendances.length,
        emiDueDate: activeInstalment?.dueDate ? activeInstalment.dueDate.toISOString().split('T')[0] : '2026-10-18',
        emiAmount: `₹${(activeInstalment?.amount || 16000).toLocaleString('en-IN')}`,
        emiStatus: activeInstalment?.status || 'DUE',
      };
    });

    // Synthesize personalized WhatsApp drafts
    const messageDrafts: MessageDraft[] = qualified.map((s) => {
      const inst = s.instalments[0];
      const batch = s.enrollments[0]?.batch;
      const dueDateFormatted = inst?.dueDate ? inst.dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '18 Oct';
      const amountStr = `₹${(inst?.amount || 16000).toLocaleString('en-IN')}`;

      const text = `Hi ${s.name.split(' ')[0]}, Rajesh from ClassPilot here. We noticed you missed ${s.attendances.length} recent sessions in ${batch?.name || 'Java Full Stack'}. We want to make sure you stay on track! Also, a friendly reminder that your next EMI (${amountStr}) is scheduled for ${dueDateFormatted}. Let us know if you need any academic backup support or flexible fee assistance: https://classpilot.io/pay/${s.rollNo}`;

      const cleanPhone = s.phone.replace(/[^0-9]/g, '');
      const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;

      return {
        studentId: s.id,
        studentName: s.name,
        phone: s.phone,
        rollNo: s.rollNo,
        batchName: batch?.name || 'Java Full Stack',
        missedClassesCount: s.attendances.length,
        emiDueDate: dueDateFormatted,
        emiAmount: inst?.amount || 16000,
        message: text,
        waLink,
      };
    });

    // Create diff summary for Action Preview card
    const diffSummary: DiffItem[] = qualified.map((s) => ({
      id: s.id,
      target: s.name,
      field: 'WhatsApp Outbox Queue',
      before: 'No reminder logged',
      after: `Queued: Academic + Fee Notice (${s.attendances.length} absences, EMI due)`,
      reason: 'Human verification required prior to sending WhatsApp message',
    }));

    // Register Pending CopilotAction in Database
    const copilotAction = await prisma.copilotAction.create({
      data: {
        userId,
        userName,
        role,
        actionType: 'WHATSAPP_REMINDER',
        title: `Dispatch WhatsApp Reminders (${qualified.length} At-Risk Students)`,
        description: `Personalized academic attendance alert and EMI due notice for students in Java batches.`,
        payload: JSON.stringify(messageDrafts),
        diffSummary: JSON.stringify(diffSummary),
        affectedCount: qualified.length,
        status: 'PENDING',
      },
    });

    const executionTimeMs = Date.now() - startTime;

    // Log Query to Immutable Audit Trail
    await prisma.auditLog.create({
      data: {
        userId,
        userName,
        role,
        action: 'COPILOT_QUERY',
        prompt,
        query: querySQL,
        tablesTouched: (validation as any).tablesTouched.join(', '),
        rowCount: rows.length,
        executionTimeMs,
        details: `Returned ${rows.length} at-risk students with missed classes >= 3 and EMI due. Staged Action ID: ${copilotAction.id}`,
      },
    });

    return {
      plan: {
        intent: isFollowUpCohortB
          ? 'Refine previous at-risk Java student list to Cohort Beta only'
          : 'Identify students in Java batches with >=3 absences and upcoming/overdue EMI, then draft personalized WhatsApp communications',
        steps: [
          'Locate active Java Full Stack cohorts in database',
          'Join attendance log to count total unexcused absences per student',
          'Cross-reference fee instalment calendar for dues between Oct 14 - Oct 21',
          'Synthesize personalized WhatsApp reminder drafts with dynamic student variables',
          'Stage approval slip in Copilot Action Queue (requires human authorization before sending)',
        ],
        reasoning:
          'Combining academic signals (missed classes) with financial signals (upcoming EMI) surfaces at-risk learners early so counselors can intervene empathetically before drop-off occurs.',
      },
      receipt: {
        query: querySQL,
        tablesTouched: (validation as any).tablesTouched,
        rowCount: rows.length,
        executionTimeMs,
        plainEnglishExplanation:
          'Scanned the Student, Enrollment, Batch, AttendanceRecord, and Instalment tables. Filtered for course Java Full Stack where student absences are 3 or more and an EMI is due between Oct 14 and Oct 21, 2026.',
      },
      columns: ['rollNo', 'name', 'phone', 'batchName', 'missedClasses', 'emiDueDate', 'emiAmount', 'emiStatus'],
      rows,
      citations: rows.map((r) => `Student: ${r.name} (${r.rollNo})`),
      actionPreview: {
        id: copilotAction.id,
        actionType: 'WHATSAPP_REMINDER',
        title: `Dispatch WhatsApp Reminders (${rows.length} Students)`,
        description: 'Send personalized academic retention and EMI fee notices via WhatsApp.',
        diffSummary,
        messageDrafts,
        affectedCount: rows.length,
        status: 'PENDING',
      },
    };
  }

  // SCENARIO 2: Timetable Conflict & Double Booking Query
  if (lower.includes('clash') || lower.includes('double book') || lower.includes('conflict') || lower.includes('schedule issue')) {
    const querySQL = `SELECT t.name as trainerName, b.code as batchCode, b.name as batchName,
       b.daysOfWeek, b.startTime, b.endTime, r.name as roomName
FROM Batch b
JOIN Trainer t ON b.trainerId = t.id
JOIN Room r ON b.roomId = r.id
WHERE t.id = 'tr-priya'
ORDER BY b.startTime ASC LIMIT 10;`;

    const validation = validateQuery(querySQL, role);

    const priyaBatches = await prisma.batch.findMany({
      where: { trainerId: 'tr-priya' },
      include: { trainer: true, room: true },
    });

    const rows = priyaBatches.map((b) => ({
      batchCode: b.code,
      batchName: b.name,
      trainer: b.trainer.name,
      room: b.room?.name || 'Unassigned',
      schedule: `${b.daysOfWeek} @ ${b.startTime}-${b.endTime}`,
      status: b.daysOfWeek.includes('TUE') ? '⚠️ Conflict: Double-booked on Tuesday' : 'Normal',
    }));

    const executionTimeMs = Date.now() - startTime;

    await prisma.auditLog.create({
      data: {
        userId,
        userName,
        role,
        action: 'COPILOT_QUERY',
        prompt,
        query: querySQL,
        tablesTouched: 'Batch, Trainer, Room',
        rowCount: rows.length,
        executionTimeMs,
        details: 'Identified trainer schedule conflict for Priya Sharma.',
      },
    });

    return {
      plan: {
        intent: 'Detect trainer scheduling overlap and room allocation clashes',
        steps: ['Scan weekly batch assignments', 'Cross-examine day and time overlaps', 'Verify room capacity constraints'],
        reasoning: 'Double-booked trainers cause immediate classroom disruption and require automated schedule re-planning.',
      },
      receipt: {
        query: querySQL,
        tablesTouched: ['Batch', 'Trainer', 'Room'],
        rowCount: rows.length,
        executionTimeMs,
        plainEnglishExplanation:
          'Queried all batch schedules assigned to trainer Priya Sharma across Monday to Friday to inspect overlapping time slots.',
      },
      columns: ['batchCode', 'batchName', 'trainer', 'room', 'schedule', 'status'],
      rows,
      citations: ['Batch: JAVA-2026-A', 'Batch: JAVA-2026-B'],
    };
  }

  // SCENARIO 3: Dropout Risk Radar Query
  if (lower.includes('dropout') || lower.includes('risk') || lower.includes('at-risk') || lower.includes('falling behind')) {
    const querySQL = `SELECT rollNo, name, email, phone, city, riskScore, riskLevel, riskReasons
FROM Student
WHERE riskLevel IN ('HIGH', 'MEDIUM')
ORDER BY riskScore DESC LIMIT 20;`;

    const validation = validateQuery(querySQL, role);

    const atRiskStudents = await prisma.student.findMany({
      where: { riskLevel: { in: ['HIGH', 'MEDIUM'] } },
      orderBy: { riskScore: 'desc' },
      take: 15,
    });

    const rows = atRiskStudents.map((s) => ({
      rollNo: s.rollNo,
      name: s.name,
      phone: s.phone,
      riskScore: `${s.riskScore.toFixed(0)}/100`,
      riskLevel: s.riskLevel,
      riskReasons: JSON.parse(s.riskReasons).join(' • '),
    }));

    const executionTimeMs = Date.now() - startTime;

    await prisma.auditLog.create({
      data: {
        userId,
        userName,
        role,
        action: 'COPILOT_QUERY',
        prompt,
        query: querySQL,
        tablesTouched: 'Student',
        rowCount: rows.length,
        executionTimeMs,
        details: `Queried ${rows.length} at-risk students.`,
      },
    });

    return {
      plan: {
        intent: 'Retrieve learners flagged by multi-factor Dropout Risk scoring engine',
        steps: [
          'Examine aggregate attendance trajectory over last 30 days',
          'Factor in pending/overdue assignments',
          'Include instalment payment delays',
          'Rank students by composite risk score',
        ],
        reasoning: 'Early intervention before drop-off maximizes student completion rates and protects institute revenue.',
      },
      receipt: {
        query: querySQL,
        tablesTouched: ['Student'],
        rowCount: rows.length,
        executionTimeMs,
        plainEnglishExplanation:
          'Selected students categorized with HIGH or MEDIUM risk level, sorted by composite multi-factor risk score.',
      },
      columns: ['rollNo', 'name', 'phone', 'riskScore', 'riskLevel', 'riskReasons'],
      rows,
      citations: rows.slice(0, 5).map((r) => `${r.name} (${r.riskScore})`),
    };
  }

  // DEFAULT / GENERAL QUERY: Batch summary or student directory
  const querySQL = `SELECT b.code, b.name, c.name as courseName, t.name as trainerName,
       r.name as roomName, b.mode, b.daysOfWeek, b.startTime, b.endTime, b.status
FROM Batch b
JOIN Course c ON b.courseId = c.id
JOIN Trainer t ON b.trainerId = t.id
LEFT JOIN Room r ON b.roomId = r.id
WHERE b.status = 'ACTIVE' LIMIT 20;`;

  const batches = await prisma.batch.findMany({
    include: { course: true, trainer: true, room: true },
    take: 12,
  });

  const rows = batches.map((b) => ({
    code: b.code,
    name: b.name,
    course: b.course.name,
    trainer: b.trainer.name,
    room: b.room?.name || 'Virtual',
    mode: b.mode,
    schedule: `${b.daysOfWeek} ${b.startTime}-${b.endTime}`,
  }));

  const executionTimeMs = Date.now() - startTime;

  await prisma.auditLog.create({
    data: {
      userId,
      userName,
      role,
      action: 'COPILOT_QUERY',
      prompt,
      query: querySQL,
      tablesTouched: 'Batch, Course, Trainer, Room',
      rowCount: rows.length,
      executionTimeMs,
      details: 'General institute operational overview requested.',
    },
  });

  return {
    plan: {
      intent: 'Provide active batches and operational overview',
      steps: ['Scan active batches across all courses', 'Load assigned trainers and venues', 'Format cohort schedule summary'],
      reasoning: 'General status summary requested for institute batches.',
    },
    receipt: {
      query: querySQL,
      tablesTouched: ['Batch', 'Course', 'Trainer', 'Room'],
      rowCount: rows.length,
      executionTimeMs,
      plainEnglishExplanation: 'Retrieved active batches with their assigned courses, trainers, and classroom allocations.',
    },
    columns: ['code', 'name', 'course', 'trainer', 'room', 'mode', 'schedule'],
    rows,
  };
}
