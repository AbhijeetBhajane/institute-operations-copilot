import { NextResponse } from 'next/server';
import { solveSchedule, getExpandedSchedule } from '@/lib/timetable/solver';

export async function GET() {
  try {
    const data = await getExpandedSchedule();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch schedule' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const result = await solveSchedule();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to solve schedule' }, { status: 500 });
  }
}
