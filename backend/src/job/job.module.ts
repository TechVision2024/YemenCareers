import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JobEntity } from './entities/job.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([JobEntity, UserEntity]),
        AuthModule
    ],
    providers: [JwtStrategy]
})
export class JobModule {}
