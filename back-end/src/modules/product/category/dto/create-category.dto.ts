import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsUUID()
  parentId: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  childrenIds: string[];

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  productIds: string[];
}
