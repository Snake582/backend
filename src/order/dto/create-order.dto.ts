import { Type } from "class-transformer";
import { IsArray, IsNumber, ValidateNested } from "class-validator";

class OrderItemDto {
    @IsNumber()
    productId: number;

    @IsNumber()
    quantity: number;

    @IsNumber()
    price: number;
}

export class CreateOrderDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @IsNumber()
    total: number;
}
