import { 
    BadRequestException,
    Body,
    Controller, 
    Delete, 
    Get, 
    Logger, 
    Param, 
    ParseIntPipe, 
    Patch, 
    Post, 
    Query, 
    Req, 
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    ValidationPipe
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { GetUser } from './decorators/get-user.decorator';
import { UserEntity } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dtos/create.dto';
import { UserService } from './user.service';
import { refreshTokenCookieConfig } from 'src/config/cookies.config';
import { omitObjectKeys } from 'src/utils/omit.util';
import { LoginDto } from './dtos/login.dto';
import { UpdateUserInformationDto } from './dtos/update-information.dto';
import { UpdateUserPasswordDto } from './dtos/update-password.dto';
import { DeleteUserDto } from './dtos/delete.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { deleteImage } from 'src/utils/delete-image.util';
import { Throttle } from '@nestjs/throttler';
import { RolesGuard } from './guards/role.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRoleEnum } from './enums/role.enum';

@Controller('user')
export class UserController {
    private readonly logger: Logger = new Logger('UserController', {timestamp: true});
    private readonly API_BASE: string = "api/v1/user";

    constructor(
        private userService: UserService
    ) {}

    @Throttle({default: { limit: 10, ttl: 60*60*1000}}) // 10 requests/hour
    @Post('register')
    @UseInterceptors(FileInterceptor('profileImage'))
    async create(
        @Body() body: any,
        @UploadedFile() profileImage: Express.Multer.File,
        @Res() res: Response
    ) {
        this.logger.log(`POST '${this.API_BASE}/register'`);
        if (!body) throw new BadRequestException();
        const createUserDto = plainToInstance(CreateUserDto, body);
        const error = await validate(createUserDto, {
            skipMissingProperties: false,
            whitelist: true
        })
        if (error.length > 0) {
            deleteImage(profileImage.path);
            let validation_error = []
            for( let err of error) {
                validation_error.push(
                    Object.entries(err.constraints)[0][1]
                )
            }
            throw new BadRequestException({
                messages: validation_error,
                error: "Bad Request",
                statusCode: 400
            });
        }
        const userData = await this.userService.create(createUserDto, profileImage);
        res.cookie('refreshToken', userData.refreshToken, refreshTokenCookieConfig);
        return res.json(
            omitObjectKeys(userData, ['refreshToken'])
        ).status(201);
    }

    @Throttle({default: { limit: 10, ttl: 60*60*1000}}) // 10 requests/hour
    @Post('login')
    async login(
        @Body(ValidationPipe) loginDto: LoginDto,
        @Res() res: Response
    ) {
        this.logger.log(`POST '${this.API_BASE}/login'`);
        const userData = await this.userService.login(loginDto);
        res.cookie('refreshToken', userData.refreshToken, refreshTokenCookieConfig);
        return res.json(
            omitObjectKeys(userData, ['refreshToken'])
        ).status(200);
    }

    @Get('refresh')
    async refresh(
        @Req() req: Request,
        @Res() res: Response
    ) {
        this.logger.log(`POST '${this.API_BASE}/refresh'`);
        const { refreshToken } = req.cookies;
        const userData = await this.userService.refresh(refreshToken);
        res.cookie('refreshToken', userData.refreshToken, refreshTokenCookieConfig );
        res.status(200).json(omitObjectKeys(userData, ['refreshToken']));
    }

    @Post('logout')
    logout(
        @Res() res: Response
    ) {
        this.logger.log(`POST '${this.API_BASE}/logout'`);
        res.cookie('refreshToken', "", {maxAge: 1000, httpOnly: true})
        res.status(200).send();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoleEnum.ADMIN)
    @Get()
    search(
        @Query('name') name: string,
        @Query('s', ParseIntPipe) start: number,
        @Query('e', ParseIntPipe) end: number,
        @GetUser() user : UserEntity
    ) {
        this.logger.log(`GET '${this.API_BASE}?name=${name}&s=${start}&e=${end}'`);
        return this.userService.search(name, start, end, user);
    }

    @Get('info/:id')
    information(
        @Param('id', ParseIntPipe) id: number
    ) {
        this.logger.log(`POST '${this.API_BASE}/info/${id}'`);
        return this.userService.information(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoleEnum.ADMIN)
    @Patch('active/:id')
    setUserAsActive(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: UserEntity
    ) {
        this.logger.log(`PATCH '${this.API_BASE}/active/${id}'`);
        return this.userService.setUserAsActive(id, user);
    }

    @Throttle({default: { limit: 10, ttl: 60*60*1000}}) // 10 requests/hour
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('profileImage'))
    @Patch('update/info')
    async updateInformation(
        @Body(ValidationPipe) updateUserDto: UpdateUserInformationDto,
        @UploadedFile() profileImage: Express.Multer.File,
        @GetUser() user: UserEntity,
        @Res() res: Response
    ) {
        this.logger.log(`POST '${this.API_BASE}/update/info'`);
        const userData = await this.userService
            .updateInformation(
                updateUserDto, 
                user, 
                profileImage
            );
        res.cookie('refreshToken', userData.refreshToken, refreshTokenCookieConfig );
        res.status(200).json(omitObjectKeys(userData, ['refreshToken']));
    }
    
    @Throttle({default: { limit: 5, ttl: 60*60*1000}}) // 5 requests/hour
    @UseGuards(JwtAuthGuard)
    @Patch('update/pass')
    updatePassword(
        @Body(ValidationPipe) updateUserPasswordDto: UpdateUserPasswordDto,
        @GetUser() user: UserEntity,
    ) {
        this.logger.log(`POST '${this.API_BASE}/update/pass'`);
        return this.userService.updatePassword(updateUserPasswordDto, user);
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete('delete')
    async delete(
        @Body(ValidationPipe) deleteUserDto: DeleteUserDto,
        @GetUser() user: UserEntity,
        @Res() res: Response
    ) {
        this.logger.log(`DELETE '${this.API_BASE}/delete'`);
        await this.userService.delete(deleteUserDto, user);
        res.cookie('refreshToken', "", {maxAge: 1000, httpOnly: true})
        res.send().status(200);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoleEnum.ADMIN)
    @Delete('delete/:id')
    adminDelete(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: UserEntity
    ) {
        this.logger.log(`DELETE '${this.API_BASE}/delete/${id}'`);
        return this.userService.adminDelete(id, user);
    }
}
