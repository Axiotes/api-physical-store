import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { Store } from './store.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GeoUtilsService } from '../../common/utils/geo-utils/geo-utils.service';
import { StoreTypeEnum } from '../../common/enums/store-type.enum';
import { NotFoundException } from '@nestjs/common';

describe('StoreService', () => {
  let service: StoreService;
  let storeRepositoryMock: Partial<jest.Mocked<Repository<Store>>>;
  let geoUtilsService: GeoUtilsService;

  beforeEach(async () => {
    storeRepositoryMock = {
      find: jest.fn(),
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
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
    geoUtilsService = module.get<GeoUtilsService>(GeoUtilsService);
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
});
