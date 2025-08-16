import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getData() {
    const ordersCount = await this.orderRepository.count();

    const revenueResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'sum')
      .getRawOne<{ sum: string | null }>();

    const revenue = Number(revenueResult?.sum) || 0;

    const usersCount = await this.userRepository.count();

    const productsCount = await this.productRepository.count();

    const latestOrder = await this.orderRepository.find({
  order: { createdAt: 'DESC' },
  take: 5,
  relations: ['user'], // pour inclure l'acheteur
});

const latestUsers = await this.userRepository.find({
  order: { createdAt: 'DESC' },
  take: 5,
});

const latestProduct = await this.productRepository.find({
  order: { createdAt: 'DESC' },
  take: 5,
});

    return {
      orders: ordersCount,
      revenue,
      users: usersCount,
      products: productsCount,
      latestOrder,
      latestUsers,
      latestProduct,
    };
    
  }
}
