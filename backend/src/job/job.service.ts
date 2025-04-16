import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobEntity } from './entities/job.entity';
import { Repository } from 'typeorm';
import { CreateJobDto } from './dtos/create.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { omitObjectKeys } from 'src/utils/omit.util';

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
}
