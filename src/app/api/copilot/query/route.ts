import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { processCopilotQuery } from '@/lib/copilot/mockEngine';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { prompt, followUpContext } = body as { prompt: string; followUpContext?: any };

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Valid prompt text is required' }, { status: 400 });
    }

    const result = await processCopilotQuery(
      prompt,
      user.role,
      user.id,
      user.name,
      followUpContext
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Copilot query error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while executing Copilot query' },
      { status: 500 }
    );
  }
}
