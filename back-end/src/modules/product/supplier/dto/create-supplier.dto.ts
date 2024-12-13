import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  address: string[];

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  phone: string[];

  @IsEmail({}, { each: true })
  @IsNotEmpty({ each: true })
  email: string[];

  @IsString()
  @IsOptional()
  website: string;

  @IsString({ each: true })
  @IsOptional()
  @IsArray()
  productIds: string[];
}
