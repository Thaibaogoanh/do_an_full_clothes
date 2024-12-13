import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '@/modules/product/category/entities/category.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@/modules/product/product/entities/product.entity';
import { PaginationDto } from '@/dto/pagination';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  create = async (createCategoryDto: CreateCategoryDto) => {
    if (await this.categoryRepository.findOne({ where: { name: createCategoryDto.name } })) {
      throw new BadRequestException('Category already exists');
    }

    const category = this.categoryRepository.create(createCategoryDto);

    if (createCategoryDto.parentId) {
      const parent = await this.categoryRepository.findOne({ where: { id: createCategoryDto.parentId } });
      if (!parent) {
        throw new BadRequestException('Parent category does not exist');
      }
      category.parent = parent;
    }

    if (createCategoryDto.childrenIds) {
      const children = await this.categoryRepository.find({ where: { id: In(createCategoryDto.childrenIds) } });
      category.children = children;
    }

    const record = await this.categoryRepository.save(category);

    return {
      id: record.id,
      createdAt: record.createdAt,
    };
  };

  findAll = async ({ page, limit }: PaginationDto) => {
    const [data, totalRecords] = await this.categoryRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['parent', 'children', 'products'],
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
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children', 'products'],
    });
    if (!category) {
      throw new BadRequestException('Category does not exist');
    }
    return category;
  };

  update = async (id: string, updateCategoryDto: UpdateCategoryDto) => {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new BadRequestException('Category does not exist');
    }

    if (updateCategoryDto.parentId) {
      const parent = await this.categoryRepository.findOne({ where: { id: updateCategoryDto.parentId } });
      if (!parent) {
        throw new BadRequestException('Parent category does not exist');
      }
      category.parent = parent;
    }

    if (updateCategoryDto.childrenIds) {
      const children = await this.categoryRepository.find({ where: { id: In(updateCategoryDto.childrenIds) } });
      category.children = children;
    }

    this.categoryRepository.merge(category, updateCategoryDto);
    const record = await this.categoryRepository.save(category);

    return {
      id: record.id,
      updatedAt: record.updatedAt,
    };
  };

  remove = async (id: string) => {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new BadRequestException('Category does not exist');
    }

    const record = await this.categoryRepository.softRemove({ id });

    return {
      id: record.id,
      deletedAt: record.deletedAt,
    };
  };
}
