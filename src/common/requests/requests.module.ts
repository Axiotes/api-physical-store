import { Module } from '@nestjs/common';
import { GoogleApisService } from './google-apis/google-apis.service';
import { HttpModule } from '@nestjs/axios';
import { ViaCepApiService } from './via-cep-api/via-cep-api.service';
import { MelhorEnvioApiService } from './melhor-envio-api/melhor-envio-api.service';

@Module({
  imports: [HttpModule],
  providers: [GoogleApisService, ViaCepApiService, MelhorEnvioApiService],
  exports: [GoogleApisService, ViaCepApiService, MelhorEnvioApiService],
})
export class RequestsModule {}
