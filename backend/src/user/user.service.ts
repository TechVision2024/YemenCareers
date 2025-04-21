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
import { FullUserData, SearchUserInterface } from './interfaces';
import { omitObjectKeys } from 'src/utils/omit.util';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create.dto';
import { UserStatus } from './enums/status.enum';
import { LoginDto } from './dtos/login.dto';
import { UpdateUserInformationDto } from './dtos/update-information.dto';
import { deleteImage } from 'src/utils/delete-image.util';
import { UpdateUserPasswordDto } from './dtos/update-password.dto';
import { DeleteUserDto } from './dtos/delete.dto';

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
        if (!profileImage) throw new BadRequestException({
            messages: ["Profile image NOT found!"],
            error: "Bad Request",
            statusCode: 400
        });
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

    async search(
        name: string|undefined,
        start: number,
        end: number,
        user: UserEntity
    ): Promise<SearchUserInterface[]> {
        if ( start < 0 || end < 0 || start > end || end - start > 50)
            throw new BadRequestException('Invalid start or end point!');
        const query = `
            SELECT
                id,
                name,
                status,
                address,
                email,
                company_type,
                website,
                profile_image_url,
                phone,
                created_at::DATE,
                updated_at::DATE,
                CURRENT_DATE - created_at::DATE AS days_since_creation
            FROM users
            WHERE
                name ILIKE $1
            ORDER BY status DESC, created_at ASC
            LIMIT $2 OFFSET $3;
        `;
        const users: SearchUserInterface[] = await this.userRepository.query(
            query, 
            [name ? `%${name}%` : '%%', end-start, start]
        );
        if (users.length < 1 ) throw new NotFoundException();
        this.logger.log(`Admin '${user.name}' got users.`);
        return users;
    }

    async information(id: number): Promise<UserEntity> {
        const user = await this.userRepository.findOne({where: {id}});
        if (!user || user.status == UserStatus.INACTIVE ) 
            throw new NotFoundException(`User with id '${id}' NOT found!`);
        return omitObjectKeys(
            user, 
            ['password', 'salt', 'role', 'status', 'created_at', 'updated_at']
        ) as UserEntity;
    }

    async setUserAsActive(id: number, user: UserEntity) {
        const {affected} = await this.userRepository.update(id, {status: UserStatus.ACTIVE});
        if ( affected < 1 ) throw new NotFoundException();
        this.logger.log(`'${user.name}' has accepted the register request for the user with id '${id}'.`);
        return;
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

    async delete(deleteUserDto: DeleteUserDto, user: UserEntity): Promise<void> {
        if (
            (await bcrypt.hash(deleteUserDto.password, user.salt)) !== user.password
        ) throw new UnauthorizedException();
        await this.userRepository.delete(user.id);
        this.logger.log(`The user '${user.name}' deleted his account.`);
        return;
    }

    async adminDelete(id: number, user: UserEntity): Promise<void> {
        let {affected} = await this.userRepository.delete(id);
        if (affected < 1) throw new NotFoundException();
        this.logger.log(`'${user.name}' deleted the user with id '${id}'`);
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
