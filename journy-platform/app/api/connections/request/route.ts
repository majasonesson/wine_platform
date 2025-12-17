import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    const body = await request.json();
    const { Status, ProducerID } = body;

    console.log(Status, ProducerID);

    const pool = await connectToDatabase();

    await pool
      .request()
      .input('Status', Status || null)
      .input('ProducerID', ProducerID || null)
      .input('ImporterID', user.id).query(`
        INSERT INTO ConnectionRequests (Status, ImporterID, ProducerID)
        OUTPUT INSERTED.ProducerID
        VALUES (@Status, @ImporterID, @ProducerID)
      `);

    return NextResponse.json(
      { message: 'Connection request successfully created' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed create connection request:', error);
    return NextResponse.json(
      { error: `Database error: ${error}` },
      { status: 500 }
    );
  }
}

