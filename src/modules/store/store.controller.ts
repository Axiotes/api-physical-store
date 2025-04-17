import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CepValidationPipe } from '../../common/pipes/cep-validation/cep-validation.pipe';
import { ApiOperation } from '@nestjs/swagger';
import { PaginationDto } from './dtos/pagination.dto';
import { StoreShipping } from '../../common/interfaces/store-shipping.interface';
import { ValidatePaginationInterceptor } from '../../common/interceptors/validate-pagination/validate-pagination.interceptor';
import { ShippingBodyDto } from './dtos/shipping-body.dto';
import { OffsetValidated } from '../../common/decorators/offset-validate.decorator';
import { Store } from './store.entity';
import { UfValidationPipe } from '../../common/pipes/uf-validation/uf-validation.pipe';
import { StoreType } from 'src/common/types/store-type.type';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
import { StoreRoute } from 'src/common/interfaces/store-route.interface';

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
  public async findAll(
    @Query() pagination: PaginationDto,
  ): Promise<ApiResponse<StoreType[]>> {
    const stores: StoreType[] = await this.storeService.findAll(pagination);

    return {
      data: stores,
      pagination,
      total: stores.length,
    };
  }

  @ApiOperation({
    summary: 'Retorna loja com ID informado',
    description:
      "Caso deseje utilizar o query param 'offset', é necessário utiliza-lo em conjunto com o 'limit'",
  })
  @Get('id/:id')
  public async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<Store>> {
    const stores = await this.storeService.findBy<'id'>('id', id, {
      limit: 1,
      offset: null,
    });

    return {
      data: stores[0],
      total: stores.length,
    };
  }

  @ApiOperation({
    summary: 'Retorna lojas do UF informado',
    description:
      "Caso deseje utilizar o query param 'offset', é necessário utiliza-lo em conjunto com o 'limit'",
  })
  @Get('uf/:uf')
  public async findByUf(
    @Param('uf', UfValidationPipe) uf: string,
    @Query() pagination: PaginationDto,
  ): Promise<ApiResponse<Store[]>> {
    const stores = await this.storeService.findBy<'uf'>('uf', uf, pagination);

    return {
      data: stores,
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
    @Query() pagination: PaginationDto,
  ): Promise<ApiResponse<StoreRoute[]>> {
    const stores = await this.storeService.closerStores(cep, pagination);

    return {
      data: stores,
      pagination,
      total: stores.length,
    };
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
  ): Promise<ApiResponse<StoreShipping[]>> {
    const storeShippings: StoreShipping[] =
      await this.storeService.storesShipping(cep, body.products, pagination);

    return {
      data: storeShippings,
      pagination,
      total: storeShippings.length,
    };
  }
}
