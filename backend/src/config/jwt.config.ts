
import { ConfigModule, ConfigService } from '@nestjs/config';
import {JwtModuleAsyncOptions} from '@nestjs/jwt';

export const jwtConfig: JwtModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        return {
            secret: configService.get<string>("YEMENCAREERS_JWT_SECREAT"),
            signOptions: {
                expiresIn: configService.get<string>("YEMENCAREERS_JWT_EXPIRESIN")
            }
        }
    }
}