import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
    imports: [
        // TODO: Add job entity
        AuthModule
    ],
    providers: [JwtStrategy]
})
export class JobModule {}
