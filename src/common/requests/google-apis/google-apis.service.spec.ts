import { Test, TestingModule } from '@nestjs/testing';
import { GoogleApisService } from './google-apis.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

describe('GoogleApisService', () => {
  let service: GoogleApisService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleApisService,
        {
          provide: HttpService,
          useValue: { get: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('api-key') },
        },
      ],
    }).compile();

    service = module.get<GoogleApisService>(GoogleApisService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw Internal Error if API key is undefined', () => {
    jest.spyOn(configService, 'get').mockReturnValue(undefined);

    expect(() => new GoogleApisService(httpService, configService)).toThrow(
      InternalServerErrorException,
    );
  });

  it('should call geocode method successfuly', () => {
    const mockResponse = { data: {}, status: 200 } as AxiosResponse;
    (httpService.get as jest.Mock).mockReturnValue(of(mockResponse));

    const address = 'Rua Setúbal, 1497 - Recife, PE';
    service.geocode(address).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(httpService.get).toHaveBeenCalledWith(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address,
        )}&key=api-key`,
      );
    });
  });

  it('should call directions method successfuly', () => {
    const mockResponse = { data: {}, status: 200 } as AxiosResponse;
    (httpService.get as jest.Mock).mockReturnValue(of(mockResponse));

    const origin = { lat: -8.047562, lng: -34.877113 };
    const destination = { lat: -8.047562, lng: -34.877113 };

    service.directions(origin, destination).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(httpService.get).toHaveBeenCalledWith(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=api-key`,
      );
    });
  });
});
