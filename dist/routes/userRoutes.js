"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const roleMiddleware_1 = __importDefault(require("../middleware/roleMiddleware"));
const validateRequest_1 = __importDefault(require("../middleware/validateRequest"));
const requireActiveUser_1 = __importDefault(require("../middleware/requireActiveUser"));
const router = (0, express_1.Router)();
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
router.get('/', authMiddleware_1.default, requireActiveUser_1.default, (0, roleMiddleware_1.default)(['admin']), userController_1.getUsers);
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
router.patch('/:userId/deactivate', authMiddleware_1.default, requireActiveUser_1.default, (0, roleMiddleware_1.default)(['admin']), [(0, express_validator_1.param)('userId').isMongoId().withMessage('Invalid user id')], validateRequest_1.default, userController_1.deactivateUser);
exports.default = router;
