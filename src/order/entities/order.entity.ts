import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";

@Entity()
export class Order {
     @PrimaryGeneratedColumn()
       id: number;

     @ManyToOne(() => User, (user) => user.orders)
       user: User;

     @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
       items: OrderItem[];

     @Column()
       total: number;

     @Column({ default: 'pending' }) // pending, paid, shipped, etc.
       status: string;

     @CreateDateColumn()
       createdAt: Date;
}

