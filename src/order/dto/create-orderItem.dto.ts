import { IsNumber, IsOptional, IsString } from 'class-validator';


export class OrderItemDto {
@IsNumber()
productId: number;


@IsNumber()
quantity: number;


@IsNumber()
price: number;


@IsOptional()
@IsString()
image?: string;
}