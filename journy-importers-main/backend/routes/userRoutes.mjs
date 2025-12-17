import express from 'express';
import {
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  login,
  changePassword,
  getCertifications,
  forgotPassword,
  updateRole,
} from '../controllers/userController.mjs';
import { createPassword } from '../Utilities/sendPasswordToken.mjs';
import multer from 'multer';
import { Certificate } from 'crypto';
import { protect } from '../middleware/authorization.mjs';
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
const router = express.Router();

router.get('/certifications', protect, getCertifications);
router.get('/', getUsers);
router.get('/profile/:id', protect, getUserById);
router.put(
  '/profile/update/:id',
  upload.fields([
    { name: 'certifications', maxCount: 10 },
    { name: 'profileImage', maxCount: 1 },
  ]),
  updateUser
);
router.delete('/delete/:id', deleteUser);
router.put('/change-password/:id', changePassword);
router.post('/request-reset-password', forgotPassword);
router.post('/update/role', updateRole);
router.post('/login', login);
router.put('/createpassword/:token', createPassword);

export default router;
