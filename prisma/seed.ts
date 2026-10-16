import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Clearing old data...');
  await prisma.auditLog.deleteMany();
  await prisma.copilotAction.deleteMany();
  await prisma.reconciliationRecord.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.recording.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.instalment.deleteMany();
  await prisma.feePlan.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.student.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.course.deleteMany();
  await prisma.trainer.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  console.log('👥 Creating Users (Roles)...');
  const userOwner = await prisma.user.create({
    data: {
      id: 'usr-owner-01',
      name: 'Rajesh Ramanathan',
      email: 'owner@classpilot.io',
      role: 'OWNER',
    },
  });

  const userCounselor = await prisma.user.create({
    data: {
      id: 'usr-counselor-01',
      name: 'Meera Menon',
      email: 'counselor@classpilot.io',
      role: 'COUNSELOR',
    },
  });

  const userAccounts = await prisma.user.create({
    data: {
      id: 'usr-accounts-01',
      name: 'Suresh Agarwal',
      email: 'accounts@classpilot.io',
      role: 'ACCOUNTS',
    },
  });

  console.log('🏢 Creating Rooms...');
  const roomsData = [
    { id: 'room-101', name: 'Room 101 - Turing Tech Lab', capacity: 40, type: 'LAB', features: '40 Dual-Monitor Workstations, High-Speed LAN, 4K Projector' },
    { id: 'room-102', name: 'Room 102 - Ada Lovelace Hall', capacity: 32, type: 'CLASSROOM', features: 'Interactive Smart Board, Hybrid Cameras, Soundbar' },
    { id: 'room-201', name: 'Room 201 - von Neumann Suite', capacity: 28, type: 'CLASSROOM', features: 'Ergonomic Pod Desks, Dual Ceiling Mics' },
    { id: 'room-202', name: 'Room 202 - Hopper Seminar Hall', capacity: 55, type: 'SEMINAR_HALL', features: 'Tiered Seating, Studio Grade AV, Livestream Rack' },
    { id: 'room-301', name: 'Room 301 - Shannon Design Studio', capacity: 25, type: 'LAB', features: '25 iMac 24" Retina, Wacom Tablets, Colour-Calibrated Lighting' },
  ];
  for (const r of roomsData) {
    await prisma.room.create({ data: r });
  }

  console.log('👨‍🏫 Creating Trainers...');
  const trainersData = [
    {
      id: 'tr-priya',
      name: 'Priya Sharma',
      email: 'priya.sharma@classpilot.io',
      phone: '+91 98450 12345',
      specializations: 'Java, Spring Boot, Microservices, Hibernate, Kafka',
      maxHoursPerWeek: 25,
      isAvailable: true,
      availabilitySlots: JSON.stringify([
        { day: 'MON', start: '09:00', end: '14:00' },
        { day: 'TUE', start: '09:00', end: '14:00' },
        { day: 'WED', start: '09:00', end: '14:00' },
        { day: 'THU', start: '09:00', end: '14:00' },
        { day: 'FRI', start: '09:00', end: '14:00' },
      ]),
    },
    {
      id: 'tr-rahul',
      name: 'Rahul Verma',
      email: 'rahul.verma@classpilot.io',
      phone: '+91 98450 23456',
      specializations: 'Python, Machine Learning, PyTorch, LangChain, NumPy',
      maxHoursPerWeek: 25,
      isAvailable: true,
      availabilitySlots: JSON.stringify([
        { day: 'MON', start: '10:00', end: '18:00' },
        { day: 'WED', start: '10:00', end: '18:00' },
        { day: 'FRI', start: '10:00', end: '18:00' },
      ]),
    },
    {
      id: 'tr-ananya',
      name: 'Ananya Iyer',
      email: 'ananya.iyer@classpilot.io',
      phone: '+91 98450 34567',
      specializations: 'SQL, PowerBI, Tableau, Data Warehousing, Snowflake',
      maxHoursPerWeek: 20,
      isAvailable: true,
      availabilitySlots: JSON.stringify([
        { day: 'SAT', start: '09:00', end: '17:00' },
        { day: 'SUN', start: '09:00', end: '17:00' },
      ]),
    },
    {
      id: 'tr-vikram',
      name: 'Vikram Malhotra',
      email: 'vikram.m@classpilot.io',
      phone: '+91 98450 45678',
      specializations: 'AWS, Kubernetes, Terraform, Docker, CI/CD pipelines',
      maxHoursPerWeek: 25,
      isAvailable: true,
      availabilitySlots: JSON.stringify([
        { day: 'TUE', start: '08:00', end: '14:00' },
        { day: 'THU', start: '08:00', end: '14:00' },
        { day: 'SAT', start: '08:00', end: '14:00' },
      ]),
    },
    {
      id: 'tr-sneha',
      name: 'Sneha Patil',
      email: 'sneha.patil@classpilot.io',
      phone: '+91 98450 56789',
      specializations: 'Figma, Design Systems, User Research, Interaction Design',
      maxHoursPerWeek: 20,
      isAvailable: true,
      availabilitySlots: JSON.stringify([
        { day: 'MON', start: '14:00', end: '19:00' },
        { day: 'WED', start: '14:00', end: '19:00' },
        { day: 'FRI', start: '14:00', end: '19:00' },
      ]),
    },
    {
      id: 'tr-rohan',
      name: 'Rohan Das',
      email: 'rohan.das@classpilot.io',
      phone: '+91 98450 67890',
      specializations: 'React, Next.js, Node.js, Express, MongoDB, TypeScript',
      maxHoursPerWeek: 25,
      isAvailable: true,
      availabilitySlots: JSON.stringify([
        { day: 'MON', start: '17:00', end: '21:00' },
        { day: 'TUE', start: '17:00', end: '21:00' },
        { day: 'WED', start: '17:00', end: '21:00' },
        { day: 'THU', start: '17:00', end: '21:00' },
      ]),
    },
    {
      id: 'tr-arjun',
      name: 'Arjun Nair',
      email: 'arjun.nair@classpilot.io',
      phone: '+91 98450 78901',
      specializations: 'Ethical Hacking, Penetration Testing, SOC Analysis, ISO 27001',
      maxHoursPerWeek: 20,
      isAvailable: true,
      availabilitySlots: JSON.stringify([
        { day: 'SAT', start: '10:00', end: '18:00' },
        { day: 'SUN', start: '10:00', end: '18:00' },
      ]),
    },
    {
      id: 'tr-divya',
      name: 'Divya Kapoor',
      email: 'divya.kapoor@classpilot.io',
      phone: '+91 98450 89012',
      specializations: 'Performance Marketing, Google Ads, SEO, Conversion Optimization',
      maxHoursPerWeek: 20,
      isAvailable: true,
      availabilitySlots: JSON.stringify([
        { day: 'TUE', start: '10:00', end: '14:00' },
        { day: 'THU', start: '10:00', end: '14:00' },
      ]),
    },
  ];

  for (const t of trainersData) {
    await prisma.trainer.create({ data: t });
  }

  // Also create user for Trainer Priya Sharma
  await prisma.user.create({
    data: {
      id: 'usr-trainer-priya',
      name: 'Priya Sharma (Trainer)',
      email: 'trainer@classpilot.io',
      role: 'TRAINER',
      trainerId: 'tr-priya',
    },
  });

  console.log('📚 Creating Courses...');
  const coursesData = [
    {
      id: 'crs-java',
      code: 'JAVA-FS',
      name: 'Java Full Stack & Cloud Microservices',
      category: 'Software Engineering',
      durationWeeks: 16,
      totalHours: 160,
      baseFee: 48000.0,
      syllabusSummary: 'Core Java, OOP, Collections, Spring Boot 3, RESTful APIs, JPA, PostgreSQL, Docker, Microservices, React Frontend',
    },
    {
      id: 'crs-pyds',
      code: 'PY-DS',
      name: 'Python Data Science & Generative AI',
      category: 'Artificial Intelligence',
      durationWeeks: 16,
      totalHours: 160,
      baseFee: 52000.0,
      syllabusSummary: 'Python Advanced, NumPy, Pandas, Scikit-Learn, Deep Learning with PyTorch, LLMs, LangChain, RAG Systems',
    },
    {
      id: 'crs-da',
      code: 'DATA-BI',
      name: 'Data Analytics & Business Intelligence',
      category: 'Data & Analytics',
      durationWeeks: 12,
      totalHours: 120,
      baseFee: 38000.0,
      syllabusSummary: 'Advanced SQL, Power BI DAX, Tableau Storyboarding, Data Modeling, Excel VBA, Executive Dashboards',
    },
    {
      id: 'crs-uiux',
      code: 'UIUX-PRO',
      name: 'UI/UX Product Design & Design Systems',
      category: 'Product & Design',
      durationWeeks: 12,
      totalHours: 120,
      baseFee: 42000.0,
      syllabusSummary: 'Design Thinking, Figma Mastery, Design Tokens, Micro-interactions, User Testing, Portfolio Case Studies',
    },
    {
      id: 'crs-devops',
      code: 'CLOUD-OPS',
      name: 'Cloud DevOps & Infrastructure as Code',
      category: 'Cloud & Infrastructure',
      durationWeeks: 14,
      totalHours: 140,
      baseFee: 46000.0,
      syllabusSummary: 'Linux, AWS Core, Docker, Kubernetes, Terraform, GitHub Actions, Prometheus & Grafana Monitoring',
    },
    {
      id: 'crs-dm',
      code: 'MKT-GROWTH',
      name: 'Digital Marketing & Growth Hacking',
      category: 'Marketing',
      durationWeeks: 10,
      totalHours: 100,
      baseFee: 32000.0,
      syllabusSummary: 'Performance Marketing, Google Ads, Meta Ads Manager, GA4 Analytics, Marketing Automation, SEO',
    },
  ];

  for (const c of coursesData) {
    await prisma.course.create({ data: c });
  }

  console.log('🗓️ Creating 12 Batches (including deliberate clash for demo)...');
  // NOTE: Notice the deliberate clash:
  // Batch 1 (batch-java-a): Priya Sharma, Room 101, MON,WED,FRI 10:00 - 12:00
  // Batch 2 (batch-java-b): Priya Sharma, Room 102, TUE,THU 10:00 - 12:00
  // Deliberate trainer clash scenario: batch-java-b has been scheduled on TUE 10:00 AM overlapping with another urgent review session, OR Priya is unavailable on Tuesdays. The engine re-plans it seamlessly!
  const batchesData = [
    {
      id: 'batch-java-a',
      code: 'JAVA-2026-A',
      name: 'Java Full Stack (Cohort Alpha - Morning)',
      courseId: 'crs-java',
      trainerId: 'tr-priya',
      roomId: 'room-101',
      mode: 'HYBRID',
      daysOfWeek: 'MON,WED,FRI',
      startTime: '10:00',
      endTime: '12:00',
      startDate: new Date('2026-08-03T04:30:00.000Z'),
      endDate: new Date('2026-11-20T12:30:00.000Z'),
      maxStudents: 35,
      onlineSeatLimit: 50,
      status: 'ACTIVE',
    },
    {
      id: 'batch-java-b',
      code: 'JAVA-2026-B',
      name: 'Java Full Stack (Cohort Beta - Afternoon)',
      courseId: 'crs-java',
      trainerId: 'tr-priya', // Deliberate clash subject
      roomId: 'room-102',
      mode: 'HYBRID',
      daysOfWeek: 'TUE,THU',
      startTime: '10:00',
      endTime: '12:30',
      startDate: new Date('2026-08-04T04:30:00.000Z'),
      endDate: new Date('2026-11-21T12:30:00.000Z'),
      maxStudents: 30,
      onlineSeatLimit: 50,
      status: 'ACTIVE',
    },
    {
      id: 'batch-py-ds1',
      code: 'PYDS-2026-A',
      name: 'Python Data Science (Morning Batch)',
      courseId: 'crs-pyds',
      trainerId: 'tr-rahul',
      roomId: 'room-101',
      mode: 'HYBRID',
      daysOfWeek: 'MON,WED,FRI',
      startTime: '14:00',
      endTime: '16:00',
      startDate: new Date('2026-08-03T04:30:00.000Z'),
      endDate: new Date('2026-11-25T12:30:00.000Z'),
      maxStudents: 35,
      onlineSeatLimit: 50,
      status: 'ACTIVE',
    },
    {
      id: 'batch-py-ds2',
      code: 'PYDS-2026-E',
      name: 'Generative AI & LLMs (Evening Intensive)',
      courseId: 'crs-pyds',
      trainerId: 'tr-rahul',
      roomId: 'room-202',
      mode: 'ONLINE',
      daysOfWeek: 'TUE,THU',
      startTime: '18:30',
      endTime: '20:30',
      startDate: new Date('2026-09-01T04:30:00.000Z'),
      endDate: new Date('2026-12-15T12:30:00.000Z'),
      maxStudents: 50,
      onlineSeatLimit: 80,
      status: 'ACTIVE',
    },
    {
      id: 'batch-da-wknd',
      code: 'DABI-2026-W',
      name: 'Data Analytics & Power BI (Weekend Executive)',
      courseId: 'crs-da',
      trainerId: 'tr-ananya',
      roomId: 'room-201',
      mode: 'CLASSROOM',
      daysOfWeek: 'SAT,SUN',
      startTime: '10:00',
      endTime: '13:00',
      startDate: new Date('2026-08-15T04:30:00.000Z'),
      endDate: new Date('2026-11-08T12:30:00.000Z'),
      maxStudents: 26,
      onlineSeatLimit: 0,
      status: 'ACTIVE',
    },
    {
      id: 'batch-uiux-1',
      code: 'UIUX-2026-A',
      name: 'UI/UX Product Design (Studio Cohort)',
      courseId: 'crs-uiux',
      trainerId: 'tr-sneha',
      roomId: 'room-301',
      mode: 'CLASSROOM',
      daysOfWeek: 'MON,WED,FRI',
      startTime: '14:30',
      endTime: '16:30',
      startDate: new Date('2026-08-10T04:30:00.000Z'),
      endDate: new Date('2026-11-06T12:30:00.000Z'),
      maxStudents: 24,
      onlineSeatLimit: 0,
      status: 'ACTIVE',
    },
    {
      id: 'batch-devops-1',
      code: 'DEVOPS-2026-M',
      name: 'Cloud DevOps & Kubernetes (Morning Fast-track)',
      courseId: 'crs-devops',
      trainerId: 'tr-vikram',
      roomId: 'room-102',
      mode: 'HYBRID',
      daysOfWeek: 'TUE,THU,SAT',
      startTime: '08:30',
      endTime: '10:30',
      startDate: new Date('2026-08-18T04:30:00.000Z'),
      endDate: new Date('2026-11-28T12:30:00.000Z'),
      maxStudents: 30,
      onlineSeatLimit: 40,
      status: 'ACTIVE',
    },
    {
      id: 'batch-dm-1',
      code: 'MKT-2026-A',
      name: 'Digital Marketing & Performance Ads',
      courseId: 'crs-dm',
      trainerId: 'tr-divya',
      roomId: 'room-201',
      mode: 'HYBRID',
      daysOfWeek: 'TUE,THU',
      startTime: '11:00',
      endTime: '13:00',
      startDate: new Date('2026-09-01T04:30:00.000Z'),
      endDate: new Date('2026-11-15T12:30:00.000Z'),
      maxStudents: 25,
      onlineSeatLimit: 40,
      status: 'ACTIVE',
    },
    {
      id: 'batch-mern-1',
      code: 'MERN-2026-E',
      name: 'Full Stack MERN & Next.js (Night Shift)',
      courseId: 'crs-java', // Reusing course or tech
      trainerId: 'tr-rohan',
      roomId: 'room-101',
      mode: 'HYBRID',
      daysOfWeek: 'MON,TUE,WED,THU',
      startTime: '18:00',
      endTime: '19:30',
      startDate: new Date('2026-08-25T04:30:00.000Z'),
      endDate: new Date('2026-12-05T12:30:00.000Z'),
      maxStudents: 35,
      onlineSeatLimit: 50,
      status: 'ACTIVE',
    },
    {
      id: 'batch-cyber-1',
      code: 'SEC-2026-W',
      name: 'Cybersecurity & Ethical Hacking Lab',
      courseId: 'crs-devops',
      trainerId: 'tr-arjun',
      roomId: 'room-202',
      mode: 'CLASSROOM',
      daysOfWeek: 'SAT,SUN',
      startTime: '14:00',
      endTime: '17:00',
      startDate: new Date('2026-09-05T04:30:00.000Z'),
      endDate: new Date('2026-12-12T12:30:00.000Z'),
      maxStudents: 35,
      onlineSeatLimit: 0,
      status: 'ACTIVE',
    },
    {
      id: 'batch-uiux-2',
      code: 'UIUX-2026-E',
      name: 'UI/UX Advanced Prototyping (Evening)',
      courseId: 'crs-uiux',
      trainerId: 'tr-sneha',
      roomId: 'room-301',
      mode: 'ONLINE',
      daysOfWeek: 'TUE,THU',
      startTime: '18:30',
      endTime: '20:30',
      startDate: new Date('2026-09-15T04:30:00.000Z'),
      endDate: new Date('2026-12-08T12:30:00.000Z'),
      maxStudents: 30,
      onlineSeatLimit: 60,
      status: 'ACTIVE',
    },
    {
      id: 'batch-da-fast',
      code: 'DABI-2026-F',
      name: 'Data Analytics Sprint (Weekday Fast-track)',
      courseId: 'crs-da',
      trainerId: 'tr-ananya',
      roomId: 'room-201',
      mode: 'HYBRID',
      daysOfWeek: 'MON,WED',
      startTime: '16:00',
      endTime: '18:00',
      startDate: new Date('2026-09-10T04:30:00.000Z'),
      endDate: new Date('2026-11-30T12:30:00.000Z'),
      maxStudents: 25,
      onlineSeatLimit: 30,
      status: 'ACTIVE',
    },
  ];

  for (const b of batchesData) {
    await prisma.batch.create({ data: b });
  }

  console.log('🎓 Generating 150 Realistic Students & Enrollments...');
  const firstNames = [
    'Aditya', 'Neha', 'Karan', 'Simran', 'Farhan', 'Rohan', 'Pooja', 'Aman', 'Ankita', 'Varun',
    'Deepak', 'Sanjana', 'Gaurav', 'Ishita', 'Naveen', 'Ritu', 'Manish', 'Kavita', 'Siddharth', 'Tanvi',
    'Abhishek', 'Swati', 'Harsh', 'Prachi', 'Kunal', 'Divya', 'Mohit', 'Shreya', 'Akash', 'Megha',
    'Yash', 'Pallavi', 'Vikram', 'Sakshi', 'Sameer', 'Rashmi', 'Mayank', 'Bhavna', 'Pranav', 'Nidhi',
    'Gautam', 'Kritika', 'Alok', 'Snehal', 'Tushar', 'Priyanka', 'Saurabh', 'Komal', 'Ayush', 'Archana'
  ];
  const lastNames = [
    'Kumar', 'Reddy', 'Johar', 'Kaur', 'Akhtar', 'Sharma', 'Patel', 'Verma', 'Gupta', 'Singh',
    'Joshi', 'Mehta', 'Nair', 'Iyer', 'Deshmukh', 'Chatterjee', 'Banerjee', 'Chopra', 'Malhotra', 'Bhat',
    'Saxena', 'Pandey', 'Mishra', 'Yadav', 'Rao', 'Pillai', 'Menon', 'Kulkarni', 'Naik', 'Goswami'
  ];

  const targetDateOct2026 = new Date('2026-10-16T12:00:00.000Z');

  // We will explicitly track the students who are in Java batches with 3+ missed classes and EMI due this week!
  // Hero Demo Target Students:
  // 1. Aditya Kumar (Java A) - Missed 4 classes, EMI 2 Due Oct 18, 2026 (INR 16,000)
  // 2. Neha Reddy (Java A) - Missed 3 classes, EMI 2 Due Oct 15, 2026 (INR 16,000 - Overdue by 1 day)
  // 3. Karan Johar (Java B) - Missed 5 classes, EMI 2 Due Oct 20, 2026 (INR 16,000)
  // 4. Simran Kaur (Java B) - Missed 3 classes, EMI 2 Due Oct 17, 2026 (INR 16,000)
  // 5. Farhan Akhtar (Java A) - Missed 4 classes, EMI 2 Due Oct 19, 2026 (INR 16,000)

  const createdStudents = [];

  for (let i = 1; i <= 150; i++) {
    const fName = firstNames[(i - 1) % firstNames.length];
    const lName = lastNames[(i - 1 + Math.floor(i / firstNames.length)) % lastNames.length];
    const fullName = `${fName} ${lName}`;
    const rollNo = `STU-2026-${String(i).padStart(3, '0')}`;
    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@student.classpilot.io`;
    const phone = `+91 ${98000 + (i * 37) % 89999} ${String(10000 + i * 19).slice(-5)}`;

    // Distribute among batches
    let assignedBatchId = batchesData[(i - 1) % batchesData.length].id;
    
    // Ensure the first 5 students go to Java Batch A and Java Batch B for our deterministic hero demo!
    if (i === 1) assignedBatchId = 'batch-java-a';
    if (i === 2) assignedBatchId = 'batch-java-a';
    if (i === 3) assignedBatchId = 'batch-java-b';
    if (i === 4) assignedBatchId = 'batch-java-b';
    if (i === 5) assignedBatchId = 'batch-java-a';

    const isHeroTarget = i <= 5;
    const isAtRisk = isHeroTarget || i % 14 === 0;

    let riskScore = 12.0;
    let riskLevel = 'LOW';
    let riskReasons = '[]';

    if (isHeroTarget) {
      const missedCount = i === 3 ? 5 : (i === 1 || i === 5 ? 4 : 3);
      riskScore = 78.0 + (i * 2);
      riskLevel = 'HIGH';
      riskReasons = JSON.stringify([
        `Missed ${missedCount} recent classes`,
        `Instalment 2 due/overdue this week (INR 16,000)`,
        `Lab assignment 2 pending submission`,
      ]);
    } else if (isAtRisk) {
      riskScore = 55.0;
      riskLevel = 'MEDIUM';
      riskReasons = JSON.stringify(['Attendance dropped below 75%', '1 assignment overdue']);
    }

    const student = await prisma.student.create({
      data: {
        id: `stu-${String(i).padStart(3, '0')}`,
        rollNo,
        name: fullName,
        email,
        phone,
        whatsappNo: phone,
        guardianPhone: `+91 94440 ${String(20000 + i * 23).slice(-5)}`,
        city: i % 4 === 0 ? 'Mumbai' : i % 3 === 0 ? 'Hyderabad' : 'Bengaluru',
        status: isHeroTarget ? 'AT_RISK' : 'ENROLLED',
        riskScore,
        riskLevel,
        riskReasons,
      },
    });

    createdStudents.push({ student, assignedBatchId, isHeroTarget, index: i });

    // Create Enrollment
    await prisma.enrollment.create({
      data: {
        studentId: student.id,
        batchId: assignedBatchId,
        enrolledAt: new Date('2026-08-01T04:30:00.000Z'),
        status: 'ACTIVE',
      },
    });

    // Create Fee Plan (Total 48,000 in 3 EMIs of 16,000 each)
    const feePlan = await prisma.feePlan.create({
      data: {
        studentId: student.id,
        batchId: assignedBatchId,
        totalAmount: 48000.0,
        discountAmount: 0.0,
        payableAmount: 48000.0,
        instalmentCount: 3,
      },
    });

    // Create 3 Instalments:
    // EMI 1: Aug 15, 2026 (Paid for everyone or almost everyone)
    // EMI 2: Mid Oct 2026 (Due or overdue)
    // EMI 3: Mid Nov 2026 (Upcoming)
    const emi1Paid = true;
    const emi2Status = isHeroTarget
      ? (i === 2 ? 'OVERDUE' : 'DUE')
      : (i % 5 === 0 ? 'OVERDUE' : i % 3 === 0 ? 'DUE' : 'PAID');

    // EMI 1
    const inst1 = await prisma.instalment.create({
      data: {
        feePlanId: feePlan.id,
        studentId: student.id,
        instalmentNo: 1,
        dueDate: new Date('2026-08-15T00:00:00.000Z'),
        amount: 16000.0,
        status: 'PAID',
        paidAmount: 16000.0,
        paidAt: new Date('2026-08-12T10:30:00.000Z'),
      },
    });

    // Payment for EMI 1
    await prisma.payment.create({
      data: {
        instalmentId: inst1.id,
        studentId: student.id,
        amount: 16000.0,
        paymentDate: new Date('2026-08-12T10:30:00.000Z'),
        source: i % 2 === 0 ? 'UPI' : 'BANK_TRANSFER',
        transactionRef: `UPI/HDFC/${88000000 + i * 111}`,
        receiptNo: `RCPT-2026-${String(i).padStart(4, '0')}-A`,
        remarks: 'Instalment 1 paid online',
      },
    });

    // EMI 2: Due between Oct 15 and Oct 22, 2026!
    let emi2DueDate = new Date('2026-10-18T00:00:00.000Z');
    if (i === 1) emi2DueDate = new Date('2026-10-18T00:00:00.000Z');
    if (i === 2) emi2DueDate = new Date('2026-10-15T00:00:00.000Z'); // Overdue
    if (i === 3) emi2DueDate = new Date('2026-10-20T00:00:00.000Z');
    if (i === 4) emi2DueDate = new Date('2026-10-17T00:00:00.000Z');
    if (i === 5) emi2DueDate = new Date('2026-10-19T00:00:00.000Z');

    const inst2 = await prisma.instalment.create({
      data: {
        feePlanId: feePlan.id,
        studentId: student.id,
        instalmentNo: 2,
        dueDate: emi2DueDate,
        amount: 16000.0,
        status: emi2Status,
        paidAmount: emi2Status === 'PAID' ? 16000.0 : 0.0,
        paidAt: emi2Status === 'PAID' ? new Date('2026-10-10T11:00:00.000Z') : null,
      },
    });

    if (emi2Status === 'PAID') {
      await prisma.payment.create({
        data: {
          instalmentId: inst2.id,
          studentId: student.id,
          amount: 16000.0,
          paymentDate: new Date('2026-10-10T11:00:00.000Z'),
          source: 'UPI',
          transactionRef: `UPI/AXIS/${77000000 + i * 111}`,
          receiptNo: `RCPT-2026-${String(i).padStart(4, '0')}-B`,
          remarks: 'Instalment 2 paid via GPay',
        },
      });
    }

    // EMI 3
    await prisma.instalment.create({
      data: {
        feePlanId: feePlan.id,
        studentId: student.id,
        instalmentNo: 3,
        dueDate: new Date('2026-11-20T00:00:00.000Z'),
        amount: 16000.0,
        status: 'DUE',
        paidAmount: 0.0,
      },
    });
  }

  console.log('📅 Generating 3 Months of Realistic Attendance Records...');
  // We simulate 24 session dates across Aug, Sep, Oct 2026
  const sessionDates = [
    '2026-08-05', '2026-08-10', '2026-08-15', '2026-08-20', '2026-08-25', '2026-08-30',
    '2026-09-02', '2026-09-06', '2026-09-11', '2026-09-16', '2026-09-21', '2026-09-26', '2026-09-30',
    '2026-10-02', '2026-10-05', '2026-10-07', '2026-10-09', '2026-10-12', '2026-10-14', '2026-10-16'
  ];

  for (const s of createdStudents) {
    const student = s.student;
    const batchId = s.assignedBatchId;
    const isHero = s.isHeroTarget;

    // For hero students (i = 1 to 5), make sure the last 3 to 5 recent sessions are marked ABSENT!
    for (let dIdx = 0; dIdx < sessionDates.length; dIdx++) {
      const dateStr = sessionDates[dIdx];
      const isRecent = dIdx >= sessionDates.length - 5;
      let status = 'PRESENT';
      let mode = dIdx % 3 === 0 ? 'ONLINE' : 'CLASSROOM';

      if (isHero) {
        if (s.index === 1 && dIdx >= sessionDates.length - 4) status = 'ABSENT'; // 4 missed
        else if (s.index === 2 && dIdx >= sessionDates.length - 3) status = 'ABSENT'; // 3 missed
        else if (s.index === 3 && dIdx >= sessionDates.length - 5) status = 'ABSENT'; // 5 missed
        else if (s.index === 4 && dIdx >= sessionDates.length - 3) status = 'ABSENT'; // 3 missed
        else if (s.index === 5 && dIdx >= sessionDates.length - 4) status = 'ABSENT'; // 4 missed
        else status = 'PRESENT';
      } else {
        // Random natural attendance pattern (85% present)
        status = (s.index + dIdx) % 7 === 0 ? 'ABSENT' : ((s.index + dIdx) % 11 === 0 ? 'LATE' : 'PRESENT');
      }

      await prisma.attendanceRecord.create({
        data: {
          studentId: student.id,
          batchId: batchId,
          date: new Date(`${dateStr}T10:00:00.000Z`),
          status: status,
          mode: mode,
          checkInTime: status !== 'ABSENT' ? new Date(`${dateStr}T09:58:00.000Z`) : null,
          checkOutTime: status !== 'ABSENT' ? new Date(`${dateStr}T12:05:00.000Z`) : null,
          onlineJoinDurationMins: mode === 'ONLINE' && status !== 'ABSENT' ? 115 : null,
          notes: status === 'ABSENT' ? 'Student did not check in' : 'Verified biometric/join log',
        },
      });
    }
  }

  console.log('📝 Creating Assignments, Recordings & Certificates...');
  const javaBatchA = 'batch-java-a';
  const asg1 = await prisma.assignment.create({
    data: {
      batchId: javaBatchA,
      title: 'Spring Boot RESTful Microservice Architecture',
      description: 'Implement a secure CRUD service with JWT authentication, Flyway migrations, and unit tests using Testcontainers.',
      dueDate: new Date('2026-10-25T23:59:59.000Z'),
      maxScore: 100,
    },
  });

  const asg2 = await prisma.assignment.create({
    data: {
      batchId: javaBatchA,
      title: 'Database Indexing & JPA N+1 Optimization',
      description: 'Benchmark query performance with Hibernate profiling and eliminate N+1 bottlenecks.',
      dueDate: new Date('2026-10-10T23:59:59.000Z'),
      maxScore: 100,
    },
  });

  // Recordings
  const recData = [
    {
      batchId: 'batch-java-a',
      sessionTitle: 'Session 18: Spring Security 6 Deep Dive & Filter Chains',
      sessionDate: new Date('2026-10-14T10:00:00.000Z'),
      durationMins: 110,
      videoUrl: 'https://cdn.classpilot.io/recordings/java-2026-a/session-18.mp4',
      passcode: 'pilot@sec2026',
      notes: 'Covered SecurityFilterChain bean, CSRF disable for APIs, and JwtAuthenticationConverter.',
    },
    {
      batchId: 'batch-java-a',
      sessionTitle: 'Session 17: Microservices Service Discovery with Eureka',
      sessionDate: new Date('2026-10-12T10:00:00.000Z'),
      durationMins: 105,
      videoUrl: 'https://cdn.classpilot.io/recordings/java-2026-a/session-17.mp4',
      passcode: 'eureka@cloud',
      notes: 'Hands-on Eureka server setup and Feign client declarative HTTP calls.',
    },
    {
      batchId: 'batch-py-ds1',
      sessionTitle: 'Session 12: Transformers and Attention Mechanisms',
      sessionDate: new Date('2026-10-13T14:00:00.000Z'),
      durationMins: 120,
      videoUrl: 'https://cdn.classpilot.io/recordings/pyds-2026-a/session-12.mp4',
      passcode: 'attn@llm',
      notes: 'Self-attention math, scaled dot product, multi-head queries.',
    },
  ];
  for (const r of recData) {
    await prisma.recording.create({ data: r });
  }

  // Sample Completed Certificate
  await prisma.certificate.create({
    data: {
      id: 'cert-001',
      certificateNo: 'CP-CERT-2026-8801',
      studentId: 'stu-050',
      courseId: 'crs-java',
      verificationCode: 'VERIF-CP-8801-XQ9',
      grade: 'Distinction (94%)',
      status: 'ISSUED',
      qrCodeUrl: 'https://classpilot.io/verify-certificate/VERIF-CP-8801-XQ9',
    },
  });

  console.log('💳 Creating Realistic Bank Statement / UPI Records for Reconciliation Module...');
  const reconciliationData = [
    {
      utrRef: 'UPI/AXIS/628919283001',
      senderName: 'Aditya Kumar',
      amount: 16000.0,
      statementDate: new Date('2026-10-15T09:30:00.000Z'),
      matchedInstalmentId: null,
      status: 'UNMATCHED',
      remarks: 'Axis GPay transaction - matches Aditya Kumar roll STU-2026-001',
    },
    {
      utrRef: 'UPI/HDFC/992182741002',
      senderName: 'N. Reddy', // Partial / fuzzy match on Neha Reddy
      amount: 16000.0,
      statementDate: new Date('2026-10-15T10:15:00.000Z'),
      matchedInstalmentId: null,
      status: 'PARTIAL',
      confidenceScore: 0.88,
      remarks: 'Fuzzy name match: N. Reddy -> Neha Reddy (STU-2026-002)',
    },
    {
      utrRef: 'UPI/ICIC/448102938003',
      senderName: 'Kunal Patel',
      amount: 16000.0,
      statementDate: new Date('2026-10-14T14:20:00.000Z'),
      matchedInstalmentId: null,
      status: 'MATCHED',
      confidenceScore: 0.99,
      remarks: 'Exact amount & matching name in batch DABI-2026-W',
    },
    {
      utrRef: 'IMPS/SBI/120938475004',
      senderName: 'Unknown Depositor',
      amount: 12500.0,
      statementDate: new Date('2026-10-13T16:45:00.000Z'),
      matchedInstalmentId: null,
      status: 'UNMATCHED',
      confidenceScore: 0.15,
      remarks: 'Amount does not match standard 16,000 instalment; sender unknown',
    },
    {
      utrRef: 'UPI/PAYTM/883920192005',
      senderName: 'Vikram Malhotra (Duplicate test)',
      amount: 16000.0,
      statementDate: new Date('2026-10-12T11:10:00.000Z'),
      matchedInstalmentId: null,
      status: 'DUPLICATE',
      confidenceScore: 0.95,
      remarks: 'Duplicate UTR reference detected in bank statement',
    },
  ];

  for (const rc of reconciliationData) {
    await prisma.reconciliationRecord.create({ data: rc });
  }

  console.log('📜 Creating Sample Audit Logs...');
  await prisma.auditLog.create({
    data: {
      userId: userOwner.id,
      userName: userOwner.name,
      role: 'OWNER',
      action: 'SYSTEM_INIT',
      prompt: 'System initialization and database seed',
      query: 'SELECT COUNT(*) FROM Student, Batch, Trainer, Room',
      tablesTouched: 'Student, Batch, Trainer, Room, FeePlan',
      rowCount: 150,
      executionTimeMs: 18,
      details: 'Initial system load complete with 150 students and 12 batches.',
    },
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
