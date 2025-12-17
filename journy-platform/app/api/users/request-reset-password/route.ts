import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import connectToDatabase from '@/lib/db';
import { PasswordResetRequest } from '@/types/api.types';

export async function POST(request: NextRequest) {
  try {
    const body: PasswordResetRequest = await request.json();
    const { email } = body;

    const pool = await connectToDatabase();

    const result = await pool
      .request()
      .input('Email', email)
      .query('SELECT * FROM Users WHERE Email = @Email');

    if (!result.recordset.length) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = resetToken;
    const passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);

    await pool
      .request()
      .input('Email', email)
      .input('PasswordResetToken', passwordResetToken)
      .input('PasswordResetExpires', passwordResetExpires).query(`
        UPDATE Users 
        SET PasswordResetToken = @PasswordResetToken, 
            PasswordResetExpires = @PasswordResetExpires 
        WHERE Email = @Email
      `);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetURL = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `Click this link to reset your password: ${resetURL}\nIf you didn't request this, please ignore this email.`,
    });

    return NextResponse.json(
      { message: 'Password reset link sent to email' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}

