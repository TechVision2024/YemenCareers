import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "../decorators/roles.decorator";
import { UserEntity } from "../entities/user.entity";

@Injectable() 
export class RolesGuard implements CanActivate {
    private readonly logger: Logger = new Logger('RolesGuard', {timestamp: true});
    constructor( private reflector: Reflector = new Reflector()) {}
    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get(Roles, context.getHandler());
        if (!roles) return true;
        const req = context.switchToHttp().getRequest();
        const user: UserEntity = req.user;
        if( !roles.includes(user.role) ) {
            this.logger.warn(`Cancel access attempt from '${req.ip}' by '${user.email}' !!!`);
            return false;
        }
        return true;
    }
}