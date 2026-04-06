import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss';
import connectDB from './db/connect';
import { loadEnv } from './config/env';
import { appConfig } from './config/app';
import { swaggerOptions } from './config/swagger';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import recordRoutes from './routes/recordRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import loggerMiddleware from './middleware/logger';
import notFoundMiddleware from './middleware/notFound';
import errorHandlerMiddleware from './middleware/errorHandler';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

loadEnv();

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP, please try again later.'
  }
});

const sanitizeValue = (value: unknown): unknown => {
  if (typeof value === 'string') {
    return xss(value);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, sanitizeValue(nestedValue)])
    );
  }

  return value;
};

const sanitizeObjectInPlace = (target: unknown) => {
  if (!target || typeof target !== 'object' || Array.isArray(target)) {
    return;
  }

  const sanitizedEntries = Object.entries(target).map(([key, value]) => [key, sanitizeValue(value)]);
  Object.assign(target, Object.fromEntries(sanitizedEntries));
};

const xssSanitizer: express.RequestHandler = (req, _res, next) => {
  req.body = sanitizeValue(req.body);
  sanitizeObjectInPlace(req.query);
  sanitizeObjectInPlace(req.params);
  next();
};

app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(apiLimiter);
app.use(xssSanitizer);
app.use(loggerMiddleware);

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.get('/swagger.json', (_req, res) => res.json(swaggerSpec));
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'Finance API Docs'
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const startServer = async () => {
  await connectDB(appConfig.mongoUri);
  app.listen(appConfig.port, () => {
    console.log(`Server listening on port ${appConfig.port}`);
  });
};

startServer();


