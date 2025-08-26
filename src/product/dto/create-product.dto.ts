import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  alt: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  prix: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  stock: number;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  image?: string; // ✅ minuscule

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  secondaryImages?: string[];
}
