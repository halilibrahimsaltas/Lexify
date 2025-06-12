import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../common/enum/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import {
  CanActivate,
  ExecutionContext,
  
  Injectable,
} from '@nestjs/common';

interface RequestWithUser extends Request {
  user: {
    id: number;
    role: UserRole;
  };
}

@Injectable()
export class OwnerOrRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user, params } = context.switchToHttp().getRequest<RequestWithUser>();
    
    // Eğer kullanıcı kendi verilerine erişmeye çalışıyorsa izin ver
    if (user && params.id && user.id === parseInt(params.id)) {
      return true;
    }

    // Kullanıcının gerekli rollere sahip olup olmadığını kontrol et
    return requiredRoles.some((role) => user.role === role);
  }
}
