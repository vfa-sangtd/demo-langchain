import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class SimilaritySearchDto {
  @IsNotEmpty()
  @IsString()
  query: string;

  @IsNotEmpty()
  @IsInt()
  num: number;
}
