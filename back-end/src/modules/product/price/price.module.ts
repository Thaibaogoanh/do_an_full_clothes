import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { Variant } from '@/modules/product/variant/entities/variant.entity';
import { Price } from '@/modules/product/price/entities/price.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Price, Variant])],
  controllers: [PriceController],
  providers: [PriceService],
})
export class PriceModule {}
