import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        MulterModule.register(multerConfig),
        AuthModule
    ],
    providers: [JwtStrategy, UserService],
    controllers: [UserController]
})
export class UserModule {}
