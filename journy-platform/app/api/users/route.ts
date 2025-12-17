import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';

export async function GET() {
  try {
    const pool = await connectToDatabase();

    const usersQuery = `
      SELECT UserID, Email, FullName, Company, Role, IsWhitelisted, CreatedAt, 
             Country, Region, District, ProfileImageUrl
      FROM Users
    `;

    const result = await pool.request().query(usersQuery);

    return NextResponse.json({ data: result.recordset }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

