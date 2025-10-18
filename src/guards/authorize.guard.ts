import { RequestUser } from '@app/interfaces/request.interface';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: RequestUser = context.switchToHttp().getRequest();

    const authorizedPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!authorizedPermissions) {
      return true; // Allow access if no permissions are specified
    }

    // if (!hasRequiredPermission) {
    //   throw new UnauthorizedException(
    //     `Access Denied - Missing Permissions ${authorizedPermissions[0].split('.')[0]}`,
    //   );
    // }
    return true;
  }
}
