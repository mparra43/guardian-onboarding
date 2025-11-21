import { Injectable } from '@nestjs/common';
import { OnboardingRepositoryInterface } from '@domain/repositories/onboarding.repository.interface';
import { OnboardingEntity } from '@domain/entities/onboarding.entity';

@Injectable()
export class InMemoryOnboardingRepository
  implements OnboardingRepositoryInterface
{
  private onboardings: Map<string, OnboardingEntity> = new Map();

  async save(onboarding: OnboardingEntity): Promise<OnboardingEntity> {
    this.onboardings.set(onboarding.id, onboarding);
    return onboarding;
  }

  async findById(id: string): Promise<OnboardingEntity | null> {
    return this.onboardings.get(id) || null;
  }

  async findAll(): Promise<OnboardingEntity[]> {
    return Array.from(this.onboardings.values());
  }
}
