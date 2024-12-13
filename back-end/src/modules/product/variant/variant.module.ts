import { Module } from '@nestjs/common';
import { VariantService } from './variant.service';
import { VariantController } from './variant.controller';
import { Variant } from '@/modules/product/variant/entities/variant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from '@/modules/product/inventory/entities/inventory.entity';
import { Price } from '@/modules/product/price/entities/price.entity';
import { Product } from '@/modules/product/product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Variant, Inventory, Price, Product])],
  controllers: [VariantController],
  providers: [VariantService],
})
export class VariantModule {}
