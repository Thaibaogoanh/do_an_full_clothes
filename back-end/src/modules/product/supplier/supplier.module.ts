import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { Supplier } from '@/modules/product/supplier/entities/supplier.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/modules/product/product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, Product])],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
