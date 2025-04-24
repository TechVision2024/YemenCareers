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
import { 
    JobInformaionInterface, 
    SearchJobInterface, 
    UpdateJobReturnInterface, 
    YourJobInterface 
} from './interfaces';
import { JobStatus } from './enums/job-status.enum';
import { UpdateJobDto } from './dtos/update.dto';
import { FiltersDto } from './dtos/filters.dto';
import { UserRoleEnum } from 'src/user/enums/role.enum';

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
            company_image: job.user.profile_image_url,
            company_name: job.user.name,
            remaining_days: Math.round(
                // 1d = 86,400,000ms
                ( (new Date(job.end_date)).getTime() - (new Date()).getTime() )/86400000
            ),
        };
        jobInfo.status = (jobInfo.remaining_days <= 0) ? JobStatus.CLOSE : JobStatus.OPEN;
        return jobInfo;
    }

    async yourJob(start: number, end: number, user: UserEntity): Promise<YourJobInterface[]> {
        if ( start < 0 || end < 0 || start > end || end - start > 50) 
            throw new BadRequestException('Invalid start or end point!');
        const jobs: JobEntity[] = await this.jobRepository.find({
            where: {userId: user.id},
            skip: start,
            take: end - start
        });
        if (jobs.length < 1) throw new NotFoundException();
        let formatedJobs: YourJobInterface[] = [];
        for (let job of jobs) {
            let remaining_days = Math.round(
                // 1d = 86,400,000ms
                ( (new Date(job.end_date)).getTime() - (new Date()).getTime() )/86400000
            )
            formatedJobs.push({
                ...omitObjectKeys(job, ['body', 'user', 'userId', 'updated_at', 'apply_url']),
                company_image: user.profile_image_url,
                remaining_days,
                status: (remaining_days <= 0) ? JobStatus.CLOSE : JobStatus.OPEN
            })
        }
        return formatedJobs;
    }

    async search(filters: FiltersDto, start: number, end: number): Promise<SearchJobInterface[]> {
        if ( start < 0 || end < 0 || start > end || end - start > 50) 
            throw new BadRequestException('Invalid start or end point!');
        const query = `
            SELECT 
                jobs.id,
                jobs.title,
                jobs.type,
                jobs.department,
                jobs.end_date,
                jobs.created_at,
                jobs.city,
                users.name AS company_name,
                users.profile_image_url AS company_image
            FROM jobs
            LEFT JOIN users ON users.id = jobs."userId"
            WHERE
                jobs.title      ILIKE $1 AND
                jobs.type       ILIKE $2 AND
                jobs.department ILIKE $3 AND
                jobs.end_date   >=    $4 AND
                jobs.created_at >=    $5 AND
                jobs.city       ILIKE $6 AND
                users.name      ILIKE $7    
            ORDER BY jobs.end_date ASC
            LIMIT  $8 
            OFFSET $9
        `;
        const jobs: SearchJobInterface[] = await this.jobRepository.query(
            query,
            [
                filters?.title        ? `%${filters.title}%`        : "%%",
                filters?.type         ? `%${filters.type}%`         : "%%",
                filters?.department   ? `%${filters.department}%`   : "%%",
                filters?.end_date     ? `${ filters.end_date}`      : "2000-01-01",
                filters?.created_at   ? `${ filters.created_at}`    : "2000-01-01",
                filters?.city         ? `%${filters.city}%`         : "%%",
                filters?.company_name ? `%${filters.company_name}%` : "%%",
                end - start,
                start
            ]
        );
        if (jobs.length < 1) throw new NotFoundException();
        jobs.map( (job) => { 
            let remaining_days = Math.round(
                // 1d = 86,400,000ms
                ( (new Date(job.end_date)).getTime() - (new Date()).getTime() )/86400000
            )
            job.remaining_days = remaining_days;
            job.status = (remaining_days <= 0) ? JobStatus.CLOSE : JobStatus.OPEN;
        });
        return jobs;
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

    async delete(id: number, user: UserEntity): Promise<void> {
        let serchForm = {};
        if (user.role === UserRoleEnum.ADMIN) {
            serchForm = { id };
        } else {
            serchForm = { id, userId: user.id };
        }
        const {affected} = await this.jobRepository.delete(serchForm);
        if (affected<1) throw new NotFoundException();
        this.logger.log(`${user.name} deleted job with id '${id}'`);
        return;
    }
}
