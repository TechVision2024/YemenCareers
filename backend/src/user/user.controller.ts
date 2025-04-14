import { 
    Body,
    Controller, 
    Delete, 
    Get, 
    Logger, 
    Param, 
    ParseIntPipe, 
    Patch, 
    Post, 
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

@Controller('user')
export class UserController {
    private readonly logger: Logger = new Logger('UserController', {timestamp: true});
    private readonly API_BASE: string = "api/v1/user";

    constructor(
        private userService: UserService
    ) {}

    @Post('register')
    @UseInterceptors(FileInterceptor('profileImage'))
    async create(
        @Body(ValidationPipe) createUserDto: CreateUserDto,
        @UploadedFile() profileImage: Express.Multer.File,
        @Res() res: Response
    ) {
        this.logger.log(`POST '${this.API_BASE}/register'`);
        const userData = await this.userService.create(createUserDto, profileImage);
        res.cookie('refreshToken', userData.refreshToken, refreshTokenCookieConfig);
        return res.json(
            omitObjectKeys(userData, ['refreshToken'])
        ).status(201);
    }

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

    @Get('info/:id')
    information(
        @Param('id', ParseIntPipe) id: number
    ) {
        this.logger.log(`POST '${this.API_BASE}/info/${id}'`);
        return this.userService.information(id);
    }

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
    
    @UseGuards(JwtAuthGuard)
    @Patch('update/pass')
    updatePassword(
        @GetUser() user: UserEntity,
    ) {
        this.logger.log(`POST '${this.API_BASE}/update/pass'`);
        return 'update/pass';
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete('delete')
    delete(
        @GetUser() user: UserEntity,
        @Req() req: Request,
        @Res() res: Response
    ) {
        this.logger.log(`POST '${this.API_BASE}/delete'`);
        res.send('delete');
    }
}
