import { 
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn, 
    UpdateDateColumn
} from "typeorm";
import { JobStatus } from "../enums/job-status.enum";
import { UserEntity } from "src/user/entities/user.entity";


@Entity({name: 'jobs'})
export class JobEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 255})
    title: string;

    @Column({type: 'text'})
    body: string;

    @Column({length: 100})
    type: string;

    @Column({length: 100})
    department: string;

    @Column({type: 'timestamp'})
    end_date: Date;

    @Column({length: 100})
    city: string;

    @Column({enum: JobStatus, default: JobStatus.OPEN})
    status: JobStatus;

    @Column()
    apply_url: string;

    @Column()
    userId: number;

    @ManyToOne((_) => UserEntity, (user) => user.jobs, {onDelete: 'CASCADE'})
    user: UserEntity;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date
}