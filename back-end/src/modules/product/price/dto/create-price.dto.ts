import { IsDateString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreatePriceDto {
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  currency: string;

  @IsNotEmpty()
  @IsDateString()
  effectiveDate: Date;

  @IsNotEmpty()
  @IsUUID()
  variantId: string;
}
