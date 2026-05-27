import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  stockItemId!: string;

  @IsInt()
  @Min(1)
  @Max(999)
  qty!: number;
}
