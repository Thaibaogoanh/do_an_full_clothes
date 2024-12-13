import { Coupon } from '@/modules/order/coupon/entities/coupon.entity';
import { OrderItem } from '@/modules/order/order-item/entities/order-item.entity';
import { Payment } from '@/modules/order/payment/entities/payment.entity';
import { Shipment } from '@/modules/order/shipment/entities/shipment.entity';
import { User } from '@/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  total: number;

  @Column()
  currency: string;

  @Column()
  status: string;

  @ManyToOne(() => User, (user) => user.orders)
  user: Relation<User>;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: Relation<OrderItem[]>;

  @OneToOne(() => Payment, (payment) => payment.order, { cascade: true })
  @JoinColumn()
  payment: Relation<Payment>;

  @OneToOne(() => Shipment, (shipment) => shipment.order, { cascade: true })
  @JoinColumn()
  shipment: Relation<Shipment>;

  @ManyToOne(() => Coupon, (coupon) => coupon.orders)
  coupon: Relation<Coupon>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
