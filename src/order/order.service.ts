import { Injectable, NotFoundException } from '@nestjs/common';
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

  // Créer une commande
  async create(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    const order = this.orderRepository.create({
      user,
      total: createOrderDto.total,
      status: 'pending',
    });

    const savedOrder = await this.orderRepository.save(order);

    const orderItems: OrderItem[] = [];

    for (const itemDto of createOrderDto.items) {
      const product = await this.productRepository.findOne({ where: { id: itemDto.productId } });
      if (!product) throw new NotFoundException(`Product with id ${itemDto.productId} not found`);

      const item = this.orderItemRepository.create({
        order: savedOrder,
        product,
        quantity: itemDto.quantity,
        price: itemDto.price,
      });

      orderItems.push(item);
    }

    await this.orderItemRepository.save(orderItems);

    // Recharge la commande avec les relations
    const foundOrder = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['items', 'items.product', 'user'],
    });

    if (!foundOrder) throw new NotFoundException(`Order with id ${savedOrder.id} not found after creation`);

    return foundOrder;
  }

  // Récupérer toutes les commandes ou celles d'un utilisateur
async findAll(userId?: number): Promise<Order[]> {
  if (userId) {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product', 'user'], // Ajout relations
      order: { id: 'DESC' },
    });
  } else {
    return this.orderRepository.find({
      relations: ['user', 'items', 'items.product'], // Relations complètes
      order: { createdAt: 'DESC' },
    });
  }
}
}
