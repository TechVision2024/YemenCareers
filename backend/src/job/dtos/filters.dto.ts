import { PartialType } from "@nestjs/mapped-types";
import { CreateJobDto } from "./create.dto";
import { IsYYYYMMDD } from "../validators/date.validator";
import { 
    IsOptional, 
    IsString, 
    MaxLength, 
    MinLength 
} from "class-validator";


export class FiltersDto extends PartialType(CreateJobDto) {
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    company_name?: string;

    @IsOptional()
    @IsYYYYMMDD()
    created_at?: Date;
}