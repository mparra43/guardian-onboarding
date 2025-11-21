import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'guardian-secret-key-change-in-production',
  expiresIn: '5m', 
}));
