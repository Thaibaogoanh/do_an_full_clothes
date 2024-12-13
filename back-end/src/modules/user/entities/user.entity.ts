import { Cart } from '@/modules/cart/cart/entities/cart.entity';
import { Contact } from '@/modules/contact/entities/contact.entity';
import { Order } from '@/modules/order/order/entities/order.entity';
import { Payment } from '@/modules/order/payment/entities/payment.entity';
import { Review } from '@/modules/product/review/entities/review.entity';
import { Role } from '@/modules/role/entities/role.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  email: string;

  @Column({ select: false, nullable: false })
  password: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  age: number;

  @Column({ nullable: false })
  gender: string;

  @Column('text', { nullable: true })
  avatar: string;

  @Column({ select: false, nullable: true })
  refreshToken: string;

  @OneToMany(() => Contact, (contact) => contact.user)
  contacts: Relation<Contact[]>;

  @ManyToOne(() => Role, (role) => role.users)
  role: Relation<Role>;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Relation<Review[]>;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Relation<Cart[]>;

  @OneToMany(() => Order, (order) => order.user)
  orders: Relation<Order[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
