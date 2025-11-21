import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  constructor() {
    this.seedUsers();
  }

  private async seedUsers(): Promise<void> {
    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('admin2024', 10);
    const hashedPassword3 = await bcrypt.hash('test1234', 10);

    this.users = [
      new User('1', 'admin', hashedPassword1, 'admin@guardian.com'),
      new User('2', 'usuario', hashedPassword2, 'usuario@guardian.com'),
      new User('3', 'test', hashedPassword3, 'test@guardian.com'),
    ];
  }

  /**
   * @param username - Nombre de usuario
   * @returns Usuario encontrado o null
   */
  async findByUsername(username: string): Promise<User | null> {
    const user = this.users.find((u) => u.username === username);
    return user || null;
  }

  /**
   * @param id - ID del usuario
   * @returns Usuario encontrado o null
   */
  async findById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    return user || null;
  }
}
