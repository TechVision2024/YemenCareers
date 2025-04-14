import { 
    BadRequestException,
    HttpException, 
    HttpStatus, 
    Injectable, 
    InternalServerErrorException, 
    Logger, 
    NotFoundException,
    UnauthorizedException
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
import { UserStatus } from './enums/status.enum';
import { LoginDto } from './dtos/login.dto';
import { UpdateUserInformationDto } from './dtos/update-information.dto';
import { deleteImage } from 'src/utils/delete-image.util';
import { UpdateUserPasswordDto } from './dtos/update-password.dto';

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
            deleteImage(profileImage.path);
            if  (error.code == '23505' )
                throw new HttpException(`Email is already registered!`, HttpStatus.FOUND);
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }

    async login( loginDto: LoginDto ): Promise<FullUserData> {
        const user = await this.userRepository.findOne({ where: {email: loginDto.email}});
        if ( !user ) throw new NotFoundException(`User '${loginDto.email}' NOT found!`);
        const loginHashPassword = await bcrypt.hash(loginDto.password, user.salt);
        if ( 
            user.password !== loginHashPassword 
        ) throw new UnauthorizedException("Invalid password!");
        if (
            user.status === UserStatus.INACTIVE
        ) throw new HttpException('User data is under review!', 451);
        this.logger.log(`User '${user.email}' logging.`);
        return this.formatUserData(user);
    }

    async refresh(refreshToken: string|undefined ): Promise<FullUserData> {
        if (!refreshToken) throw new UnauthorizedException();
        try {
            const decoded: JwtPayloadInterface = this.jwtService.verify(refreshToken, {ignoreExpiration: false});
            const user = await this.userRepository.findOne({where: {email: decoded.email} });
            if (!user) throw new UnauthorizedException();
            return this.formatUserData(user);
        } catch( _ ) {
            throw new UnauthorizedException();
        }
    }

    async information(id: number): Promise<UserEntity> {
        const user = await this.userRepository.findOne({where: {id}});
        if (!user || user.status == UserStatus.INACTIVE ) 
            throw new NotFoundException(`User with id '${id}' NOT found!`);
        return omitObjectKeys(
            user, 
            ['password', 'salt', 'role', 'status', 'created_at', 'update_at']
        ) as UserEntity;
    }

    async updateInformation(
            updateUserInformationDto: UpdateUserInformationDto, 
            user: UserEntity,
            profileImage: Express.Multer.File,
        ): Promise<FullUserData> {
        if (! updateUserInformationDto ) throw new BadRequestException("Invalid body!");
        const updateUserDtoKeys: string[] = Object.keys(updateUserInformationDto);
        const updatefields: string[] = [ 
            'name', 'description', 'email',
            'company_type', 'phone', 'address',
            'website', 'social_url_1', 'social_url_2',
            'social_url_3', 'social_url_4'
        ];
        let oldProfileImage: string = "";
        let isInvalidBody: boolean = (
            updateUserDtoKeys.length > updatefields.length ||
            updateUserDtoKeys.length < 1 ||
            !updateUserDtoKeys.every( (key) => updatefields.includes(key) ) 
        );

        if ( isInvalidBody && !profileImage ) throw new BadRequestException("Invalid body!");
        if ( !isInvalidBody ) Object.assign(user, updateUserInformationDto);
        if (profileImage) {
            // Update the profile_image_url
            oldProfileImage = user.profile_image_url;
            user.profile_image_url = `${this.UPLOADS_BASE}/${profileImage.filename}`;
        }
        try {
            let newUser = await user.save() ;
            deleteImage(
                oldProfileImage.replace('api', '') // replace the first 'api' in the path.
            );
            return this.formatUserData(newUser);
        } catch(error) {
            if (profileImage) { deleteImage(profileImage.path); }
            if  (error.code == '23505' )
                throw new HttpException(`Email is already registered!`, HttpStatus.FOUND);
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }

    async updatePassword(
        updateUserPassword: UpdateUserPasswordDto,
        user: UserEntity
    ): Promise<void> {
        const oldPasswordHash = await bcrypt.hash(updateUserPassword.oldPassword, user.salt);
        if ( oldPasswordHash !== user.password ) throw new UnauthorizedException();
        user.password = await bcrypt.hash(updateUserPassword.password, user.salt);
        await user.save();
        return;
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
