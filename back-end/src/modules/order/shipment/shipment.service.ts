import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { Shipment } from '@/modules/order/shipment/entities/shipment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '@/modules/order/order/entities/order.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '@/dto/pagination';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  create = async (createShipmentDto: CreateShipmentDto) => {
    const order = await this.orderRepository.findOne({ where: { id: createShipmentDto.orderId } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const shipment = this.shipmentRepository.create(createShipmentDto);
    shipment.order = order;

    const record = await this.shipmentRepository.save(shipment);
    return {
      id: record.id,
      createdAt: record.createdAt,
    };
  };

  findAll = async ({ limit, page }: PaginationDto) => {
    const [data, totalRecords] = await this.shipmentRepository.findAndCount({
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
    const shipment = await this.shipmentRepository.findOne({ where: { id }, relations: ['order'] });

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    return shipment;
  };

  update = async (id: string, updateShipmentDto: UpdateShipmentDto) => {
    const shipment = await this.shipmentRepository.findOne({ where: { id }, relations: ['order'] });

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    this.shipmentRepository.merge(shipment, updateShipmentDto);

    const record = await this.shipmentRepository.save(shipment);
    return {
      id: record.id,
      updatedAt: record.updatedAt,
    };
  };

  remove = async (id: string) => {
    const shipment = await this.shipmentRepository.findOne({ where: { id } });

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    const record = await this.shipmentRepository.softRemove(shipment);
    return {
      id: record.id,
      deletedAt: record.deletedAt,
    };
  };
}
