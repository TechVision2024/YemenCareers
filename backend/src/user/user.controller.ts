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
        res.cookie('refrshToken', userData.refreshToken, refreshTokenCookieConfig);
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
        res.cookie('refrshToken', userData.refreshToken, refreshTokenCookieConfig);
        return res.json(
            omitObjectKeys(userData, ['refreshToken'])
        ).status(200);
    }

    @Get('refresh')
    refresh(
        @Req() req: Request,
        @Res() res: Response
    ) {
        this.logger.log(`POST '${this.API_BASE}/refresh'`);
        res.send('refresh');
    }

    @Post('logout')
    logout(
        @Res() res: Response
    ) {
        this.logger.log(`POST '${this.API_BASE}/logout'`);
        res.send('logout');
    }

    @Get('info/:id')
    information(
        @Param('id', ParseIntPipe) id: number
    ) {
        this.logger.log(`POST '${this.API_BASE}/info/${id}'`);
        return `info/${id}`;
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update/info')
    updateInformation(
        @GetUser() user: UserEntity,
        @Res() res: Response
    ) {
        this.logger.log(`POST '${this.API_BASE}/update/info'`);
        res.send('update/info');
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
