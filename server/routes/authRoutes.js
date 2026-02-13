import express from 'express';
import { body } from 'express-validator';
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  addResume,
  getResumes,
  deleteResume,
  saveJob,
  updateJobStatus,
  connectGitHub
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';

const router = express.Router();

// ============================================
// Public Routes
// ============================================

// Register validation
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validateRequest
];

// Login validation
const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest
];

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);

// ============================================
// Protected Routes (Require Authentication)
// ============================================

// User profile
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Resume history
router.post('/resume', protect, addResume);
router.get('/resumes', protect, getResumes);
router.delete('/resume/:id', protect, deleteResume);

// Job tracking
router.post('/save-job', protect, saveJob);
router.put('/job/:id', protect, updateJobStatus);

// GitHub integration
router.post('/github', protect, connectGitHub);

export default router;
