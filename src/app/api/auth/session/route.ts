import { NextResponse } from 'next/server';
import { getCurrentUser, PRESET_USERS, UserRole } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({
    user,
    presetUsers: PRESET_USERS,
  });
}
