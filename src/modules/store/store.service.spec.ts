import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { Store } from './store.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GeoUtilsService } from '../../common/utils/geo-utils/geo-utils.service';

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
});
