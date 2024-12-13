import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from '@/modules/cart/cart-item/entities/cart-item.entity';
import { Repository } from 'typeorm';
import { Cart } from '@/modules/cart/cart/entities/cart.entity';
import { Variant } from '@/modules/product/variant/entities/variant.entity';
import { PaginationDto } from '@/dto/pagination';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
  ) {}

  create = async (createCartItemDto: CreateCartItemDto) => {
    let cart;
  
    if (createCartItemDto.cartId) {
      cart = await this.cartRepository.findOne({ where: { id: createCartItemDto.cartId } });
      if (!cart) {
        throw new NotFoundException('Cart not found');
      }
    } else {
      // Create a new cart if no cartId is provided
      cart = this.cartRepository.create();
      cart.cartItems = [];
      cart = await this.cartRepository.save(cart);
    }
  
    const variant = await this.variantRepository.findOne({ where: { id: createCartItemDto.variantId } });
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }
  
    const cartItem = this.cartItemRepository.create(createCartItemDto);
    cartItem.cart = cart;
    cartItem.variant = variant;
  
    const record = await this.cartItemRepository.save(cartItem);
  
    return {
      id: record.id,
      cartId: cart.id,
      createdAt: record.createdAt,
    };
  };
  
  findAll = async ({ limit, page }: PaginationDto) => {
    const [data, totalRecords] = await this.cartItemRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['variant', 'cart', 'cart.user', 'variant.product', 'variant.prices'],
    });

    const totalPages = Math.ceil(totalRecords / limit);

    return {
      pagination: {
        totalRecords,
        totalPages,
        page,
        limit,
      },
      data,
    };
  };

  findOne = async (id: string) => {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id },
      relations: ['variant', 'cart', 'cart.user', 'variant.product', 'variant.prices'],
    });

    if (!cartItem) {
      throw new NotFoundException('CartItem not found');
    }

    return cartItem;
  };

  update = async (id: string, updateCartItemDto: UpdateCartItemDto) => {
    const cartItem = await this.cartItemRepository.findOne({ where: { id } });

    if (!cartItem) {
      throw new NotFoundException('CartItem not found');
    }

    this.cartItemRepository.merge(cartItem, updateCartItemDto);
    const record = await this.cartItemRepository.save(cartItem);
    return {
      id: record.id,
      createdAt: record.createdAt,
    };
  };

  remove = async (id: string) => {
    const cartItem = await this.cartItemRepository.findOne({ where: { id } });

    if (!cartItem) {
      throw new NotFoundException('CartItem not found');
    }

    const record = await this.cartItemRepository.softRemove(cartItem);

    return {
      id: record.id,
      deletedAt: record.deletedAt,
    };
  };
}
