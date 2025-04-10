import { 
    HttpException, 
    HttpStatus, 
    Injectable, 
    InternalServerErrorException, 
    Logger 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadInterface } from 'src/auth/interface';
import { FullUserData } from './interfaces';
import { omitObjectKeys } from 'src/utils/omit.util';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create.dto';
import { promises as fsPromises } from 'fs';
import { join } from 'path';

@Injectable()
export class UserService {
    private readonly logger: Logger = new Logger(UserService.name, {timestamp: true});
    private readonly UPLOADS_BASE: string = '/api/uploads';
    constructor( 
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async create( createUserDto: CreateUserDto, profileImage: Express.Multer.File): Promise<FullUserData> {
        const user: UserEntity = this.userRepository.create();
        Object.assign(user, omitObjectKeys(createUserDto, ['confirmation']));
        user.salt = await bcrypt.genSalt(
            Number.parseInt(
                this.configService.get<string>("YEMENCAREERS_PASSWORD_SALT_RANGE", "12")
            )
        );
        user.password = await bcrypt.hash(createUserDto.password, user.salt);
        user.profile_image_url = `${this.UPLOADS_BASE}/${profileImage.filename}`;
        try {
            return this.formatUserData( await user.save() );
        } catch(error) {
            try {
                // Delete the image if the register failed.
                const filePath = join(__dirname, '../..', profileImage.path);
                await fsPromises.unlink(filePath);
            } catch (error) { }
            if  (error.code == '23505' )
                throw new HttpException(`Email is already registered!`, HttpStatus.FOUND);
            throw new InternalServerErrorException();
        }
    }

    private formatUserData( user: UserEntity ): FullUserData {
        const payload: JwtPayloadInterface = { id: user.id, email: user.email };
        const expiresIn: string = this.configService.get<string>("YEMENCAREERS_JWT_LONG_EXPIRESIN", '3d');
        this.logger.log(`Create tokens for '${user.email}'`);
        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(payload, {expiresIn}),
            user: omitObjectKeys(
                user, 
                ['password', 'salt', 'status']
            ) as UserEntity
        }
    }
}
