import { Controller, Get, Param } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orders: OrderService) {}

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.orders.getById(id);
  }
}
