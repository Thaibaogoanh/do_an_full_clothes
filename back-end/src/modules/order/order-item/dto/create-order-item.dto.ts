import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateOrderItemDto {
  @IsUUID()
  @IsOptional()
  orderId: string;

  @IsUUID()
  @IsNotEmpty()
  variantId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
