import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { DataSource } from 'typeorm';
import { StoreTypeEnum } from '../../common/enums/store-type.enum';

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
    const closerReturn = [
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
    const pagination = {
      limit: undefined,
      offset: undefined,
    };
    const mockResponse = {
      data: closerReturn,
      pagination,
      total: closerReturn.length,
    };

    storeService.closerStores = jest.fn().mockResolvedValue(closerReturn);

    const result = await controller.closerStores(cep, pagination);

    expect(storeService.closerStores).toHaveBeenCalledTimes(1);
    expect(storeService.closerStores).toHaveBeenCalledWith(cep, pagination);
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

    expect(result.data).toEqual(storeShippings);
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

    expect(result.data).toEqual(storeShippings);
    expect(result.pagination).toEqual(pagination);
    expect(result.total).toEqual(storeShippings.length);
  });

  it('should return all stores without pagination', async () => {
    const stores = [
      {
        id: 2,
        type: StoreTypeEnum.PDV,
        name: 'Store 2',
        cep: '00000-001',
        street: 'Rua Teste 2',
        city: 'Cidade Teste 2',
        number: 2,
        neighborhood: 'Bairro Teste 2',
        state: 'UF Teste 2',
        uf: 'UF 2',
        region: 'Região Teste 2',
        lat: '1',
        lng: '1',
      },
    ];
    const pagination = {
      limit: undefined,
      offset: undefined,
    };

    storeService.findAll = jest.fn().mockResolvedValue(stores);

    const result = await controller.findAll(pagination);

    expect(result.data).toEqual(stores);
    expect(result.total).toEqual(stores.length);
  });

  it('should return all stores with pagination', async () => {
    const stores = [
      {
        id: 6,
        type: StoreTypeEnum.PDV,
        name: 'Store 6',
        cep: '00000-001',
        street: 'Rua Teste 6',
        city: 'Cidade Teste 6',
        number: 6,
        neighborhood: 'Bairro Teste 6',
        state: 'UF Teste 6',
        uf: 'UF 6',
        region: 'Região Teste 6',
        lat: '1',
        lng: '1',
      },
      {
        id: 7,
        type: StoreTypeEnum.PDV,
        name: 'Store 7',
        cep: '00000-001',
        street: 'Rua Teste 7',
        city: 'Cidade Teste 7',
        number: 7,
        neighborhood: 'Bairro Teste 7',
        state: 'UF Teste 7',
        uf: 'UF 7',
        region: 'Região Teste 7',
        lat: '1',
        lng: '1',
      },
    ];
    const pagination = {
      limit: 5,
      offset: 5,
    };

    storeService.findAll = jest.fn().mockResolvedValue(stores);

    const result = await controller.findAll(pagination);

    expect(result.data).toEqual(stores);
    expect(result.total).toBeLessThanOrEqual(pagination.limit);
    expect(result.data[0].id).toEqual(pagination.offset + 1);
  });

  it('should return stores according to uf successfully', async () => {
    const stores = [
      {
        id: 1,
        type: StoreTypeEnum.PDV,
        name: 'Store 1',
        cep: '00000-001',
        street: 'Rua Teste 1',
        city: 'Cidade Teste 1',
        number: 1,
        neighborhood: 'Bairro Teste 1',
        state: 'UF Teste 1',
        uf: 'PE',
        region: 'Região Teste 1',
        lat: '1',
        lng: '1',
      },
      {
        id: 2,
        type: StoreTypeEnum.PDV,
        name: 'Store 2',
        cep: '00000-001',
        street: 'Rua Teste 2',
        city: 'Cidade Teste 2',
        number: 2,
        neighborhood: 'Bairro Teste 2',
        state: 'UF Teste 2',
        uf: 'PE',
        region: 'Região Teste 2',
        lat: '1',
        lng: '1',
      },
      {
        id: 3,
        type: StoreTypeEnum.PDV,
        name: 'Store 3',
        cep: '00000-001',
        street: 'Rua Teste 3',
        city: 'Cidade Teste 3',
        number: 3,
        neighborhood: 'Bairro Teste 3',
        state: 'UF Teste 3',
        uf: 'MG',
        region: 'Região Teste 3',
        lat: '1',
        lng: '1',
      },
    ];
    const pagination = {
      limit: undefined,
      offset: undefined,
    };
    const uf = 'PE';
    const ufStores = stores.filter((store) => store.uf === uf);

    storeService.findBy = jest.fn().mockResolvedValue(ufStores);

    const result = await controller.findByUf(uf, pagination);

    expect(result.total).toEqual(ufStores.length);
    expect(result.data).toEqual(ufStores);
    result.data.map((store) => {
      expect(store.uf).toEqual(uf);
    });
  });

  it('should return stores according to id successfully', async () => {
    const stores = [
      {
        id: 1,
        type: StoreTypeEnum.PDV,
        name: 'Store 1',
        cep: '00000-001',
        street: 'Rua Teste 1',
        city: 'Cidade Teste 1',
        number: 1,
        neighborhood: 'Bairro Teste 1',
        state: 'UF Teste 1',
        uf: 'PE',
        region: 'Região Teste 1',
        lat: '1',
        lng: '1',
      },
      {
        id: 2,
        type: StoreTypeEnum.PDV,
        name: 'Store 2',
        cep: '00000-001',
        street: 'Rua Teste 2',
        city: 'Cidade Teste 2',
        number: 2,
        neighborhood: 'Bairro Teste 2',
        state: 'UF Teste 2',
        uf: 'PE',
        region: 'Região Teste 2',
        lat: '1',
        lng: '1',
      },
      {
        id: 3,
        type: StoreTypeEnum.PDV,
        name: 'Store 3',
        cep: '00000-001',
        street: 'Rua Teste 3',
        city: 'Cidade Teste 3',
        number: 3,
        neighborhood: 'Bairro Teste 3',
        state: 'UF Teste 3',
        uf: 'MG',
        region: 'Região Teste 3',
        lat: '1',
        lng: '1',
      },
    ];
    const pagination = {
      limit: undefined,
      offset: undefined,
    };
    const id = 1;
    const idStores = stores.filter((store) => store.id === id);

    storeService.findBy = jest.fn().mockResolvedValue(idStores);

    const result = await controller.findById(id);

    expect(result.data.id).toEqual(id);
  });
});
