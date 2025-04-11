import { Controller, Get, Param } from '@nestjs/common';
import { StoreService } from './store.service';
import { CepValidationPipe } from 'src/common/pipes/cep-validation/cep-validation.pipe';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('closer/:cep')
  public async closerStores(@Param('cep', CepValidationPipe) cep: string) {
    return await this.storeService.closerStores(cep);
  }
}
