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
    Query, 
    UseGuards, 
    ValidationPipe
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';
import { JobService } from './job.service';
import { CreateJobDto } from './dtos/create.dto';

@Controller('job')
export class JobController {
    private readonly logger: Logger = new Logger('JobController', {timestamp: true});
    private readonly API_BASE: string = 'api/v1/job';

    constructor(
        private jobService: JobService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('create')
    create(
        @Body(ValidationPipe) createJobDto: CreateJobDto,
        @GetUser() user: UserEntity
    ) {
        this.logger.log(`POST '${this.API_BASE}/create'.`);
        return this.jobService.create(createJobDto, user);
    }
    
    @Get('info/:id')
    information(
        @Param('id', ParseIntPipe) id: number
    ) {
        this.logger.log(`GET '${this.API_BASE}/info/${id}'.`);
        return this.jobService.jobInofrmation(id);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('your')
    yourJobs(
        @Query('s', ParseIntPipe) start: number,
        @Query('e', ParseIntPipe) end: number,
        @GetUser() user: UserEntity
    ) {
        this.logger.log(`GET '${this.API_BASE}/your?s=${start}&e=${end}'.`);
        return 'your';
    }
    
    @Get()
    getSomeJobs(
        @Query('s', ParseIntPipe) start: number,
        @Query('e', ParseIntPipe) end: number,
    ) {
        this.logger.log(`GET '${this.API_BASE}?s=${start}&e=${end}'.`);
        return 'job';
    }
    
    @UseGuards(JwtAuthGuard)
    @Patch('update/:id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: UserEntity
    ) {
        this.logger.log(`PATCH '${this.API_BASE}/update/${id}'.`);
        return `update/${id}`;
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    delete(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: UserEntity
    ) {
        this.logger.log(`DELETE '${this.API_BASE}/delete/${id}'.`);
        return `delete/${id}`;
    }
}
