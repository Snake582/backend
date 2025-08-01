import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateStripeDto } from './dto/create-stripe.dto';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('checkout')
  createCheckoutSession(@Body() createStripeDto: CreateStripeDto) {
    return this.stripeService.createCheckoutSession(createStripeDto.products);
  }
}
