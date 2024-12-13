import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '@/modules/product/review/entities/review.entity';
import { Product } from '@/modules/product/product/entities/product.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '@/dto/pagination';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create = async (createReviewDto: CreateReviewDto, userId: string) => {
    const review = this.reviewRepository.create(createReviewDto);

    review.product = await this.productRepository.findOne({ where: { id: createReviewDto.productId } });
    review.user = await this.userRepository.findOne({ where: { id: userId } });

    const record = await this.reviewRepository.save(review);
    return {
      id: record.id,
      createdAt: record.createdAt,
    };
  };

  findAll = async ({ limit, page }: PaginationDto) => {
    const [data, totalRecords] = await this.reviewRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      relations: ['product', 'user'],
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
    const review = await this.reviewRepository.findOne({ where: { id }, relations: ['product', 'user'] });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  };

  update = async (id: string, updateReviewDto: UpdateReviewDto) => {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    this.reviewRepository.merge(review, updateReviewDto);

    const record = await this.reviewRepository.save(review);

    return {
      id: record.id,
      updatedAt: record.updatedAt,
    };
  };

  remove = async (id: string) => {
    const review = await this.reviewRepository.findOne({ where: { id } });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const record = await this.reviewRepository.softRemove(review);

    return {
      id: record.id,
      deletedAt: record.deletedAt,
    };
  };
}
