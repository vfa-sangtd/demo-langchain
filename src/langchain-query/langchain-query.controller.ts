import { Body, Controller, Get } from '@nestjs/common';
import { LangChainQueryService } from './langchain-query.service';
import { BasicMessageDto } from './dto/query.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Query')
@Controller('/query')
export class LangChainQueryController {
  constructor(private readonly langChainQueryService: LangChainQueryService) {}

  @Get()
  async chat(@Body() condition: BasicMessageDto) {
    return this.langChainQueryService.query(condition);
  }
}
