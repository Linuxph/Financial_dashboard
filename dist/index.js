"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const xss_1 = __importDefault(require("xss"));
const connect_1 = __importDefault(require("./db/connect"));
const env_1 = require("./config/env");
const app_1 = require("./config/app");
const swagger_1 = require("./config/swagger");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const recordRoutes_1 = __importDefault(require("./routes/recordRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const logger_1 = __importDefault(require("./middleware/logger"));
const notFound_1 = __importDefault(require("./middleware/notFound"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
(0, env_1.loadEnv)();
const app = (0, express_1.default)();
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: 'Too many requests from this IP, please try again later.'
    }
});
const sanitizeValue = (value) => {
    if (typeof value === 'string') {
        return (0, xss_1.default)(value);
    }
    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }
    if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([key, nestedValue]) => [key, sanitizeValue(nestedValue)]));
    }
    return value;
};
const xssSanitizer = (req, _res, next) => {
    req.body = sanitizeValue(req.body);
    req.query = sanitizeValue(req.query);
    req.params = sanitizeValue(req.params);
    next();
};
app.use((0, helmet_1.default)());
app.use(express_1.default.json({ limit: '1mb' }));
app.use(apiLimiter);
app.use(xssSanitizer);
app.use(logger_1.default);
const swaggerSpec = (0, swagger_jsdoc_1.default)(swagger_1.swaggerOptions);
app.get('/swagger.json', (_req, res) => res.json(swaggerSpec));
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'Finance API Docs'
}));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/records', recordRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
app.use(notFound_1.default);
app.use(errorHandler_1.default);
const startServer = async () => {
    await (0, connect_1.default)(app_1.appConfig.mongoUri);
    app.listen(app_1.appConfig.port, () => {
        console.log(`Server listening on port ${app_1.appConfig.port}`);
    });
};
startServer();
