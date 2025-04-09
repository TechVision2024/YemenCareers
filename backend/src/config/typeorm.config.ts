import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entities/user.entity";


export const typeormConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        const isProduction = configService.get<string>("NODE_ENV") === "production";
        return {
            type: 'postgres',
            host: configService.get<string>("YEMENCAREERS_DATABASE_HOST"),
            port: Number.parseInt(configService.get<string>("YEMENCAREERS_DATABASE_PORT")),
            username: configService.get<string>("YEMENCAREERS_DATABASE_USERNAME"),
            password: configService.get<string>("YEMENCAREERS_DATABASE_PASSWORD"),
            database: configService.get<string>("YEMENCAREERS_DATABASE_NAME"),
            entities: [UserEntity],
            synchronize: configService.get<string>("YEMENCAREERS_DATABASE_SYNC") === "true",
            ssl: isProduction ? { rejectUnauthorized: false } : false
        }
    }
}