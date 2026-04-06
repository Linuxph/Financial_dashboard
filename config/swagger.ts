import path from 'path';
import { Options } from 'swagger-jsdoc';

const routeFiles = [
  path.join(__dirname, '../routes/*.ts'),
  path.join(__dirname, '../routes/*.js')
];

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Dashboard API',
      version: '1.0.0',
      description: 'API documentation for Finance Data Processing and Access Control Dashboard'
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: routeFiles
};
