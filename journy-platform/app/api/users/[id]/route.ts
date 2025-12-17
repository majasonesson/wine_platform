import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import connectToDatabase from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { message: 'Not authorized, token missing' },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    
    // Users can only delete themselves, or admins can delete anyone
    if (user.id !== parseInt(id) && user.role !== 'Admin') {
      return NextResponse.json(
        { error: 'Not authorized to delete this user' },
        { status: 403 }
      );
    }

    const pool = await connectToDatabase();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // Delete user certifications
      await transaction
        .request()
        .input('UserID', sql.Int, parseInt(id))
        .query('DELETE FROM UserCertifications WHERE UserID = @UserID');

      // Delete connection requests (both sent and received)
      await transaction
        .request()
        .input('UserID', sql.Int, parseInt(id))
        .query(
          'DELETE FROM ConnectionRequests WHERE ImporterID = @UserID OR ProducerID = @UserID'
        );

      // Delete wines owned by user
      await transaction
        .request()
        .input('UserID', sql.Int, parseInt(id))
        .query('DELETE FROM Wines WHERE UserID = @UserID');

      // Delete the user
      const deleteUserResult = await transaction
        .request()
        .input('UserID', sql.Int, parseInt(id))
        .query('DELETE FROM Users WHERE UserID = @UserID');

      if (deleteUserResult.rowsAffected[0] === 0) {
        await transaction.rollback();
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      await transaction.commit();

      return NextResponse.json(
        { message: 'User deleted successfully' },
        { status: 200 }
      );
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

