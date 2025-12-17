import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import connectToDatabase from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { uploadCertificationToBlob, uploadImageToBlob } from '@/lib/azure';

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
  WHERE u.UserID = @UserID
`;

export async function GET(
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

    verifyToken(token);

    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input('UserID', sql.Int, parseInt(id))
      .query(userByIdQuery);

    if (!result.recordset.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

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

    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const dataString = formData.get('data') as string;
    let updates = JSON.parse(dataString);

    const pool = await connectToDatabase();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // Handle certification file uploads
      const certificationFiles: File[] = [];
      formData.forEach((value, key) => {
        if (key === 'certifications' && value instanceof File) {
          certificationFiles.push(value);
        }
      });

      const uploadedUrls = await Promise.all(
        certificationFiles.map((file) => uploadCertificationToBlob(file))
      );

      // Handle profile image upload
      const imageFile = formData.get('profileImage') as File | null;
      let profileImageUrl = updates.profileImageUrl;

      if (imageFile && imageFile.size > 0) {
        profileImageUrl = await uploadImageToBlob(imageFile, 'images');
      }

      // Update certifications with new URLs
      if (updates.certifications && uploadedUrls.length > 0) {
        updates.certifications = updates.certifications.map((cert: any, index: number) => ({
          ...cert,
          imageUrl: uploadedUrls[index] || cert.imageUrl,
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
        WHERE UserID = @UserID
      `;

      await transaction
        .request()
        .input('UserID', sql.Int, parseInt(id))
        .input('Company', sql.NVarChar, updates.company)
        .input('Country', sql.NVarChar, updates.country)
        .input('District', sql.NVarChar, updates.district)
        .input('Region', sql.NVarChar, updates.region)
        .input('Address', sql.NVarChar, updates.address)
        .input('ProfileImageUrl', sql.NVarChar, profileImageUrl)
        .query(updateUser);

      // Update certifications
      if (updates.certifications) {
        await transaction
          .request()
          .input('UserID', sql.Int, parseInt(id))
          .query('DELETE FROM UserCertifications WHERE UserID = @UserID');

        for (const cert of updates.certifications) {
          await transaction
            .request()
            .input('UserID', sql.Int, parseInt(id))
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

      const updatedUser = await pool
        .request()
        .input('UserID', sql.Int, parseInt(id))
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

      return NextResponse.json(
        {
          message: 'User updated successfully',
          data: transformedUser,
        },
        { status: 200 }
      );
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

