import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('/test')
  getHello(): string {
    return 'Hello World!';
  }
}
