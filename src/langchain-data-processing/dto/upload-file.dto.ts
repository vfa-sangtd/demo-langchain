import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UploadFileDto {
  @ApiProperty()
  @IsBoolean()
  keepOrigin: boolean;
}
