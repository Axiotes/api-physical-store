import { Module } from '@nestjs/common';
import { GoogleApisService } from './google-apis/google-apis.service';
import { HttpModule } from '@nestjs/axios';
import { ViaCepApiService } from './via-cep-api/via-cep-api.service';

@Module({
  imports: [HttpModule],
  providers: [GoogleApisService, ViaCepApiService],
  exports: [GoogleApisService, ViaCepApiService],
})
export class RequestsModule {}
