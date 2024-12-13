import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from '@/modules/permission/entities/permission.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '@/dto/pagination';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  create = async (createPermissionDto: CreatePermissionDto) => {
    if (
      await this.permissionRepository.findOne({
        where: {
          name: createPermissionDto.name,
          method: createPermissionDto.method,
          apiPath: createPermissionDto.apiPath,
        },
      })
    ) {
      throw new BadRequestException('Permission name already exists');
    }

    const permission = this.permissionRepository.create(createPermissionDto);
    const record = await this.permissionRepository.save(permission);
    return {
      id: record.id,
      createdAt: record.createdAt,
    };
  };

  findAll = async ({ page, limit }: PaginationDto) => {
    const [data, totalRecords] = await this.permissionRepository.findAndCount({
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
    const permission = await this.permissionRepository.findOne({ where: { id }, relations: ['roles'] });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  };

  update = async (id: string, updatePermissionDto: UpdatePermissionDto) => {
    const permission = await this.permissionRepository.findOne({ where: { id } });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    this.permissionRepository.merge(permission, updatePermissionDto);

    const updatedPermission = await this.permissionRepository.save(permission);

    return {
      id: updatedPermission.id,
      updatedAt: updatedPermission.updatedAt,
    };
  };

  remove = async (id: string) => {
    const permission = await this.permissionRepository.findOne({ where: { id } });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    const record = await this.permissionRepository.softRemove(permission);

    return {
      id: record.id,
      deletedAt: record.deletedAt,
    };
  };
}
