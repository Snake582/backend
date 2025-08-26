import { OrderItem } from 'src/order/entities/order-item.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  alt: string; // texte alternatif

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  prix: number;

  @Column()
  stock: number;

  @Column()
  category: string;

  @Column()
  image: string; // ✅ minuscule

  @Column('simple-array', { nullable: true })
  secondaryImages?: string[];

   @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
orderItems: OrderItem[];

}
