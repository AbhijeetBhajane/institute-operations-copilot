import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { actionId, decision, editedPayload } = body as {
      actionId: string;
      decision: 'APPROVE' | 'REJECT';
      editedPayload?: any;
    };

    if (!actionId || !decision) {
      return NextResponse.json({ error: 'actionId and decision are required' }, { status: 400 });
    }

    const action = await prisma.copilotAction.findUnique({
      where: { id: actionId },
    });

    if (!action) {
      return NextResponse.json({ error: 'Copilot action record not found' }, { status: 404 });
    }

    if (action.status !== 'PENDING') {
      return NextResponse.json(
        { error: `Action has already been finalized as ${action.status}` },
        { status: 400 }
      );
    }

    if (decision === 'REJECT') {
      const updated = await prisma.copilotAction.update({
        where: { id: actionId },
        data: {
          status: 'REJECTED',
          reviewedAt: new Date(),
          reviewedBy: `${user.name} (${user.role})`,
          executionResult: 'Rejected by human operator before execution.',
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          userName: user.name,
          role: user.role,
          action: 'COPILOT_ACTION_REJECT',
          prompt: `Action ID: ${actionId}`,
          details: `User rejected staged action: ${action.title}`,
        },
      });

      return NextResponse.json({
        success: true,
        action: updated,
        message: 'Action was successfully rejected and removed from execution queue.',
      });
    }

    // APPROVE & EXECUTE
    const finalPayload = editedPayload ? JSON.stringify(editedPayload) : action.payload;

    const updated = await prisma.copilotAction.update({
      where: { id: actionId },
      data: {
        payload: finalPayload,
        status: 'EXECUTED',
        reviewedAt: new Date(),
        reviewedBy: `${user.name} (${user.role})`,
        executionResult: `Executed successfully: ${action.affectedCount} actions processed. Simulated WhatsApp dispatches logged in Outbox.`,
      },
    });

    // Write to Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        role: user.role,
        action: 'COPILOT_ACTION_EXECUTE',
        prompt: `Action ID: ${actionId}`,
        details: `Human operator approved and executed: ${action.title} (${action.affectedCount} records affected).`,
      },
    });

    return NextResponse.json({
      success: true,
      action: updated,
      message: `Action approved! Successfully executed for ${action.affectedCount} recipients.`,
    });
  } catch (error: any) {
    console.error('Execute action error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process action decision' }, { status: 500 });
  }
}
