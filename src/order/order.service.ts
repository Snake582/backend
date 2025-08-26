import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto, OrderStatus } from './dto/update-order.dto';

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
    if (!user) throw new NotFoundException(`Utilisateur ${userId} introuvable`);

    const order = this.orderRepository.create({
      user,
      total: createOrderDto.total,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Créer les items de commande
    const orderItems: OrderItem[] = [];
    for (const itemDto of createOrderDto.items) {
      const product = await this.productRepository.findOne({ where: { id: itemDto.productId } });
      if (!product) throw new NotFoundException(`Produit ${itemDto.productId} introuvable`);

      const orderItem = this.orderItemRepository.create({
        order: savedOrder,
        product,
        quantity: itemDto.quantity,
        price: itemDto.price,
      });

      orderItems.push(orderItem);
    }

    await this.orderItemRepository.save(orderItems);

    return this.findOne(savedOrder.id, userId, true);
  }

  // Récupérer toutes les commandes (optionnel par userId)
  async findAll(userId?: number): Promise<Order[]> {
    const where = userId ? { user: { id: userId } } : {};
    return this.orderRepository.find({
      where,
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  // Récupérer une commande par ID
  async findOne(id: number, userId?: number, isAdmin = false): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) throw new NotFoundException(`Commande ${id} introuvable`);

    if (!isAdmin && order.user.id !== userId) {
      throw new NotFoundException(`Commande ${id} introuvable pour cet utilisateur`);
    }

    return order;
  }

  // Mettre à jour une commande
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Commande ${id} introuvable`);

    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
    }

    await this.orderRepository.save(order);
    return this.findOne(order.id, undefined, true);
  }

  // Supprimer une commande
  async remove(id: number): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!order) throw new NotFoundException(`Commande ${id} introuvable`);

    // Supprimer d'abord les items pour éviter les erreurs de clé étrangère
    await this.orderItemRepository.remove(order.items);
    await this.orderRepository.remove(order);
  }
}
