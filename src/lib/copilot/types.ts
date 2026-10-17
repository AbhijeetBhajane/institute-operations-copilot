import { UserRole } from '../auth';

export interface MessageDraft {
  studentId: string;
  studentName: string;
  phone: string;
  rollNo: string;
  batchName: string;
  missedClassesCount: number;
  emiDueDate: string;
  emiAmount: number;
  message: string;
  waLink: string;
}

export interface DiffItem {
  id: string;
  target: string;
  field: string;
  before: string | number | null;
  after: string | number | null;
  reason: string;
}

export interface ActionPreviewData {
  id?: string;
  actionType: 'WHATSAPP_REMINDER' | 'RESCHEDULE_BATCH' | 'MARK_ATTENDANCE' | 'APPLY_CONCESSION';
  title: string;
  description: string;
  diffSummary: DiffItem[];
  messageDrafts?: MessageDraft[];
  affectedCount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXECUTED';
}

export interface QueryReceipt {
  query: string;
  tablesTouched: string[];
  rowCount: number;
  executionTimeMs: number;
  plainEnglishExplanation: string;
}

export interface CopilotPlan {
  intent: string;
  steps: string[];
  reasoning: string;
}

export interface CopilotQueryResult {
  plan: CopilotPlan;
  receipt: QueryReceipt;
  columns: string[];
  rows: any[];
  citations?: string[];
  actionPreview?: ActionPreviewData;
  refused?: boolean;
  refusalReason?: string;
  executiveSummary?: string;
}

export interface CopilotRequestPayload {
  prompt: string;
  role?: UserRole;
  conversationId?: string;
  followUpContext?: any;
}
