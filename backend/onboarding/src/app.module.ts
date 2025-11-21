import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

// Configuration
import jwtConfig from '@infrastructure/config/jwt.config';

// Infrastructure
import { InMemoryOnboardingRepository } from '@infrastructure/adapters/in-memory-onboarding.repository';
import { JwtStrategy } from '@infrastructure/auth/jwt.strategy';

// Application
import { CreateOnboardingUseCase } from '@application/use-cases/create-onboarding.use-case';

// Presentation
import { OnboardingController } from '@presentation/controllers/onboarding.controller';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';

// Domain
import { ONBOARDING_REPOSITORY } from '@domain/repositories/onboarding.repository.interface';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
      envFilePath: '.env',
    }),

    // Passport para autenticación
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JWT Module
    JwtModule.registerAsync({
      useFactory: () => ({
        secret:
          process.env.JWT_SECRET ||
          'guardian-secret-key-change-in-production',
        signOptions: {
          expiresIn: '5m',
        },
      }),
    }),
  ],
  controllers: [OnboardingController],
  providers: [
    // Repositories (con inyección de dependencias)
    {
      provide: ONBOARDING_REPOSITORY,
      useClass: InMemoryOnboardingRepository,
    },

    // Use Cases
    CreateOnboardingUseCase,

    // Auth
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [JwtStrategy, JwtAuthGuard, PassportModule],
})
export class AppModule {}
