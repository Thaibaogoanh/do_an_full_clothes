import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Variant } from '@/modules/product/variant/entities/variant.entity';
import { In, Repository } from 'typeorm';
import { Price } from '@/modules/product/price/entities/price.entity';
import { Inventory } from '@/modules/product/inventory/entities/inventory.entity';
import { PaginationDto } from '@/dto/pagination';
import { Product } from '@/modules/product/product/entities/product.entity';

@Injectable()
export class VariantService {
  constructor(
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  create = async (createVariantDto: CreateVariantDto) => {
    if (
      await this.variantRepository.findOne({
        where: { name: createVariantDto.name },
      })
    ) {
      throw new BadRequestException('Name already exists');
    }

    const variant = this.variantRepository.create(createVariantDto);

    if (createVariantDto.priceIds) {
      variant.prices = await this.priceRepository.find({ where: { id: In(createVariantDto.priceIds) } });
    }

    if (createVariantDto.inventoryIds) {
      variant.inventories = await this.inventoryRepository.find({ where: { id: In(createVariantDto.inventoryIds) } });
    }

    variant.product = await this.productRepository.findOne({ where: { id: createVariantDto.productId } });

    const record = await this.variantRepository.save(variant);
    return {
      id: record.id,
      createdAt: record.createdAt,
    };
  };

  findAll = async ({ page, limit }: PaginationDto) => {
    const [data, totalRecords] = await this.variantRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      relations: ['prices', 'inventories'],
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
    const variant = await this.variantRepository.findOne({
      where: { id },
      relations: ['prices', 'inventories'],
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    return variant;
  };

  update = async (id: string, updateVariantDto: UpdateVariantDto) => {
    const variant = await this.variantRepository.findOne({ where: { id } });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    if (updateVariantDto.name) {
      if (await this.variantRepository.findOne({ where: { name: updateVariantDto.name } })) {
        throw new BadRequestException('Name already exists');
      }
    }

    if (updateVariantDto.priceIds) {
      variant.prices = await this.priceRepository.find({ where: { id: In(updateVariantDto.priceIds) } });
    }

    if (updateVariantDto.inventoryIds) {
      variant.inventories = await this.inventoryRepository.find({ where: { id: In(updateVariantDto.inventoryIds) } });
    }

    this.variantRepository.merge(variant, updateVariantDto);
    const record = await this.variantRepository.save(variant);
    return {
      id: record.id,
      updatedAt: record.updatedAt,
    };
  };

  remove = async (id: string) => {
    const variant = await this.variantRepository.findOne({ where: { id } });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    const record = await this.variantRepository.softRemove({ id });
    return {
      id: record.id,
      deletedAt: record.deletedAt,
    };
  };
}
