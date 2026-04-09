import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<('PASSENGER' | 'DRIVER')[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No specific role required, so allow access
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
       // Should not really happen if JwtAuthGuard is correctly used before RolesGuard
       throw new ForbiddenException('Acess denied: No user role found');
    }

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
       throw new ForbiddenException(`Access denied: Requires one of these roles: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
