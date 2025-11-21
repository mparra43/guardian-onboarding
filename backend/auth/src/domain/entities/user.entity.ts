export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly password: string,
    public readonly email: string,
  ) {}

  isValid(): boolean {
    return !!(this.id && this.username && this.password && this.email);
  }
}
