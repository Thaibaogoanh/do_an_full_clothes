import { IsString, IsDate, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateShipmentDto {
  @IsString()
  @IsNotEmpty()
  carrier: string;

  @IsString()
  @IsNotEmpty()
  trackingCode: string;

  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  estimatedDate: Date;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  orderId: string;
}
