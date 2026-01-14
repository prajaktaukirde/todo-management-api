import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @Get()
  home() {
    return { message: 'Todo Management API is running' };
  }
}
