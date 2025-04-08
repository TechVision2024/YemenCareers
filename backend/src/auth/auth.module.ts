import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConfig } from 'src/config/jwt.config';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.registerAsync(jwtConfig),
        // TODO: Add TypeORM and User Entity.
    ],
    providers: [JwtStrategy],
    exports: [JwtModule]
})
export class AuthModule {}
