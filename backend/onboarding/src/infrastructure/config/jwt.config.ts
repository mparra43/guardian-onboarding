import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'guardian-secret-key-change-in-production',
  signOptions: {
    expiresIn: '5m',
  },
}));
