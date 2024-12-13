import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Order } from '@/modules/order/order/entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '@/modules/order/payment/entities/payment.entity';
import { PaginationDto } from '@/dto/pagination';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  create = async (createPaymentDto: CreatePaymentDto) => {
    const order = await this.orderRepository.findOne({ where: { id: createPaymentDto.orderId } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const payment = this.paymentRepository.create(createPaymentDto);
    const record = await this.paymentRepository.save(payment);
    return {
      id: record.id,
      createdAt: record.createdAt,
    };
  };

  findAll = async ({ limit, page }: PaginationDto) => {
    const [data, totalRecords] = await this.paymentRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['order'],
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
    const payment = await this.paymentRepository.findOne({ where: { id }, relations: ['order'] });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  };

  update = async (id: string, updatePaymentDto: UpdatePaymentDto) => {
    const payment = await this.paymentRepository.findOne({ where: { id } });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    this.paymentRepository.merge(payment, updatePaymentDto);

    const record = await this.paymentRepository.save(payment);

    return {
      id: record.id,
      updatedAt: record.updatedAt,
    };
  };

  remove = async (id: string) => {
    const payment = await this.paymentRepository.findOne({ where: { id } });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const record = await this.paymentRepository.softRemove(payment);

    return {
      id: record.id,
      deletedAt: record.deletedAt,
    };
  };
}
