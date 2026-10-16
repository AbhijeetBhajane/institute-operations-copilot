import { NextResponse } from 'next/server';
import { triggerDeliberateClash } from '@/lib/timetable/solver';

export async function POST() {
  try {
    const res = await triggerDeliberateClash();
    return NextResponse.json(res);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to trigger clash' }, { status: 500 });
  }
}
