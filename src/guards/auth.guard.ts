import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    // Determine the UserTypes that can execute the called endpoint
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log(roles);

    // Grab the JWT from the request header and verify it

    // Determine request to get user by id

    // Determine if the user has permission
    return true;
  }
}
