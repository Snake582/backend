import { IsArray, ValidateNested, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

class ProductDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  price: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateStripeDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}
