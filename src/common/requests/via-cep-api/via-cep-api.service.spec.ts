import { Test, TestingModule } from '@nestjs/testing';
import { ViaCepApiService } from './via-cep-api.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('ViaCepApiService', () => {
  let service: ViaCepApiService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ViaCepApiService,
        {
          provide: HttpService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ViaCepApiService>(ViaCepApiService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call viaCep method successfully', () => {
    const mockResponse = { data: {}, status: 200 };
    (httpService.get as jest.Mock).mockReturnValue(of(mockResponse));

    const cep = '12345678';
    service.viaCep(cep).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(httpService.get).toHaveBeenCalledWith(
        `https://viacep.com.br/ws/${cep}/json`,
      );
    });
  });

  it('should call viaCep method with error response', () => {
    const mockErrorResponse = { error: true };
    (httpService.get as jest.Mock).mockReturnValue(of(mockErrorResponse));

    const cep = '87654321';
    service.viaCep(cep).subscribe((response) => {
      expect(response).toEqual(mockErrorResponse);
      expect(httpService.get).toHaveBeenCalledWith(
        `https://viacep.com.br/ws/${cep}/json`,
      );
    });
  });
});
