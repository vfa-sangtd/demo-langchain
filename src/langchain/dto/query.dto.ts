import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BasicMessageDto {
  @IsNotEmpty()
  @IsString()
  query: string;

  @IsNotEmpty()
  @IsInt()
  @IsOptional()
  num: number = 5;
}
