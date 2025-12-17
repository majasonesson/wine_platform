import connectToDatabase from '../ConnectDB.mjs';
import sql from 'mssql';

export const createConnectionRequest = async (req, res, next) => {
  try {
    const { Status, ProducerID } = req.body;

    console.log(Status, ProducerID);

    const pool = await connectToDatabase();

    if (!pool) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const userID = req.user.UserID;

    await pool
      .request()
      .input('Status', Status || null)
      .input('ProducerID', ProducerID || null)
      .input('ImporterID', userID).query(`
        INSERT INTO ConnectionRequests (Status, ImporterID, ProducerID)
        OUTPUT INSERTED.ProducerID
        VALUES (@Status, @ImporterID, @ProducerID)
      `);

    res
      .status(201)
      .json({ message: 'Connection request successfully created' });
  } catch (err) {
    console.error('Failed create connection request:', err);
    res.status(500).json({ error: `Database error: ${err}` });
  }
};

export const updateConnectionStatus = async (req, res, next) => {
  const { id } = req.params;
  const { Status } = req.body;
  const producerID = req.user.UserID;

  try {
    const pool = await connectToDatabase();

    if (!pool) {
      console.error('Database connection failed: pool is undefined');
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const verifyQuery = `
      SELECT COUNT(*) as count 
      FROM ConnectionRequests 
        WHERE ConnectionID = @ConnectionID 
        AND ProducerID = @ProducerID`;

    const verifyResult = await pool
      .request()
      .input('ConnectionID', sql.Int, id)
      .input('ProducerID', sql.Int, producerID)
      .query(verifyQuery);

    if (verifyResult.recordset[0].count === 0) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this connection request' });
    }

    const updateQuery = `
      UPDATE ConnectionRequests
      SET Status = @Status
        WHERE ConnectionID = @ConnectionID`;

    await pool
      .request()
      .input('Status', Status)
      .input('ConnectionID', sql.Int, id)
      .query(updateQuery);

    res.status(200).json({ message: 'Connection status updated successfully' });
  } catch (error) {
    console.error('Failed to update Connection status:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const getConnectionRequests = async (req, res, next) => {
  try {
    const pool = await connectToDatabase();
    const userID = req.user.UserID;
    const userRole = req.user.Role;

    if (!pool) {
      console.error('Database connection failed: pool is undefined');
      return res.status(500).json({ error: 'Database connection failed' });
    }

    let connectionQuery;
    if (userRole === 'Producer') {
      connectionQuery = `
        SELECT cr.*, u.Company, u.FullName, u.Email
        FROM ConnectionRequests cr
        INNER JOIN Users u ON cr.ImporterID = u.UserID
        WHERE cr.ProducerID = @UserID
      `;
    } else if (userRole === 'Importer') {
      connectionQuery = `
        SELECT cr.*, u.Company, u.FullName, u.Email
        FROM ConnectionRequests cr
        INNER JOIN Users u ON cr.ProducerID = u.UserID
        WHERE cr.ImporterID = @UserID
      `;
    } else {
      return res.status(403).json({ error: 'Unauthorized role for this operation' });
    }

    const result = await pool
      .request()
      .input('UserID', sql.Int, userID)
      .query(connectionQuery);

    res.status(200).json({ data: result.recordset });
  } catch (err) {
    console.error('Failed to fetch connection requests:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getPublishedWines = async (req, res, next) => {
  try {
    const importerID = req.user.UserID;

    const pool = await connectToDatabase();

    if (!pool) {
      console.error('Database connection failed: pool is undefined');
      return res.status(500).json({ error: 'Database connection failed' });
    }

    if (!req.user || !importerID) {
      return res
        .status(401)
        .json({ error: 'User not authenticated or UserID not available' });
    }

    const publishedWinesQuery = `
      SELECT w.* FROM Wines w
        INNER JOIN ConnectionRequests cr ON w.UserID = cr.ProducerID
          WHERE cr.ImporterID = @ImporterID 
          AND cr.Status = 'ACCEPTED'
          AND w.IsPublished = 1
      `;

    // Get all published wines from producers that have accepted connections with this importer
    const publishedWinesResult = await pool
      .request()
      .input('ImporterID', sql.Int, importerID)
      .query(publishedWinesQuery);

    res.status(200).json(publishedWinesResult.recordset);
  } catch (error) {
    console.error('Failed to fetch published wines from producers:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const getPublishedWine = async (req, res, next) => {
  const { wineID } = req.params;
  const importerID = req.user.UserID;

  try {
    const pool = await connectToDatabase();

    if (!pool) {
      console.error('Database connection failed: pool is undefined');
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const query = `
      SELECT w.* FROM Wines w
      INNER JOIN ConnectionRequests cr ON w.UserID = cr.ProducerID
      WHERE w.WineID = @WineID
        AND cr.ImporterID = @ImporterID 
        AND cr.Status = 'ACCEPTED'
        AND w.IsPublished = 1
    `;

    const result = await pool
      .request()
      .input('WineID', sql.Int, wineID)
      .input('ImporterID', sql.Int, importerID)
      .query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Wine not found or not accessible' });
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

// const getConnected
