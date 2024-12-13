import { Order } from '@/modules/order/order/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Shipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  carrier: string;

  @Column()
  trackingCode: string;

  @Column()
  startDate: Date;

  @Column()
  estimatedDate: Date;

  @Column()
  status: string;

  @OneToOne(() => Order, (order) => order.shipment, { onDelete: 'CASCADE' })
  order: Relation<Order>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
