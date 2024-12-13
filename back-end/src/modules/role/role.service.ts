import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '@/modules/role/entities/role.entity';
import { In, Repository } from 'typeorm';
import { Permission } from '@/modules/permission/entities/permission.entity';
import { PaginationDto } from '@/dto/pagination';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  create = async (createRoleDto: CreateRoleDto) => {
    if (
      await this.roleRepository.findOne({
        where: { name: createRoleDto.name },
      })
    ) {
      throw new BadRequestException('Role already exists');
    }

    const role = this.roleRepository.create(createRoleDto);

    if (createRoleDto.permissionIds) {
      const permissions = await this.permissionRepository.find({ where: { id: In(createRoleDto.permissionIds) } });
      role.permissions = permissions;
    }

    const record = await this.roleRepository.save(role);
    return {
      id: record.id,
      createdAt: record.createdAt,
    };
  };

  findAll = async ({ page, limit }: PaginationDto) => {
    const [data, totalRecords] = await this.roleRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['permissions'],
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
    const record = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!record) {
      throw new NotFoundException('User ID does not exist');
    }
    return record;
  };

  update = async (id: string, { permissionIds, ...updateRoleDto }: UpdateRoleDto) => {
    const role = await this.roleRepository.findOne({ where: { id }, relations: ['permissions'] });

    if (!role) {
      throw new NotFoundException('Role ID does not exist');
    }

    if (permissionIds) {
      const permissions = await this.permissionRepository.find({ where: { id: In(permissionIds) } });
      if (!permissions) {
        throw new NotFoundException('Role ID does not exist');
      }
      role.permissions = permissions;
    }

    this.roleRepository.merge(role, updateRoleDto);

    const record = await this.roleRepository.save(role);
    return {
      id: record.id,
      updatedAt: record.updatedAt,
    };
  };

  remove = async (id: string) => {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role ID does not exist');
    }

    const record = await this.roleRepository.softRemove(role);
    return {
      id: record.id,
      deletedAt: record.deletedAt,
    };
  };
}
