import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CepValidationPipe } from '../../common/pipes/cep-validation/cep-validation.pipe';
import { StoreRoute } from '../../common/interfaces/store-route.interface';
import { ApiOperation } from '@nestjs/swagger';
import { PaginationDto } from './dtos/pagination.dto';
import { StoreShipping } from '../../common/interfaces/store-shipping.interface';
import { ValidatePaginationInterceptor } from '../../common/interceptors/validate-pagination/validate-pagination.interceptor';
import { ShippingBodyDto } from './dtos/shipping-body.dto';
import { OffsetValidated } from '../../common/decorators/offset-validate.decorator';
import { Store } from './store.entity';
import { StoreInterface } from '../../common/interfaces/store.interface';
import { UfValidationPipe } from '../../common/pipes/uf-validation/uf-validation.pipe';

@OffsetValidated(Store)
@UseInterceptors(ValidatePaginationInterceptor)
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @ApiOperation({
    summary: 'Retorna todas as lojas',
    description:
      "Caso deseje utilizar o query param 'offset', é necessário utiliza-lo em conjunto com o 'limit'",
  })
  @Get()
  public async findAll(@Query() pagination: PaginationDto) {
    const stores: StoreInterface[] =
      await this.storeService.findAll(pagination);

    return {
      stores,
      pagination,
      total: stores.length,
    };
  }

  @Get('uf/:uf')
  public async findByUf(
    @Param('uf', UfValidationPipe) uf: string,
    @Query() pagination: PaginationDto,
  ) {
    const stores = await this.storeService.findBy<'uf'>('uf', uf, pagination);

    return {
      stores: stores,
      pagination,
      total: stores.length,
    };
  }

  @ApiOperation({
    summary: 'Retorna as lojas em até 100km do CEP informado',
    description: "CEP deve ser informado no formato '00000000'",
  })
  @Get('closer/:cep')
  public async closerStores(
    @Param('cep', CepValidationPipe) cep: string,
  ): Promise<StoreRoute[]> {
    return await this.storeService.closerStores(cep);
  }

  @ApiOperation({
    summary: 'Retorna o frete para entrega de produtos ao CEP informado',
    description: `CEP deve ser informado no formato '00000000'. 
      Caso deseje utilizar o query param 'offset', é necessário utiliza-lo em conjunto com o 'limit'. 
      As dimensões do produto devem ser informadas em centímetros e o peso em kg`,
  })
  @Post('shipping/:cep')
  public async storesShipping(
    @Param('cep', CepValidationPipe) cep: string,
    @Body() body: ShippingBodyDto,
    @Query() pagination: PaginationDto,
  ) {
    const storeShippings: StoreShipping[] =
      await this.storeService.storesShipping(cep, body.products, pagination);

    return {
      storeShippings: storeShippings,
      pagination,
      total: storeShippings.length,
    };
  }
}
