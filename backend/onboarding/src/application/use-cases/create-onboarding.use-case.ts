import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import type { OnboardingRepositoryInterface } from '@domain/repositories/onboarding.repository.interface';
import { ONBOARDING_REPOSITORY } from '@domain/repositories/onboarding.repository.interface';
import { OnboardingEntity } from '@domain/entities/onboarding.entity';
import { CreateOnboardingDto } from '../dto/create-onboarding.dto';
import { OnboardingResponseDto } from '../dto/onboarding-response.dto';

@Injectable()
export class CreateOnboardingUseCase {
  constructor(
    @Inject(ONBOARDING_REPOSITORY)
    private readonly onboardingRepository: OnboardingRepositoryInterface,
  ) {}

  async execute(dto: CreateOnboardingDto): Promise<OnboardingResponseDto> {
    const onboardingId = uuidv4();

    const onboarding = OnboardingEntity.create(
      onboardingId,
      dto.nombre,
      dto.documento,
      dto.email,
      dto.montoInicial,
    );

    const savedOnboarding = await this.onboardingRepository.save(onboarding);

    return new OnboardingResponseDto(
      savedOnboarding.id,
      savedOnboarding.status,
    );
  }
}
