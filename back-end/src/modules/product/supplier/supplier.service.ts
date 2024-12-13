import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from '@/modules/product/supplier/entities/supplier.entity';
import { Product } from '@/modules/product/product/entities/product.entity';
import { In, Repository } from 'typeorm';
import { PaginationDto } from '@/dto/pagination';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  create = async (createSupplierDto: CreateSupplierDto) => {
    if (
      await this.supplierRepository.findOne({
        where: { name: createSupplierDto.name },
      })
    ) {
      throw new BadRequestException('Name already exists');
    }

    const supplier = this.supplierRepository.create(createSupplierDto);

    if (createSupplierDto.productIds) {
      supplier.products = await this.productRepository.find({
        where: { id: In(createSupplierDto.productIds) },
      });
    }

    const record = await this.supplierRepository.save(supplier);

    return {
      id: record.id,
      createdAt: record.createdAt,
    };
  };

  findAll = async ({ limit, page }: PaginationDto) => {
    const [data, totalRecords] = await this.supplierRepository.findAndCount({
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
    const supplier = await this.supplierRepository.findOne({ where: { id }, relations: ['products'] });

    if (!supplier) {
      throw new BadRequestException('Supplier not found');
    }

    return supplier;
  };

  update = async (id: string, updateSupplierDto: UpdateSupplierDto) => {
    const supplier = await this.supplierRepository.findOne({ where: { id }, relations: ['products'] });

    if (!supplier) {
      throw new BadRequestException('Supplier not found');
    }

    if (updateSupplierDto.productIds) {
      supplier.products = await this.productRepository.find({
        where: { id: In(updateSupplierDto.productIds) },
      });
    }

    this.supplierRepository.merge(supplier, updateSupplierDto);
    const record = await this.supplierRepository.save(supplier);

    return {
      id: record.id,
      updatedAt: record.updatedAt,
    };
  };

  remove = async (id: string) => {
    const supplier = await this.supplierRepository.findOne({ where: { id }, relations: ['products'] });

    if (!supplier) {
      throw new BadRequestException('Supplier not found');
    }

    const record = await this.supplierRepository.softRemove({ id });

    return {
      id: record.id,
      deletedAt: record.deletedAt,
    };
  };
}
