import { 
    BaseEntity, 
    Column, 
    Entity, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn 
} from 'typeorm';
import { UserRoleEnum } from '../enums/role.enum';

@Entity({name: 'users'})
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 255})
    name: string;

    @Column({type: 'text'})
    description: string;

    @Column({length: 255})
    email: string;

    @Column({length: 255})
    company_type: string;

    @Column({length: 20})
    phone: string;

    @Column({length: 255})
    address: string

    @Column({length: 255})
    website: string;

    @Column({length: 255})
    social_url_1: string;

    @Column({length: 255})
    social_url_2: string;

    @Column({length: 255})
    social_url_3: string;

    @Column({length: 255})
    social_url_4: string;

    @Column({type: 'text'})
    password: string;

    @Column({type: 'text'})
    salt: string;

    @Column({type: 'text'})
    profile_image_url: string;

    @Column({enum: UserRoleEnum, default: UserRoleEnum.USER})
    role: UserRoleEnum;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn()
    update_at: Date
}
