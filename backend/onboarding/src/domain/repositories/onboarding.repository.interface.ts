import { OnboardingEntity } from '../entities/onboarding.entity';

export interface OnboardingRepositoryInterface {
  save(onboarding: OnboardingEntity): Promise<OnboardingEntity>;
  findById(id: string): Promise<OnboardingEntity | null>;
  findAll(): Promise<OnboardingEntity[]>;
}

export const ONBOARDING_REPOSITORY = Symbol('ONBOARDING_REPOSITORY');
