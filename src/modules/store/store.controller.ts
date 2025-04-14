import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { StoreService } from './store.service';
import { CepValidationPipe } from '../../common/pipes/cep-validation/cep-validation.pipe';
import { StoreRoute } from '../../common/interfaces/store-route.interface';
import { ApiOperation } from '@nestjs/swagger';
import { PaginationDto } from './dtos/pagination.dto';
import { StoreFreights } from 'src/common/interfaces/store-freights.interface';
import { ValidatePaginationInterceptor } from 'src/common/interceptors/validate-pagination/validate-pagination.interceptor';

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

  @Get('cep/:cep')
  public async storeByCep(
    @Param('cep', CepValidationPipe) cep: string,
    @Query() pagination: PaginationDto,
  ) {
    const storeFreights: StoreFreights[] = await this.storeService.storeByCep(
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
      storeFreights,
      pagination,
      total: storeFreights.length,
    };
  }
}
