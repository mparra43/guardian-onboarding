import { ApiProperty } from '@nestjs/swagger';
import { OnboardingStatus } from '@domain/entities/onboarding.entity';

export class OnboardingResponseDto {
  @ApiProperty({
    description: 'ID único del onboarding',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  onboardingId: string;

  @ApiProperty({
    description: 'Estado del onboarding',
    enum: OnboardingStatus,
    example: OnboardingStatus.REQUESTED,
  })
  status: OnboardingStatus;

  constructor(onboardingId: string, status: OnboardingStatus) {
    this.onboardingId = onboardingId;
    this.status = status;
  }
}
