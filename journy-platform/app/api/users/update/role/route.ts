import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import connectToDatabase from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, role } = body;

    console.log(`Updating role to: ${role} for email: ${email}`);

    const pool = await connectToDatabase();

    const result = await pool
      .request()
      .input('Role', sql.NVarChar, role)
      .input('Email', sql.NVarChar, email)
      .query('UPDATE Users SET Role = @Role WHERE Email = @Email');

    if (result.rowsAffected[0] > 0) {
      console.log('Successfully updated user role');
      return NextResponse.json(
        { success: true, message: 'Role updated successfully' },
        { status: 200 }
      );
    } else {
      console.log('No user found with that email');
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error updating role:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update role' },
      { status: 500 }
    );
  }
}

