import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateCartItemDto {
  @IsUUID()
  @IsOptional()
  cartId?: string;

  @IsUUID()
  @IsNotEmpty()
  variantId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
