import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@ApiTags('Auth')
@ApiBearerAuth('bearer')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('signup')
  signup(@Body() body: SignupDto) {
    return this.auth.signup(body);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.auth.login(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  logout(@Req() req: any) {
    return this.auth.logout(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Req() req: any) {
    return req.user;
  }
}
