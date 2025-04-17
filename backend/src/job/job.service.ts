import { 
    BadRequestException,
    Injectable, 
    Logger, 
    NotFoundException, 
    UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobEntity } from './entities/job.entity';
import { Repository } from 'typeorm';
import { CreateJobDto } from './dtos/create.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { omitObjectKeys } from 'src/utils/omit.util';
import { JobInformaionInterface, UpdateJobReturnInterface } from './interfaces';
import { JobStatus } from './enums/job-status.enum';
import { UpdateJobDto } from './dtos/update.dto';

@Injectable()
export class JobService {
    private readonly logger: Logger = new Logger('JobService', {timestamp: true});
    constructor(
        @InjectRepository(JobEntity) private jobRepository: Repository<JobEntity>
    ) {}

    async create( createJobDto: CreateJobDto, user: UserEntity ): Promise<JobEntity> {
        const job = this.jobRepository.create();
        Object.assign(job, createJobDto);
        job.user = user;
        this.logger.log(`${user.name} created new job.`);
        return omitObjectKeys(await job.save(), ['user']) as JobEntity;
    }

    async jobInofrmation(id: number): Promise<JobInformaionInterface> {
        const job = await this.jobRepository.findOne({
            where: {id},
            relations: ['user']
        });
        if (!job) throw new NotFoundException();
        let jobInfo: JobInformaionInterface = {
            ...omitObjectKeys(job, ['user', 'userId' ]),
            compnay_image: job.user.profile_image_url,
            compnay_name: job.user.name,
            remaining_days: Math.round(
                // 1d = 86,400,000ms
                ( (new Date(job.end_date)).getTime() - (new Date()).getTime() )/86400000
            ),
            state: JobStatus.CLOSE
        };
        jobInfo.state = (jobInfo.remaining_days <= 0) ? JobStatus.CLOSE : JobStatus.OPEN;
        return jobInfo;
    }

    async update(
        id: number,
        updateJobDto: UpdateJobDto,
        user: UserEntity
    ): Promise<UpdateJobReturnInterface> {
        if (!updateJobDto) throw new BadRequestException("Invalid body!");
        const updateJobDtoKeys: string[] = Object.keys(updateJobDto);
        const updatefields: string[] = [ 
            'title', 'body', 'type',
            'department', 'end_date', 'city',
            'apply_url',
        ];
        if (
            updateJobDtoKeys.length > updatefields.length ||
            updateJobDtoKeys.length < 1 ||
            !updateJobDtoKeys.every( (key) => updatefields.includes(key) ) 
        ) throw new BadRequestException("Invalid body!");
        const job = await this.jobRepository.findOne({where: {id}});
        if (!job) throw new NotFoundException();
        if (job.userId != user.id) throw new UnauthorizedException();
        Object.assign(job, updateJobDto);
        await job.save();
        this.logger.log(`${user.name} updated job '${job.id}'.`);
        return { id: job.id };
    }
}
