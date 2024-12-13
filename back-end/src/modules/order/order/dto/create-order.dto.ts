import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  total: number;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsUUID()
  @IsOptional()
  paymentId: string;

  @IsUUID()
  @IsOptional()
  shipmentId: string;

  @IsUUID()
  @IsOptional()
  couponCode: string;
}
