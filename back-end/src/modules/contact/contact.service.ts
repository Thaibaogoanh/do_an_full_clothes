import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from '@/modules/contact/entities/contact.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '@/dto/pagination';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create = async ({ userId, ...createContactDto }: CreateContactDto) => {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    const contact = this.contactRepository.create(createContactDto);
    contact.user = user;

    const record = await this.contactRepository.save(contact);
    return {
      id: record.id,
      createdAt: record.createdAt,
    };
  };

  findAll = async ({ page, limit }: PaginationDto) => {
    const [data, totalRecords] = await this.contactRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
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
    const contact = await this.contactRepository.findOne({ where: { id }, relations: ['user'] });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return contact;
  };

  update = async (id: string, updateContactDto: UpdateContactDto) => {
    const contact = await this.contactRepository.findOne({ where: { id } });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    this.contactRepository.merge(contact, updateContactDto);

    const record = await this.contactRepository.save(contact);

    return {
      id: record.id,
      updatedAt: record.updatedAt,
    };
  };

  remove = async (id: string) => {
    const contact = await this.contactRepository.findOne({ where: { id } });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    const record = await this.contactRepository.softRemove(contact);

    return {
      id: record.id,
      deletedAt: record.deletedAt,
    };
  };
}
