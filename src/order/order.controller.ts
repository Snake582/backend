import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  ForbiddenException,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Créer une commande
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() dto: CreateOrderDto, @Req() req: Request) {
    const user = req.user as { userId: number };
    return this.orderService.create(dto, user.userId);
  }

  // Récupérer toutes les commandes de l'utilisateur
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Req() req: Request) {
    const user = req.user as { userId: number };
    return this.orderService.findAll(user.userId);
  }

  // Récupérer toutes les commandes (admin)
  @Get('all')
  @UseGuards(AuthGuard('jwt'))
  async findAllOrders(@Req() req: Request) {
    const user = req.user as { role: string };
    if (user.role !== 'admin') {
      throw new ForbiddenException('Accès réservé aux administrateurs');
    }
    return this.orderService.findAll();
  }

  // Récupérer une commande par ID
  @Get(':id')
@UseGuards(AuthGuard('jwt'))
findOne(@Param('id') id: string, @Req() req: Request) {
  const user = req.user as { userId: number; role: string };
  if (user.role === 'admin') {
    return this.orderService.findOne(+id, undefined, true);
  }
  return this.orderService.findOne(+id, user.userId, false);
}


  // Mettre à jour une commande (admin uniquement)
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req: Request,
  ) {
    const user = req.user as { role: string };
    if (user.role !== 'admin') {
      throw new ForbiddenException('Seul l’admin peut mettre à jour les commandes');
    }
    return this.orderService.update(+id, updateOrderDto);
  }

  // Supprimer une commande (admin uniquement)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as { role: string };
    if (user.role !== 'admin') {
      throw new ForbiddenException('Seul l’admin peut supprimer les commandes');
    }
    await this.orderService.remove(+id);
    return { message: 'Commande supprimée avec succès' };
  }
}
