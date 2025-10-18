import { RequestUser } from '@app/interfaces/request.interface';
import { UserService } from '@app/modules/user/services/user.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestUser = context.switchToHttp().getRequest();

    const authorizedPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!authorizedPermissions) {
      return true;
    }
    const user = await this.userService.findUserById(request.user.id);
    if (!user.is_admin) {
      throw new UnauthorizedException(
        `Access Denied - Missing Permissions ${authorizedPermissions[0].split('.')[0]}`,
      );
    }
    return true;
  }
}
