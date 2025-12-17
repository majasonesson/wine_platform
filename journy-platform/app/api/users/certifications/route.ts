import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'User not authenticated or UserID not available' },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    const pool = await connectToDatabase();

    const result = await pool
      .request()
      .input('UserID', user.id)
      .query('SELECT * FROM UserCertifications WHERE UserID = @UserID');

    return NextResponse.json(result.recordset, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch certifications:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

