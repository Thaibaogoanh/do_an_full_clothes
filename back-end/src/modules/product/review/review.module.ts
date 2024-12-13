import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { User } from '@/modules/user/entities/user.entity';
import { Product } from '@/modules/product/product/entities/product.entity';
import { Review } from '@/modules/product/review/entities/review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Product, User])],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
