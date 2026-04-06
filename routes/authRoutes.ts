import { Router } from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser } from '../controllers/authController';
import validateRequest from '../middleware/validateRequest';

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [viewer, analyst, admin]
 *     responses:
 *       201:
 *         description: User registered
 */
router.post(
  '/register',
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 60 })
      .withMessage('Name must be between 2 and 60 characters'),
    body('email')
      .isEmail()
      .withMessage('Valid email is required')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/[a-z]/)
      .withMessage('Password must include a lowercase letter')
      .matches(/[A-Z]/)
      .withMessage('Password must include an uppercase letter')
      .matches(/[0-9]/)
      .withMessage('Password must include a number')
      .matches(/[^A-Za-z0-9]/)
      .withMessage('Password must include a special character'),
    body('role').optional().isIn(['viewer', 'analyst', 'admin']).withMessage('Invalid role')
  ],
  validateRequest,
  registerUser
);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login success
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  loginUser
);

export default router;
