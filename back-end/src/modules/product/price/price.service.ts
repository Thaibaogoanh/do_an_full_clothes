import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { Variant } from '@/modules/product/variant/entities/variant.entity';
import { Price } from '@/modules/product/price/entities/price.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '@/dto/pagination';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
  ) {}

  create = async (createPriceDto: CreatePriceDto) => {
    const price = this.priceRepository.create(createPriceDto);
    price.variant = await this.variantRepository.findOne({ where: { id: createPriceDto.variantId } });
    const record = await this.priceRepository.save(price);
    return {
      id: record.id,
      createdAt: record.createdAt,
    };
  };

  findAll = async ({ limit, page }: PaginationDto) => {
    const [data, totalRecords] = await this.priceRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['variant'],
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
    const price = await this.priceRepository.findOne({ where: { id }, relations: ['variant'] });
    if (!price) {
      throw new NotFoundException('Price not found');
    }
    return price;
  };

  update = async (id: string, updatePriceDto: UpdatePriceDto) => {
    const price = await this.priceRepository.findOne({ where: { id }, relations: ['variant'] });

    if (!price) {
      throw new NotFoundException('Price not found');
    }

    this.priceRepository.merge(price, updatePriceDto);

    const record = await this.priceRepository.save(price);

    return {
      id: record.id,
      updatedAt: record.updatedAt,
    };
  };

  remove = async (id: string) => {
    const price = await this.priceRepository.findOne({ where: { id } });

    if (!price) {
      throw new NotFoundException('Price not found');
    }

    const record = await this.priceRepository.softRemove(price);

    return {
      id: record.id,
      deletedAt: record.deletedAt,
    };
  };
}
