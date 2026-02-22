import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Frigideira API',
      version: '1.0.0',
      description: 'API para o sistema de pedidos do restaurante Frigideira.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3333}`,
        description: 'Servidor de Desenvolvimento',
      },
    ],
    components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
  },
  apis: [
    path.join(__dirname, '../routes/*.ts'), 
    path.join(__dirname, '../schemas/*.ts')
], 
};

export const swaggerSpec = swaggerJsdoc(options);
