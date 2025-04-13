import { Test, TestingModule } from '@nestjs/testing';
import { MelhorEnvioApiService } from './melhor-envio-api.service';

describe('MelhorEnvioApiService', () => {
  let service: MelhorEnvioApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MelhorEnvioApiService],
    }).compile();

    service = module.get<MelhorEnvioApiService>(MelhorEnvioApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
