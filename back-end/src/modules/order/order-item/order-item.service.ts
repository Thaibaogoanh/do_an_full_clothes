import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { Variant } from '@/modules/product/variant/entities/variant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '@/modules/order/order/entities/order.entity';
import { OrderItem } from '@/modules/order/order-item/entities/order-item.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '@/dto/pagination';
import { isArray } from 'class-validator';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
  ) {}

  create = async (createOrderItemDto: CreateOrderItemDto) => {
    const order = await this.orderRepository.findOne({
      where: { id: createOrderItemDto.orderId },
      relations: ['orderItems'],
    });
    const variant = await this.variantRepository.findOne({ where: { id: createOrderItemDto.variantId } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }
    if (isArray(order.orderItems) && order.orderItems.find((item) => item.variant === variant)) {
      throw new BadRequestException('OrderItem already exists');
    }

    const orderItem = this.orderItemRepository.create(createOrderItemDto);
    orderItem.order = order;
    orderItem.variant = variant;
    const record = await this.orderItemRepository.save(orderItem);

    return {
      id: record.id,
      createdAt: record.createdAt,
    };
  };

  findAll = async ({ limit, page }: PaginationDto) => {
    const [data, totalRecords] = await this.orderItemRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['order', 'variant'],
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
    const orderItem = await this.orderItemRepository.findOne({ where: { id }, relations: ['order', 'variant'] });

    if (!orderItem) {
      throw new NotFoundException('OrderItem not found');
    }

    return orderItem;
  };

  update = async (id: string, updateOrderItemDto: UpdateOrderItemDto) => {
    const orderItem = await this.orderItemRepository.findOne({ where: { id } });

    if (!orderItem) {
      throw new NotFoundException('OrderItem not found');
    }

    this.orderItemRepository.merge(orderItem, updateOrderItemDto);
    const record = await this.orderItemRepository.save(orderItem);

    return {
      id: record.id,
      updatedAt: record.updatedAt,
    };
  };

  remove = async (id: string) => {
    const orderItem = await this.orderItemRepository.findOne({ where: { id } });

    if (!orderItem) {
      throw new NotFoundException('OrderItem not found');
    }

    const record = await this.orderItemRepository.softRemove(orderItem);

    return {
      id: record.id,
      deletedAt: record.deletedAt,
    };
  };
}
