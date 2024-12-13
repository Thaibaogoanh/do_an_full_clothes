import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateVariantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsNotEmpty()
  @IsString()
  barcode: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsString()
  @IsNotEmpty()
  colorName: string;

  @IsString()
  @IsNotEmpty()
  colorCode: string;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  mainImage: string;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  images: string[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  priceIds: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  inventoryIds: string[];

  @IsNotEmpty()
  @IsUUID()
  productId: string;
}
