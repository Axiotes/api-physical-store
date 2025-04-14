import { Test, TestingModule } from '@nestjs/testing';
import { LogisticUtilsService } from './logistic-utils.service';
import { MelhorEnvioApiService } from '../../requests/melhor-envio-api/melhor-envio-api.service';
import { StoreTypeEnum } from '../../enums/store-type.enum';
import { StoreInterface } from '../../interfaces/store.interface';
import { Product } from '../../interfaces/product.interface';
import { StoreFreights } from '../../interfaces/store-freights.interface';
import { of, throwError } from 'rxjs';
import { StoreRoute } from 'src/common/interfaces/store-route.interface';

describe('LogisticUtilsService', () => {
  let service: LogisticUtilsService;
  let melhorEnvioApiService: MelhorEnvioApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogisticUtilsService,
        {
          provide: MelhorEnvioApiService,
          useValue: {
            freight: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LogisticUtilsService>(LogisticUtilsService);
    melhorEnvioApiService = module.get<MelhorEnvioApiService>(
      MelhorEnvioApiService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return freights successfully', async () => {
    const stores: StoreRoute[] = [
      {
        store: {
          id: 1,
          type: StoreTypeEnum.PDV,
          name: 'Store 1',
          cep: '00000-000',
          street: 'Rua Teste',
          city: 'Cidade Teste',
          number: 1,
          neighborhood: 'Bairro Teste',
          state: 'UF Teste',
          uf: 'UF',
          region: 'Região Teste',
          lat: '0',
          lng: '0',
        },
        distance: {
          text: '60 km',
          value: 60000,
        },
        duration: {
          text: '1 day',
          value: 86400,
        },
      },
    ];
    const to = '00000000';
    const products: Product[] = [
      {
        id: '1',
        width: 10,
        height: 10,
        length: 10,
        weight: 1,
        insurance_value: 0,
        quantity: 1,
      },
      {
        id: '2',
        width: 20,
        height: 20,
        length: 20,
        weight: 2,
        insurance_value: 0,
        quantity: 2,
      },
    ];
    const mockStoresFreigths: StoreFreights[] = [
      {
        store: stores[0].store,
        distance: stores[0].distance,
        freights: [
          {
            id: 1,
            name: 'Freight 1',
            price: '10',
            discount: '0',
            currency: 'BRL',
            delivery_range: {
              min: 1,
              max: 2,
            },
            company: {
              id: 1,
              name: 'Company 1',
            },
          },
          {
            id: 2,
            name: 'Freight 2',
            price: '15',
            discount: '0',
            currency: 'BRL',
            delivery_range: {
              min: 1,
              max: 2,
            },
            company: {
              id: 1,
              name: 'Company 1',
            },
          },
        ],
      },
    ];
    (melhorEnvioApiService.freight as jest.Mock).mockImplementation(() =>
      of({
        data: [
          {
            id: 1,
            name: 'Freight 1',
            price: '10',
            discount: '0',
            currency: 'BRL',
            delivery_range: {
              min: 1,
              max: 2,
            },
            company: {
              id: 1,
              name: 'Company 1',
            },
          },
          {
            id: 2,
            name: 'Freight 2',
            price: '15',
            discount: '0',
            currency: 'BRL',
            delivery_range: {
              min: 1,
              max: 2,
            },
            company: {
              id: 1,
              name: 'Company 1',
            },
          },
        ],
      }),
    );

    const result = await service.getFreight(stores, to, products);

    expect(result).toEqual(mockStoresFreigths);
  });

  it('should return empty array when no freights are found', async () => {
    const stores: StoreRoute[] = [
      {
        store: {
          id: 1,
          type: StoreTypeEnum.PDV,
          name: 'Store 1',
          cep: '00000-000',
          street: 'Rua Teste',
          city: 'Cidade Teste',
          number: 1,
          neighborhood: 'Bairro Teste',
          state: 'UF Teste',
          uf: 'UF',
          region: 'Região Teste',
          lat: '0',
          lng: '0',
        },
        distance: {
          text: '60 km',
          value: 60000,
        },
        duration: {
          text: '1 day',
          value: 86400,
        },
      },
    ];
    const to = '00000000';
    const products: Product[] = [
      {
        id: '1',
        width: 10,
        height: 10,
        length: 10,
        weight: 1,
        insurance_value: 0,
        quantity: 1,
      },
    ];

    (melhorEnvioApiService.freight as jest.Mock).mockImplementation(() =>
      of({
        data: [],
      }),
    );

    const result = await service.getFreight(stores, to, products);

    expect(result).toEqual([]);
  });

  it('should throw an InternalServerErrorException when an error occurs in the api request', async () => {
    const stores: StoreRoute[] = [
      {
        store: {
          id: 1,
          type: StoreTypeEnum.PDV,
          name: 'Store 1',
          cep: '00000-000',
          street: 'Rua Teste',
          city: 'Cidade Teste',
          number: 1,
          neighborhood: 'Bairro Teste',
          state: 'UF Teste',
          uf: 'UF',
          region: 'Região Teste',
          lat: '0',
          lng: '0',
        },
        distance: {
          text: '60 km',
          value: 60000,
        },
        duration: {
          text: '1 day',
          value: 86400,
        },
      },
    ];
    const to = '00000000';
    const products: Product[] = [
      {
        id: '1',
        width: 10,
        height: 10,
        length: 10,
        weight: 1,
        insurance_value: 0,
        quantity: 1,
      },
    ];

    (melhorEnvioApiService.freight as jest.Mock).mockImplementation(() => {
      return throwError(() => new Error('API Error'));
    });

    await expect(service.getFreight(stores, to, products)).rejects.toThrow(
      new Error('API Error'),
    );
  });

  it('should throw BadRequestException when distance exceeds maximum limit', () => {
    const distance = 60000;

    expect(() => service.deliveryTime(distance)).toThrow(
      `Distance exceeds the maximum limit of 50 km`,
    );
  });

  it('should calculate delivery time correctly', () => {
    const distance = 25000;
    const result = service.deliveryTime(distance);

    expect(result).toEqual({ min: 7, max: 8 });
  });
});
