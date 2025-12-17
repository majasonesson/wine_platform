import connectToDatabase from '../ConnectDB.mjs';
import sql from 'mssql';
import { BlobServiceClient } from '@azure/storage-blob';

const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;

export const listWines = async (req, res, next) => {
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
      .query('SELECT * FROM Wines WHERE UserID = @UserID');

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Failed to fetch wines:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

const uploadDocumentToBlob = async (file) => {
  if (!file) return null;

  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );

  const containerName = 'documents';
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const blobName = `${Date.now()}-${file.originalname}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    await blockBlobClient.uploadData(file.buffer),
      {
        blobHTTPHeaders: {
          blobContentType: file.mimetype,
        },
      };

    return blockBlobClient.url;
  } catch (error) {}
};

const uploadImageToBlob = async (file) => {
  if (!file) return null;

  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );
  const containerName = 'images'; // Your Azure Blob container name
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const blobName = `${Date.now()}-${file.originalname}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    // Upload file to Azure Blob with content type and disposition for display
    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: {
        blobContentType: file.mimetype || 'image/png', // Set content type
        blobContentDisposition: 'inline', // Set content disposition to inline
      },
    });

    return blockBlobClient.url; // Return the image URL after upload
  } catch (error) {
    console.error('Error uploading image to Blob Storage', error);
    throw error;
  }
};

