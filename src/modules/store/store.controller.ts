import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { StoreService } from './store.service';
import { CepValidationPipe } from '../../common/pipes/cep-validation/cep-validation.pipe';
import { StoreRoute } from '../../common/interfaces/store-route.interface';
import { ApiOperation } from '@nestjs/swagger';
import { PaginationDto } from './dtos/pagination.dto';
import { StoreShipping } from '../../common/interfaces/store-shipping.interface';
import { ValidatePaginationInterceptor } from '../../common/interceptors/validate-pagination/validate-pagination.interceptor';

@UseInterceptors(ValidatePaginationInterceptor)
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

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

  @Get('shipping/:cep')
  public async storeByCep(
    @Param('cep', CepValidationPipe) cep: string,
    @Query() pagination: PaginationDto,
  ) {
    const storeShippings: StoreShipping[] =
      await this.storeService.storesShipping(
        cep,
        [
          {
            id: '1',
            width: 15,
            height: 10,
            length: 20,
            weight: 1,
            insurance_value: 0,
            quantity: 1,
          },
        ],
        pagination,
      );

    return {
      storeShippings: storeShippings,
      pagination,
      total: storeShippings.length,
    };
  }
}
