import express from 'express';
import { protect } from '../middleware/authorization.mjs';
import {
  createConnectionRequest,
  getConnectionRequests,
  getPublishedWine,
  getPublishedWines,
  updateConnectionStatus,
} from '../controllers/connectionController.mjs';

const router = express.Router();

router.post('/request', protect, createConnectionRequest);
router.put('/status/:id', protect, updateConnectionStatus);
router.get('/requests', protect, getConnectionRequests);
router.get('/published/wines', protect, getPublishedWines);
router.get('/published/wine/:wineID', protect, getPublishedWine);

export default router;
