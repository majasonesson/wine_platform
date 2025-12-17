import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import connectToDatabase from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    const pool = await connectToDatabase();

    let connectionQuery;
    if (user.role === 'Producer') {
      connectionQuery = `
        SELECT cr.*, u.Company, u.FullName, u.Email
        FROM ConnectionRequests cr
        INNER JOIN Users u ON cr.ImporterID = u.UserID
        WHERE cr.ProducerID = @UserID
      `;
    } else if (user.role === 'Importer') {
      connectionQuery = `
        SELECT cr.*, u.Company, u.FullName, u.Email
        FROM ConnectionRequests cr
        INNER JOIN Users u ON cr.ProducerID = u.UserID
        WHERE cr.ImporterID = @UserID
      `;
    } else {
      return NextResponse.json(
        { error: 'Unauthorized role for this operation' },
        { status: 403 }
      );
    }

    const result = await pool
      .request()
      .input('UserID', sql.Int, user.id)
      .query(connectionQuery);

    return NextResponse.json({ data: result.recordset }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch connection requests:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

