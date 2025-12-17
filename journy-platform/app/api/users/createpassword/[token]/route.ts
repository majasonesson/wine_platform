import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await request.json();
    const { newPassword } = body;

    const pool = await connectToDatabase();

    const result = await pool
      .request()
      .input('Token', token)
      .query(`
        SELECT UserID, PasswordResetExpires 
        FROM Users 
        WHERE PasswordResetToken = @Token
      `);

    if (!result.recordset.length) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    const user = result.recordset[0];

    if (user.PasswordResetExpires && new Date(user.PasswordResetExpires) < new Date()) {
      return NextResponse.json(
        { message: 'Token has expired' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await pool
      .request()
      .input('UserID', user.UserID)
      .input('Password', hashedPassword)
      .query(`
        UPDATE Users 
        SET Password = @Password,
            PasswordResetToken = NULL,
            PasswordResetExpires = NULL
        WHERE UserID = @UserID
      `);

    return NextResponse.json(
      { message: 'Password created successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating password:', error);
    return NextResponse.json(
      { error: 'Failed to create password' },
      { status: 500 }
    );
  }
}

