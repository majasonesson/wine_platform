import express from 'express';
import {
  addWine,
  updateWine,
  deleteWine,
  listWines,
  getWine,
  getQRCode,
  updateIsPublishedWine,
} from '../controllers/wineController.mjs';
import { protect } from '../middleware/authorization.mjs';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post(
  '/addWine',
  protect,
  upload.fields([
    { name: 'image', maxCount: 1 }, // Single main wine image
    { name: 'sustainabilityImages', maxCount: 5 }, // Multiple sustainability images
    { name: 'documents', maxCount: 5 },
  ]),
  addWine
);
router.put(
  '/updateWine/:id',
  protect,
  upload.fields([
    { name: 'image', maxCount: 1 }, // Single main wine image
    { name: 'sustainabilityImages', maxCount: 5 }, // Multiple sustainability images
    { name: 'documents', maxCount: 5 },
  ]),
  updateWine
); // PUT REQUEST to update wine data
router.put(
  '/updateIsPublished/:id',
  protect,
  upload.fields([{ name: 'isPublished' }]),
  updateIsPublishedWine
); // PUT REQUEST to update wine data
router.delete('/deleteWine/:id', protect, deleteWine); // DELETE request to delete wine
router.get('/', protect, listWines); // Fetches all wines
router.get('/wine/:id', getWine); // fetches wine by id
router.get('/wine/qrCode/:id', getQRCode); // fetches qr code by id

export default router;
