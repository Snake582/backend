import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsEnum, IsOptional } from 'class-validator';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  CANCELED = 'canceled',
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsEnum(OrderStatus, { message: 'Statut invalide' })
  status?: OrderStatus;
}
