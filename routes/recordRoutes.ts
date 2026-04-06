import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  createFinancialRecord,
  updateFinancialRecord,
  deleteFinancialRecord,
  listFinancialRecords
} from '../controllers/recordController';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';
import validateRequest from '../middleware/validateRequest';
import { financeConfig } from '../config/finance';
import requireActiveUser from '../middleware/requireActiveUser';

const router = Router();

/**
 * @openapi
 * /api/records:
 *   get:
 *     summary: List financial records
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Records fetched
 */
router.get(
  '/',
  authMiddleware,
  requireActiveUser,
  [
    query('type').optional().isIn(['income', 'expense']).withMessage('Invalid type'),
    query('category').optional().isIn(financeConfig.categories).withMessage('Invalid category'),
    query('startDate').optional().isISO8601().withMessage('Invalid startDate'),
    query('endDate').optional().isISO8601().withMessage('Invalid endDate'),
    query('page').optional().isInt({ min: 1 }).withMessage('Invalid page'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Invalid limit')
  ],
  validateRequest,
  listFinancialRecords
);

/**
 * @openapi
 * /api/records:
 *   post:
 *     summary: Create a financial record (admin only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - category
 *               - date
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Record created
 */
router.post(
  '/',
  authMiddleware,
  requireActiveUser,
  roleMiddleware(['admin']),
  [
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
    body('type').isIn(['income', 'expense']).withMessage('Invalid type'),
    body('category').isIn(financeConfig.categories).withMessage('Invalid category'),
    body('date')
      .isISO8601()
      .withMessage('Valid date is required')
      .custom((value) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
          throw new Error('Invalid date');
        }
        if (date > new Date()) {
          throw new Error('Date cannot be in the future');
        }
        return true;
      }),
    body('notes').optional().isString().isLength({ max: 500 })
  ],
  validateRequest,
  createFinancialRecord
);

/**
 * @openapi
 * /api/records/{recordId}:
 *   patch:
 *     summary: Update a financial record (admin only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated
 */
router.patch(
  '/:recordId',
  authMiddleware,
  requireActiveUser,
  roleMiddleware(['admin']),
  [
    param('recordId').isMongoId().withMessage('Invalid record id'),
    body('amount').optional().isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
    body('type').optional().isIn(['income', 'expense']),
    body('category').optional().isIn(financeConfig.categories).withMessage('Invalid category'),
    body('date')
      .optional()
      .isISO8601()
      .withMessage('Valid date is required')
      .custom((value) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
          throw new Error('Invalid date');
        }
        if (date > new Date()) {
          throw new Error('Date cannot be in the future');
        }
        return true;
      }),
    body('notes').optional().isString().isLength({ max: 500 })
  ],
  validateRequest,
  updateFinancialRecord
);

/**
 * @openapi
 * /api/records/{recordId}:
 *   delete:
 *     summary: Delete a financial record (admin only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted
 */
router.delete(
  '/:recordId',
  authMiddleware,
  requireActiveUser,
  roleMiddleware(['admin']),
  [param('recordId').isMongoId().withMessage('Invalid record id')],
  validateRequest,
  deleteFinancialRecord
);

export default router;
