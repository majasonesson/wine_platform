import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import connectToDatabase from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ wineID: string }> }
) {
  try {
    const { wineID } = await params;
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    const pool = await connectToDatabase();

    const query = `
      SELECT w.* FROM Wines w
      INNER JOIN ConnectionRequests cr ON w.UserID = cr.ProducerID
      WHERE w.WineID = @WineID
        AND cr.ImporterID = @ImporterID 
        AND cr.Status = 'ACCEPTED'
        AND w.IsPublished = 1
    `;

    const result = await pool
      .request()
      .input('WineID', sql.Int, parseInt(wineID))
      .input('ImporterID', sql.Int, user.id)
      .query(query);

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { message: 'Wine not found or not accessible' },
        { status: 404 }
      );
    }

    const wine = result.recordset[0];
    if (wine.productionDetails) {
      wine.productionDetails = JSON.parse(wine.productionDetails);
    }

    return NextResponse.json(wine, { status: 200 });
  } catch (error) {
    console.error('Failed fetching Wine by ID ', error);
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}

