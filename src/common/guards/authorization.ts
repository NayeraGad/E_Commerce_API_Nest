import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, UserRoles } from '../index';
import { GqlExecutionContext } from '@nestjs/graphql';

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

    let request: any;

    if (context['contextType'] === 'http') {
      request = context.switchToHttp().getRequest();
    } else if (context['contextType'] === 'graphql') {
      request = GqlExecutionContext.create(context).getContext().req;
    }

    const user = request.user;

    if (!requiredRoles.includes(user.role)) {
      throw new BadRequestException('Unauthorized');
    }

    return true;
  }
}
