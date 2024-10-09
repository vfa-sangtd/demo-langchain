import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Test')
@Controller('/test')
export class AppController {
  constructor() {}

  @Get()
  test(): string {
    return 'Hello World!';
  }
}
