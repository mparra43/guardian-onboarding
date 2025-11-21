export const config = {
  port: process.env.PORT || 3002,
  environment: process.env.NODE_ENV || 'development',
  serviceName: 'products-service',
  apiPrefix: 'api',
  apiVersion: 'v1',
  swagger: {
    title: 'Products API',
    description:
      'Microservicio de gestión de productos con Clean Architecture',
    version: '1.0',
    tag: 'products',
  },
};
