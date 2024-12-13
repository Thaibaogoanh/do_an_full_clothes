import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { Variant } from '@/modules/product/variant/entities/variant.entity';
import { Inventory } from '@/modules/product/inventory/entities/inventory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, Variant])],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
