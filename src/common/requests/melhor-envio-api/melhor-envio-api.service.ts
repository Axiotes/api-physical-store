import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MelhorEnvioApiService {
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {
    this.apiKey = this.config.get<string>('MELHOR_ENVIO_API_KEY');

    if (!this.apiKey) {
      throw new InternalServerErrorException('Google API key not found');
    }
  }

  public freight(from: string, to: string) {
    return this.httpService.post(
      'https://melhorenvio.com.br/api/v2/me/shipment/calculate',
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: {
          from: {
            postal_code: from,
          },
          to: {
            postal_code: to,
          },
          services: '1,2',
        },
      },
    );
  }
}
