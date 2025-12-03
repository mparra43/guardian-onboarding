import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'guardian-secret-key-change-in-production',
  expiresIn: '5m',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'guardian-refresh-secret-key-change-in-production',
  refreshExpiresIn: '7d',
}));
