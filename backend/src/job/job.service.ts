import { 
    Injectable, 
    Logger, 
    NotFoundException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobEntity } from './entities/job.entity';
import { Repository } from 'typeorm';
import { CreateJobDto } from './dtos/create.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { omitObjectKeys } from 'src/utils/omit.util';
import { JobInformaionInterface } from './interfaces';
import { JobStatus } from './enums/job-status.enum';

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
}
