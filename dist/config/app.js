"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
exports.appConfig = {
    port: Number(process.env.PORT) || 3000,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/finance_dashboard',
    jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d'
};
