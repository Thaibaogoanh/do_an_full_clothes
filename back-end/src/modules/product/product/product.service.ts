import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '@/modules/product/product/entities/product.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from '@/modules/product/supplier/entities/supplier.entity';
import { Brand } from '@/modules/product/brand/entities/brand.entity';
import { Category } from '@/modules/product/category/entities/category.entity';
import { Tag } from '@/modules/product/tag/entities/tag.entity';
import { PaginationDto } from '@/dto/pagination';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  create = async (createProductDto: CreateProductDto) => {
    if (
      await this.productRepository.findOne({
        where: { name: createProductDto.name },
      })
    ) {
      throw new BadRequestException('Product name already exists');
    }

    const product = this.productRepository.create(createProductDto);

    product.suppliers = await this.supplierRepository.find({ where: { id: In(createProductDto.supplierIds) } });
    product.brand = await this.brandRepository.findOne({ where: { id: createProductDto.brandId } });
    product.category = await this.categoryRepository.findOne({ where: { id: createProductDto.categoryId } });

    if (createProductDto.tagIds) {
      product.tags = await this.tagRepository.find({ where: { id: In(createProductDto.tagIds) } });
    }

    const record = await this.productRepository.save(product);

    return {
      id: record.id,
      createdAt: record.createdAt,
    };
  };

  findAll = async ({ page, limit }: PaginationDto) => {
    const [data, totalRecords] = await this.productRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['suppliers', 'brand', 'category', 'tags', 'variants', 'reviews'],
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
    const record = await this.productRepository.findOne({
      where: { id },
      relations: ['suppliers', 'brand', 'category', 'tags', 'variants', 'reviews'],
    });

    if (!record) {
      throw new BadRequestException('Product not found');
    }

    return record;
  };

  update = async (id: string, updateProductDto: UpdateProductDto) => {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['suppliers', 'brand', 'category', 'tags', 'variants', 'reviews'],
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (updateProductDto.name) {
      if (
        await this.productRepository.findOne({
          where: { name: updateProductDto.name },
        })
      ) {
        throw new BadRequestException('Product name already exists');
      }
    }

    this.productRepository.merge(product, updateProductDto);

    if (updateProductDto.supplierIds) {
      product.suppliers = await this.supplierRepository.find({
        where: { id: In(updateProductDto.supplierIds) },
      });
    }

    if (updateProductDto.brandId) {
      product.brand = await this.brandRepository.findOne({ where: { id: updateProductDto.brandId } });
    }

    if (updateProductDto.categoryId) {
      product.category = await this.categoryRepository.findOne({ where: { id: updateProductDto.categoryId } });
    }

    if (updateProductDto.tagIds) {
      product.tags = await this.tagRepository.find({ where: { id: In(updateProductDto.tagIds) } });
    }

    const record = await this.productRepository.save(product);

    return {
      id: record.id,
      updatedAt: record.updatedAt,
    };
  };

  remove = async (id: string) => {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    const record = await this.productRepository.softRemove({ id });

    return {
      id: record.id,
      deletedAt: record.deletedAt,
    };
  };
}
