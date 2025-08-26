import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { OrderItemDto } from './create-orderItem.dto';


export class CreateOrderDto {
@IsArray()
@ValidateNested({ each: true })
@Type(() => OrderItemDto)
items: OrderItemDto[];


@IsNumber()
total: number;
}