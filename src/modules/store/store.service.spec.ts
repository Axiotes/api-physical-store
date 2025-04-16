import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { Store } from './store.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GeoUtilsService } from '../../common/utils/geo-utils/geo-utils.service';
import { StoreTypeEnum } from '../../common/enums/store-type.enum';
import { NotFoundException } from '@nestjs/common';
import { LogisticUtilsService } from '../../common/utils/logistic-utils/logistic-utils.service';

describe('StoreService', () => {
  let service: StoreService;
  let storeRepositoryMock: Partial<jest.Mocked<Repository<Store>>>;
  let geoUtilsService: GeoUtilsService;
  let logisticUtilsService: LogisticUtilsService;

  beforeEach(async () => {
    storeRepositoryMock = {
      find: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        { provide: getRepositoryToken(Store), useValue: storeRepositoryMock },
        {
          provide: GeoUtilsService,
          useValue: {
            getAddress: jest.fn(),
            getCoordinate: jest.fn(),
            getDistance: jest.fn(),
          },
        },
        {
          provide: LogisticUtilsService,
          useValue: {
            getShipping: jest.fn(),
            deliveryTime: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
    geoUtilsService = module.get<GeoUtilsService>(GeoUtilsService);
    logisticUtilsService =
      module.get<LogisticUtilsService>(LogisticUtilsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return closer stores successfully', async () => {
    const cep = '12345678';
    const address = '123 Main St, City, State';
    const coordinate = { lat: 40.7128, lng: -74.006 };
    const stores = [
      {
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
    const storesRoutes = [
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
        distance: { value: 50000, text: '50 km' },
        duration: { value: 3600, text: '1 hour' },
      },
    ];

    geoUtilsService.getAddress = jest.fn().mockResolvedValue(address);
    geoUtilsService.getCoordinate = jest.fn().mockResolvedValue(coordinate);
    storeRepositoryMock.find = jest.fn().mockResolvedValue(stores);
    geoUtilsService.getDistance = jest.fn().mockResolvedValue(storesRoutes);

    const result = await service.closerStores(cep);

    expect(geoUtilsService.getAddress).toHaveBeenCalledWith(cep);
    expect(geoUtilsService.getAddress).toHaveBeenCalledTimes(1);
    expect(geoUtilsService.getCoordinate).toHaveBeenCalledWith(address);
    expect(geoUtilsService.getCoordinate).toHaveBeenCalledTimes(1);
    expect(storeRepositoryMock.find).toHaveBeenCalled();
    expect(storeRepositoryMock.find).toHaveBeenCalledTimes(1);
    expect(geoUtilsService.getDistance).toHaveBeenCalledWith(
      coordinate,
      stores,
    );
    expect(result).toEqual(storesRoutes);
    expect(result.length).toEqual(storesRoutes.length);
    expect(result[0].store).toEqual({
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
    });
  });

  it('should throw NotFoundException when no stores found within 100km radius', async () => {
    const cep = '12345678';
    const address = '123 Main St, City, State';
    const coordinate = { lat: 40.7128, lng: -74.006 };
    const stores = [
      {
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
    const storesRoutes = [];

    geoUtilsService.getAddress = jest.fn().mockResolvedValue(address);
    geoUtilsService.getCoordinate = jest.fn().mockResolvedValue(coordinate);
    storeRepositoryMock.find = jest.fn().mockResolvedValue(stores);
    geoUtilsService.getDistance = jest.fn().mockResolvedValue(storesRoutes);

    await expect(service.closerStores(cep)).rejects.toThrow(
      new NotFoundException('No stores found within 100km radius'),
    );
    expect(geoUtilsService.getAddress).toHaveBeenCalledWith(cep);
    expect(geoUtilsService.getAddress).toHaveBeenCalledTimes(1);
    expect(geoUtilsService.getCoordinate).toHaveBeenCalledWith(address);
    expect(geoUtilsService.getCoordinate).toHaveBeenCalledTimes(1);
    expect(storeRepositoryMock.find).toHaveBeenCalled();
    expect(storeRepositoryMock.find).toHaveBeenCalledTimes(1);
    expect(geoUtilsService.getDistance).toHaveBeenCalledWith(
      coordinate,
      stores,
    );
  });

  it('should return shipping ordered by distance with stores within and outside 50 km', async () => {
    const cep = '12345678';
    const address = '123 Main St, City, State';
    const coordinate = { lat: 40.7128, lng: -74.006 };
    const stores = [
      {
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
    const storesRoutes = [
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
        distance: { value: 45000, text: '45 km' },
        duration: { value: 3600, text: '1 hour' },
      },
      {
        store: {
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
        distance: { value: 60000, text: '60 km' },
        duration: { value: 7200, text: '2 hours' },
      },
    ];
    const mockReturn = [
      {
        store: stores[0],
        distance: { value: 45000, text: '45 km' },
        shippings: [
          {
            id: 1,
            name: 'Store 1',
            price: '15.00',
            discount: '0',
            currency: 'R$',
            delivery_range: { min: 4, max: 5 },
            company: {
              id: 1,
              name: 'Store 1',
            },
          },
        ],
      },
      {
        store: stores[1],
        distance: { value: 60000, text: '60 km' },
        shippings: [
          {
            id: 1,
            name: 'PAC',
            price: '20.00',
            discount: '0',
            currency: 'R$',
            delivery_range: { min: 6, max: 7 },
            company: {
              id: 1,
              name: 'Correios',
            },
          },
          {
            id: 1,
            name: 'Sedex',
            price: '35.00',
            discount: '0',
            currency: 'R$',
            delivery_range: { min: 2, max: 3 },
            company: {
              id: 1,
              name: 'Correios',
            },
          },
        ],
      },
    ];

    geoUtilsService.getAddress = jest.fn().mockResolvedValue(address);
    geoUtilsService.getCoordinate = jest.fn().mockResolvedValue(coordinate);
    const createQueryBuilderMock = {
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(stores),
    };
    storeRepositoryMock.createQueryBuilder = jest
      .fn()
      .mockReturnValue(createQueryBuilderMock);
    geoUtilsService.getDistance = jest.fn().mockResolvedValue(storesRoutes);
    logisticUtilsService.deliveryTime = jest
      .fn()
      .mockReturnValue({ min: 4, max: 5 });
    logisticUtilsService.getShipping = jest.fn().mockResolvedValue([
      {
        store: stores[1],
        distance: { value: 60000, text: '60 km' },
        shippings: [
          {
            id: 1,
            name: 'PAC',
            price: '20.00',
            discount: '0',
            currency: 'R$',
            delivery_range: { min: 6, max: 7 },
            company: {
              id: 1,
              name: 'Correios',
            },
          },
          {
            id: 1,
            name: 'Sedex',
            price: '35.00',
            discount: '0',
            currency: 'R$',
            delivery_range: { min: 2, max: 3 },
            company: {
              id: 1,
              name: 'Correios',
            },
          },
        ],
      },
    ]);

    const products = [
      {
        id: '1',
        width: 15,
        height: 10,
        length: 20,
        weight: 1,
        insurance_value: 0,
        quantity: 1,
      },
    ];
    const pagination = { offset: 0, limit: 10 };

    const result = await service.storesShipping(cep, products, pagination);

    expect(geoUtilsService.getAddress).toHaveBeenCalledWith(cep);
    expect(geoUtilsService.getAddress).toHaveBeenCalledTimes(1);
    expect(geoUtilsService.getCoordinate).toHaveBeenCalledWith(address);
    expect(geoUtilsService.getCoordinate).toHaveBeenCalledTimes(1);
    expect(storeRepositoryMock.createQueryBuilder).toHaveBeenCalledWith(
      'store',
    );
    expect(storeRepositoryMock.createQueryBuilder).toHaveBeenCalledTimes(1);
    expect(createQueryBuilderMock.skip).toHaveBeenCalledWith(pagination.offset);
    expect(createQueryBuilderMock.skip).toHaveBeenCalledTimes(1);
    expect(createQueryBuilderMock.take).toHaveBeenCalledWith(pagination.limit);
    expect(createQueryBuilderMock.take).toHaveBeenCalledTimes(1);
    expect(createQueryBuilderMock.getMany).toHaveBeenCalled();
    expect(geoUtilsService.getDistance).toHaveBeenCalledWith(
      coordinate,
      stores,
    );
    expect(logisticUtilsService.getShipping).toHaveBeenCalledWith(
      [storesRoutes[1]],
      cep,
      products,
    );
    expect(logisticUtilsService.getShipping).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockReturn);
  });

  it('should only return stores within 50km when all are close together', async () => {
    const cep = '12345678';
    const address = '123 Main St, City, State';
    const coordinate = { lat: 40.7128, lng: -74.006 };
    const stores = [
      {
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
    ];
    const storesRoutes = [
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
        distance: { value: 45000, text: '45 km' },
        duration: { value: 3600, text: '1 hour' },
      },
    ];
    const mockReturn = [
      {
        store: stores[0],
        distance: { value: 45000, text: '45 km' },
        shippings: [
          {
            id: 1,
            name: 'Store 1',
            price: '15.00',
            discount: '0',
            currency: 'R$',
            delivery_range: { min: 4, max: 5 },
            company: {
              id: 1,
              name: 'Store 1',
            },
          },
        ],
      },
    ];

    geoUtilsService.getAddress = jest.fn().mockResolvedValue(address);
    geoUtilsService.getCoordinate = jest.fn().mockResolvedValue(coordinate);
    const createQueryBuilderMock = {
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(stores),
    };
    storeRepositoryMock.createQueryBuilder = jest
      .fn()
      .mockReturnValue(createQueryBuilderMock);
    geoUtilsService.getDistance = jest.fn().mockResolvedValue(storesRoutes);
    logisticUtilsService.deliveryTime = jest
      .fn()
      .mockReturnValue({ min: 4, max: 5 });

    const products = [
      {
        id: '1',
        width: 15,
        height: 10,
        length: 20,
        weight: 1,
        insurance_value: 0,
        quantity: 1,
      },
    ];
    const pagination = { offset: 0, limit: 10 };

    const result = await service.storesShipping(cep, products, pagination);

    expect(geoUtilsService.getAddress).toHaveBeenCalledWith(cep);
    expect(geoUtilsService.getAddress).toHaveBeenCalledTimes(1);
    expect(geoUtilsService.getCoordinate).toHaveBeenCalledWith(address);
    expect(geoUtilsService.getCoordinate).toHaveBeenCalledTimes(1);
    expect(storeRepositoryMock.createQueryBuilder).toHaveBeenCalledWith(
      'store',
    );
    expect(storeRepositoryMock.createQueryBuilder).toHaveBeenCalledTimes(1);
    expect(createQueryBuilderMock.skip).toHaveBeenCalledWith(pagination.offset);
    expect(createQueryBuilderMock.skip).toHaveBeenCalledTimes(1);
    expect(createQueryBuilderMock.take).toHaveBeenCalledWith(pagination.limit);
    expect(createQueryBuilderMock.take).toHaveBeenCalledTimes(1);
    expect(createQueryBuilderMock.getMany).toHaveBeenCalled();
    expect(geoUtilsService.getDistance).toHaveBeenCalledWith(
      coordinate,
      stores,
    );
    expect(logisticUtilsService.getShipping).toHaveBeenCalledTimes(0);
    expect(result).toEqual(mockReturn);
  });

  it('should only return stores over 50 km away when they are all far apart', async () => {
    const cep = '12345678';
    const address = '123 Main St, City, State';
    const coordinate = { lat: 40.7128, lng: -74.006 };
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
    const storesRoutes = [
      {
        store: {
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
        distance: { value: 60000, text: '60 km' },
        duration: { value: 7200, text: '2 hours' },
      },
    ];
    const mockReturn = [
      {
        store: stores[1],
        distance: { value: 60000, text: '60 km' },
        shippings: [
          {
            id: 1,
            name: 'PAC',
            price: '20.00',
            discount: '0',
            currency: 'R$',
            delivery_range: { min: 6, max: 7 },
            company: {
              id: 1,
              name: 'Correios',
            },
          },
          {
            id: 1,
            name: 'Sedex',
            price: '35.00',
            discount: '0',
            currency: 'R$',
            delivery_range: { min: 2, max: 3 },
            company: {
              id: 1,
              name: 'Correios',
            },
          },
        ],
      },
    ];

    geoUtilsService.getAddress = jest.fn().mockResolvedValue(address);
    geoUtilsService.getCoordinate = jest.fn().mockResolvedValue(coordinate);
    const createQueryBuilderMock = {
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(stores),
    };
    storeRepositoryMock.createQueryBuilder = jest
      .fn()
      .mockReturnValue(createQueryBuilderMock);
    geoUtilsService.getDistance = jest.fn().mockResolvedValue(storesRoutes);
    logisticUtilsService.getShipping = jest.fn().mockResolvedValue([
      {
        store: stores[1],
        distance: { value: 60000, text: '60 km' },
        shippings: [
          {
            id: 1,
            name: 'PAC',
            price: '20.00',
            discount: '0',
            currency: 'R$',
            delivery_range: { min: 6, max: 7 },
            company: {
              id: 1,
              name: 'Correios',
            },
          },
          {
            id: 1,
            name: 'Sedex',
            price: '35.00',
            discount: '0',
            currency: 'R$',
            delivery_range: { min: 2, max: 3 },
            company: {
              id: 1,
              name: 'Correios',
            },
          },
        ],
      },
    ]);

    const products = [
      {
        id: '1',
        width: 15,
        height: 10,
        length: 20,
        weight: 1,
        insurance_value: 0,
        quantity: 1,
      },
    ];
    const pagination = { offset: 0, limit: 10 };

    const result = await service.storesShipping(cep, products, pagination);

    expect(geoUtilsService.getAddress).toHaveBeenCalledWith(cep);
    expect(geoUtilsService.getAddress).toHaveBeenCalledTimes(1);
    expect(geoUtilsService.getCoordinate).toHaveBeenCalledWith(address);
    expect(geoUtilsService.getCoordinate).toHaveBeenCalledTimes(1);
    expect(storeRepositoryMock.createQueryBuilder).toHaveBeenCalledWith(
      'store',
    );
    expect(storeRepositoryMock.createQueryBuilder).toHaveBeenCalledTimes(1);
    expect(createQueryBuilderMock.skip).toHaveBeenCalledWith(pagination.offset);
    expect(createQueryBuilderMock.skip).toHaveBeenCalledTimes(1);
    expect(createQueryBuilderMock.take).toHaveBeenCalledWith(pagination.limit);
    expect(createQueryBuilderMock.take).toHaveBeenCalledTimes(1);
    expect(createQueryBuilderMock.getMany).toHaveBeenCalled();
    expect(geoUtilsService.getDistance).toHaveBeenCalledWith(
      coordinate,
      stores,
    );
    expect(logisticUtilsService.getShipping).toHaveBeenCalledWith(
      [storesRoutes[0]],
      cep,
      products,
    );
    expect(logisticUtilsService.getShipping).toHaveBeenCalledTimes(1);
    expect(logisticUtilsService.deliveryTime).toHaveBeenCalledTimes(0);
    expect(result).toEqual(mockReturn);
  });

  it('should return all stores without pagination', async () => {
    const pagination = { offset: undefined, limit: undefined };
    const mockStores = [
      { id: 1, name: 'Store 1' },
      { id: 2, name: 'Store 2' },
    ];

    const createQueryBuilderMock = {
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockStores),
    };

    storeRepositoryMock.createQueryBuilder = jest
      .fn()
      .mockReturnValue(createQueryBuilderMock);

    const result = await service.findAll(pagination);

    expect(result).toEqual(mockStores);
    expect(storeRepositoryMock.createQueryBuilder().getMany).toHaveBeenCalled();
  });

  it('should return stores with pagination', async () => {
    const pagination = { offset: 10, limit: 5 };
    const mockStores = [
      { id: 1, name: 'Store 1' },
      { id: 2, name: 'Store 2' },
    ];

    const createQueryBuilderMock = {
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockStores),
    };

    storeRepositoryMock.createQueryBuilder = jest
      .fn()
      .mockReturnValue(createQueryBuilderMock);

    const result = await service.findAll(pagination);

    expect(result).toEqual(mockStores);
    expect(storeRepositoryMock.createQueryBuilder().skip).toHaveBeenCalledWith(
      pagination.offset,
    );
    expect(storeRepositoryMock.createQueryBuilder().take).toHaveBeenCalledWith(
      pagination.limit,
    );
    expect(storeRepositoryMock.createQueryBuilder().getMany).toHaveBeenCalled();
  });

  it('should find a store by id', async () => {
    const createQueryBuilderMock = {
      where: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    };
    storeRepositoryMock.createQueryBuilder = jest
      .fn()
      .mockReturnValue(createQueryBuilderMock);

    const store = new Store();
    const id = 1;
    const pagination = {
      limit: undefined,
      offset: undefined,
    };

    createQueryBuilderMock.getMany.mockResolvedValueOnce([store]);

    const result = await service.findBy<'id'>('id', id, pagination);

    expect(storeRepositoryMock.createQueryBuilder).toHaveBeenCalledWith(
      'store',
    );
    expect(createQueryBuilderMock.where).toHaveBeenCalledWith(
      'store.id = :value',
      { value: id },
    );
    expect(createQueryBuilderMock.skip).toHaveBeenCalledWith(pagination.offset);
    expect(createQueryBuilderMock.take).toHaveBeenCalledWith(pagination.limit);
    expect(result).toEqual([store]);
  });

  it('should find a store by uf', async () => {
    const createQueryBuilderMock = {
      where: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    };
    storeRepositoryMock.createQueryBuilder = jest
      .fn()
      .mockReturnValue(createQueryBuilderMock);

    const store = new Store();
    const uf = '12345678901';
    const pagination = {
      limit: undefined,
      offset: undefined,
    };

    createQueryBuilderMock.getMany.mockResolvedValueOnce([store]);

    const result = await service.findBy<'uf'>('uf', uf, pagination);

    expect(storeRepositoryMock.createQueryBuilder).toHaveBeenCalledWith(
      'store',
    );
    expect(createQueryBuilderMock.where).toHaveBeenCalledWith(
      'store.uf = :value',
      { value: uf },
    );
    expect(createQueryBuilderMock.skip).toHaveBeenCalledWith(pagination.offset);
    expect(createQueryBuilderMock.take).toHaveBeenCalledWith(pagination.limit);
    expect(result).toEqual([store]);
  });

  it('should throw an error if the store is not found by id', async () => {
    const createQueryBuilderMock = {
      where: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    };
    storeRepositoryMock.createQueryBuilder = jest
      .fn()
      .mockReturnValue(createQueryBuilderMock);

    const id = 1;
    const pagination = {
      limit: undefined,
      offset: undefined,
    };

    await expect(service.findBy<'id'>('id', id, pagination)).rejects.toThrow(
      new NotFoundException(`Store not found`),
    );
  });

  it('should throw an error if the reader is not found by uf', async () => {
    const createQueryBuilderMock = {
      where: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    };
    storeRepositoryMock.createQueryBuilder = jest
      .fn()
      .mockReturnValue(createQueryBuilderMock);

    const uf = 'AM';
    const pagination = {
      limit: undefined,
      offset: undefined,
    };

    await expect(service.findBy<'uf'>('uf', uf, pagination)).rejects.toThrow(
      new NotFoundException(`Store not found`),
    );
  });
});
