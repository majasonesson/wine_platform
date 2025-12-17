import connectToDatabase from '../ConnectDB.mjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ErrorResponse from '../models/ErrorResponse.mjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import sql from 'mssql';
import { BlobServiceClient } from '@azure/storage-blob';

const userByIdQuery = `
SELECT 
  u.UserID, 
  u.Email,
  u.Role,
  u.FullName, 
  u.Company,
  u.Country,
  u.District,
  u.Region,
  u.Address,
  u.Labels,
  u.Password,
  u.SubscriptionStatus,
  u.SubscriptionEndDate,
  u.PriceId,
  u.hasUsedFreeTier,
  uc.CertificationType,
  uc.ExpiryDate,
  uc.ReferenceNumber,
  uc.ImageURL,
  u.ProfileImageUrl
FROM Users u
LEFT JOIN UserCertifications uc ON u.UserID = uc.UserID
WHERE u.UserID = @UserID`;

const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;

const sendPasswordCreationEmail = async (email, token) => {
  console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
  const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  const mailOptions = {
    from: 'william.jansson@medieinstitutet.se',
    to: email,
    subject: 'Create Your Password',
    text: `Please click the following link to create your password: ${process.env.FRONTEND_URL}/createpassword/${token}`,
  };

  try {
    console.log('Preparing to send email to', email);
    await transporter.sendMail(mailOptions);
    console.log('Email sent To', email);
  } catch (error) {
    console.log('Error sending email', error);
  }
};

