import { NextRequest, NextResponse } from 'next/server';
import { PRESET_USERS, UserRole } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role } = body as { role: UserRole };

    if (!role || !PRESET_USERS[role]) {
      return NextResponse.json({ error: 'Invalid role specified' }, { status: 400 });
    }

    const response = NextResponse.json({
      success: true,
      user: PRESET_USERS[role],
      message: `Switched active role to ${role}`,
    });

    response.cookies.set('classpilot_role', role, {
      path: '/',
      httpOnly: false, // Accessible to client for instant UI reactivity
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to switch role' }, { status: 500 });
  }
}
