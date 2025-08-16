import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

 @ManyToOne(() => Product, product => product.orderItems, { eager: true })
  product: Product;


  @Column()
  quantity: number;

  @Column()
  price: number; // prix au moment de l’achat
}