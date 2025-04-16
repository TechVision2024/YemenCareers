import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JobEntity } from './entities/job.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { JobController } from './job.controller';
import { JobService } from './job.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([JobEntity, UserEntity]),
        AuthModule
    ],
    providers: [JwtStrategy, JobService],
    controllers: [JobController]
})
export class JobModule {}