const uploadImageToBlob = async (file, containerName) => {
  console.log('Starting upload for file:', file?.originalname);

  if (!file) {
    console.log('No file received in uploadImageToBlob');
    return null;
  }

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blobName = `${Date.now()}-${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: {
        blobContentType: file.mimetype,
        blobContentDisposition: `inline; filename="${file.originalname}"`,
      },
    });

    console.log(`Successfully uploaded: ${blockBlobClient.url}`);
    return blockBlobClient.url;
  } catch (error) {
    console.error('Blob upload error:', error);
    throw error;
  }
};

export const registerUser = async (
  fullName,
  email,
  password,
  role,
  company,
  country,
  region,
  district,
  certificationDetails
) => {
  const pool = await connectToDatabase();
  const transaction = new sql.Transaction(pool);
  await transaction.begin();

  // Handle file uploads first
  // const sustainabilityFiles = req.files?.sustainabilityImages || [];
  // console.log('Processing files:', sustainabilityFiles); // Debug log

  // const sustainabilityUrls = await Promise.all(
  //   sustainabilityFiles.map(async (file) => {
  //     console.log('Processing file:', file.originalname); // Debug log
  //     return await uploadImageToBlob(file);
  //   })
  // );

  // First insert user
  try {
    const userResult = await transaction
      .request()
      .input('FullName', sql.NVarChar, fullName)
      .input('Email', sql.NVarChar, email)
      .input('Password', sql.NVarChar, password)
      .input('Role', sql.NVarChar, role)
      .input('Company', sql.NVarChar, company)
      .input('Country', sql.NVarChar, country)
      .input('Region', sql.NVarChar, region)
      .input('District', sql.NVarChar, district).query(`
        INSERT INTO Users (FullName, Email, Password, Role, Company, Country, Region, District)
        OUTPUT INSERTED.UserID
        VALUES (@FullName, @Email, @Password, @Role, @Company, @Country, @Region, @District)
      `);

    const userId = userResult.recordset[0].UserID;

    if (certificationDetails) {
      for (const [certType, certData] of Object.entries(certificationDetails)) {
        if (certData.expiryDate && certData.referenceNumber) {
          await transaction
            .request()
            .input('UserID', sql.Int, userId)
            .input('CertificationType', sql.NVarChar, certType)
            .input('ExpiryDate', sql.Date, new Date(certData.expiryDate))
            .input('ReferenceNumber', sql.NVarChar, certData.referenceNumber)
            .input('ImageURL', sql.NVarChar, certData.imageURL || null).query(`
              INSERT INTO UserCertifications 
              (UserID, CertificationType, ExpiryDate, ReferenceNumber, ImageURL)
              VALUES 
              (@UserID, @CertificationType, @ExpiryDate, @ReferenceNumber, @ImageURL)
            `);
        }
      }
    }

    await transaction.commit();
    return { success: true, userId };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const { email, role } = req.body;

    console.log(`Updating role to: ${role} for email: ${email}`);

    const pool = await connectToDatabase();

    // Update user role
    const result = await pool
      .request()
      .input('Role', sql.NVarChar, role)
      .input('Email', sql.NVarChar, email)
      .query('UPDATE Users SET Role = @Role WHERE Email = @Email');

    if (result.rowsAffected[0] > 0) {
      console.log('Successfully updated user role');
      res.json({ success: true, message: 'Role updated successfully' });
    } else {
      console.log('No user found with that email');
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ success: false, message: 'Failed to update role' });
  }
};

export const getCertifications = async (req, res, next) => {
  try {
    const pool = await connectToDatabase();

    if (!pool) {
      console.error('Database connection failed: pool is undefined');
      return res.status(500).json({ error: 'Database connection failed' });
    }

    if (!req.user || !req.user.UserID) {
      return res
        .status(401)
        .json({ error: 'User not authenticated or UserID not available' });
    }

    const userID = req.user.UserID;

    const result = await pool
      .request()
      .input('UserID', userID)
      .query('SELECT * FROM UserCertifications WHERE UserID = @UserID');

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Failed to fetch certifications:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Please provide email and password' });
  }

  // Get the user from the database
  const pool = await connectToDatabase();
  const result = await pool
    .request()
    .input('Email', email)
    .query('SELECT * FROM Users WHERE Email = @Email');

  const user = result.recordset[0];

  // Check if user exists and password matches
  if (!user || !(await bcrypt.compare(password, user.Password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Send token if authentication is successful
  createAndSendToken(user, 200, res);
};

// Get all users
export const getUsers = async (req, res) => {
  const pool = await connectToDatabase();

  const usersQuery = `
  SELECT UserID, Email, FullName, Company, Role, IsWhitelisted, CreatedAt, Country, Region, District, ProfileImageUrl
  FROM Users`;

  // Execute the query
  let result = await pool.request().query(usersQuery);

  try {
    res.status(200).json({ data: result.recordset });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  // Get id from router parameter users/:id
  const { id } = req.params;

  const pool = await connectToDatabase();

  // Execute the query
  let result = await pool
    .request()
    .input('UserID', sql.Int, id)
    .query(userByIdQuery);

  try {
    // Transform the data to group certifications
    const user = {
      userID: result.recordset[0]?.UserID || '',
      email: result.recordset[0]?.Email || '',
      fullName: result.recordset[0]?.FullName || '',
      company: result.recordset[0]?.Company || '',
      role: result.recordset[0]?.Role || '',
      country: result.recordset[0]?.Country || '',
      district: result.recordset[0]?.District || '',
      region: result.recordset[0]?.Region || '',
      address: result.recordset[0]?.Address || '',
      labels: result.recordset[0]?.Labels || '0',
      subscriptionEndDate: result.recordset[0]?.SubscriptionEndDate || '',
      subscriptionStatus: result.recordset[0]?.SubscriptionStatus || '',
      hasUsedFreeTier: result.recordset[0]?.hasUsedFreeTier || '',
      priceId: result.recordset[0]?.PriceId || '',
      profileImageUrl: result.recordset[0]?.ProfileImageUrl || '',

      certifications: result.recordset
        .filter((row) => row.CertificationType)
        .map((cert) => ({
          type: cert.CertificationType,
          expiryDate: cert.ExpiryDate,
          referenceNumber: cert.ReferenceNumber,
          imageUrl: cert.ImageURL,
        })),
    };

    res.status(200).json({ data: user });
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  let updates = JSON.parse(req.body.data); // Parse the JSON string from FormData
  let transaction;

  console.log('Files received:', req.files);
  console.log('Updates payload:', updates);

  try {
    const pool = await connectToDatabase();
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // Handle file uploads first, similar to registerUser
      const files = req.files?.certifications || [];
      console.log('Processing files:', files);

      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          console.log('Processing file:', file.originalname);
          return await uploadImageToBlob(file, 'certifications');
        })
      );

      const imageFile = req.files?.profileImage?.[0];
      let profileImageUrl;

      if (imageFile) {
        profileImageUrl = await uploadImageToBlob(imageFile, 'images');
      } else {
        // Keep already uploaded URL
        profileImageUrl = updates.profileImageUrl;
      }

      // Update certifications with new URLs
      if (updates.certifications && uploadedUrls.length > 0) {
        updates.certifications = updates.certifications.map((cert, index) => ({
          ...cert,
          imageUrl: uploadedUrls[index] || cert.imageUrl, // Keep existing URL if no new file
        }));
      }

      const updateUser = `
          UPDATE Users 
          SET Company = @Company,
              Country = @Country,
              District = @District,
              Region = @Region,
              Address = @Address,
              ProfileImageUrl = @ProfileImageUrl
          WHERE UserID = @UserID`;

      // Update user details
      await transaction
        .request()
        .input('UserID', sql.Int, id)
        .input('Company', sql.NVarChar, updates.company)
        .input('Country', sql.NVarChar, updates.country)
        .input('District', sql.NVarChar, updates.district)
        .input('Region', sql.NVarChar, updates.region)
        .input('Address', sql.NVarChar, updates.address)
        .input('ProfileImageUrl', sql.NVarChar, profileImageUrl)
        .query(updateUser);

      // Update certifications
      if (updates.certifications) {
        // Delete existing certifications
        await transaction
          .request()
          .input('UserID', sql.Int, id)
          .query('DELETE FROM UserCertifications WHERE UserID = @UserID');

        // Insert updated certifications
        for (const cert of updates.certifications) {
          await transaction
            .request()
            .input('UserID', sql.Int, id)
            .input('CertificationType', sql.NVarChar, cert.type)
            .input('ExpiryDate', sql.Date, new Date(cert.expiryDate))
            .input('ReferenceNumber', sql.NVarChar, cert.referenceNumber)
            .input('ImageURL', sql.NVarChar, cert.imageUrl).query(`
              INSERT INTO UserCertifications 
              (UserID, CertificationType, ExpiryDate, ReferenceNumber, ImageURL)
              VALUES 
              (@UserID, @CertificationType, @ExpiryDate, @ReferenceNumber, @ImageURL)
            `);
        }
      }

      await transaction.commit();

      // Fetch and return updated user data
      const updatedUser = await pool
        .request()
        .input('UserID', sql.Int, id)
        .query(userByIdQuery);

      const transformedUser = {
        userID: updatedUser.recordset[0].UserID,
        company: updatedUser.recordset[0].Company,
        country: updatedUser.recordset[0].Country,
        district: updatedUser.recordset[0].District,
        region: updatedUser.recordset[0].Region,
        address: updatedUser.recordset[0].Address,
        profileImageUrl: profileImageUrl,
        certifications: updatedUser.recordset
          .filter((row) => row.CertificationType)
          .map((cert) => ({
            type: cert.CertificationType,
            expiryDate: cert.ExpiryDate,
            referenceNumber: cert.ReferenceNumber,
            imageUrl: cert.ImageURL,
          })),
      };

      res.status(200).json({
        message: 'User updated successfully',
        data: transformedUser,
      });
    } catch (error) {
      console.error('Transaction error:', error);
      await transaction.rollback();
      throw error;
    }
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  // Get id from router parameter users/:id
  const { id } = req.params;

  const pool = await connectToDatabase();

  const deleteUserQuery = `
    DELETE FROM [Users]
    WHERE UserID = @UserID;
  `;

  // Execute the query
  let result = await pool.request().input('UserID', id).query(deleteUserQuery);

  try {
    res
      .status(200)
      .json({ message: 'User updated successfully', data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createAndSendToken = (user, statusCode, res) => {
  // Generate the JWT token
  const token = jwt.sign(
    { id: user.UserID, role: user.Role }, // JWT payload
    process.env.JWT_SECRET, // Your secret key stored in the .env file
    { expiresIn: process.env.JWT_TTL } // Example: '30d' for 30 days
  );

  // Send the token and user info in the response body
  res.status(statusCode).json({
    success: true,
    token, // Include the JWT token
    data: {
      user: {
        id: user.UserID,
        email: user.Email,
        role: user.Role,
      },
    },
  });
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.params;

    const pool = await connectToDatabase();

    // Get current user
    let result = await pool
      .request()
      .input('UserID', sql.Int, id)
      .query(userByIdQuery);

    const user = {
      userID: result.recordset[0]?.UserID || '',
      password: result.recordset[0]?.Password || '',
    };

    console.log('Query:', userByIdQuery);
    console.log(result.recordset[0]);
    console.log('User ID from params:', id);

    if (!result.recordset[0]) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Stored Password:', user.password);
    console.log('Entered Password:', currentPassword);

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await pool
      .request()
      .input('UserID', sql.Int, id)
      .input('Password', sql.NVarChar, hashedPassword)
      .query('UPDATE Users SET Password = @Password WHERE UserID = @UserID');

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const pool = await connectToDatabase();

    // Check if user exists
    const result = await pool
      .request()
      .input('Email', email)
      .query('SELECT * FROM Users WHERE Email = @Email');

    if (!result.recordset.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = resetToken;
    const passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Save token to database
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

    // Send reset email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetDevURL = `http://localhost:5173/reset-password/${resetToken}`;
    const resetURL = `https://www.journy.se/reset-password/${resetToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `Click this link to reset your password: ${resetURL}\nIf you didn't request this, please ignore this email.`,
    });

    res.status(200).json({
      message: 'Password reset link sent to email',
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
};
