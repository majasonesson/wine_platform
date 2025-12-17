import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import connectToDatabase from '@/lib/db';
import QRCode from 'qrcode';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pool = await connectToDatabase();

    // Get wine QR code URL
    const query = 'SELECT QRCodeUrl FROM Wines WHERE WineID = @WineID';

    const result = await pool
      .request()
      .input('WineID', sql.Int, parseInt(id))
      .query(query);

    if (result.recordset.length === 0) {
      return NextResponse.json({ message: 'Wine not found' }, { status: 404 });
    }

    const qrCodeUrl = result.recordset[0].QRCodeUrl;

    if (!qrCodeUrl) {
      return NextResponse.json(
        { error: 'QR code URL not found for this wine' },
        { status: 404 }
      );
    }

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 1,
    });

    return NextResponse.json(
      {
        qrCodeUrl,
        qrCodeImage: qrCodeDataUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}

