import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import { ChangePasswordRequest } from '@/types/api.types';

const userByIdQuery = `
  SELECT UserID, Password
  FROM Users
  WHERE UserID = @UserID
`;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: ChangePasswordRequest = await request.json();
    const { currentPassword, newPassword } = body;

    const pool = await connectToDatabase();

    const result = await pool
      .request()
      .input('UserID', sql.Int, parseInt(id))
      .query(userByIdQuery);

    if (!result.recordset[0]) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const user = result.recordset[0];

    const isValidPassword = await bcrypt.compare(currentPassword, user.Password);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await pool
      .request()
      .input('UserID', sql.Int, parseInt(id))
      .input('Password', sql.NVarChar, hashedPassword)
      .query('UPDATE Users SET Password = @Password WHERE UserID = @UserID');

    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    );
  }
}

