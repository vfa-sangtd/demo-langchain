import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { LangChainService } from './langchain.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { SimilaritySearchDto } from './dto/similarity-search.dto';
import { BasicMessageDto } from './dto/query.dto';

@ApiTags('Langchain')
@Controller('/langchain')
export class LangChainController {
  constructor(private readonly langChainService: LangChainService) {}

  /**
   * Handles the upload of a file and processes it. It supports files in PDF, TXT, and MD formats.
   * @param {Express.Multer.File} file - The uploaded file to be processed.
   * @returns {Promise<any>} - A success response or an error if processing fails.
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
    return await this.langChainService.embedding(file);
  }

  /**
   * Similarity search
   */
  @Get('similarity-search')
  async getSimilaritySearch(@Body() condition: SimilaritySearchDto) {
    return this.langChainService.getSimilaritySearch(condition);
  }

  /**
   *
   */
  @Get('query')
  async query(@Body() condition: BasicMessageDto) {
    return this.langChainService.query(condition);
  }
}
