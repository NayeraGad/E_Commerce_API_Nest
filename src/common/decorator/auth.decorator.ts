import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard, RolesGuard, UserRoles } from '../index.js';

export function Auth(...roles: UserRoles[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
  );
}
