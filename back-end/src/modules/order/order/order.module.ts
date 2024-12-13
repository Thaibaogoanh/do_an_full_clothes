import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Payment } from '@/modules/order/payment/entities/payment.entity';
import { Shipment } from '@/modules/order/shipment/entities/shipment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@/modules/order/order/entities/order.entity';
import { OrderItem } from '@/modules/order/order-item/entities/order-item.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Coupon } from '@/modules/order/coupon/entities/coupon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Shipment, Payment, User, Coupon])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
