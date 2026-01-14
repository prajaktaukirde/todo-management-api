import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'p2@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Pass@1234' })
  @IsString()
  password: string;
}
