import { IsNotEmpty, IsString } from 'class-validator';

export class SimilaritySearchDto {
  @IsNotEmpty()
  @IsString()
  q: string;
}
