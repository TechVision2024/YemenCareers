import { 
    IsEmail, 
    IsOptional, 
    IsPhoneNumber, 
    IsString, 
    IsUrl, 
    Matches, 
    MaxLength, 
    MinLength 
} from "class-validator";
import { IsPasswordMatch } from "../validators/password-conf.validator";

export class CreateUserDto {
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    name: string;

    @IsString()
    @MinLength(10)
    @MaxLength(100)
    description: string;

    @IsEmail()
    @MinLength(5)
    @MaxLength(255)
    email: string;

    @IsString()
    @MinLength(3)
    @MaxLength(100)
    company_type: string;

    @IsString()
    @IsPhoneNumber()
    @MinLength(9)
    @MaxLength(20)
    phone: string;

    @IsString()
    @MinLength(3)
    @MaxLength(255)
    address: string;

    @IsOptional()
    @IsUrl()
    @MinLength(3)
    @MaxLength(255)
    website?: string;

    @IsOptional()
    @IsUrl()
    @MinLength(3)
    @MaxLength(255)
    social_url_1?: string;

    @IsOptional()
    @IsUrl()
    @MinLength(3)
    @MaxLength(255)
    social_url_2?: string;

    @IsOptional()
    @IsUrl()
    @MinLength(3)
    @MaxLength(255)
    social_url_3?: string;

    @IsOptional()
    @IsUrl()
    @MinLength(3)
    @MaxLength(255)
    social_url_4?: string;

    @IsString()
    @MinLength(8)
    @MaxLength(255)
    @Matches(
        /((?=.*\d)|(?=.*\w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: "Password too weak, please use uppercase and lowercase letters and symbols and numbers!" }
    )
    password: string;

    @IsPasswordMatch('password', {message: "Invalid password confirmation!"})
    confirmation: string;
}