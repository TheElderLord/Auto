import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CheckoutDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  customerName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  customerPhone!: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;
}
