import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import { LoginRequest, LoginResponse } from '@/types/api.types';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Please provide email and password' },
        { status: 400 }
      );
    }

    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input('Email', email)
      .query('SELECT * FROM Users WHERE Email = @Email');

    const user = result.recordset[0];

    if (!user || !(await bcrypt.compare(password, user.Password))) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateToken({
      id: user.UserID,
      role: user.Role,
      email: user.Email,
    });

    const response: LoginResponse = {
      success: true,
      token,
      data: {
        user: {
          id: user.UserID,
          email: user.Email,
          role: user.Role,
        },
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

