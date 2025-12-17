import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import connectToDatabase from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { uploadImageToBlob, uploadDocumentToBlob } from '@/lib/azure';
import { WineFormData } from '@/types/wine.types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pool = await connectToDatabase();

    const query = 'SELECT * FROM Wines WHERE WineID = @WineID';

    const result = await pool
      .request()
      .input('WineID', sql.Int, parseInt(id))
      .query(query);

    if (result.recordset.length === 0) {
      return NextResponse.json({ message: 'Wine not found' }, { status: 404 });
    }

    const wine = result.recordset[0];
    if (wine.productionDetails) {
      wine.productionDetails = JSON.parse(wine.productionDetails);
    }

    return NextResponse.json(wine, { status: 200 });
  } catch (error) {
    console.error('Failed fetching Wine by ID ', error);
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    const pool = await connectToDatabase();

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
    const imageUrl = imageFile && imageFile.size > 0 ? 
      await uploadImageToBlob(imageFile, 'images') : null;

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

    let sustainabilityUrls: string[] = [];
    if (sustainabilityFiles.length > 0) {
      sustainabilityUrls = await Promise.all(
        sustainabilityFiles.map((file) => uploadImageToBlob(file, 'images'))
      );
    }

    const query = `
      UPDATE Wines
      SET 
        BrandName = @BrandName,
        Country = @Country,
        Region = @Region,
        IsPublished = @IsPublished,
        District = @District,
        EAN = @EAN,
        GTIN = @GTIN,
        ImageURL = COALESCE(@ImageURL, ImageURL),
        Name = @Name,
        Carbs = @Carbs,
        CarbsOfSugar = @CarbsOfSugar,
        Kcal = @Kcal,
        KJ = @KJ,
        Organic = @Organic,
        OrganicAcid = @OrganicAcid,
        Category = @Category,
        AlcoholVolume = @AlcoholVolume,
        WineYear = @WineYear,
        Grape = @Grape,
        Ingredients = @Ingredients,
        NetQuantity = @NetQuantity,
        ResidualSugar = @ResidualSugar, 
        ExpiryDate = @ExpiryDate,
        Type = @Type,
        SQPNI = @SQPNI,
        Sulphites = @Sulphites,
        Documents = NULLIF(@Documents, ''),
        Sustainability = NULLIF(@Sustainability, ''),
        productionDetails = @productionDetails,
        Certificates = @Certificates,
        MajorGrape = @MajorGrape,
        MajorGrapePercentage = @MajorGrapePercentage,
        SecondGrape = @SecondGrape,
        SecondGrapePercentage = @SecondGrapePercentage,
        ThirdGrape = @ThirdGrape,
        ThirdGrapePercentage = @ThirdGrapePercentage,
        FourthGrape = @FourthGrape,
        FourthGrapePercentage = @FourthGrapePercentage
      WHERE WineID = @WineID
    `;

    const result = await pool
      .request()
      .input('BrandName', wineData.BrandName || null)
      .input('Country', userCountry || null)
      .input('District', userDistrict || null)
      .input('Region', userRegion || null)
      .input('IsPublished', wineData.IsPublished || null)
      .input('EAN', wineData.EAN || null)
      .input('GTIN', wineData.GTIN || null)
      .input('ImageURL', imageUrl || null)
      .input('Name', wineData.Name || null)
      .input('Carbs', wineData.Carbs || null)
      .input('CarbsOfSugar', wineData.CarbsOfSugar || null)
      .input('Kcal', wineData.Kcal || null)
      .input('KJ', wineData.KJ || null)
      .input('Category', wineData.Category || null)
      .input('Organic', wineData.Organic || null)
      .input('OrganicAcid', wineData.OrganicAcid || null)
      .input('AlcoholVolume', wineData.AlcoholVolume || null)
      .input('WineYear', wineData.WineYear || null)
      .input('Grape', wineData.Grape || null)
      .input('ExpiryDate', wineData.ExpiryDate || null)
      .input('Ingredients', wineData.Ingredients || null)
      .input('NetQuantity', wineData.NetQuantity || null)
      .input('ResidualSugar', wineData.ResidualSugar || null)
      .input('Type', wineData.Type || null)
      .input('SQPNI', wineData.SQPNI || null)
      .input('Sulphites', wineData.Sulphites || null)
      .input('Sustainability', sustainabilityUrls.join(',') || null)
      .input('Documents', documentUrls.join(',') || null)
      .input('productionDetails', sql.NVarChar, JSON.stringify(wineData.productionDetails) || null)
      .input('Certificates', wineData.Certificates || '')
      .input('WineID', sql.Int, parseInt(id))
      .input('MajorGrape', wineData.MajorGrape || null)
      .input('MajorGrapePercentage', wineData.MajorGrapePercentage || null)
      .input('SecondGrape', wineData.SecondGrape || null)
      .input('SecondGrapePercentage', wineData.SecondGrapePercentage || null)
      .input('ThirdGrape', wineData.ThirdGrape || null)
      .input('ThirdGrapePercentage', wineData.ThirdGrapePercentage || null)
      .input('FourthGrape', wineData.FourthGrape || null)
      .input('FourthGrapePercentage', wineData.FourthGrapePercentage || null)
      .query(query);

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json({ message: 'Wine not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Wine data updated successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to update wine data:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    const pool = await connectToDatabase();

    // Check ownership
    const checkOwnershipQuery = `
      SELECT UserID FROM Wines WHERE WineID = @WineID
    `;

    const wine = await pool
      .request()
      .input('WineID', parseInt(id))
      .query(checkOwnershipQuery);

    if (wine.recordset.length === 0) {
      return NextResponse.json({ message: 'Wine not found' }, { status: 404 });
    }

    const wineOwnerID = wine.recordset[0].UserID;

    if (wineOwnerID !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this wine' },
        { status: 403 }
      );
    }

    const deleteQuery = `DELETE FROM Wines WHERE WineID = @WineID`;

    const result = await pool
      .request()
      .input('WineID', parseInt(id))
      .query(deleteQuery);

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json({ message: 'Wine not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Wine deleted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to delete wine:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

