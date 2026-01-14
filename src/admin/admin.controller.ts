import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { AdminService } from './admin.service';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';

@ApiTags('Admin')
@ApiBearerAuth('bearer')
@UseGuards(AuthGuard('jwt'))
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('users')
  listUsers() {
    return this.admin.listUsers();
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() body: AdminUpdateUserDto) {
    return this.admin.updateUser(id, body);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.admin.deleteUser(id);
  }
}
