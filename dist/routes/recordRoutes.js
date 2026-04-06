"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const recordController_1 = require("../controllers/recordController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const roleMiddleware_1 = __importDefault(require("../middleware/roleMiddleware"));
const validateRequest_1 = __importDefault(require("../middleware/validateRequest"));
const finance_1 = require("../config/finance");
const requireActiveUser_1 = __importDefault(require("../middleware/requireActiveUser"));
const router = (0, express_1.Router)();
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
router.get('/', authMiddleware_1.default, requireActiveUser_1.default, [
    (0, express_validator_1.query)('type').optional().isIn(['income', 'expense']).withMessage('Invalid type'),
    (0, express_validator_1.query)('category').optional().isIn(finance_1.financeConfig.categories).withMessage('Invalid category'),
    (0, express_validator_1.query)('startDate').optional().isISO8601().withMessage('Invalid startDate'),
    (0, express_validator_1.query)('endDate').optional().isISO8601().withMessage('Invalid endDate'),
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Invalid page'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Invalid limit')
], validateRequest_1.default, recordController_1.listFinancialRecords);
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
router.post('/', authMiddleware_1.default, requireActiveUser_1.default, (0, roleMiddleware_1.default)(['admin']), [
    (0, express_validator_1.body)('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
    (0, express_validator_1.body)('type').isIn(['income', 'expense']).withMessage('Invalid type'),
    (0, express_validator_1.body)('category').isIn(finance_1.financeConfig.categories).withMessage('Invalid category'),
    (0, express_validator_1.body)('date')
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
    (0, express_validator_1.body)('notes').optional().isString().isLength({ max: 500 })
], validateRequest_1.default, recordController_1.createFinancialRecord);
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
router.patch('/:recordId', authMiddleware_1.default, requireActiveUser_1.default, (0, roleMiddleware_1.default)(['admin']), [
    (0, express_validator_1.param)('recordId').isMongoId().withMessage('Invalid record id'),
    (0, express_validator_1.body)('amount').optional().isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
    (0, express_validator_1.body)('type').optional().isIn(['income', 'expense']),
    (0, express_validator_1.body)('category').optional().isIn(finance_1.financeConfig.categories).withMessage('Invalid category'),
    (0, express_validator_1.body)('date')
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
    (0, express_validator_1.body)('notes').optional().isString().isLength({ max: 500 })
], validateRequest_1.default, recordController_1.updateFinancialRecord);
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
router.delete('/:recordId', authMiddleware_1.default, requireActiveUser_1.default, (0, roleMiddleware_1.default)(['admin']), [(0, express_validator_1.param)('recordId').isMongoId().withMessage('Invalid record id')], validateRequest_1.default, recordController_1.deleteFinancialRecord);
exports.default = router;
