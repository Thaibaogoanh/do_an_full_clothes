import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { Variant } from '@/modules/product/variant/entities/variant.entity';
import { Cart } from '@/modules/cart/cart/entities/cart.entity';
import { CartItem } from '@/modules/cart/cart-item/entities/cart-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, Cart, Variant])],
  controllers: [CartItemController],
  providers: [CartItemService],
})
export class CartItemModule {}
