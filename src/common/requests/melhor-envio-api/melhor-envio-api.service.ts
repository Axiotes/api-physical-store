import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

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

  public freight(
    from: string,
    to: string,
  ): Observable<AxiosResponse<MelhorEnvioResponse>> {
    return this.httpService.post<MelhorEnvioResponse>(
      'https://melhorenvio.com.br/api/v2/me/shipment/calculate',
      {
        from: { postal_code: from },
        to: { postal_code: to },
        products: [
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
        options: {
          receipt: false,
          own_hand: false,
          insurance_value: 0,
          reverse: false,
          non_commercial: true,
        },
        services: ['1', '2'],
        validate: true,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'PhysicalStore/1.0',
        },
      },
    );
  }
}
