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

    verifyToken(token);

    const body = await request.json();
    const { IsPublished } = body;

    const pool = await connectToDatabase();

    const query = `
      UPDATE Wines
      SET IsPublished = @IsPublished
      WHERE WineID = @WineID
    `;

    const result = await pool
      .request()
      .input('IsPublished', IsPublished)
      .input('WineID', sql.Int, parseInt(id))
      .query(query);

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json({ message: 'Wine not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Wine data updated successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to update wine data:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

