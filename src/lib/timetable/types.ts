export type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export interface TimeSlot {
  day: DayOfWeek;
  startTime: string; // "10:00"
  endTime: string;   // "12:00"
}

export interface TimetableSlot {
  batchId: string;
  batchCode: string;
  batchName: string;
  courseName: string;
  trainerId: string;
  trainerName: string;
  roomId: string;
  roomName: string;
  roomCapacity: number;
  studentCount: number;
  mode: string;
  daysOfWeek: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  hasConflict?: boolean;
  conflictReason?: string;
}

export interface ConflictRecord {
  id: string;
  type: 'TRAINER_CLASH' | 'ROOM_CLASH' | 'CAPACITY_EXCEEDED' | 'TRAINER_UNAVAILABLE';
  title: string;
  description: string;
  batchIds: string[];
  day: DayOfWeek;
  timeRange: string;
}

export interface MoveStep {
  batchId: string;
  batchName: string;
  trainerName: string;
  from: {
    day: string;
    time: string;
    roomName: string;
  };
  to: {
    day: string;
    time: string;
    roomName: string;
  };
  reason: string;
}

export interface SolveResult {
  success: boolean;
  solveTimeMs: number;
  conflictsBefore: ConflictRecord[];
  conflictsAfter: ConflictRecord[];
  moves: MoveStep[];
  changeReportMarkdown: string;
  totalBatchesEvaluated: number;
  schedule: TimetableSlot[];
}
