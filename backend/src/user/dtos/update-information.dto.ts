import { PartialType } from "@nestjs/mapped-types"
import { CreateUserDto } from "./create.dto";

export class UpdateUserInformationDto extends PartialType(CreateUserDto) {}