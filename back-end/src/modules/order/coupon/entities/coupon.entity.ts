import { Order } from '@/modules/order/order/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  discount: number;

  @Column()
  type: string;

  @Column()
  isAvailable: boolean;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @OneToMany(() => Order, (order) => order.coupon)
  orders: Relation<Order[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
