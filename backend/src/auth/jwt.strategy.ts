import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayloadInterface } from "./interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor( 
        // 
        @Inject(ConfigService) configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('YEMENCAREERS_JWT_SECREAT')
        })
    }

    async validate( payload: JwtPayloadInterface ) {
        return;
    }
}