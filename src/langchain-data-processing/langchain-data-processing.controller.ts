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

@ApiTags('Data Processing')
@Controller('/data')
export class LangChainDataProcessingController {
  constructor(
    private readonly langChainDataProcessingService: LangChainDataProcessingService,
  ) {}

  /**
   * Handles the upload of a file and processes it. It supports files in PDF, TXT, and MD formats.
   * @param {Express.Multer.File} file - The uploaded file to be processed.
   * @returns {Promise<any>} - A success response or an error if processing fails.
   * @memberof LangChainDataProcessingController
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async embedding(
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
  ): Promise<any> {
    return await this.langChainDataProcessingService.embedding(file);
  }
}
