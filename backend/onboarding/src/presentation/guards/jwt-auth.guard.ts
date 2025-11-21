import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const requestId = request.headers['x-request-id'] || 'no-request-id';

    if (err || !user) {
      this.logger.error(
        `Intento de autenticación fallido [RequestId: ${requestId}] - ${info?.message || 'Token inválido'}`,
      );

      throw (
        err ||
        new UnauthorizedException(
          'No autorizado: Token inválido o expirado',
        )
      );
    }

    this.logger.log(
      `Autenticación exitosa [RequestId: ${requestId}] - Usuario: ${user.userId}`,
    );

    return user;
  }
}
