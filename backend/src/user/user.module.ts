import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        AuthModule
    ],
    providers: [JwtStrategy],
    controllers: [UserController]
})
export class UserModule {}
