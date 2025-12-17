import jwt from 'jsonwebtoken';
import { promisify } from 'util'; // To convert callback-based functions to promises
import connectToDatabase from '../ConnectDB.mjs';

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    // Verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Attach user data to request
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input('UserID', decoded.id) // Get the user by ID from the token
      .query('SELECT * FROM Users WHERE UserID = @UserID');

    const user = result.recordset[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // Attach the user to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};
