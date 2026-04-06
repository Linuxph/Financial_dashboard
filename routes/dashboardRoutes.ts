import { Router } from 'express';
import { fetchDashboardSummary } from '../controllers/dashboardController';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';
import requireActiveUser from '../middleware/requireActiveUser';

const router = Router();

/**
 * @openapi
 * /api/dashboard:
 *   get:
 *     summary: Fetch dashboard summary (analyst or admin)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary fetched
 */
router.get('/', authMiddleware, requireActiveUser, roleMiddleware(['analyst', 'admin']), fetchDashboardSummary);

export default router;
