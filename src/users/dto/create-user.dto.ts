import { IsNotEmpty, IsEmail, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  firstName: string;

  @IsOptional()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  number: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
