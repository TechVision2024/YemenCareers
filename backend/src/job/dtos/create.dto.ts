import { 
    IsString,
    IsUrl,
    MaxLength,
    MinLength
} from "class-validator";
import { IsYYYYMMDD } from "../validators/date.validator";

export class CreateJobDto {
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    title: string;

    @IsString()
    @MinLength(100)
    @MaxLength(6000)
    body: string;

    @IsString()
    @MinLength(3)
    @MaxLength(100)
    type: string;
    
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    department: string;

    @IsYYYYMMDD()
    end_date: Date;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    city: string;

    @IsUrl()
    apply_url: string;
}