// First, get the user's details before inserting the wine data
export const addWine = async (req, res) => {
  try {
    const pool = await connectToDatabase();

    if (!pool) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const userID = req.user.UserID;

    // Get user's country
    const userQuery = `
      SELECT Country, Region, District
      FROM Users 
      WHERE UserID = @UserID
    `;

    const userResult = await pool
      .request()
      .input('UserID', userID)
      .query(userQuery);

    const userCountry = userResult.recordset[0]?.Country;
    const userRegion = userResult.recordset[0]?.Region;
    const userDistrict = userResult.recordset[0]?.District;

    // Check if user has available labels
    const labelCheckQuery = `
      SELECT labels 
      FROM Users 
      WHERE UserID = @UserID
    `;

    const labelCheck = await pool
      .request()
      .input('UserID', userID)
      .query(labelCheckQuery);

    const remainingLabels = labelCheck.recordset[0]?.labels || 0;

    if (remainingLabels <= 0) {
      return res.status(403).json({
        error:
          'No labels available. Please upgrade your plan to add more wines.',
      });
    }

    const wineData = JSON.parse(req.body.wineData);

    // Override or set the country and region from user's data
    wineData.Country = userCountry;
    wineData.Region = userRegion;
    wineData.District = userDistrict;

    //Upload Documents
    const documentFiles = req.files?.documents || [];
    const documentFileUrl = await Promise.all(
      documentFiles.map((file) => uploadDocumentToBlob(file))
    );

    // Upload the main product image
    const imageFile = req.files?.image?.[0];
    const imageUrl = imageFile ? await uploadImageToBlob(imageFile) : null;

    // Upload sustainability images
    const sustainabilityFiles = req.files?.sustainabilityImages || [];
    const sustainabilityUrls = await Promise.all(
      sustainabilityFiles.map((file) => uploadImageToBlob(file))
    );

    // Prepare the SQL query
    const query = `
      INSERT INTO Wines (
        BrandName, Country, District, CreatedAt, EAN, GTIN, ImageURL, Name, 
        Carbs, CarbsOfSugar, Kcal, KJ, Organic, OrganicAcid, AlcoholVolume, WineYear, Grape, 
        Ingredients, NetQuantity, ResidualSugar, Type, Region, SQPNI, Sustainability, 
        QRCodeUrl, UserID, Documents, Category, Sulphites, productionDetails, ExpiryDate, Certificates,  MajorGrape, MajorGrapePercentage, 
        SecondGrape, SecondGrapePercentage, 
        ThirdGrape, ThirdGrapePercentage, 
        FourthGrape, FourthGrapePercentage
      )
      OUTPUT inserted.WineID
      VALUES (
        @BrandName, @Country, @District, @CreatedAt, @EAN, @GTIN, @ImageURL, @Name, 
        @Carbs, @CarbsOfSugar, @Kcal, @KJ, @Organic, @OrganicAcid, @AlcoholVolume, @WineYear, @Grape, 
        @Ingredients, @NetQuantity, @ResidualSugar, @Type, @Region, @SQPNI, @Sustainability, 
        @QRCodeUrl, @UserID, @Documents, @Category, @Sulphites, @productionDetails, @ExpiryDate, @Certificates,
        @MajorGrape, @MajorGrapePercentage, 
        @SecondGrape, @SecondGrapePercentage,
        @ThirdGrape, @ThirdGrapePercentage, 
        @FourthGrape, @FourthGrapePercentage
      )
    `;

    const result = await pool
      .request()
      .input('BrandName', wineData.BrandName || null)
      .input('Country', wineData.Country || null)
      .input('Region', wineData.Region || null)
      .input('District', wineData.District || null)
      .input('CreatedAt', new Date() || null)
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
      .input('Documents', documentFileUrl.join(',') || null)
      .input('Sulphites', wineData.Sulphites || null)
      .input('QRCodeUrl', '') // Prepare QRCodeUrl before adding WineID
      .input('UserID', userID)
      .input(
        'productionDetails',
        sql.NVarChar,
        JSON.stringify(wineData.productionDetails) || null
      )
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

    // Get the inserted WineID
    const wineID = result.recordset[0].WineID;
    // QR code URL
    const QRCodeUrl = `http://www.journy.se/product/${wineID}`;

    // Update the Wines table with the generated QR code URL
    const updateQuery = `
      UPDATE Wines
      SET QRCodeUrl = @QRCodeUrl
      WHERE WineID = @WineID
    `;

    await pool
      .request()
      .input('QRCodeUrl', QRCodeUrl)
      .input('WineID', wineID)
      .query(updateQuery);

    // Update the user's label count
    const updateLabelsQuery = `
      UPDATE Users 
      SET labels = labels - 1 
      WHERE UserID = @UserID
    `;

    await pool.request().input('UserID', userID).query(updateLabelsQuery);

    res.status(201).json({ message: 'Wine data added successfully' });
  } catch (err) {
    console.error('Failed to insert wine data:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

export const updateWine = async (req, res, next) => {
  const { id } = req.params;
  try {
    const pool = await connectToDatabase();

    if (!pool) {
      console.error('Database connection failed: pool is undefined');
      return res.status(500).json({ error: 'Database connection failed' });
    }

    // Get user's country and region first
    const userID = req.user.UserID;
    const userQuery = `
      SELECT Country, Region, District 
      FROM Users 
      WHERE UserID = @UserID
    `;

    const userResult = await pool
      .request()
      .input('UserID', userID)
      .query(userQuery);

    const userCountry = userResult.recordset[0]?.Country;
    const userRegion = userResult.recordset[0]?.Region;
    const userDistrict = userResult.recordset[0]?.District;

    // Upload Documents
    const documentFiles = req.files?.documents || [];
    const documentFileUrl = await Promise.all(
      documentFiles.map((file) => uploadDocumentToBlob(file))
    );

    // Upload the main product image
    const imageFile = req.files?.image?.[0];
    const imageUrl = imageFile ? await uploadImageToBlob(imageFile) : null;

    // Handle sustainability images
    let sustainabilityUrls = [];

    // If user explicitly wants to remove sustainability images (sends empty array or null)
    if (
      req.body.sustainabilityImages === null ||
      req.body.sustainabilityImages?.length === 0
    ) {
      sustainabilityUrls = []; // This will result in setting Sustainability to NULL
    } else {
      // If new files are uploaded, upload them
      if (req.files?.sustainabilityImages) {
        const sustainabilityFiles = req.files.sustainabilityImages || [];
        sustainabilityUrls = await Promise.all(
          sustainabilityFiles.map((file) => uploadImageToBlob(file))
        );
      }

      // If no new files, preserve existing image URLs
      const existingSustainabilityImages = req.body.sustainabilityImages;
      if (
        existingSustainabilityImages &&
        existingSustainabilityImages.length > 0
      ) {
        sustainabilityUrls = sustainabilityUrls.concat(
          existingSustainabilityImages
        ); // Combine old and new URLs
      }
    }

    const wineData = JSON.parse(req.body.wineData);

    // Override country and region with user's data
    wineData.Country = userCountry;
    wineData.Region = userRegion;
    wineData.District = userDistrict;

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
        ImageURL = COALESCE (@ImageURL, ImageURL),
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
        WHERE WineID = @WineID;`;

    const result = await pool
      .request()
      .input('BrandName', wineData.BrandName || null)
      .input('Country', wineData.Country || null)
      .input('District', wineData.District || null)
      .input('Region', wineData.Region || null)
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
      .input('Documents', documentFileUrl.join(',') || null)
      .input(
        'productionDetails',
        sql.NVarChar,
        JSON.stringify(wineData.productionDetails) || null
      )
      .input('Certificates', wineData.Certificates || '')
      .input('WineID', sql.Int, id)
      .input('MajorGrape', wineData.MajorGrape || null)
      .input('MajorGrapePercentage', wineData.MajorGrapePercentage || null)
      .input('SecondGrape', wineData.SecondGrape || null)
      .input('SecondGrapePercentage', wineData.SecondGrapePercentage || null)
      .input('ThirdGrape', wineData.ThirdGrape || null)
      .input('ThirdGrapePercentage', wineData.ThirdGrapePercentage || null)
      .input('FourthGrape', wineData.FourthGrape || null)
      .input('FourthGrapePercentage', wineData.FourthGrapePercentage || null)
      .query(query);

    console.log('Received files:', req.files);
    console.log('Received body:', req.body);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Wine not found' });
    }

    res.status(201).json({ message: 'Wine data updated successfully' });
  } catch (error) {
    console.error('Failed to update wine data:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const updateIsPublishedWine = async (req, res, next) => {
  const { id } = req.params;
  const { IsPublished } = req.body;

  try {
    const pool = await connectToDatabase();

    if (!pool) {
      console.error('Database connection failed: pool is undefined');
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const query = `
      UPDATE Wines
      SET 
        IsPublished = @IsPublished
      WHERE WineID = @WineID;`;

    const result = await pool
      .request()
      .input('IsPublished', IsPublished)
      .input('WineID', sql.Int, id)
      .query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Wine not found' });
    }

    res.status(201).json({ message: 'Wine data updated successfully' });
  } catch (error) {
    console.error('Failed to update wine data:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const deleteWine = async (req, res, next) => {
  const { id } = req.params;

  try {
    const pool = await connectToDatabase();

    if (!pool) {
      console.error('Database connection failed: pool is undefined');
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const userID = req.user.UserID;

    if (!req.user || !req.user.UserID) {
      return res
        .status(401)
        .json({ error: 'User not authenticated or UserID not available' });
    }

    const checkOwnershipQuery = `
    SELECT UserID FROM Wines WHERE WineID = @WineID
  `;

    const wine = await pool
      .request()
      .input('WineID', id)
      .query(checkOwnershipQuery);

    if (wine.recordset.length === 0) {
      return res.status(404).json({ message: 'Wine not found' });
    }

    const wineOwnerID = wine.recordset[0].UserID;

    if (wineOwnerID !== userID) {
      return res
        .status(403)
        .json({ error: 'You do not have permission to delete this wine' });
    }

    const deleteQuery = ` 
      DELETE FROM Wines WHERE WineID = @WineID`;

    const result = await pool.request().input('WineID', id).query(deleteQuery);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Wine not found' });
    }

    res.status(201).json({ message: 'Wine deleted successfully' });
  } catch (error) {
    console.error('Failed to delete wine:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const getWine = async (req, res, next) => {
  const { id } = req.params;

  try {
    const pool = await connectToDatabase();

    if (!pool) {
      console.error('Database connection failed: pool is undefined');
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const query = 'SELECT * FROM Wines WHERE WineID = @WineID';

    const result = await pool
      .request()
      .input('WineID', sql.Int, id)
      .query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Wine not found' });
    }

    // Parse productionDetails JSON string to object
    const wine = result.recordset[0];
    if (wine.productionDetails) {
      wine.productionDetails = JSON.parse(wine.productionDetails);
    }

    res.status(200).json(wine);
  } catch (error) {
    console.error('Failed fetching Wine by ID ', error);
    res.status(500).json({ error: 'Database Error' });
  }
};

export const getQRCode = async (req, res) => {
  const { id } = req.params; // Extract wine ID from the route

  try {
    // Fetch QR code from Azure SQL Database using the wine ID
    const qrCodeResult =
      await sql.query`SELECT QRCodeUrl FROM Wines WHERE WineID = ${id}`;

    if (qrCodeResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Wine not found' });
    }

    const qrCode = qrCodeResult.recordset[0].QRCodeUrl;

    res.json({ qrCode });
  } catch (error) {
    console.error('Error fetching QR code:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
