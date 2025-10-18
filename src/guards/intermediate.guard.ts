import { RequestUser } from '@app/interfaces/request.interface';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class IntermediateGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request: RequestUser = context.switchToHttp().getRequest();

    request.forwardedFrom = 'intermediate';
    return true;
  }
}
