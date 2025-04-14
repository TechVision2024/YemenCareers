import { PickType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create.dto";

export class DeleteUserDto extends PickType(CreateUserDto, ['password']) {}