import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '@/modules/product/tag/entities/tag.entity';
import { Product } from '@/modules/product/product/entities/product.entity';
import { In, Repository } from 'typeorm';
import { PaginationDto } from '@/dto/pagination';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  create = async (createTagDto: CreateTagDto) => {
    if (
      await this.tagRepository.findOne({
        where: { name: createTagDto.name },
      })
    ) {
      throw new BadRequestException('Name already exists');
    }

    const tag = this.tagRepository.create(createTagDto);

    if (createTagDto.productIds) {
      tag.products = await this.productRepository.find({ where: { id: In(createTagDto.productIds) } });
    }

    const record = await this.tagRepository.save(tag);

    return {
      id: record.id,
      createdAt: record.createdAt,
    };
  };

  findAll = async ({ limit, page }: PaginationDto) => {
    const [data, totalRecords] = await this.tagRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
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
    const tag = await this.tagRepository.findOne({ where: { id }, relations: ['products'] });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return tag;
  };

  update = async (id: string, updateTagDto: UpdateTagDto) => {
    const tag = await this.tagRepository.findOne({ where: { id } });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    if (updateTagDto.productIds) {
      tag.products = await this.productRepository.find({ where: { id: In(updateTagDto.productIds) } });
    }

    this.tagRepository.merge(tag, updateTagDto);

    const record = await this.tagRepository.save(tag);

    return {
      id: record.id,
      updatedAt: record.updatedAt,
    };
  };

  remove = async (id: string) => {
    const tag = await this.tagRepository.findOne({ where: { id }, relations: ['products'] });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    const record = await this.tagRepository.softRemove(tag);

    return {
      id: record.id,
      deletedAt: record.deletedAt,
    };
  };
}
