import { IS_PUBLIC_KEY } from '@/decorators/public';
import { Permission } from '@/modules/permission/entities/permission.entity';
import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { isArray, isNotEmptyObject } from 'class-validator';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRequest = <UserByAccessToken>(
    err: any,
    { permissions, ...user }: UserByAccessToken & { permissions: Permission[] },
    info: any,
    context: ExecutionContext,
  ): UserByAccessToken => {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !isNotEmptyObject(user)) {
      throw err || new UnauthorizedException();
    }

    const request: Request = context.switchToHttp().getRequest();

    const targetApiPath = request.route.path;
    const targetMethod = request.method;
    if (
      !isArray(permissions) ||
      !permissions.find((permission) => permission.method === targetMethod && permission.apiPath === targetApiPath)
    ) {
      throw new ForbiddenException();
    }

    return user as UserByAccessToken;
  };
}
