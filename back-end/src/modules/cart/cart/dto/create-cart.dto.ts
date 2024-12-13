import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';

export class CreateCartDto {
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  cartItemIds?: string[];
}
