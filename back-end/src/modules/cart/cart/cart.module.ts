import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { User } from '@/modules/user/entities/user.entity';
import { CartItem } from '@/modules/cart/cart-item/entities/cart-item.entity';
import { Cart } from '@/modules/cart/cart/entities/cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, User])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
