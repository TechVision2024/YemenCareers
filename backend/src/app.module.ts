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

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    TypeOrmModule.forRootAsync(typeormConfig),
    ServeStaticModule.forRoot(ServeStaticConfig),
    AuthModule,
    UserModule,
    JobModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
