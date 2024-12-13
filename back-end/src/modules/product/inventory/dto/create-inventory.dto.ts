import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateInventoryDto {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsUUID()
  variantId: string;
}
