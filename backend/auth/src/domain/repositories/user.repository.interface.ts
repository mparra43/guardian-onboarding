import { User } from '../entities/user.entity';

export interface IUserRepository {
  /**
   * @param username - Nombre de usuario
   * @returns Usuario encontrado o null
   */
  findByUsername(username: string): Promise<User | null>;

  /**
   * @param id - ID del usuario
   * @returns Usuario encontrado o null
   */
  findById(id: string): Promise<User | null>;
}

export const USER_REPOSITORY = Symbol('IUserRepository');
