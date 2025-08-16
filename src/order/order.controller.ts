import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthGuard('jwt')) // Assuming you want to protect this route
  create(@Body() dto: CreateOrderDto, @Req() req: Request) {
  const user = req.user as { userId: number };

  if (!user?.userId || isNaN(user.userId)) {
    throw new Error('User ID not found or invalid');
  }

  return this.orderService.create(dto, user.userId);
}

  @Get()
  @UseGuards(AuthGuard('jwt')) // Assuming you want to protect this route
  findAll(@Req() req: Request) {
    const user = req.user as { userId: number };

    if (!user?.userId || isNaN(user.userId)) {
      throw new Error('User ID not found or invalid');
    }

    return this.orderService.findAll(user.userId);
  }
}