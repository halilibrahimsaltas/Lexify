import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { UserRole } from '../../common/enum/user-role.enum';
  
  // Temporary test user data
  const mockUser = {
    id: 1,
    name: 'Test Admin',
    role: UserRole.ADMIN,
  };
  
  @Injectable()
  export class AdminGuard implements CanActivate {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = mockUser; // Will be replaced with real authentication
  
      // Check if user exists and has admin privileges
      if (!user || (user.role !== UserRole.ADMIN )) {
        throw new ForbiddenException('This action requires admin privileges.');
      }
  
      
      return true;
    }
  }
  
