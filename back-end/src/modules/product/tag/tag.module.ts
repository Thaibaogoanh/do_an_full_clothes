import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { Tag } from '@/modules/product/tag/entities/tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/modules/product/product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, Product])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
