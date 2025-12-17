import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import connectToDatabase from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    const body = await request.json();
    const { Status } = body;

    const pool = await connectToDatabase();

    // Verify that the user is the producer of this connection request
    const verifyQuery = `
      SELECT COUNT(*) as count 
      FROM ConnectionRequests 
      WHERE ConnectionID = @ConnectionID 
        AND ProducerID = @ProducerID
    `;

    const verifyResult = await pool
      .request()
      .input('ConnectionID', sql.Int, parseInt(id))
      .input('ProducerID', sql.Int, user.id)
      .query(verifyQuery);

    if (verifyResult.recordset[0].count === 0) {
      return NextResponse.json(
        { message: 'Not authorized to update this connection request' },
        { status: 403 }
      );
    }

    const updateQuery = `
      UPDATE ConnectionRequests
      SET Status = @Status
      WHERE ConnectionID = @ConnectionID
    `;

    await pool
      .request()
      .input('Status', Status)
      .input('ConnectionID', sql.Int, parseInt(id))
      .query(updateQuery);

    return NextResponse.json(
      { message: 'Connection status updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to update Connection status:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

