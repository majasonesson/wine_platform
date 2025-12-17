import bcrypt from 'bcryptjs';
import connectToDatabase from '../ConnectDB.mjs';

export const createPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const token = req.params.token;
    const pool = await connectToDatabase();

    if (!pool) {
      console.error('Database connection failed');
      return res.status(500).json({ error: 'Database connection failed' });
    }

    // Verify token and check if it has expired
    const query = `
      SELECT * FROM Users WHERE PasswordResetToken = @token AND PasswordResetExpires > GETDATE()
    `;

    // Create a request object
    const request = pool.request().input('token', token); // Define the parameter

    const result = await request.query(query);

    if (!result.recordset.length) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the user's password and remove the token
    const updateQuery = `
      UPDATE Users SET Password = @password, PasswordResetToken = NULL, PasswordResetExpires = NULL WHERE UserID = @userId
    `;

    await pool
      .request()
      .input('password', hashedPassword)
      .input('userId', result.recordset[0].UserID)
      .query(updateQuery);

    res.status(200).json({ message: 'Password successfully created' });
  } catch (error) {
    console.error('Error creating password:', error);
    res.status(500).json({ error: 'Error creating password' });
  }
};
