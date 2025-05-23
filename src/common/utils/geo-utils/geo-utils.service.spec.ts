import { Test, TestingModule } from '@nestjs/testing';
import { GeoUtilsService } from './geo-utils.service';
import { ViaCepApiService } from '../../requests/via-cep-api/via-cep-api.service';
import { GoogleApisService } from '../../requests/google-apis/google-apis.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import { StoreTypeEnum } from '../../enums/store-type.enum';
import { StorePDV } from 'src/common/interfaces/store-pdv.interface';

describe('GeoUtilsService', () => {
  let service: GeoUtilsService;
  let viaCepApiService: ViaCepApiService;
  let googleApisService: GoogleApisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeoUtilsService,
        { provide: ViaCepApiService, useValue: { viaCep: jest.fn() } },
        {
          provide: HttpService,
          useValue: { get: jest.fn() },
        },
        { provide: GoogleApisService, useValue: { geocode: jest.fn() } },
      ],
    }).compile();

    service = module.get<GeoUtilsService>(GeoUtilsService);
    viaCepApiService = module.get<ViaCepApiService>(ViaCepApiService);
    googleApisService = module.get<GoogleApisService>(GoogleApisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return address successfuly', async () => {
    const cep = '00000000';
    const expectedAddress = 'Rua Teste, Bairro Teste, Cidade Teste, UF Teste';
    const mockResponse = {
      status: 200,
      data: {
        cep: '00000-000',
        logradouro: 'Rua Teste',
        complemento: '',
        unidade: '',
        bairro: 'Bairro Teste',
        localidade: 'Cidade Teste',
        uf: 'UF Teste',
        estado: 'Estado Teste',
        regiao: 'Região Teste',
        ibge: '0000000',
        gia: '',
        ddd: '00',
        siafi: '0000',
      },
    };

    viaCepApiService.viaCep = jest.fn().mockReturnValue(of(mockResponse));

    const address = await service.getAddress(cep);

    expect(address).toBeDefined();
    expect(address).toEqual(expectedAddress);
    expect(viaCepApiService.viaCep).toHaveBeenCalledWith(cep);
    expect(viaCepApiService.viaCep).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when address not found', async () => {
    const cep = '00000000';
    const mockResponse = {
      status: 200,
      data: {
        error: true,
      },
    };

    viaCepApiService.viaCep = jest.fn().mockReturnValue(of(mockResponse));

    await expect(service.getAddress(cep)).rejects.toThrow(
      new NotFoundException('Address not found'),
    );
  });

  it('should return coordinates successfully', async () => {
    const address = 'Rua Teste, Bairro Teste, Cidade Teste, UF Teste';
    const expectedCoordinates = { lat: 0, lng: 0 };
    const mockResponse = {
      status: 200,
      data: {
        results: [
          {
            geometry: {
              location: expectedCoordinates,
            },
          },
        ],
        status: 'OK',
      },
    };

    googleApisService.geocode = jest.fn().mockReturnValue(of(mockResponse));

    const coordinates = await service.getCoordinate(address);

    expect(coordinates).toBeDefined();
    expect(coordinates).toEqual(expectedCoordinates);
    expect(googleApisService.geocode).toHaveBeenCalledWith(address);
    expect(googleApisService.geocode).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when coordinates not found', async () => {
    const address = 'Rua Teste, Bairro Teste, Cidade Teste, UF Teste';
    const mockResponse = {
      status: 200,
      data: {
        results: [],
        status: 'ZERO_RESULTS',
      },
    };

    googleApisService.geocode = jest.fn().mockReturnValue(of(mockResponse));

    await expect(service.getCoordinate(address)).rejects.toThrow(
      new NotFoundException('Coordinates not found'),
    );
  });

  it('should return distances successfully', async () => {
    const origin = { lat: 10, lng: 10 };
    const stores: StorePDV[] = [
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

    const mockResponse = {
      status: 200,
      data: {
        routes: [
          {
            legs: [
              {
                distance: {
                  text: '10 km',
                  value: 10000,
                },
                duration: {
                  text: '10 mins',
                  value: 600,
                },
              },
            ],
          },
        ],
        status: 'OK',
      },
    };

    const expectedDistances = [
      {
        store: stores[0],
        distance: {
          text: '10 km',
          value: 10000,
        },
        duration: {
          text: '10 mins',
          value: 600,
        },
      },
      {
        store: stores[1],
        distance: {
          text: '10 km',
          value: 10000,
        },
        duration: {
          text: '10 mins',
          value: 600,
        },
      },
    ];

    googleApisService.directions = jest.fn().mockReturnValue(of(mockResponse));

    const distances = await service.getDistance(origin, stores);

    expect(distances).toBeDefined();
    expect(distances).toEqual(expectedDistances);
    expect(googleApisService.directions).toHaveBeenCalledTimes(stores.length);
  });

  it('should not return any distance', async () => {
    const origin = { lat: 10, lng: 10 };
    const stores: StorePDV[] = [
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

    const mockResponse = {
      status: 200,
      data: {
        routes: [],
        status: 'ZERO_RESULTS',
      },
    };

    const expectedDistances = [];

    googleApisService.directions = jest.fn().mockReturnValue(of(mockResponse));

    const distances = await service.getDistance(origin, stores);

    expect(distances).toBeDefined();
    expect(distances).toEqual(expectedDistances);
    expect(googleApisService.directions).toHaveBeenCalledTimes(stores.length);
  });
});
