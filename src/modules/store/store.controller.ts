import { Controller, Get, Param } from '@nestjs/common';
import { StoreService } from './store.service';
import { CepValidationPipe } from '../../common/pipes/cep-validation/cep-validation.pipe';
import { StoreRoute } from '../../common/interfaces/store-route.interface';
import { ApiOperation } from '@nestjs/swagger';

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
}
