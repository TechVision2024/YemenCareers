import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './config/env.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
