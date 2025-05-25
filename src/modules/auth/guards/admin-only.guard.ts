import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      throw new ForbiddenException('User not found in request');
    }
    
    if (user.role !== 'admin') {
      throw new ForbiddenException('Access denied: Admin role required');
    }
    
    return true;
  }
}
