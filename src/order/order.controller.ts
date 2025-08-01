import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateOrderDto, @Req() req: Request) {
  const user = req.user as { userId: number };

  if (!user?.userId || isNaN(user.userId)) {
    throw new Error('User ID not found or invalid');
  }

  return this.orderService.create(dto, user.userId);
}
}