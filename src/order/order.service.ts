import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
    

  async create(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
  const user = await this.userRepository.findOne({ where: { id: userId } });
  if (!user) throw new Error(`User with id ${userId} not found`);

  const order = this.orderRepository.create({
    user,
    total: createOrderDto.total,
    status: 'pending',
  });

  const savedOrder = await this.orderRepository.save(order);

  const orderItems: OrderItem[] = [];

  for (const itemDto of createOrderDto.items) {
    const product = await this.productRepository.findOne({ where: { id: itemDto.productId } });
    if (!product) {
      throw new Error(`Product with id ${itemDto.productId} not found`);
    }

    const item = this.orderItemRepository.create({
      order: savedOrder,
      product,
      quantity: itemDto.quantity,
      price: itemDto.price,
    });

    orderItems.push(item);
  }

  await this.orderItemRepository.save(orderItems);

  // Recharge l’ordre avec les produits
  const foundOrder = await this.orderRepository.findOne({
    where: { id: savedOrder.id },
    relations: ['items', 'items.product', 'user'],
  });

  if (!foundOrder) {
    throw new Error(`Order with id ${savedOrder.id} not found after creation`);
  }

  return foundOrder;
}
}