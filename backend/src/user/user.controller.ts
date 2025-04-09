import { 
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
    UseGuards
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { GetUser } from './decorators/get-user.decorator';
import { UserEntity } from './entities/user.entity';

@Controller('user')
export class UserController {
    private readonly logger: Logger = new Logger('UserController', {timestamp: true});
    private readonly API_BASE: string = "api/v1/user";

    @Post('register')
    create(
        @Res() res: Response
    ) {
        this.logger.log(`POST '${this.API_BASE}/register'`);
        res.send('register');
    }

    @Post('login')
    login(
        @Res() res: Response
    ) {
        this.logger.log(`POST '${this.API_BASE}/login'`);
        res.send('login');
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
