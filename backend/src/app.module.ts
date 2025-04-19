import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './config/env.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ServeStaticConfig } from './config/serve-static.config';
import { JobModule } from './job/job.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { rateLimitConfig } from './config/rate-limit.config';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    TypeOrmModule.forRootAsync(typeormConfig),
    ServeStaticModule.forRoot(ServeStaticConfig),
    ThrottlerModule.forRoot(rateLimitConfig),
    AuthModule,
    UserModule,
    JobModule
  ],
  controllers: [],
  providers: [
    {provide: APP_GUARD, useClass: ThrottlerGuard}
  ],
})
export class AppModule {}
