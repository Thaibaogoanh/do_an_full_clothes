import { NotFoundException, Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '@/modules/role/entities/role.entity';
import bcrypt from 'bcrypt';
import { PaginationDto } from '@/dto/pagination';
import { USER_ROLE } from '@/modules/database/sample';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  create = async ({ roleId, ...createUserDto }: CreateUserDto) => {
    if (
      await this.userRepository.findOne({
        where: { email: createUserDto.email },
      })
    ) {
      throw new BadRequestException('Email already exists');
    }

    const user = this.userRepository.create(createUserDto);

    user.password = this.hashPassword(user.password);

    if (roleId) {
      const role = await this.roleRepository.findOne({ where: { id: roleId } });
      if (!role) {
        throw new NotFoundException('Role ID does not exist');
      }
      user.role = role;
    } else {
      const role = await this.roleRepository.findOne({
        where: { name: USER_ROLE },
      });
      user.role = role;
    }

    const record = await this.userRepository.save(user);
    return {
      id: record.id,
      createdAt: record.createdAt,
    };
  };

  findAll = async ({ page, limit }: PaginationDto) => {
    const [data, totalRecords] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['role', 'contacts', 'reviews', 'carts', 'carts.cartItems', 'orders', 'orders.orderItems'],
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
    const record = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'contacts', 'reviews', 'carts', 'carts.cartItems', 'orders', 'orders.orderItems'],
    });
    if (!record) {
      throw new NotFoundException('User ID does not exist');
    }
    return record;
  };

  update = async (id: string, { roleId, ...updateUserDto }: UpdateUserDto) => {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User ID does not exist');
    }

    if (roleId) {
      const role = await this.roleRepository.findOne({ where: { id: roleId } });
      if (!role) {
        throw new NotFoundException('Role ID does not exist');
      }
      user.role = role;
    }

    this.userRepository.merge(user, updateUserDto);
    const record = await this.userRepository.save(user);

    return {
      id: record.id,
      updatedAt: record.updatedAt,
    };
  };

  remove = async (id: string) => {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const record = await this.userRepository.softRemove({ id });
    return {
      id: record.id,
      deletedAt: record.deletedAt,
    };
  };

  hashPassword = (password: string) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
  };

  comparePassword = (password: string, hash: string) => {
    return bcrypt.compareSync(password, hash);
  };

  // AUTHENTICATION
  findOneByEmail = async (
    email: string,
  ): Promise<{
    id: string;
    password: string;
    role: {
      id: string;
    };
  }> => {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
      select: {
        id: true,
        password: true,
        role: {
          id: true,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return user;
  };

  findOneByRefreshToken = async (refreshToken: string) => {
    return await this.userRepository.findOne({
      where: { refreshToken },
      relations: ['role'],
      select: {
        id: true,
        role: {
          id: true,
        },
      },
    });
  };

  updateRefreshToken = async (id: string, refreshToken: string) => {
    await this.userRepository.update(id, { refreshToken });
  };

  removeRefreshToken = async (id: string) => {
    await this.userRepository.update(id, { refreshToken: null });
  };
}
