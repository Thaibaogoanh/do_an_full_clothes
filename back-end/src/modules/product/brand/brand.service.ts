import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from '@/modules/product/brand/entities/brand.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '@/dto/pagination';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  create = async (createBrandDto: CreateBrandDto) => {
    if (await this.brandRepository.findOne({ where: { name: createBrandDto.name } })) {
      throw new BadRequestException('Brand already exists');
    }

    const brand = this.brandRepository.create(createBrandDto);

    const record = await this.brandRepository.save(brand);

    return {
      id: record.id,
      createdAt: record.createdAt,
    };
  };

  findAll = async ({ page, limit }: PaginationDto) => {
    const [data, totalRecords] = await this.brandRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['products'],
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
    const brand = await this.brandRepository.findOne({ where: { id }, relations: ['products'] });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand;
  };

  update = async (id: string, updateBrandDto: UpdateBrandDto) => {
    const brand = await this.brandRepository.findOne({ where: { id } });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    this.brandRepository.merge(brand, updateBrandDto);

    const record = await this.brandRepository.save(brand);
    return {
      id: record.id,
      updatedAt: record.updatedAt,
    };
  };

  remove = async (id: string) => {
    const brand = await this.brandRepository.findOne({ where: { id } });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    await this.brandRepository.softRemove(brand);

    return {
      id: brand.id,
      deletedAt: brand.deletedAt,
    };
  };
}
