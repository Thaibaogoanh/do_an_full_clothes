import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { UserModule } from '@/modules/user/user.module';
import { User } from '@/modules/user/entities/user.entity';
import { Role } from '@/modules/role/entities/role.entity';
import { Permission } from '@/modules/permission/entities/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/modules/product/product/entities/product.entity';
import { Contact } from '@/modules/contact/entities/contact.entity';
import { Brand } from '@/modules/product/brand/entities/brand.entity';
import { Category } from '@/modules/product/category/entities/category.entity';
import { Inventory } from '@/modules/product/inventory/entities/inventory.entity';
import { Price } from '@/modules/product/price/entities/price.entity';
import { Review } from '@/modules/product/review/entities/review.entity';
import { Supplier } from '@/modules/product/supplier/entities/supplier.entity';
import { Tag } from '@/modules/product/tag/entities/tag.entity';
import { Variant } from '@/modules/product/variant/entities/variant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Permission,
      Role,
      User,
      Contact,
      Brand,
      Category,
      Inventory,
      Price,
      Product,
      Review,
      Supplier,
      Tag,
      Variant,
    ]),
    UserModule,
  ],
  controllers: [DatabaseController],
  providers: [DatabaseService],
})
export class DatabaseModule {}
