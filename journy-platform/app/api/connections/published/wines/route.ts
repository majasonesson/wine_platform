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

    const publishedWinesQuery = `
      SELECT w.* FROM Wines w
      INNER JOIN ConnectionRequests cr ON w.UserID = cr.ProducerID
      WHERE cr.ImporterID = @ImporterID 
        AND cr.Status = 'ACCEPTED'
        AND w.IsPublished = 1
    `;

    const publishedWinesResult = await pool
      .request()
      .input('ImporterID', sql.Int, user.id)
      .query(publishedWinesQuery);

    return NextResponse.json(publishedWinesResult.recordset, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch published wines from producers:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

