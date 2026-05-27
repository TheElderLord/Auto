import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class SearchProductsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  q!: string;

  @IsOptional()
  @IsString()
  brand?: string;
}
