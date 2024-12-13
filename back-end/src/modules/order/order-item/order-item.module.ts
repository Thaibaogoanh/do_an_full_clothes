import { Module } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { OrderItem } from '@/modules/order/order-item/entities/order-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variant } from '@/modules/product/variant/entities/variant.entity';
import { Order } from '@/modules/order/order/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, Order, Variant])],
  controllers: [OrderItemController],
  providers: [OrderItemService],
})
export class OrderItemModule {}
