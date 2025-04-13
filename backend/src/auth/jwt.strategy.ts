import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayloadInterface } from "./interface";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { UserStatus } from "src/user/enums/status.enum";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor( 
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @Inject(ConfigService) configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('YEMENCAREERS_JWT_SECREAT')
        })
    }

    async validate( payload: JwtPayloadInterface ) {
        const { email } = payload;
        const user = await this.userRepository.findOne({where: {email}});
        if ( !user || user.status == UserStatus.INACTIVE )
            throw new UnauthorizedException("User NOT found!");
        return user;
    }
}