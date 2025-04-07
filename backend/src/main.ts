import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api/v1');
  app.use(cookieParser());
  app.enableCors({
    origin: configService.get<string>("YEMENCAREERS_APP_FRONTEND_URL"),
    credentials: true
  })
  const logger = new Logger("bootstrap", {timestamp: true});
  const PORT = Number.parseInt(configService.get<string>("YEMENCAREERS_APP_PROT"));
  await app.listen(PORT, () => logger.log(`App running on prot: ${PORT}`) );
}
bootstrap();
