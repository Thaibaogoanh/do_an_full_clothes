import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Shipment } from '@/modules/order/shipment/entities/shipment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '@/modules/order/order/entities/order.entity';
import { OrderItem } from '@/modules/order/order-item/entities/order-item.entity';
import { Payment } from '@/modules/order/payment/entities/payment.entity';
import { PaginationDto } from '@/dto/pagination';
import { User } from '@/modules/user/entities/user.entity';
import { Coupon } from '@/modules/order/coupon/entities/coupon.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) {}

  create = async (createOrderDto: CreateOrderDto, userId: string) => {
    const order = this.orderRepository.create(createOrderDto);

    const shipment = await this.shipmentRepository.findOne({ where: { id: createOrderDto.shipmentId } });
    order.shipment = shipment;

    const payment = await this.paymentRepository.findOne({ where: { id: createOrderDto.paymentId } });
    order.payment = payment;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    order.user = user;

    const coupon = await this.couponRepository.findOne({ where: { code: createOrderDto.couponCode } });
    order.coupon = coupon;

    const record = await this.orderRepository.save(order);
    return {
      id: record.id,
      createdAt: record.createdAt,
    };
  };

  findAll = async ({ limit, page }: PaginationDto) => {
    const [data, totalRecords] = await this.orderRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['shipment', 'payment', 'orderItems'],
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
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['shipment', 'payment', 'orderItems'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  };

  update = async (id: string, updateOrderDto: UpdateOrderDto) => {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (updateOrderDto.shipmentId) {
      const shipment = await this.shipmentRepository.findOne({ where: { id: updateOrderDto.shipmentId } });
      order.shipment = shipment;
    }

    if (updateOrderDto.paymentId) {
      const payment = await this.paymentRepository.findOne({ where: { id: updateOrderDto.paymentId } });
      order.payment = payment;
    }

    this.orderRepository.merge(order, updateOrderDto);

    const record = await this.orderRepository.save(order);
    return {
      id: record.id,
      updatedAt: record.updatedAt,
    };
  };

  remove = async (id: string) => {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['shipment', 'payment', 'orderItems'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const record = await this.orderRepository.softRemove(order);

    return {
      id: record.id,
      deletedAt: record.deletedAt,
    };
  };
}
