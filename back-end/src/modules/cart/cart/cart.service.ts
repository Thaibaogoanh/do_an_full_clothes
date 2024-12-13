import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { User } from '@/modules/user/entities/user.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from '@/modules/cart/cart-item/entities/cart-item.entity';
import { Cart } from '@/modules/cart/cart/entities/cart.entity';
import { PaginationDto } from '@/dto/pagination';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create = async (createCartDto: CreateCartDto, userId: string) => {
    const cart = this.cartRepository.create();
    const user = await this.userRepository.findOne({ where: { id: userId } });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    cart.user = user;
  
    // Handle optional cartItemIds
    if (createCartDto.cartItemIds && createCartDto.cartItemIds.length > 0) {
      const cartItems = await this.cartItemRepository.find({
        where: { id: In(createCartDto.cartItemIds) },
      });
  
      if (cartItems.length !== createCartDto.cartItemIds.length) {
        throw new NotFoundException('Some cart items were not found');
      }
  
      cart.cartItems = cartItems;
    } else {
      cart.cartItems = []; // Initialize an empty cart if no items are provided
    }
  
    const record = await this.cartRepository.save(cart);
  
    return {
      id: record.id,
      createdAt: record.createdAt,
    };
  };
  
  update = async (id: string, updateCartDto: UpdateCartDto) => {
    // Find the existing cart
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['cartItems'],
    });
  
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
  
    // Update cartItems if provided
    if (updateCartDto.cartItemIds && updateCartDto.cartItemIds.length > 0) {
      const cartItems = await this.cartItemRepository.find({
        where: { id: In(updateCartDto.cartItemIds) },
      });
  
      if (cartItems.length !== updateCartDto.cartItemIds.length) {
        throw new NotFoundException('Some cart items were not found');
      }
  
      cart.cartItems = cartItems;
    }
  
    const record = await this.cartRepository.save(cart);
  
    return {
      id: record.id,
      updatedAt: record.updatedAt,
    };
  };
  

  findAll = async ({ limit, page }: PaginationDto) => {
    const [data, totalRecords] = await this.cartRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['cartItems', 'cartItems.variant', 'cartItems.variant.product', 'cartItems.variant.prices'],
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
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['cartItems', 'cartItems.variant', 'cartItems.variant.product', 'cartItems.variant.prices'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  };

  // update = async (id: string, updateCartDto: UpdateCartDto) => {
  //   return `This action updates a #${id} cart`;
  // };

  remove = async (id: string) => {
    const cart = await this.cartRepository.findOne({ where: { id }, relations: ['cartItems'] });
  
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
  
    // Remove associated cart items
    await this.cartItemRepository.remove(cart.cartItems);
  
    // Soft-remove the cart itself
    const record = await this.cartRepository.softRemove(cart);
  
    return {
      id: record.id,
      deletedAt: record.deletedAt,
    };
  };
  
}
