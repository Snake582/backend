import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create({
      alt: createProductDto.alt,
      description: createProductDto.description,
      prix: createProductDto.prix,
      image: createProductDto.image ?? '/uploads/default.jpg',
      stock: createProductDto.stock,
      category: createProductDto.category,
      secondaryImages: createProductDto.secondaryImages ?? [],
    });

    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<Product | null> {
    return this.productRepository.findOneBy({ id });
  }

  async update(id: number, updateProductDto: Partial<CreateProductDto>) {
    await this.productRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.productRepository.delete(id);
  }
}
