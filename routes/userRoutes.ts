import { Router } from 'express';
import { param } from 'express-validator';
import { getUsers, deactivateUser } from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';
import validateRequest from '../middleware/validateRequest';
import requireActiveUser from '../middleware/requireActiveUser';

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: List all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched
 */
router.get('/', authMiddleware, requireActiveUser, roleMiddleware(['admin']), getUsers);

/**
 * @openapi
 * /api/users/{userId}/deactivate:
 *   patch:
 *     summary: Deactivate a user (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deactivated
 */
router.patch(
  '/:userId/deactivate',
  authMiddleware,
  requireActiveUser,
  roleMiddleware(['admin']),
  [param('userId').isMongoId().withMessage('Invalid user id')],
  validateRequest,
  deactivateUser
);

export default router;
