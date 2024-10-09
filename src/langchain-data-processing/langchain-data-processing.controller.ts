import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { LangChainDataProcessingService } from './langchain-data-processing.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { UploadFileDto } from './dto/upload-file.dto';

@ApiTags('Data Processing')
@Controller('/data')
export class LangChainDataProcessingController {
  constructor(
    private readonly langChainDataProcessingService: LangChainDataProcessingService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // 5MB
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          // .PDF, .TXT, .MD
          new FileTypeValidator({
            fileType: /^(application\/pdf|text\/plain|text\/markdown)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() condition: UploadFileDto,
  ) {
    return await this.langChainDataProcessingService.uploadFile(
      file,
      condition,
    );
  }
}
