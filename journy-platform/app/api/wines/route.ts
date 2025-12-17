import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import connectToDatabase from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { uploadImageToBlob, uploadDocumentToBlob } from '@/lib/azure';
import { WineFormData } from '@/types/wine.types';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'User not authenticated or UserID not available' },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    const pool = await connectToDatabase();

    const result = await pool
      .request()
      .input('UserID', user.id)
      .query('SELECT * FROM Wines WHERE UserID = @UserID');

    return NextResponse.json(result.recordset, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch wines:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    const pool = await connectToDatabase();

    // Check label availability
    const labelCheckQuery = `
      SELECT labels 
      FROM Users 
      WHERE UserID = @UserID
    `;

    const labelCheck = await pool
      .request()
      .input('UserID', user.id)
      .query(labelCheckQuery);

    const remainingLabels = labelCheck.recordset[0]?.labels || 0;

    if (remainingLabels <= 0) {
      return NextResponse.json(
        {
          error: 'No labels available. Please upgrade your plan to add more wines.',
        },
        { status: 403 }
      );
    }

    // Get user's location data
    const userQuery = `
      SELECT Country, Region, District
      FROM Users 
      WHERE UserID = @UserID
    `;

    const userResult = await pool
      .request()
      .input('UserID', user.id)
      .query(userQuery);

    const userCountry = userResult.recordset[0]?.Country;
    const userRegion = userResult.recordset[0]?.Region;
    const userDistrict = userResult.recordset[0]?.District;

    const formData = await request.formData();
    const wineDataString = formData.get('wineData') as string;
    const wineData: WineFormData = JSON.parse(wineDataString);

    // Upload files
    const imageFile = formData.get('image') as File | null;
    const imageUrl = imageFile ? await uploadImageToBlob(imageFile, 'images') : null;

    const documentFiles: File[] = [];
    const sustainabilityFiles: File[] = [];
    
    formData.forEach((value, key) => {
      if (key === 'documents' && value instanceof File) {
        documentFiles.push(value);
      }
      if (key === 'sustainabilityImages' && value instanceof File) {
        sustainabilityFiles.push(value);
      }
    });

    const documentUrls = await Promise.all(
      documentFiles.map((file) => uploadDocumentToBlob(file))
    );

    const sustainabilityUrls = await Promise.all(
      sustainabilityFiles.map((file) => uploadImageToBlob(file, 'images'))
    );

    const query = `
      INSERT INTO Wines (
        BrandName, Country, District, CreatedAt, EAN, GTIN, ImageURL, Name, 
        Carbs, CarbsOfSugar, Kcal, KJ, Organic, OrganicAcid, AlcoholVolume, WineYear, Grape, 
        Ingredients, NetQuantity, ResidualSugar, Type, Region, SQPNI, Sustainability, 
        QRCodeUrl, UserID, Documents, Category, Sulphites, productionDetails, ExpiryDate, Certificates,
        MajorGrape, MajorGrapePercentage, SecondGrape, SecondGrapePercentage, 
        ThirdGrape, ThirdGrapePercentage, FourthGrape, FourthGrapePercentage
      )
      OUTPUT inserted.WineID
      VALUES (
        @BrandName, @Country, @District, @CreatedAt, @EAN, @GTIN, @ImageURL, @Name, 
        @Carbs, @CarbsOfSugar, @Kcal, @KJ, @Organic, @OrganicAcid, @AlcoholVolume, @WineYear, @Grape, 
        @Ingredients, @NetQuantity, @ResidualSugar, @Type, @Region, @SQPNI, @Sustainability, 
        @QRCodeUrl, @UserID, @Documents, @Category, @Sulphites, @productionDetails, @ExpiryDate, @Certificates,
        @MajorGrape, @MajorGrapePercentage, @SecondGrape, @SecondGrapePercentage,
        @ThirdGrape, @ThirdGrapePercentage, @FourthGrape, @FourthGrapePercentage
      )
    `;

    const result = await pool
      .request()
      .input('BrandName', wineData.BrandName || null)
      .input('Country', userCountry || null)
      .input('Region', userRegion || null)
      .input('District', userDistrict || null)
      .input('CreatedAt', new Date())
      .input('EAN', wineData.EAN || null)
      .input('GTIN', wineData.GTIN || null)
      .input('ImageURL', imageUrl || null)
      .input('Name', wineData.Name || null)
      .input('Carbs', wineData.Carbs || null)
      .input('CarbsOfSugar', wineData.CarbsOfSugar || null)
      .input('Kcal', wineData.Kcal || null)
      .input('KJ', wineData.KJ || null)
      .input('Organic', wineData.Organic || null)
      .input('OrganicAcid', wineData.OrganicAcid || null)
      .input('AlcoholVolume', wineData.AlcoholVolume || null)
      .input('WineYear', wineData.WineYear || null)
      .input('Category', wineData.Category || null)
      .input('Grape', wineData.Grape || null)
      .input('Ingredients', wineData.Ingredients || null)
      .input('NetQuantity', wineData.NetQuantity || null)
      .input('ResidualSugar', wineData.ResidualSugar || null)
      .input('Type', wineData.Type || null)
      .input('SQPNI', wineData.SQPNI || null)
      .input('Sustainability', sustainabilityUrls.join(',') || null)
      .input('Documents', documentUrls.join(',') || null)
      .input('Sulphites', wineData.Sulphites || null)
      .input('QRCodeUrl', '')
      .input('UserID', user.id)
      .input('productionDetails', sql.NVarChar, JSON.stringify(wineData.productionDetails) || null)
      .input('Certificates', wineData.Certificates || '')
      .input('ExpiryDate', wineData.ExpiryDate || null)
      .input('MajorGrape', wineData.MajorGrape || null)
      .input('MajorGrapePercentage', wineData.MajorGrapePercentage || null)
      .input('SecondGrape', wineData.SecondGrape || null)
      .input('SecondGrapePercentage', wineData.SecondGrapePercentage || null)
      .input('ThirdGrape', wineData.ThirdGrape || null)
      .input('ThirdGrapePercentage', wineData.ThirdGrapePercentage || null)
      .input('FourthGrape', wineData.FourthGrape || null)
      .input('FourthGrapePercentage', wineData.FourthGrapePercentage || null)
      .query(query);

    const wineID = result.recordset[0].WineID;
    const QRCodeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/product/${wineID}`;

    await pool
      .request()
      .input('QRCodeUrl', QRCodeUrl)
      .input('WineID', wineID)
      .query('UPDATE Wines SET QRCodeUrl = @QRCodeUrl WHERE WineID = @WineID');

    // Update label count
    await pool
      .request()
      .input('UserID', user.id)
      .query('UPDATE Users SET labels = labels - 1 WHERE UserID = @UserID');

    return NextResponse.json(
      { message: 'Wine data added successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to insert wine data:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

