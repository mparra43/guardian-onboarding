export enum OnboardingStatus {
  REQUESTED = 'REQUESTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export class OnboardingEntity {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly documento: string,
    public readonly email: string,
    public readonly montoInicial: number,
    public readonly status: OnboardingStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(
    id: string,
    nombre: string,
    documento: string,
    email: string,
    montoInicial: number,
  ): OnboardingEntity {
    return new OnboardingEntity(
      id,
      nombre,
      documento,
      email,
      montoInicial,
      OnboardingStatus.REQUESTED,
      new Date(),
      new Date(),
    );
  }
}
