import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'Prajakta' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'p2@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Pass@1234' })
  @MinLength(6)
  password: string;
}
