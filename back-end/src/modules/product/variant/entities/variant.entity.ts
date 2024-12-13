import { CartItem } from '@/modules/cart/cart-item/entities/cart-item.entity';
import { OrderItem } from '@/modules/order/order-item/entities/order-item.entity';
import { Inventory } from '@/modules/product/inventory/entities/inventory.entity';
import { Price } from '@/modules/product/price/entities/price.entity';
import { Product } from '@/modules/product/product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Variant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  sku: string;

  @Column()
  barcode: string;

  @Column()
  colorName: string;

  @Column()
  colorCode: string;

  @Column()
  size: string;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  mainImage: string;

  @Column('simple-array', { nullable: true, default: [] })
  images: string[];

  @OneToMany(() => Inventory, (inventory) => inventory.variant)
  inventories: Relation<Inventory[]>;

  @OneToMany(() => Price, (price) => price.variant)
  prices: Relation<Price[]>;

  @ManyToOne(() => Product, (product) => product.variants)
  product: Relation<Product>;

  @OneToOne(() => CartItem, (cartItem) => cartItem.variant)
  cartItem: Relation<CartItem>;

  @OneToOne(() => OrderItem, (orderItem) => orderItem.variant)
  orderItem: Relation<CartItem>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
