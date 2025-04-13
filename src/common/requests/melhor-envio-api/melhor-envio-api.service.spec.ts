import { Test, TestingModule } from '@nestjs/testing';
import { MelhorEnvioApiService } from './melhor-envio-api.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { InternalServerErrorException } from '@nestjs/common';
import { of } from 'rxjs';

describe('MelhorEnvioApiService', () => {
  let service: MelhorEnvioApiService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MelhorEnvioApiService,
        {
          provide: HttpService,
          useValue: { post: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('api-key') },
        },
      ],
    }).compile();

    service = module.get<MelhorEnvioApiService>(MelhorEnvioApiService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw Internal Error if API key is undefined', () => {
    jest.spyOn(configService, 'get').mockReturnValue(undefined);

    expect(() => new MelhorEnvioApiService(httpService, configService)).toThrow(
      InternalServerErrorException,
    );
  });

  it('should call freight method successfully', () => {
    const mockResponse = { data: {}, status: 200 };
    (httpService.post as jest.Mock).mockReturnValue(of(mockResponse));

    const from = '12345678';
    const to = '87654321';
    const products = [
      {
        id: '1',
        weight: 1000,
        width: 10,
        height: 10,
        length: 10,
        insurance_value: 0,
        quantity: 1,
      },
    ];

    const response = service.freight(from, to, products).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(httpService.post).toHaveBeenCalledWith(
        'https://melhorenvio.com.br/api/v2/me/shipment/calculate',
        {
          from: { postal_code: from },
          to: { postal_code: to },
          products,
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
            Authorization: `Bearer api-key`,
            'Content-Type': 'application/json',
            'User-Agent': 'PhysicalStore/1.0',
          },
        },
      );
    });
  });
});
