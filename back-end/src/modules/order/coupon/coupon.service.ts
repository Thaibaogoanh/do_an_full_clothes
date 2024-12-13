import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from '@/modules/order/coupon/entities/coupon.entity';
import { Repository } from 'typeorm';
import { Order } from '@/modules/order/order/entities/order.entity';
import { PaginationDto } from '@/dto/pagination';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) {}

  create = async (createCouponDto: CreateCouponDto) => {
    if (
      await this.couponRepository.findOne({
        where: {
          code: createCouponDto.code,
          isAvailable: true,
        },
      })
    ) {
      throw new BadRequestException('Coupon code already exists');
    }

    const coupon = this.couponRepository.create(createCouponDto);
    const record = await this.couponRepository.save(coupon);
    return {
      id: record.id,
      createdAt: record.createdAt,
    };
  };

  findAll = async ({ limit, page }: PaginationDto) => {
    const [data, totalRecords] = await this.couponRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
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
    const coupon = await this.couponRepository.findOne({ where: { id } });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return coupon;
  };

  update = async (id: string, updateCouponDto: UpdateCouponDto) => {
    const coupon = await this.couponRepository.findOne({ where: { id } });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    this.couponRepository.merge(coupon, updateCouponDto);
    const record = await this.couponRepository.save(coupon);

    return {
      id: record.id,
      updatedAt: record.updatedAt,
    };
  };

  remove = async (id: string) => {
    const coupon = await this.couponRepository.findOne({ where: { id } });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    const record = await this.couponRepository.softRemove(coupon);

    return {
      id: record.id,
      deletedAt: record.deletedAt,
    };
  };
}
