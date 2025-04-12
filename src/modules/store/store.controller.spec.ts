import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

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
});
