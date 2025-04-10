import { 
    BaseEntity, 
    Column, 
    Entity, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn 
} from 'typeorm';
import { UserRoleEnum } from '../enums/role.enum';
import { UserStatus } from '../enums/status.enum';

@Entity({name: 'users'})
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 255})
    name: string;

    @Column({type: 'text'})
    description: string;

    @Column({length: 255, unique: true})
    email: string;

    @Column({length: 255})
    company_type: string;

    @Column({length: 20})
    phone: string;

    @Column({length: 255})
    address: string

    @Column({length: 255, nullable: true})
    website: string;

    @Column({length: 255, nullable: true})
    social_url_1: string;

    @Column({length: 255, nullable: true})
    social_url_2: string;

    @Column({length: 255, nullable: true})
    social_url_3: string;

    @Column({length: 255, nullable: true})
    social_url_4: string;

    @Column({type: 'text'})
    password: string;

    @Column({enum: UserStatus, default: UserStatus.INACTIVE})
    status: UserStatus;

    @Column({type: 'text'})
    salt: string;

    @Column({type: 'text', nullable: true})
    profile_image_url: string;

    @Column({enum: UserRoleEnum, default: UserRoleEnum.USER})
    role: UserRoleEnum;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn()
    update_at: Date
}
