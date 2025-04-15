import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { DataSource } from 'typeorm';

describe('StoreController', () => {
  let controller: StoreController;
  let storeService: StoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreController],
      providers: [
        {
          provide: StoreService,
          useValue: {
            closerStores: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            query: jest.fn(),
            manager: {
              transaction: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<StoreController>(StoreController);
    storeService = module.get<StoreService>(StoreService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return closer stores successfuly', async () => {
    const cep = '12345678';
    const mockResponse = [
      {
        store: 'Store 1',
        distance: {
          value: 50000,
          text: '50 km',
        },
        duration: {
          value: 3600,
          text: '1 hour',
        },
      },
    ];

    storeService.closerStores = jest.fn().mockResolvedValue(mockResponse);

    const result = await controller.closerStores(cep);

    expect(storeService.closerStores).toHaveBeenCalledTimes(1);
    expect(storeService.closerStores).toHaveBeenCalledWith(cep);
    expect(result).toEqual(mockResponse);
  });

  it('should return shipping with pagination successfully', async () => {
    const cep = '12345678';
    const body = {
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
    };
    const pagination = {
      limit: 5,
      offset: 10,
    };
    const storeShippings = [
      {
        store: {
          id: 1,
          type: 'loja',
          name: 'Teste',
          cep: '87654321',
          street: 'Rua Teste de Teste',
          city: 'Recife',
          number: 720,
          neighborhood: 'Boa Viagem',
          state: 'Pernambuco',
          uf: 'PE',
          region: 'Nordeste',
          lat: '-8',
          lng: '-34',
        },
        distance: {
          text: '0.5 km',
          value: 521,
        },
        shipping: [
          {
            id: 2,
            name: 'Teste',
            price: '15.00',
            discount: '0',
            currency: 'R$',
            delivery_range: {
              min: 2,
              max: 3,
            },
            company: {
              id: 2,
              name: 'Teste',
            },
          },
        ],
      },
    ];

    storeService.storesShipping = jest.fn().mockResolvedValue(storeShippings);

    const result = await controller.storesShipping(cep, body, pagination);

    expect(result.storeShippings).toEqual(storeShippings);
    expect(result.pagination).toEqual(pagination);
    expect(result.total).toBeLessThanOrEqual(result.pagination.limit);
  });

  it('should return shipping without pagination successfully', async () => {
    const cep = '12345678';
    const body = {
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
    };
    const pagination = {
      limit: undefined,
      offset: undefined,
    };
    const storeShippings = [
      {
        store: {
          id: 1,
          type: 'loja',
          name: 'Teste',
          cep: '87654321',
          street: 'Rua Teste de Teste',
          city: 'Recife',
          number: 720,
          neighborhood: 'Boa Viagem',
          state: 'Pernambuco',
          uf: 'PE',
          region: 'Nordeste',
          lat: '-8',
          lng: '-34',
        },
        distance: {
          text: '0.5 km',
          value: 521,
        },
        shipping: [
          {
            id: 2,
            name: 'Teste',
            price: '15.00',
            discount: '0',
            currency: 'R$',
            delivery_range: {
              min: 2,
              max: 3,
            },
            company: {
              id: 2,
              name: 'Teste',
            },
          },
        ],
      },
    ];

    storeService.storesShipping = jest.fn().mockResolvedValue(storeShippings);

    const result = await controller.storesShipping(cep, body, pagination);

    expect(result.storeShippings).toEqual(storeShippings);
    expect(result.pagination).toEqual(pagination);
    expect(result.total).toEqual(storeShippings.length);
  });
});
