import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { SearchProductsDto } from './dto/search-products.dto';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('search')
  search(@Query() dto: SearchProductsDto) {
    return this.catalog.search(dto.q, dto.brand);
  }

  @Get('products')
  listAll(
    @Query('take') take = '100',
    @Query('skip') skip = '0',
  ) {
    return this.catalog.listAll(Number(take), Number(skip));
  }

  @Get('products/:id')
  getById(@Param('id') id: string) {
    return this.catalog.getById(id);
  }
}
