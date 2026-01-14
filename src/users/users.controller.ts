import { Body, Controller, Delete, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Users')
@ApiBearerAuth('bearer')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('me')
  getMe(@Req() req: any) {
    return this.users.getMe(req.user.id);
  }

  @Patch('me')
  updateMe(@Req() req: any, @Body() body: UpdateProfileDto) {
    return this.users.updateMe(req.user.id, body);
  }

  @Delete('me')
  softDeleteMe(@Req() req: any) {
    return this.users.softDeleteMe(req.user.id);
  }
}
