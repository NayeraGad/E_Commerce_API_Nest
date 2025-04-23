import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, UserRoles } from '../index';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRoles[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRoles.length) {
      throw new BadRequestException('Roles are required');
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!requiredRoles.includes(user.role)) {
      throw new BadRequestException('Unauthorized');
    }

    return true;
  }
}
