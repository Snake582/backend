import { Controller, Post, Body, Get, Param, Delete, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateProductDto: Partial<CreateProductDto>) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.productService.remove(id);
  }
}
