import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CheckoutDto } from './dto/checkout.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Post()
  create() {
    return this.cart.create();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.cart.getById(id);
  }

  @Post(':id/items')
  addItem(@Param('id') id: string, @Body() dto: AddToCartDto) {
    return this.cart.addItem(id, dto);
  }

  @Delete(':id/items/:itemId')
  removeItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.cart.removeItem(id, itemId);
  }

  @Post(':id/checkout')
  checkout(@Param('id') id: string, @Body() dto: CheckoutDto) {
    return this.cart.checkout(id, dto);
  }
}
