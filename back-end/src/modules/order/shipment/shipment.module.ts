import { Module } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { Order } from '@/modules/order/order/entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipment } from '@/modules/order/shipment/entities/shipment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shipment, Order])],
  controllers: [ShipmentController],
  providers: [ShipmentService],
})
export class ShipmentModule {}
