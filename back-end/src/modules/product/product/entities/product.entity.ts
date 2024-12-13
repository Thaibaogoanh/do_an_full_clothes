import { Brand } from '@/modules/product/brand/entities/brand.entity';
import { Category } from '@/modules/product/category/entities/category.entity';
import { Review } from '@/modules/product/review/entities/review.entity';
import { Supplier } from '@/modules/product/supplier/entities/supplier.entity';
import { Tag } from '@/modules/product/tag/entities/tag.entity';
import { Variant } from '@/modules/product/variant/entities/variant.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  material: string;

  @ManyToMany(() => Supplier, (supplier) => supplier.products)
  @JoinTable()
  suppliers: Relation<Supplier[]>;

  @ManyToOne(() => Brand, (brand) => brand.products)
  brand: Relation<Brand>;

  @ManyToOne(() => Category, (category) => category.products)
  category: Relation<Category>;

  @ManyToMany(() => Tag, (tag) => tag.products)
  @JoinTable()
  tags: Relation<Tag[]>;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Relation<Review[]>;

  @OneToMany(() => Variant, (variant) => variant.product)
  variants: Relation<Variant[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
