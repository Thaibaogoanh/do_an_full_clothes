import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from '@/modules/product/inventory/entities/inventory.entity';
import { Repository } from 'typeorm';
import { Variant } from '@/modules/product/variant/entities/variant.entity';
import { PaginationDto } from '@/dto/pagination';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
  ) {}
  create = async (createInventoryDto: CreateInventoryDto) => {
    const variant = await this.variantRepository.findOne({ where: { id: createInventoryDto.variantId } });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    const inventory = this.inventoryRepository.create(createInventoryDto);
    inventory.variant = variant;

    const record = await this.inventoryRepository.save(inventory);

    return {
      id: record.id,
      createdAt: record.createdAt,
    };
  };

  findAll = async ({ page, limit }: PaginationDto) => {
    const [data, totalRecords] = await this.inventoryRepository.findAndCount({
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
    const inventory = await this.inventoryRepository.findOne({ where: { id }, relations: ['variant'] });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    return inventory;
  };

  update = async (id: string, updateInventoryDto: UpdateInventoryDto) => {
    const inventory = await this.inventoryRepository.findOne({ where: { id }, relations: ['variant'] });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    if (updateInventoryDto.variantId) {
      const variant = await this.variantRepository.findOne({ where: { id: updateInventoryDto.variantId } });

      if (!variant) {
        throw new NotFoundException('Variant not found');
      }

      inventory.variant = variant;
    }

    this.inventoryRepository.merge(inventory, updateInventoryDto);

    const record = await this.inventoryRepository.save(inventory);

    return {
      id: record.id,
      updatedAt: record.updatedAt,
    };
  };

  remove = async (id: string) => {
    const inventory = await this.inventoryRepository.findOne({ where: { id } });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    await this.inventoryRepository.softDelete(inventory);

    return {
      id: inventory.id,
      deletedAt: inventory.deletedAt,
    };
  };
}
