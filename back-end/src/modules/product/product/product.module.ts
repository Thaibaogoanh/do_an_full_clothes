import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/modules/product/product/entities/product.entity';
import { Supplier } from '@/modules/product/supplier/entities/supplier.entity';
import { Brand } from '@/modules/product/brand/entities/brand.entity';
import { Category } from '@/modules/product/category/entities/category.entity';
import { Tag } from '@/modules/product/tag/entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Supplier, Brand, Category, Tag])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
